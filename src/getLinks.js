const fs = require ("fs");
const axios = require("axios");//will this work


//string[] f(void)
async function getLinks(){

    const url = "https://api.stackexchange.com/2.3/questions?pagesize=50&order=desc&min=20&sort=votes&site=gaming&filter=withbody";
    const resp = await axios.get(url);
    //console.log(resp);


    return resp.items;
}

//string[] f(int)
async function getAnswersToQ(question_id){

    const url = "https://api.stackexchange.com/2.3/questions?pagesize=50&order=desc&min=20&sort=votes&site=gaming&filter=withbody";
    const answer_resp  = await axios.get(url);
    //get every passing answer to a question and return it
}
module.exports = getLinks;
