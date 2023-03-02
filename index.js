
import transformAll from "./src/html2mp4.js";
import scrape from "./src/scrape.js";
import * as mf from "./src/myFiles.js";
import edit from "./src/video_edit.js";

async function main () {
//    scrape ();
//    await transformAll().catch(console.error);
    await edit();

    main();
}
main();
