
'use strict';

const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

const transform = (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const recorder = new PuppeteerScreenRecorder(page);

    await recorder.start("../bin/video/replace.mp4");
    await page.goto('https://news.google.com/news/');
    await page.goto("file:///home/pawlo/Documents/code/nodejs/vandepar/bin/16657603.html");

    await recorder.stop();
    await browser.close();
});
transform();

module.exports = transform;
