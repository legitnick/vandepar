const stackexchange = require ("stackexchange");
const fs = require ("fs");
const fetch = require("axios");//will this work

var options = { version: 2.2 };
var context = new stackexchange(options);

var filter = {
    key: 'pwDNoBGQPWPm*rgcdmFBkw((',
    min: 20,
    pagesize: 50,
    sort: 'votes',
    order: 'asc',
    site:'gaming',
    filter:"withbody",
};

// Get all the questions (http://api.stackexchange.com/docs/questions)

//string[] f(void)
async function getLinks(){

    const url = "https://api.stackexchange.com/2.3/questions?pagesize=50&order=desc&min=20&sort=votes&site=gaming&filter=withbody";
    const resp = await fetch(url);
    //console.log(resp);


    return resp;
}

//string[] f(int)
async function getAnswersToQ(question_id){

    const url = "https://api.stackexchange.com/2.3/questions?pagesize=50&order=desc&min=20&sort=votes&site=gaming&filter=withbody";
    const answer_resp  = await fetch(url);
    //get every passing answer to a question and return it
}
module.exports = getLinks;
