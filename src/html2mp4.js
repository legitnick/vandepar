'use strict';

const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const process = require('process');

const curr_dir = process.cwd();
const goto_dir = "file://" + curr_dir + "/bin/scraped_html/";//this variable needs full path to work in puppeteers Chromium
console.log(goto_dir);//rm this
const video_dir = "./bin/video/";

const configForDynamic = {
    followNewTab: true,
    fps: 60,
    videoFrame: {
        width: 1920,
        height: 1080,
    },
    videoCrf: 30,
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
                //problem there?
                console.log(current_scrolled - document.body.scrollHeight + window.innerHeight)
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

    //void f(void) TODO: replace param void -> html_number(int)
    const transform = (async () => {
        const browser = await puppeteer.launch().catch((e)=>console.error(e));
        const page = await browser.newPage().catch((e)=>console.error(e));
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
            isLandscape: true,
            hasTouch: true
        });

        const recorder = new PuppeteerScreenRecorder(page,configForDynamic);

        await recorder.start(video_dir + "replace.mp4").catch((err)=>reject(err));//replace replace with html_number
        await page.goto(goto_dir + "16657603.html", {waitUntil: 'networkidle0'}).catch((e)=>console.error(e));

        return await look(page).then((res,rej)=>{
            return recorder.stop();
        }).then((res)=>browser.close()).catch((e)=>console.error(e));
    });
    //await everything

    transform();

    module.exports = transform;
