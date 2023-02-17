'use strict';

const cheerio = require("cheerio");
const fs = require("fs");
const pth = require("path");
//create a function which moves scraped html file into tmp folder, then parses it, returns multiple htmls, writes them into folder with the name corresponding to the scraped html's name
const mf  = require("./myFiles.js");




//void f(void)
const parseAll = (async ()=>{

    const html_arr_used = fs.readdirSync(mf.video_dir);
    const html_filenames = fs.readdirSync(mf.html_from_dir).filter(el=>!html_arr_used.includes(parseInt(el)+".mp4"));//only parse files w/o used variant

    console.log(html_arr_used);
    console.log(html_filenames);
    if(html_filenames.length)
        html_filenames.forEach(async (el)=>{
            await parse(el);
        });
});

//void f(string)
const writeCompleteHTML = (path,html_string)=>{
    let complete_html = mf.toCompleteHTML(html_string);
    write(path,complete_html);
}


//void f(string,string)
const write = (async (path,new_string)=>{
    fs.writeFile(path,new_string,(e)=>{
        if(e){
            console.error(e)
            return new Promise((resolve,reject)=>reject());
        }

        return new Promise((resolve,reject)=>resolve());
    })
});

//string f(string,string)
function reAddClass(class_string,html_string){
    return "<div class='"+class_string+"'>\n"+html_string+"\n</div>"
}

//void f(string)
const parse = (async (path)=>{
    fs.readFile(mf.html_from_dir+path,"utf8",(err,data)=>writeCompleteHTML(mf.html_to_dir + path,data));

});
//parseAll();
module.exports= parseAll;
