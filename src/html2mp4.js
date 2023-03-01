'use strict';

import fs from "fs";
import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import process from 'process';
import * as mf from "./myFiles.js";


const configForDynamic = {
    fps: 60,
    videoCrf: 30,
    videoFrame: {
        width: 1920,
        height: 1080,
    },
    videoCodec: 'libx264',
    videoPreset: 'ultrafast',
    videoBitrate: 2000,
    autopad: {
        color: 'black' | '#35A5FF',
    },
    aspectRatio: '16:9',
};

async function look(page){
    await new Promise(resolve=>setTimeout(resolve,2000));

    return await scroll(page);//(functionRef, ms, param1)

};

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
                    setTimeout(resolve,1000);
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
});
//await everything


const transformAll =(async ()=>{
    const html_arr = mf.html_filenames();

    const html_num_arr = await html_arr.map(el=>parseInt(el));

    const promise_arr = [];
    console.log(html_num_arr);
    await html_num_arr.forEach((el,i)=>{
       if(i<1){
            console.log(el);
            promise_arr.push(transform(el));
        }
    });

    await Promise.all(promise_arr);

});

export default  transformAll;
