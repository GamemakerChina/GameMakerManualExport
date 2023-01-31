"use strict";
const cheerio = require("cheerio");
const fs = require("fs");

let template = cheerio.load(fs.readFileSync("template.htm").toString());
let $ = cheerio.load(fs.readFileSync("Additional_Information.htm").toString());

template.html().replace("{importHtml}", $)
// console.log(template)
fs.writeFileSync("test.htm", template.html());