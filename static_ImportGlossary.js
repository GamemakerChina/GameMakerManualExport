"use strict";
const fs = require("fs");
const readline = require("readline");
const jsbeautify = require("js-beautify").js;

let glossary_file = "../GMS2-Robohelp-en/whxdata/gdata1.new.js"
let glossary_file_export = "../build/whxdata/gdata1.new.js";
let global_settings = require("../setting.json");
let json_global = require("../language/" + global_settings.group + "/global.json");

let regex = new RegExp(`"entrys": \\[\\{`, "g");

let glossary_original = fs.readFileSync(glossary_file).toString();
let glossary_beautify = jsbeautify(glossary_original, { indent_size: 4, space_in_empty_paren: true });
fs.writeFileSync(glossary_file, glossary_beautify);

let glossary_special = require("../language/" + global_settings.group + "/glossarySpecial.json")

let glossary_stream_read = fs.createReadStream(glossary_file);
let glossary_json_filename = "./gdata1.new.json";
let rl = readline.createInterface({
    input: glossary_stream_read
});

rl.on('line', (line) => {
    // 一样古典方法删除但有用
    switch (line.trim()) {
        case "(function() {":
            return "";

        case "var glossary = {":
            return "";

        case "\"type\": \"data\",":
            return "";

        case "};":
            return "";

        case "window.rh.model.publish(rh.consts('KEY_TEMP_DATA'), glossary, {":
            return "";

        case "sync: true":
            return "";

        case "});":
            return "";

        case "})();":
            return "";
    }
    fs.appendFileSync(glossary_json_filename, line.replace(regex, "[{")
                                                    .replace("}];", "}]")
                                                    .replace(/\\r\\n/g, "") // 去除 \r\n（巨坑x1）
                                                    .replace(/\u00a0/g, "&nbsp;") // 替换 Unicode 不可见字符 U+00a0为转义字符 &nbsp;（巨坑x2）
                                                    .replace(">", "&gt;")  // 替换 > 为转义字符 &gt;（巨坑x3）
                                                    );
});

rl.on("close", () => {
    if (fs.existsSync(glossary_json_filename)){
        let glossary_json = require(glossary_json_filename);
        for (let i = 0; i < glossary_json.length; i++){
            // YoYo 你们文档写得很好，下次别写了
            if (json_global[glossary_json[i].value]) { // 一般情况下的匹配
                if (glossary_json[i].value !== json_global[glossary_json[i].value]) {
                    glossary_json[i].value = json_global[glossary_json[i].value]
                }
            } else {
                // 未匹配时输出所在的位置，并使用备用方案
                console.log(glossary_json[i].name + "is not be translated, use glossarySpecial.json")
                glossary_json[i].value = glossary_special[glossary_json[i].name]
            }
        }
        fs.writeFileSync(glossary_json_filename, JSON.stringify(glossary_json, null, "\t"));
    }
    
    let glossary_json_translated = require(glossary_json_filename);
    let glossary_js_template = `
    (function() {
        var glossary = {
            "type": "data",
            "entrys": ${JSON.stringify(glossary_json_translated)}
        };
        window.rh.model.publish(rh.consts('KEY_TEMP_DATA'), glossary, {
            sync: true
        });
    })();
    `
    fs.writeFileSync(glossary_file_export, glossary_js_template)
});

if (fs.existsSync(glossary_json_filename)) {
    try {
        fs.unlinkSync(glossary_json_filename);
        fs.rmSync(glossary_json_filename);
    } catch (error) {
        if (error) {
            return;
        }
    }
};