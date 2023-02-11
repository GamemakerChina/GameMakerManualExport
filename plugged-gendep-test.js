"use strict";
const glob = require("glob");
const path = require("path");
const fs = require("fs");
const process = require('process');

let settings = require("../setting.json")
let export_directory = "../build/"
let patch_directory = "../" + settings.importPath + "/"
let patch_final = export_directory + "assets/import/"

fs.cpSync(patch_directory, patch_final, {recursive: true})

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
                                            // .replace("..\\..\\", "..\\").replace("../../", "../")
                        console.log(files[index] + " with " + jsPath)
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
                                            .replace("..\\..\\", "..\\").replace("../../", "../")
                        console.log(files[index] + " with " + cssPath)
                    }
                }
            })
        }
    }
})