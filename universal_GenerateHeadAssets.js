"use strict";
const glob = require("glob");
const path = require("path");
const fs = require("fs");

let patch_directory = "../patch/import/"

let generateDep = "js-and-css.htm";

if (fs.existsSync(generateDep)) {
    fs.rmSync(generateDep)
}

glob(patch_directory + "**/*.js", {}, (err, jsfile)=>{
    if (err) {
        console.log(err)
    } else {
        for (let index = 0; index < jsfile.length; index++) {
            let jsFilename = jsfile[index].split("/").splice(3).join("/")
            let appendJS = '<script type="text/javascript" src="assets/import/' + jsFilename + '"></script>\n'
            fs.appendFileSync(generateDep, appendJS)
        }
    }
})
glob(patch_directory + "**/*.css", {}, (err, cssfile)=>{
    if (err) {
        console.log(err)
    } else {
        for (let index = 0; index < cssfile.length; index++) {
            let cssFilename = cssfile[index].split("/").splice(3).join("/")
            let appendCSS = '<link rel="stylesheet" type="text/css" href="assets/import/' + cssFilename + '"/>\n'
            fs.appendFileSync(generateDep, appendCSS)
        }
    }
})
