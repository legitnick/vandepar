import fs from  "fs";
import axios from "axios";//will this work

import * as mem from "./persistMemory.js";
const pagesize =  20;//will scrape 20 pages at once to optimize ammount of api calls
const answer_pagesize = 5;//so, max 5 answers per Q
const site = "stackoverflow"

export async function getQuestionJSON(){


  console.log("enter");
  let dateFro = await mem.getLatestDate();
  dateFro = dateFro==undefined?(1320969600):dateFro;
  const dateTo = dateFro + 1000*60*60*24*30;//a month, roughly
  mem.setLatestDate(dateTo);
  //https://api.stackexchange.com/2.3/questions?pagesize=1&order=desc&min=30&key=pwDNoBGQPWPm*rgcdmFBkw((&sort=votes&site=stackoverflow&filter=withbody&fromdate=1320969600&todate=1321660800
  const url = "https://api.stackexchange.com/2.3/questions?pagesize="+pagesize+"&order=desc&min=30&key=pwDNoBGQPWPm*rgcdmFBkw((&sort=votes&site="+site+"&filter=withbody&fromdate="+dateFro+"&todate="+dateTo;
  console.log(url);
  const resp = await axios.get(url);
  console.log(resp.data.items);


  return resp.data.items;
}

export async function getAnswersJSON(question_id){

  const url = "https://api.stackexchange.com/2.3/questions/"+question_id+"/answers?pagesize="+answer_pagesize+"&key=pwDNoBGQPWPm*rgcdmFBkw((&order=desc&min=10&sort=votes&site="+site+"&filter=withbody";
  const answer_resp  = await axios.get(url);


  //get every passing answer to a question and return it
  return answer_resp.data.items;
}

//to get unique answers I'll use date from date to in the api call


