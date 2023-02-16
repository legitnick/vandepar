//setup modules
const Bottleneck = require('bottleneck');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const HttpProxyAgent = require("http-proxy-agent");
const HttpsProxyAgent = require("https-proxy-agent");

//setup src files
const html2mp4 = require("./html2mp4.js");
const mf = require("./myFiles.js");

const limiter = new Bottleneck({
    maxConcurrent:4,
    minTime:250,
});
const proxy = "http://61d9d31d8af64a05690ad2ef1714e5a19db2c014:@proxy.zenrows.com:8001"
//setup zenrows proxy
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

// string f(string)
const getSOText = async (link) => {
    let doc = {
        html_text:"",
        is_answered:false
    };
    try {
        const { data } = await axios.get(link
            ,httpAgent,httpsAgent).catch((error)=>{
                console.log(error)
                return null;
            });
        if (data === null) return;
        if(data.status === 404){
            console.log("404");
            return;
        }
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

//void f(void)
async function scrape(){
    let link_obj = fs.readFileSync('./bin/links.json');
    let link_arr= JSON.parse(link_obj).arr;
    await link_arr.forEach((el=>{

        wrapped(el)
            .then((postTitles) => {
                if(postTitles){
                    console.log(postTitles)
                    const regex = /\/d+\//
                    const num = el.match(regex);
                    fs.writeFile(mf.html_from_dir + num + ".html",postTitles,(error)=>{
                        console.log("file "+parseInt(el)+" saved");
                        if(error)
                            return console.log(error);
                    });
                }
            });

    }));
    //getLinks();
    //setTimeout(scrape,1000);
}

module.exports = scrape;
