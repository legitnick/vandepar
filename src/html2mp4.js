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
    await new Promise(resolve=>setTimeout(resolve,100));

    return await scroll(page);//(functionRef, ms, param1)

};

//void f(Page)
async function scroll (page) {
    return await page.evaluate(async ()=>{
        return await new Promise((resolve)=>{
            let current_scrolled = 0;
            let dist = 1;//scroll, px
            var timer = setInterval(()=>{
                window.scrollBy(0,dist);
                current_scrolled+=dist;

                if(current_scrolled > document.body.scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    setTimeout(resolve,100);
                }

            },20)//wait, ms
        }).catch((e)=>{
            console.error(e);
            reject(e);;
            });
        });
    };

//void f(int)
const transform = (async (html_number) => {
        console.log(mf.html_from_dir);
        const browser = await puppeteer.launch().catch((e)=>console.error(e));
        const page = await browser.newPage().catch((e)=>console.error(e));
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
            isLandscape: true,
        });

        const recorder = new PuppeteerScreenRecorder(page,configForDynamic);

        await recorder.start(mf.video_dir + html_number +".mp4").catch((err)=>reject(err));//replace replace with html_number


        await page.goto(goto_dir + html_number+ ".html", {waitUntil: 'networkidle0'}).catch((e)=>console.error(e));


        /*return await look(page).then((res,rej)=>{
            return recorder.stop();
        }).then((res)=>browser.close()).catch((e)=>console.error(e));*/
    });
    //await everything

const renameToUsed = (async(html_string) => {
    mf.move(html_string,"u_"+html_string);
});

//filter html_arr with a function isHTMLUsed

//void f(void)
    const transformAll = (){
        const html_arr = fs.readdirSync(mf.html_from_dir);
        const html_num_arr = html_arr.map(el=>parseInt(el));
        html_num_arr.forEach(transform);
        html_arr.forEach(renameToUsed);
    }
    transform();

    module.exports = transform;
