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
async function getLinks(){

    const url = "https://api.stackexchange.com/2.3/questions?pagesize=50&order=desc&min=20&sort=votes&site=gaming&filter=withbody";
    const resp = await fetch(url);
    //console.log(resp);


    const data = {};
    data.arr = [];
    await resp.data.items.forEach(el=>
        data.arr.push(el.question_id+'\n'+el.body)
    )
    console.log(data.arr);

    fs.writeFile("bin/links.json",JSON.stringify(data),(err)=>console.error(err));

    setTimeout(getLinks,100000);//100,000ms == 100s
}
getLinks()
module.exports = getLinks;
