const fs = require ("fs");
const axios = require("axios");//will this work


//json f(void)
async function getQuestionJSON(){

    const url = "https://api.stackexchange.com/2.3/questions?pagesize=50&order=desc&min=20&sort=votes&site=gaming&filter=withbody";
    const resp = await axios.get(url);


    return resp.data.items;
}

//string[] f(int)
async function getAnswersJSON(question_id){

    const url = "https://api.stackexchange.com/2.3/questions/"+question_id+"/"+"answers?pagesize=50&order=desc&min=5&sort=votes&site=stackoverflow&filter=withbody";
    const answer_resp  = await axios.get(url);


    //get every passing answer to a question and return it
    return answer_resp.data.items;
}
exports.getQuestionJSON = getQuestionJSON;
exports.getAnswersJSON = getAnswersJSON;
