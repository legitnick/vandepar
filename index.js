
const html2mp4 = require("./src/html2mp4.js");
const scrape = require("./src/scrape.js");
const parse = require("./src/html_processor.js");

async function main() {
    //scrape();
    html2mp4();
    parse();
}
