'use strict';

const fs = require("fs");
const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const process = require('process');
const mf = require("./myFiles.js");


const configForDynamic = {
    fps: 60,
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
        });
};

//void f(Page)
async function scroll (page) {

    await page.evaluate(async()=>{
        await new Promise((resolve)=>{
            let current_scrolled = 0;
            let dist = 1;//scroll, px
            var timer = setInterval(()=>{
                window.scrollBy(0,dist*100);//this waited for some reason for very long, then the output is 1 sec
                current_scrolled+=dist;

                console.log(document.body.scrollHeight+","+window.innerHeight);
                if(current_scrolled > document.body.scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }

            },20)//wait, ms
        })
    });
};

//void f(int,Browser)
const transform = (async (html_number,browser) => {

    const page = await browser.newPage().catch((e)=>console.error(e));
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        isLandscape: true,
    });
    await page.goto(mf.goto_dir+html_number+".html",{
        waitUntil:"load",
    });
    const recorder = await new PuppeteerScreenRecorder(page,configForDynamic);
    await recorder.start(mf.video_dir + html_number +".mp4").catch((err)=>reject(err));//replace replace with html_number


    await look(page).then(recorder.stop()).then(console.log("recorded"));
    //await page.goto(mf.goto_dir + html_number+ ".html", {waitUntil: 'networkidle0'}).catch((e)=>console.error(e));


});
//await everything

//void f(string);
const renameToUsed = (async(html_string) => {
    mf.move(mf.html_to_dir+html_string,mf.html_to_dir+"u_"+html_string);
});

//filter html_arr with a function isHTMLUsed
//bool f(string)
function isHtmlUnused(html_string){
    return html_string.charAt(0)!=='u';//using filenames, dk what else to do here, except from some real DB
}

//void f(void)
const transformAll =(async ()=>{

    const promise_array = [];

    const html_arr = fs.readdirSync(mf.html_to_dir).filter(isHtmlUnused);
    const html_num_arr = html_arr.map(el=>parseInt(el));

    const browser = await puppeteer.launch().catch((e)=>console.error(e));
    await html_num_arr.forEach(((el)=>{
        promise_array.push(transform(el,browser));
    }));

    await Promise.all(promise_array).then(()=>browser.close());

    html_arr.forEach(renameToUsed);
    /*return await look(page).then((res,rej)=>{
            return recorder.stop();
        }).then((res)=>browser.close()).catch((e)=>console.error(e));*/
});
transformAll();

module.exports = transformAll();
