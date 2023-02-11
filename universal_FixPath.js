"use strict";
const fs = require("fs");
let export_directory = "../build/"
let extra_files = [
    "Content.htm",
    "csh-redirect.htm",
    "GameMaker_Language.htm",
    "index.htm",
    "index1.htm"
]

for (let j = 0; j < extra_files.length; j++) {
    let extra_heads = export_directory + extra_files[j] + ".head"
    let extra_heads_changed = fs.readFileSync(extra_heads).toString().replaceAll("..\\", "").replaceAll("../", "")
    fs.writeFileSync(extra_heads, extra_heads_changed)
}