const fs = require ("fs");
const axios = require("axios");//will this work

const pagesize = 1;//need one Q for a video
const answer_pagesize = 5;//so, 5 answers per Q
const site = "stackoverflow"

//json f(void)
async function getQuestionJSON(){

    const url = "https://api.stackexchange.com/2.3/questions?pagesize="+answer_pagesize+"&order=desc&min=20&key=pwDNoBGQPWPm*rgcdmFBkw((&sort=votes&site="+site+"&filter=withbody";
    const resp = await axios.get(url);


    return resp.data.items;
}

//string[] f(int)
async function getAnswersJSON(question_id){

    const url = "https://api.stackexchange.com/2.3/questions/"+question_id+"/"+"answers?pagesize="+pagesize+"&key=pwDNoBGQPWPm*rgcdmFBkw((&order=desc&min=5&sort=votes&site="+site+"&filter=withbody";
    const answer_resp  = await axios.get(url);


    //get every passing answer to a question and return it
    return answer_resp.data.items;
}
exports.getQuestionJSON = getQuestionJSON;
exports.getAnswersJSON = getAnswersJSON;
