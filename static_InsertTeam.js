"use strict";
const cheerio = require("cheerio")
const fs = require("fs")

// 插入译者信息
let settings = require("../setting.json")
let export_directory = "../build/"
let content = fs.readFileSync(export_directory + "Content.htm").toString()
let team_patch = fs.readFileSync("../patch/team.htm").toString()
let $ = cheerio.load(content)

$('p').eq(settings.patch_eq).empty().addClass('team').append(team_patch)

fs.writeFileSync(export_directory + "Content.htm", $.html())
