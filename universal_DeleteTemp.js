"use strict";
const fs = require("fs");
const glob = require("glob");

let export_directory = "../build/"
let export_directory_toc = "../build/whxdata/"
let glossary_json_filename = export_directory_toc + "gdata1.new.json"

glob(export_directory_toc + "toc*.new.json", {}, (err, files)=>{
    if (err) {
        console.log(err)
    } else {
        for (let index = 0; index < files.length; index++) {
            if (fs.existsSync(files[index])) {
                fs.rmSync(files[index])
            }
        }
    }
});

if (fs.existsSync(glossary_json_filename)) {
    fs.rmSync(glossary_json_filename);
};

glob(export_directory + '**/*.head', {}, (err, files) => {
    if (err) {
        console.log(err)
    } else {
        for (let k = 0; k < files.length; k++) {
            if (fs.existsSync(files[k])) {
                fs.rmSync(files[k])
            }
        }
    }
});