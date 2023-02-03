"use strict";
const fs = require("fs")

// 插入译者信息
let export_directory = "../build/"
let content = fs.readFileSync(export_directory + "Content.htm").toString()
let team_patch = fs.readFileSync("../patch/team.htm").toString()

let final = content.replace("<h1", team_patch + "<h1")

fs.writeFileSync(export_directory + "Content.htm", final)