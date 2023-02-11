
const html2mp4 = require("./src/html2mp4.js");
const scrape = require("./src/scrape.js");
const parse = require("./src/html_processor.js");
const mf = require("./src/myFiles.js");

async function main() {
    console.log("smth");
    mf.ensureAllDirs();
    //scrape();
    html2mp4().catch(console.error);
    parse().catch(console.error);
}
