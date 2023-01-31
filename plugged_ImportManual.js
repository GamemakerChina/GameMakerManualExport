"use strict";
const cheerio = require("cheerio");
const glob = require("glob");
const fs = require("fs");

let settings = require("../setting.json")
let translation_directory = "../language/" + settings.group + "/www/"
let manual_directory = "../GMS2-Robohelp-en/"
let export_directory = "../build/"
let patch_directory = "../patch/"

glob(manual_directory + "**/*.htm", {}, (err, files) =>{
    if(err){
        console.log(err)
    } else {
        for (let index = 0; index < array.length; index++) {
            let filename = files[index].substring(20, files[index].length - 4)
            // console.log(filename)
            let $ = cheerio.load(fs.readFileSync(files[index]).toString())
            if(fs.existsSync(files[index]) && fs.existsSync(translation_directory + filename + ".json")){
                json = require(translation_directory + filename + ".json")
            } else {
                continue
            }
            
        }
    }
})