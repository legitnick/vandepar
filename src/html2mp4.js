'use strict';

const fs = require("fs");
const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const process = require('process');
const mf = require("./myFiles.js");


const configForDynamic = {
    fps: 6/*0*/,
    videoFrame: {
        width: 1920,
        height: 1080,
    },
    videoCodec: 'libx264',
    videoPreset: 'ultrafast',
    videoBitrate: 1000,
    autopad: {
        color: 'black' | '#35A5FF',
    },
    aspectRatio: '16:9',
};

//void f(Page)
async function look(page){
    return await scroll(page)
        .catch((e)=>{
            console.error(e);
            reject(e);;
        })
};

//void f(Page)
const scroll = (async (page) =>{
    await page.evaluate(async ()=>{
        await new Promise((resolve)=>{
            let current_scrolled = 0;
            let dist = 1;//px
            var timer = setInterval(()=>{
                window.scrollBy(0,dist);
                current_scrolled+=dist;
                console.log(curren_scrolled+","+(document.body.scrollHeight - window.innerHeight));
                if(current_scrolled > document.body.scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }

            },20);
        });
    })
    return 1;
});
//void f(int,Browser)
const transform = (async (html_number) => {


    const browser = await puppeteer.launch().catch((e)=>console.error(e));
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        isLandscape: true,

    });

    const recorder = await new PuppeteerScreenRecorder(page,configForDynamic);

    await page.goto(mf.goto_dir+html_number+".html");
    await recorder.start(mf.video_dir + html_number +".mp4").catch((err)=>reject(err));//replace replace with html_number

    console.log("I've been there");

    await scroll(page).then(recorder.stop()).then(console.log("recorded"));
    //await page.goto(mf.goto_dir + html_number+ ".html", {waitUntil: 'networkidle0'}).catch((e)=>console.error(e));
    browser.close();//think I may not await for it
    return 1;
});
//await everything

//void f(string);
const renameToUsed = ((html_string) => {
    mf.move(mf.html_to_dir+html_string,mf.html_to_dir+"u_"+html_string);
});

//filter html_arr with a function isHTMLUsed
//bool f(string)
function isHtmlUnused(html_string){
    return html_string.charAt(0)!=='u';//using filenames, dk what else to do here, except from some real DB
}


//look -> promise -> look, until i < len
 async function wrap(html_arr,page,recorder){
  if(!html_arr.length) return 1;
  transform(html_arr.slice(-1),page,recorder).then(()=>{html_arr.pop();wrap(html_arr)})
 }

//void f(void)
const transformAll =(async ()=>{


    const html_arr = fs.readdirSync(mf.html_to_dir).filter(isHtmlUnused);
    const html_num_arr = html_arr.map(el=>parseInt(el));

    await wrap(html_num_arr)
    /*
    await html_num_arr.map((async(el)=>{
        el = await transform(el,page,recorder);
    }));
*/
    html_arr.forEach(renameToUsed);
    /*return await look(page).then((res,rej)=>{
            return recorder.stop();
        }).then((res)=>browser.close()).catch((e)=>console.error(e));*/
});

module.exports = transformAll;
