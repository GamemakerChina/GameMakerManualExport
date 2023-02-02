"use strict";
const cheerio = require("cheerio");
const glob = require("glob");
const path = require("path");
const fs = require("fs");

let settings = require("../setting.json");
let template = fs.readFileSync("../patch/template.htm").toString();
let translation_directory = "../language/" + settings.group + "/www/"
let manual_directory = "../GMS2-Robohelp-en/"
let export_directory = "../build/"
let json_global = fs.readFileSync("../language/" + settings.group + "/global.json").toString();

// fs.cpSync(manual_directory, export_directory, {recursive: true})
// fs.cpSync("../patch/import/", export_directory + "assets/import/", {recursive: true})

glob(export_directory + '**/*.htm', {}, (err, files) => {
    if (err) {
        console.log("错误：" + err)
    } else {
        for (let index = 0; index < files.length; index++) {
            let filename = path.dirname(files[index]).split("/").splice(2).join("/") + "/" +path.basename(files[index], ".htm")
            let normalizeName = path.normalize(files[index])
            let $ = cheerio.load(fs.readFileSync(files[index]))
            let json
            if (fs.existsSync(normalizeName) && fs.existsSync(translation_directory + filename + ".json")) {
                json = fs.readFileSync(translation_directory + filename + ".json").toString()
            } else {
                continue
            }
            // console.log(json)
            let headDep = fs.readFileSync(normalizeName + ".head").toString()
            let final = template.replace("{importHtml}", headDep)
                                .replace("{json}", json)
                                .replace("{global}", json_global)
            $("head").prepend(final)
            fs.writeFile(normalizeName, $.html(), (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }
    }
})

// let template_complete = template.replace("{importHtml}", dep)
//                                 .replace("{global}", json_global.toString())
//                                 .replace("{json}", json_other.toString())
// $("head").prepend(template_complete)
// fs.writeFileSync("test.htm", $.html());