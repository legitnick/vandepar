const stackexchange = require ("stackexchange");
const fs = require ("fs");

var options = { version: 2.2 };
var context = new stackexchange(options);

var filter = {
    key: 'pwDNoBGQPWPm*rgcdmFBkw((',
    min: 20,
    pagesize: 50,
    sort: 'votes',
    order: 'asc'
};

// Get all the questions (http://api.stackexchange.com/docs/questions)
async function getLinks(){

    context.questions.questions(filter, function(err, results){
        if (err) throw err;

        results.items =    results.items.map(el=>el.link);
        console.log(results.items);
        const data = {}
        data.arr = results.items;
        fs.writeFile("bin/links.json",JSON.stringify(data),(err)=>console.error(err));


    });
    setTimeout(getLinks,100000);//100,000ms == 100s
}
getLinks()
module.exports = getLinks;
