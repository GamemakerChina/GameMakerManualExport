const fs = require("fs");

let manual_directory = "../GMS2-Robohelp-en/"
let export_directory = "../build/"
fs.cpSync(manual_directory, export_directory, {recursive: true})