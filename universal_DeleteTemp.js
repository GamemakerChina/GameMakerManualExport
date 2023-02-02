const glob = require("glob");
const fs = require("fs");

let export_directory = "../build/"

glob(export_directory + '**/*.head', {}, (err, files) => {
    if (err) {
        console.log(err)
    } else {
        for (let k = 0; k < files.length; k++) {
            if (fs.existsSync(files[k])) {
                fs.rmSync(files[k])
            }
        }
    }
})