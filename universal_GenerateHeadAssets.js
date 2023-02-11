"use strict";
const glob = require("glob");
const path = require("path");
const fs = require("fs");
const process = require('process');

let settings = require("../setting.json")
let export_directory = "../build/"
let build_options = process.argv.splice(2)
let patch_directory, patch_final

switch (build_options[0]) {
    case "plugged": // 外挂式所需依赖
        patch_directory = "../" + settings.importPath + "/"
        patch_final = export_directory + "assets/import/"
        break;

    case "static": // 静态式所需依赖
        patch_directory = "../" + settings.staticPath + "/"
        patch_final = export_directory + "assets/static_patch/"
        break;
}

console.log(build_options[0])
fs.cpSync(patch_directory, patch_final, {recursive: true, force: true})

glob(export_directory + '**/*.htm', {}, (err, files) => {
    if (err) {
        console.log("错误：" + err)
    } else {
        for (let index = 0; index < files.length; index++) {
            let filename = path.normalize(files[index])
            let generateDep = filename + ".head"
            // console.log(generateDep)
            glob(patch_final + "**/*.js", {}, (err, jsfile) => {
                if (err) {
                    console.log(err)
                } else {
                    for (let j = 0; j < jsfile.length; j++) {
                        let jsFilename = jsfile[j].split("/").splice(2).join("/")
                        let jsPath = path.relative(path.dirname(filename), jsFilename)
                                        .replace("GameMakerManualExport\\", "").replace("GameMakerManualExport/", "")
                                        .replace("..\\..\\", "..\\").replace("../../", "../")                        // console.log(jsPath)
                        let appendJS = '<script type="text/javascript" src="' + jsPath + '"></script>\n'
                        fs.appendFileSync(export_directory + generateDep, appendJS)
                    }
                }
            })
            glob(patch_final + "**/*.css", {}, (err, cssfile) => {
                if (err) {
                    console.log(err)
                } else {
                    for (let i = 0; i < cssfile.length; i++) {
                        let cssFilename = cssfile[i].split("/").splice(2).join("/")
                        let cssPath = path.relative(path.dirname(filename), cssFilename)
                                        .replace("GameMakerManualExport\\", "").replace("GameMakerManualExport/", "")
                                        .replace("..\\..\\", "..\\").replace("../../", "../")                        // console.log(cssPath)
                        let appendCSS = '<link rel="stylesheet" type="text/css" href="' + cssPath + '"/>\n'
                        fs.appendFileSync(export_directory + generateDep, appendCSS)
                    }
                }
            })
        }
    }
})