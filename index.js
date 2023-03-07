import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import transformAll from "./src/html2mp4.js";
import scrape from "./src/scrape.js";
import * as mf from "./src/myFiles.js";
import edit from "./src/video_edit.js";
async function main () {
  await Promise.all([scrape (),
    transformAll().catch(console.error),
    edit()]);

  main();
}
main();
