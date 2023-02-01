"use strict";
const cheerio = require("cheerio");
const glob = require("glob");
const path = require("path");
const fs = require("fs");

let settings = require("../setting.json");
let dep = fs.readFileSync("js-and-css.htm").toString();
let template = fs.readFileSync("../patch/template.htm").toString();
let manual_directory = "../GMS2-Robohelp-en/"
let export_directory = "../build/"
let json_global = require("../language/" + settings.group + "/global.json");

fs.cpSync(manual_directory, export_directory, {recursive: true})
fs.cpSync("../patch/import/", export_directory + "assets/import/", {recursive: true})

glob(manual_directory + '**/*.htm', {}, (err, files) => {
    if (err) {
        console.log("错误：" + err)
    } else {
        for (let index = 0; index < files.length; index++) {
            glob(export_directory + "**/*.js", {}, (err, jsfile) => {
                if (err) {
                    console.log(err)
                } else {
                    for (let j = 0; j < jsfile.length; j++) {
                        let jsFilename = jsfile[j].split("/").splice(3).join("/")
                        let $ = cheerio.load(fs.readFileSync(files[index]))
                        let jsPath = path.relative(files[index], jsFilename)
                        let appendJS = '<script type="text/javascript" src="/assets/import/' + jsPath + '"></script>\n'
                        $()
                    }
                }
            })
            // glob(patch_directory + "**/*.css", {}, (err, cssfile) => {
            //     if (err) {
            //         console.log(err)
            //     } else {
            //         for (let index = 0; index < cssfile.length; index++) {
            //             let cssFilename = cssfile[index].split("/").splice(3).join("/")
            //             let appendCSS = '<link rel="stylesheet" type="text/css" href="/assets/import/' + cssFilename + '"/>\n'
            //             fs.appendFileSync(generateDep, appendCSS)
            //         }
            //     }
            // })
        }
    }
})

// let template_complete = template.replace("{importHtml}", dep)
//                                 .replace("{global}", json_global.toString())
//                                 .replace("{json}", json_other.toString())
// $("head").prepend(template_complete)
// fs.writeFileSync("test.htm", $.html());