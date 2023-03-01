import axios from 'axios';
import fs from 'fs';

import html2mp4 from "./html2mp4.js";
import * as mf from "./myFiles.js";
import * as exchange_api from "./getLinks.js";



const getTitle = (question_json)=>{
  return "<p class='question-hyperlink'>"+question_json.title+"</p>";
}

const getQText = (question_json)=>{
  return '<div class="s-prose js-post-body">'+question_json.body+'</div>';
}

const getAText = (answer_json)=>{
  return '<div class="s-prose js-post-body">'+answer_json.body+'</div>';
}
//this is absolutely same, but I think it's ok to have it in regards to readability

const getATexts = (async (question_json)=>{
  const answers_arr = await exchange_api.getAnswersJSON(question_json.question_id);
  let res_string = "";
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

const getSOText = async (question_json) => {
  if(!question_json.is_answered)
    return null;
  let doc = "";
  const title = getTitle(question_json);
  const qText = getQText(question_json);

  doc = title + qText;

  const answers =await getATexts(question_json);

  doc+=answers;
  doc = mf.toCompleteHTML(doc);
  console.log(doc);
  return doc;
};



export default async function scrape(){
  const link_arr = await exchange_api.getQuestionJSON().catch(console.error);
  await link_arr.forEach((el=>{
    getSOText(el)
      .then((postTitles) => {
        if(postTitles){

          const i = el.question_id;
          console.log(postTitles);
          fs.writeFile(mf.html_from_dir + i + ".html",postTitles,(error)=>{
            if(error)
              console.log(error);
          });
        }
      });

  }));
}

