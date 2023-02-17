const fs = require("fs");
const path = require("path");

//string f(string)
const toCompleteHTML = (html_string)=>{
    let new_string = '<!DOCTYPE html><html lang="en"><head><style>@import url("https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;1,200;1,300&family=Work+Sans:wght@400;500&display=swap");</style><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><head><link href="../../src/css/general.css" rel="stylesheet" /></head>'
    new_string+=html_string;
    new_string+='</body></html>';
    return new_string;
}

//void f(string)
const ensureDir = ((path)=>{
    if(!fs.existsSync(path))fs.mkdirSync(path);
});

let html_from_dir = "./bin/scraped_html/";//it'll be dot for now
let video_dir = "./bin/video/";
let html_to_dir = "./bin/scraped_html/";

//void (void)
async function ensureAllDirs (){
    console.log("ensured");
    await ensureDir("./bin/");
    ensureDir(html_from_dir);
    ensureDir(video_dir);
}

ensureAllDirs();
//ensure for these 2 readdirSync functions later
const html_arr_used = fs.readdirSync(video_dir);
console.log(html_arr_used);
const html_filenames = ()=> fs.readdirSync(html_from_dir).filter(el=>!html_arr_used.includes(parseInt(el)+".mp4"));//only parse files w/o used variant
console.log(html_filenames());

exports.toCompleteHTML = toCompleteHTML;
exports.html_filenames = html_filenames;
exports.ensureAllDirs = ensureAllDirs;
exports.ensureDir = ensureDir;
exports.video_dir = video_dir;
exports.browser_dot_dir = "file://" + process.cwd();
exports.goto_dir = "file://" + process.cwd()+ "/bin/scraped_html/"; //"/bin/processed_html/";//this variable needs full path to work in puppeteers Chromium,also process.cwd more suitable than __dirname in this case
exports.html_from_dir = html_from_dir;//it'll be dot for now
//const html_from_dir = pth.join(__dirname,"/bin/scraped_html/");
//const html_to_dir = pth.join(__dirname,"/bin/processed_html/");
exports.html_to_dir = html_to_dir;



