'use strict';

const fs = require("fs");

//create a function which moves scraped html file into tmp folder, then parses it, returns multiple htmls, writes them into folder with the name corresponding to the scraped html's name
//void f(string,string)
async function move(path_pre,path_post){
    fs.rename(path_pre,path_post,(err)=>{
        if(err){
            console.log(err);
            throw err;
        }
    });
}


//string[] f(void)
const getHtmlArr = (async ()=>{
    return fs.readdirSync("./bin/scraped_html/");
});
//void f(void)
const parseAll = (async ()=>{
   const html_filenames = await getHtmlArr();
    html_filename.forEach(el=>parse(el));
});

//void f(string)
const parse = (async (path)=>{
    //magick
})

    getHtmlArr();
module.exports = parse_all;

