'use strict';

const cheerio = require("cheerio");
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

const html_from_dir = "./bin/scraped_html/";
const html_to_dir = "./bin/processed_html/";

//string[] f(void)
const getHtmlArr = (async ()=>{
    return fs.readdirSync(html_from_dir);
});
//this has no business being async function, does it?

//void f(void)
const parseAll = (async ()=>{
    const html_filenames = await getHtmlArr();
    //console.log(html_filenames);
    html_filenames.forEach(async (el)=>{
        await parse(el);
    });
});

//void f(string)
const toCompleteHtml = (html_string)=>{
    let new_string = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><head><link href="../../src/css/general.css" rel="stylesheet" /></head>'
    new_string+=html_string;
    new_string+='</body></html>';
    return new_string;
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


// string[] f(string)
const splitHTML = (error,html_string)=>{
    if(error)console.error(error);

    const $ = cheerio.load(html_string);

    const qs = $(".question-hyperlink").toArray().map(el=>$(el).html()).map(el=>reAddClass("question-hyperlink",el));
    const posts = $(".s-prose").toArray().map(el=>$(el).html()).map(el=>reAddClass("s-prose",el));
    const helpeds = $(".this-has-helped").toArray().map(el=>$(el).html()).map(el=>reAddClass("this-has-helped",el));
    //too repetitive to not have a function

    let mixed_posts = [];
    for(let i = 0;i < posts.length; i++){
        mixed_posts.push(posts[i]);
        if(i<helpeds.length)
            mixed_posts.push(helpeds[i]);
    }
    const arr = qs.concat(mixed_posts);

    console.log(arr);
    return arr;
};

//void f(string)
const parse = (async (path)=>{
    //for each post, create a different html file, as well as for
    //this has helped: X paragraphs
    let newdir = ""+parseInt(path);//get_int_string()?

    /*if(fs.access(html_from_dir + newdir),fs.constants.F_OK,(err)=>{
        console.log(`${file} ${err ? 'is not readable' : 'is readable'}`);
    })*/
    if(fs.existsSync(html_to_dir+newdir)){
        console.log(html_to_dir+newdir+" Exists");
        return new Promise((resolve)=>resolve());
    }
        //didn't even check for the correct thing

    fs.mkdirSync(html_to_dir+newdir+"/");
    return new Promise((resolve,reject)=>{

        let html;
            fs.readFile(html_from_dir+path,"utf8",splitHTML);
})
});
parseAll();
module.exports = parseAll;
