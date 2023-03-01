import fs from "fs";
import path from "path";

//string f(string)
export const toCompleteHTML = (html_string)=>{
    let new_string = '<!DOCTYPE html><html lang="en"><head><style>@import url("https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;1,200;1,300&family=Work+Sans:wght@400;500&display=swap");</style><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><head><link href="../../src/css/general.css" rel="stylesheet" /></head>'
    new_string+=html_string;
    new_string+='</body></html>';
    return new_string;
}

//void f(string)
export const ensureDir = ((path)=>{
    if(!fs.existsSync(path))fs.mkdirSync(path);
});

export const html_from_dir = "./bin/scraped_html/";//it'll be dot for now
export const video_dir = "./bin/video/";
export const html_to_dir = "./bin/scraped_html/";

//void (void)
export function ensureAllDirs (){
    console.log("ensured");
    ensureDir("./bin/");
    ensureDir(html_from_dir);
    ensureDir(video_dir);
}

ensureAllDirs();
//ensure for these 2 readdirSync functions later
export const html_arr_used = ()=> fs.readdirSync(video_dir);
console.log(html_arr_used());
export const html_filenames = ()=> fs.readdirSync(html_from_dir).filter(el=>!html_arr_used().includes(parseInt(el)+".mp4"));//only parse files w/o used variant
console.log(html_filenames());

export const browser_dot_dir = "file://" + process.cwd();
export const goto_dir = "file://" + process.cwd()+ "/bin/scraped_html/"; //"/bin/processed_html/";//this variable needs full path to work in puppeteers Chromium,also process.cwd more suitable than __dirname in this case
