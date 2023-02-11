"use strict";
const cheerio = require("cheerio");
const fs = require("fs");

let settings = require("../setting.json");
let template = fs.readFileSync("../patch/template.htm").toString();
let export_directory = "../build/";
let json_global = fs.readFileSync("../language/" + settings.group + "/global.json").toString();

let index_files = ["index.htm", "index1.htm"];

for (let i = 0; i < index_files.length; i++) {
    let index_file = export_directory + index_files[i];
    let $ = cheerio.load(fs.readFileSync(index_file));
    let headDep = fs.readFileSync(index_file + ".head").toString();
    let final = template.replace("{importHtml}", headDep).replace("{json}", "{}").replace("{global}", json_global);
    $("head").prepend(final);
    fs.writeFile(index_file, $.html(), (err) => {
        if (err) {
            console.log(err);
        }
    });
}
