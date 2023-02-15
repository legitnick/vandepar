
const transformAll = require("./src/html2mp4.js");
const scrape = require("./src/scrape.js");
const parse = require("./src/html_processor.js");
const mf = require("./src/myFiles.js");

async function main() {
    await mf.ensureAllDirs();
    scrape();
    //transformAll ();
    //parse().catch(console.error);
}
main();
