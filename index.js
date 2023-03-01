
import transformAll from "./src/html2mp4.js";
import scrape from "./src/scrape.js";
import * as mf from "./src/myFiles.js";

async function main () {
    await scrape ();
    await transformAll().catch(console.error);
    main();
}
main();
