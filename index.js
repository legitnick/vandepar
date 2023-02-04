//setup modules
const Bottleneck = require('bottleneck');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const HttpProxyAgent = require("http-proxy-agent");
const HttpsProxyAgent = require("https-proxy-agent");

//setup src files
const html2mp4 = require("./src/");
const getRecentLinkNum = require("./src/getRecentFile.js");

const limiter = new Bottleneck({
    maxConcurrent:4,
    minTime:250,
});

//setup zenrows proxy
const proxy = "http://61d9d31d8af64a05690ad2ef1714e5a19db2c014:@proxy.zenrows.com:8001";
const httpAgent = new HttpProxyAgent(proxy);
const httpsAgent = new HttpsProxyAgent(proxy);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const I_MIN_LIKES = 10;


//string f(doc?)
const getTitle = ($)=>{
    return $('#question-header  a.question-hyperlink');
}

//string f(doc?)
const getQText = ($)=>{
    return $('#question > div.post-layout > div.postcell.post-layout--right > div.s-prose.js-post-body');
}


//void f(jQuery_doc,&my_doc)
const getAText = ($,doc)=>{

    $('div.answercell > div.js-post-body').each((_idx, el) => {
        const a_likes = $(el).closest('.post-layout').find('.js-vote-count').text();

        const likes_on_A = parseInt(a_likes);
        if( likes_on_A < I_MIN_LIKES){
            return true;
        }

        doc.html_text+='<p class="this-has-helped">This answer has helped '+likes_on_A + ' people.</p>';
        //is_answered to skip writing htmls w/o answers
        doc.is_answered = true;


        doc.html_text+=$(el);
    });
}

// string f(int)
const getSOText = async (i_link) => {
    let doc = {
        html_text:"",
        is_answered:false
    };
    try {
        const { data } = await axios.get(
            'https://stackoverflow.com/questions/' + i_link  + '/how-to-use-continue-in-jquery-each-loop'
            ,httpAgent,httpsAgent).catch((error)=>{
                console.log(error)
                return null;
            });
        if (data === null) return;
        const $ = cheerio.load(data);


        const title = getTitle($);
        const qText = getQText($);
        console.log(qText);
        doc.html_text = title + qText;

        getAText($,doc);

        if(doc.is_answered)
            return doc.html_text;
        return null;
    } catch (error) {
        console.error(error, error.stack);
        return null;
    }
};

const wrapped = limiter.wrap(getSOText);

function mainLoop(){
    //{ file: '16992452.html', mtime: 2023-02-03T13:18:30.372Z }

    const curr_num = getRecentLinkNum('./bin/scraped_html');
    console.log(curr_num);
    // const promise_arr =  [];
    // push a promise to an array
    // promise_arr.push(wrapped(i));
    for( let i = curr_num - 1; i*1.01 > curr_num; i--)
        //this 1.01 is still shady
        //the number of crawls is too big rn
        wrapped(i)
            .then((postTitles) => {
                if(postTitles){
                    console.log(postTitles)

                    fs.writeFile("./bin/scraped_html"+i+".html",postTitles,(error)=>{
                        if(error)
                            return console.log(error);
                        console.log("file saved");
                    });
                }
            });
    //after all the crawling to change ip adress
    //const ip_promise = Promise.all(promise_arr);
    //ip_promise.then(changeMyIP());
    //void changeMyIP(void);
    //const changeMyIP = require('./src/windscribe_proxy.js');
    //there are probably some nodejs tools for proxying
    //also, maybe shouldn't even use async for a crawler at all, as later
    //on video-editing will be used, as well as puppeteer running
}
mainLoop();
