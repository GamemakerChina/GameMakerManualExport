"use strict";
const cheerio = require("cheerio")
const glob = require("glob")
const path = require("path");
const fs = require("fs")

let settings = require("../setting.json")
let translation_directory = "../language/" + settings.group + "/www/"
let manual_directory = "../GMS2-Robohelp-en/"
let export_directory = "../build/"
let json_global = require("../language/" + settings.group + "/global.json");

function removeHtml(str) {
    str=str.replace(/(<([^>]+)>)/ig, "{}");
    str=str.replace(/\r\n/g, '\n');
    str=str.replace(/\n/g, '');
    str=str.replace(/ {2,}/g, ' ');
    return str
}

function retHtml(str) {
    var regex = /(<([^>]+)>)/ig
	return str.match(regex);
}

function checkUnTranslated(page, json, attr, filename) {
    let html
    if(!attr){
        html = page.html()
    } else {
        html = page.attr(attr)
    }
    let key = removeHtml(html)
    let val = json[key]
    if (key != val){
        let unTranslatedLog = "\"" + key + "\" is not translated in " + filename + ".\n"
        fs.appendFileSync("logs.txt", unTranslatedLog)
    }
}

function importTranslate(page, json, attr) {
    let html
    if(!attr){
        html = page.html()
    } else {
        html = page.attr(attr)
    }
    let key = removeHtml(html)
    let val = json[key]
    if (val !== undefined && val.length) {
        let f = retHtml(html)
        let i = 0
        if (f) f.forEach((v, k) => {
            let tmp=val.replace("{"+ i +"}",v)
            if(tmp === val){
                val = val.replace("{}",v)
            }else{
                val = tmp
            }
            i++
        })
        if(!attr){
            page.html(val)
        } else {
            page.attr(attr, val)
        }
    }
}

// 从记忆库替换导入翻译
glob(manual_directory + '**/*.htm', {}, (err, files) => {
    if (err) {
        console.log("错误：" + err)
    } else {
        for (let index = 0; index < files.length; index++) {
            let filename = path.dirname(files[index]).split("/").splice(2).join("/") + "/" + path.basename(files[index], ".htm")
            let normalizeName = path.normalize(files[index])
            // console.log(filename)
            let $ = cheerio.load(fs.readFileSync(files[index]).toString())
            let json
            if(fs.existsSync(files[index]) && fs.existsSync(translation_directory + filename + ".json")){
                json = require(translation_directory + filename + ".json")
            } else {
                continue
            }
            $("p:not(.hljs,.code_plain),h1,h2,h3,td,li,a,div.dropspotnote,figcaption,.expandtext").each(function(){
                importTranslate($(this), json)
                checkUnTranslated($(this), json, null, filename)
            })
            $("div.footer a,h4,caption").each(function(){
                importTranslate($(this), json_global)
                checkUnTranslated($(this), json_global, null, filename)
            })
            $("th,.warning,.important,.optional").each(function(){
                importTranslate($(this), json_global)
                checkUnTranslated($(this), json_global, null, filename)
            })
            $(".tooltip").each(function(){
                importTranslate($(this), json_global, "title")
                checkUnTranslated($(this), json_global, "title", filename)
            })
            let generateDep
            if (fs.existsSync(normalizeName + ".head")) {
                generateDep = fs.readFileSync(normalizeName + ".head").toString()
            } else {
                generateDep = ""
            }
            $("head").prepend(generateDep)
            fs.writeFile(export_directory + filename + ".htm", $.html(), (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    }
})
