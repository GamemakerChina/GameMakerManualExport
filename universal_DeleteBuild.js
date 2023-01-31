"use strict";
const fs = require("fs")
const rimraf = require("rimraf") // 谨慎使用，这个库相当于使用 rm -rf

// 清空 build 目录内的所有文件
let export_directory = "../build/"

// 谨慎使用，这个库相当于使用 rm -rf
rimraf(export_directory, ()=>{
    console.log("success")
    fs.mkdirSync("../build")
})
