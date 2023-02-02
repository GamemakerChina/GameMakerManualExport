"use strict";
const glob = require("glob");
const path = require("path");
const fs = require("fs");
const process = require('process');

let settings = require("../setting.json")
let manual_directory = "../GMS2-Robohelp-en/"
let export_directory = "../build/"
let build_options = process.argv.splice(2)
let patch_directory

switch (build_options[0]) {
    case "plugged":
        patch_directory = "../" + settings.importPath + "/"
        break;

    case "static":
        patch_directory = "../" + settings.staticPath + "/"
        break;
}

console.log(build_options[0])
// // fs.cpSync(manual_directory, export_directory, {recursive: true})
fs.cpSync("../patch/import/", export_directory + "assets/import/", {recursive: true})

glob(export_directory + '**/*.htm', {}, (err, files) => {
    if (err) {
        console.log("错误：" + err)
    } else {
        for (let index = 0; index < files.length; index++) {
            let filename = path.normalize(files[index])
            let generateDep = filename + ".head"
            // console.log(generateDep)
            glob(export_directory + "**/*.js", {}, (err, jsfile) => {
                if (err) {
                    console.log(err)
                } else {
                    for (let j = 0; j < jsfile.length; j++) {
                        let jsFilename = jsfile[j].split("/").splice(2).join("/")
                        let jsPath = path.relative(path.dirname(filename), jsFilename).replace("GameMakerManualExport\\", "").replace("..\\..\\", "..\\")
                        // console.log(jsPath)
                        let appendJS = '<script type="text/javascript" src="' + jsPath + '"></script>\n'
                        fs.appendFileSync(export_directory + generateDep, appendJS)
                    }
                }
            })
            glob(export_directory + "**/*.css", {}, (err, cssfile) => {
                if (err) {
                    console.log(err)
                } else {
                    for (let i = 0; i < cssfile.length; i++) {
                        let cssFilename = cssfile[i].split("/").splice(2).join("/")
                        let cssPath = path.relative(path.dirname(filename), cssFilename).replace("GameMakerManualExport\\", "").replace("..\\..\\", "..\\")
                        // console.log(cssPath)
                        let appendCSS = '<link rel="stylesheet" type="text/css" href="' + cssPath + '"/>\n'
                        fs.appendFileSync(export_directory + generateDep, appendCSS)
                    }
                }
            })
        }
    }
})