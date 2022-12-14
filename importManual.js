"use strict";
const cheerio = require("cheerio")
const glob = require("glob")
const fs = require("fs")

let regex = /(<([^>]+)>)/ig
let settings = require("../setting.json")
let translation_directory = "../language/" + settings.group + "/www/"
let manual_directory = "../GMS2-Robohelp-en/"
let export_directory = "../build/"
let patch_directory = "../patch/static_patch/"
let json_global = require("../language/" + settings.group + "/global.json");

function removeHtml(str) {
    return str.replace(regex, "{}");
}

function retHtml(str) {
    return str.match(regex);
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
            var tmp=val.replace("{"+ i +"}",v)
            if(tmp===val){
                val=val.replace("{}",v)
            }else{
                val=tmp
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

fs.cpSync(manual_directory, export_directory, {recursive: true})

// 从记忆库替换导入翻译
glob(manual_directory + '**/*.htm', {}, (err, files) => {
    if (err) {
        console.log("错误：" + err)
    } else {
        for (let index = 0; index < files.length; index++) {
            let filename = files[index].substring(20, files[index].length - 4)
            // console.log(filename)
            let $ = cheerio.load(fs.readFileSync(files[index]).toString())
            let json
            if(fs.existsSync(files[index]) && fs.existsSync(translation_directory + filename + ".json")){
                json = require(translation_directory + filename + ".json")
            } else {
                continue
            }
            $("p,h1,h2,h3,td,li,a,div.dropspotnote,figcaption,.expandtext").each(function(){
                importTranslate($(this), json)
            })
            $("div.footer a,h4,caption").each(function(){
                importTranslate($(this), json_global)
            })
            $("th,.warning,.important,.optional").each(function(){
                importTranslate($(this), json_global)
            })
            $(".tooltip").each(function(){
                importTranslate($(this),json_global,"title")
            })
            glob(patch_directory + "*.js", {}, (err, jsfile)=>{
                if (err) {
                    console.log(err)
                } else {
                    for (let index = 0; index < jsfile.length; index++) {
                        let jsFilename = jsfile[index].substring(9, 0)
                        let appendJS = '<script type="text/javascript" src="assets/static_patch/' + jsFilename + '}"/>'
                        $('head').append(appendJS)
                    }
                }
            })
            glob(patch_directory + "*.css", {}, (err, cssfile)=>{
                if (err) {
                    console.log(err)
                } else {
                    for (let index = 0; index < cssfile.length; index++) {
                        let cssFilename = cssfile[index].substring(9, 0)
                        let appendCSS = '<link rel="stylesheet" type="text/css" href="assets/static_patch/' + cssFilename + '}"/>'
                        $('head').append(appendCSS)
                    }
                }
            })
            fs.writeFile(export_directory + filename + ".htm", $.html(), (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    }
})

fs.cpSync(patch_directory, export_directory + "assets/static_patch/", {recursive: true})
