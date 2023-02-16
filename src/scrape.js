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
const getLinksArr = require("./getLinks.js");

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


//string f(int)
const getTitle = (question_json)=>{
    return "<p class='question-hyperlink'>"+question_json.title+"</p>";
}

//string f(int)
const getQText = (question_json)=>{
    return '<div class="s-prose js-post-body">'+question_json.body+'</div';
}

//string f(int)
const getAText = (answer_json)=>{
    return '<div class="s-prose js-post-body">'+answer_json.body+'</div';
}
//this is absolutely same, but I think it's ok to have it in regards to readability

//void f(jQuery_doc,&my_doc)
const getATexts = (question_json)=>{

    //get answers for a question,
    // likes = answer_json.score
    // body = '<p class="this-has-helped">This answer has helped '+likes + ' people.</p>'

    /*
     * $('div.answercell > div.js-post-body').each((_idx, el) => {
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
    */
}

// string f(string)
const getSOText = async (question_json) => {
    if(!question_json.is_answered)
        return null;
    let doc = "";
    const title = getTitle(question_json);
    const qText = getQText(question_json);

    doc = title + qText;

    doc+=getATexts(question_json);

    doc = ToCompleteHTML(doc);
    return doc;
};

const wrapped = limiter.wrap(getSOText);

//void f(void)
async function scrape(){
    const link_arr = getLinksArr();
    await link_arr.forEach((el=>{
        console.log(el.body);
        wrapped(el)
            .then((postTitles) => {
                if(postTitles){
                    console.log(postTitles)

                    const i = el.question_id;
                    fs.writeFile(mf.html_from_dir + i + ".html",postTitles,(error)=>{
                        if(error)
                            return console.log(error);
                    });
                }
            });

    }));
    //getLinks();
    setTimeout(scrape,1000);
}

module.exports = scrape;
