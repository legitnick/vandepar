//setup modules
const Bottleneck = require('bottleneck');
const axios = require('axios');
const fs = require('fs');

//setup src files
const html2mp4 = require("./html2mp4.js");
const mf = require("./myFiles.js");
const exchange_api = require("./getLinks.js");

const limiter = new Bottleneck({
    maxConcurrent:4,
    minTime:250,
});


//string f(obj)
const getTitle = (question_json)=>{
    return "<p class='question-hyperlink'>"+question_json.title+"</p>";
}

//string f(obj)
const getQText = (question_json)=>{
    return '<div class="s-prose js-post-body">'+question_json.body+'</div>';
}

//string f(obj)
const getAText = (answer_json)=>{
    return '<div class="s-prose js-post-body">'+answer_json.body+'</div>';
}
//this is absolutely same, but I think it's ok to have it in regards to readability

//string f(obj)
const getATexts = (async (question_json)=>{
    const answers_arr = await exchange_api.getAnswersJSON(question_json.question_id);
    let res_string = "";
    console.log("id "+question_json.question_id);
    answers_arr.forEach((el)=>{
        const likes = el.score;
        let doc = "";
        doc+='<p class="this-has-helped">This answer has helped ' + likes + ' people.</p>';
        doc+=getAText(el);
        res_string+=doc;
    });
    //might wanna do this with a callback
    return res_string;
})

// string f(string)
const getSOText = async (question_json) => {
    if(!question_json.is_answered)
        return null;
    let doc = "";
    const title = getTitle(question_json);
    const qText = getQText(question_json);

    doc = title + qText;

    const answers =await getATexts(question_json);

    console.log(answers);
    doc+=answers;
    doc = mf.toCompleteHTML(doc);
    return doc;
};

const wrapped = limiter.wrap(getSOText);

//void f(void)
async function scrape(){
    const link_arr = await exchange_api.getQuestionJSON();
    await link_arr.forEach((el=>{
        wrapped(el)
            .then((postTitles) => {
                if(postTitles){

                    const i = el.question_id;
                    fs.writeFile(mf.html_from_dir + i + ".html",postTitles,(error)=>{
                        if(error)
                            console.log(error);
                    });
                }
            });

    }));
    //getLinks();
    setTimeout(scrape,1000);
}

module.exports = scrape;
