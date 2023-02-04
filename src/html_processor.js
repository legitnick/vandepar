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



// strin[] f(string)
const splitHTML = (html_string)=>{
    console.log(html_string);
    return html_string.split('class="s-prose js-post-body"').forEach(el=>'class="s-prose js-post-body"'+el).split('class="this-has-helped"').forEach(el=>'class="this-has-helped"'+el);
   //this calls for a function splitNoRemove
};

//void f(string)
const parse = (async (path)=>{
    //for each post, create a different html file, as well as for
    //this has helped: X paragraphs
    return await fs.readFile(html_from_dir+path,(err,html_string)=>{
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

