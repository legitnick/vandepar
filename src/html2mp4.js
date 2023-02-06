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
    videoCrf: 20,
    videoCodec: 'libx264',
    videoPreset: 'ultrafast',
    videoBitrate: 12000,
    autopad: {
        color: 'black' | '#35A5FF',
    },
    aspectRatio: '16:9',
};

//void f(Page)
const look = (async (page)=>{
    await setTimeout(scroll, 100 ,page);//(functionRef, ms, param1)
}); 

//void f(Page)
const scroll = (async (page) =>{
    await page.evaluate(async ()=>{
        await new Promise((resolve)=>{
            let current_scrolled = 0;
            let dist = 1;//scroll, px
            var timer = setInterval(()=>{
                window.scrollBy(0,dist);
                current_scrolled+=dist;
                if(current_scrolled > document.body.scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }

            },20);//wait, ms
        });
    });
});

//void f(void) TODO: replace param void -> html_number(int)
const transform = (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        isLandscape: true,
        hasTouch: true
    });

    const recorder = new PuppeteerScreenRecorder(page,configForDynamic);

    await recorder.start(video_dir + "replace.mp4").catch((err)=>reject(err));//replace replace with html_number
    await page.goto("file:///home/pauro/Documents/code/wrk/vandepar/vandepar/bin/scraped_html/16657603.html"
        /*goto_dir + "16657603.html"*/, {waitUntil: 'networkidle0'});

    await look(page);

    await recorder.stop();
    await browser.close();
});
//await everything
transform();

module.exports = transform;
