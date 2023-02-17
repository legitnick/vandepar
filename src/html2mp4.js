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
    videoBitrate: 4000,
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
            let overall_scrolled = 0;
            let dist = 1;//scroll, px

            // body > :nth-child(n) taken from the css rule
            let timer = setInterval(()=>{
                window.scrollBy(0,dist);
                overall_scrolled+=dist;
                if(overall_scrolled > document.body.scrollHeight - window.innerHeight){
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
    if(!html_number){
        console.log("html_num undefined");
        return false;
    }
    const browser = await puppeteer.launch().catch((e)=>console.error(e));
    const page = await browser.newPage().catch((e)=>console.error(e));
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        isLandscape: true,
    });




    await page.goto(mf.goto_dir + html_number+ ".html", {waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']}).catch((e)=>console.error(e));
    const recorder = new PuppeteerScreenRecorder(page,configForDynamic);
    await recorder.start(mf.video_dir + html_number +".mp4").catch((err)=>reject(err));//replace replace with html_number
    await look(page);
    await recorder.stop();
    browser.close();
    console.log("recorded");
    return 1;
    /*return await look(page).then((res,rej)=>{
            return recorder.stop();
        }).then((res)=>browser.close()).catch((e)=>console.error(e));*/
});
//await everything

//void f(string);
const renameToUsed = ((html_string) => {
    fs.renameSync(mf.html_to_dir+html_string,mf.html_to_dir+"u_"+html_string);
    //un-sync version made some errors, it probably should be done syncronously anyways?
});

//filter html_arr with a function isHTMLUsed
//bool f(string)
const isHtmlUnused = (html_string)=>{
    return html_string.charAt(0)!=='u';//using filenames, dk what else to do here, except from some real DB
}

//void f(void)
const transformAll =(async ()=>{
    const html_arr = mf.html_filenames;
    const html_num_arr = await html_arr.map(el=>parseInt(el));

    const promise_arr = [];
    console.log(html_num_arr);
    await html_num_arr.forEach((el,i)=>{
       if(i<1){
            // 4 is an arbitrary number, should get sys recource info, and cli options
            console.log(el);
            promise_arr.push(transform(el));
        }
    });//think it'll await only to push all the promises into array (and start transforming, so no false positives on promise all)

    await Promise.all(promise_arr);
    });//remake as html_arr.slice(0,4).forEeach
    //as it is more clear, and I only use el in the function anyways
    setTimeout(transformAll,1000);

});

module.exports = transformAll;
