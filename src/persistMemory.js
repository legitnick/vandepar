const storage = require("node-persist");

async function getLatestDate(){
    await storage.init({
        dir:"bin/node-persist",
    });
    let res = storage.getItem("latest");
    if (res === undefined)res =(Date.now() -  1000*60*60*24*30*12*14);//14 years ago
    return res;
}
//3.154e+10 ms in a year
//2009(StackOverflow creation) - 1970(start of time for js) = 39
//39*3.154 = 1.23e+12 - first date from

async function setLatestDate(date){
    await storage.init({
        dir:"bin/node-persist",
    });
    storage.setItem("latest",date);
}
exports.getLatestDate = getLatestDate;
exports.setLatestDate = setLatestDate;
