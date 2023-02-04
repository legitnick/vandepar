'use strict';

const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

const scroll = (async (page) =>{
    await page.evaluate(async ()=>{
        await new Promise((resolve)=>{
            let current_scrolled = 0;
            let dist = 1;//px
            var timer = setInterval(()=>{
                window.scrollBy(0,dist);
                current_scrolled+=dist;
                if(current_scrolled > document.body.scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }

            },20);
        });
    });
});
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
    const recorder = new PuppeteerScreenRecorder(page);

    await recorder.start("../bin/video/replace3.mp4");
    await page.goto("file:///home/pawlo/Documents/code/nodejs/vandepar/bin/16657603.html", {waitUntil: 'networkidle0'});

    await scroll(page);

    await recorder.stop();
    await browser.close();
});
//await everything
transform();

module.exports = transform;
