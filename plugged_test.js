"use strict";
const cheerio = require("cheerio");
const fs = require("fs");

let generateDep = "js-and-css.htm";
let dep = fs.readFileSync(generateDep).toString();
let template = cheerio.load(fs.readFileSync("tests/template.htm").toString());
let $ = cheerio.load(fs.readFileSync("tests/Additional_Information.htm").toString());

$("head").prepend(dep)
// console.log(template)
fs.writeFileSync("test.htm", $.html());