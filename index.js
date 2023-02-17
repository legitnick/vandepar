
const transformAll = require("./src/html2mp4.js");
const scrape = require("./src/scrape.js");
const mf = require("./src/myFiles.js");

async function main() {
    await mf.ensureAllDirs();
    transformAll().catch(console.error);
    scrape();
}
main();
