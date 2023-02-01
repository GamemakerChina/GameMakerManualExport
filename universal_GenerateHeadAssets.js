"use strict";
const glob = require("glob");
const path = require("path");
const fs = require("fs");

let settings = require("../setting.json")
let manual_directory = "../GMS2-Robohelp-en/"
let export_directory = "../build/"
let patch_directory

switch (settings.export_mode) {
    case "plugged":
        patch_directory = "../" + settings.importPath + "/"
        break;

    case "static":
        patch_directory = "../" + settings.staticPath + "/"
        break;
}

// fs.cpSync(manual_directory, export_directory, {recursive: true})

glob(export_directory + '**/*.head.htm', {}, (err, files) => {
    for (let k = 0; k < files.length; k++) {
        if (fs.existsSync(files[k])) {
            fs.rmSync(files[k])
        }
    }
    
})

glob(export_directory + '**/*.htm', {}, (err, files) => {
    if (err) {
        console.log("错误：" + err)
    } else {
        for (let index = 0; index < files.length; index++) {
            let generateDep = path.basename(files[index], ".htm") + ".head.htm"
            glob(patch_directory + "**/*.js", {}, (err, jsfile) => {
                if (err) {
                    console.log(err)
                } else {
                    for (let j = 0; j < jsfile.length; j++) {
                        let jsFilename = jsfile[j].split("/").splice(3).join("/")
                        let jsPath = path.relative(files[index], jsFilename)
                        // console.log(jsPath)
                        let appendJS = '<script type="text/javascript" src="' + jsPath + '"></script>\n'
                        fs.appendFileSync(export_directory + generateDep, appendJS)
                    }
                }
            })
            glob(patch_directory + "**/*.css", {}, (err, cssfile) => {
                if (err) {
                    console.log(err)
                } else {
                    for (let index = 0; index < cssfile.length; index++) {
                        let cssFilename = cssfile[index].split("/").splice(3).join("/")
                        let appendCSS = '<link rel="stylesheet" type="text/css" href="' + cssFilename + '"/>\n'
                        fs.appendFileSync(export_directory + generateDep, appendCSS)
                    }
                }
            })
        }
    }
})