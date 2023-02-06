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

//void f(void)
const parseAll = (async ()=>{
    const html_filenames = await getHtmlArr();
    html_filenames.forEach(el=>parse(el));
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
    fs.writeFile(html_to_dir+path,new_string,(e)=>{
        if(e)
            console.error(e)
    })
});

//string f(string,string)
function reAddClass(class_string,html_string){
    return "<div class='"+class_string+"'>\n"+html_string+"\n</div>"
}


// string[] f(string)
const splitHTML = (html_string)=>{
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

    return arr;
};

//void f(string)
const parse = (async (path)=>{
    //for each post, create a different html file, as well as for
    //this has helped: X paragraphs
    return await fs.readFile(html_from_dir+path,"utf8",(err,html_string)=>{
        if(err)throw err;

        const post_arr = splitHTML(html_string);


        post_arr.forEach((el,i)=>{
            let new_string = toCompleteHtml(el);
            write(i+"_"+path,new_string);
        });


    });
})

parseAll();
module.exports = parseAll;

