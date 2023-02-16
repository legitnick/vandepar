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
        fs.writeFile("links.json",JSON.stringify(data),(err)=>console.error(err));


    });
}
getLinks()
/*
 * // Get results for a different website within the stackexchange network
filter.site = 'softwareengineering';
context.questions.questions(filter, function(err, results){
  if (err) throw err;

  console.log(results.items);
  console.log(results.has_more);
});

// Get all users
context.users.users(filter, function(err, results){
  if (err) throw err;

  console.log(results.items);
  console.log(results.has_more);
});
*/
