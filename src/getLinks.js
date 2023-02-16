const stackexchange = require ("stackexchange");

var options = { version: 2.2 };
var context = new stackexchange(options);

var filter = {
  key: 'pwDNoBGQPWPm*rgcdmFBkw((',
  pagesize: 50,
  sort: 'activity',
  order: 'asc'
};

// Get all the questions (http://api.stackexchange.com/docs/questions)
context.questions.questions(filter, function(err, results){
  if (err) throw err;

  console.log(results.items);
  console.log(results.has_more);
});

// Get results for a different website within the stackexchange network
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
