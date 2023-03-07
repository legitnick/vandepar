import storage from "node-persist";

export async function getLatestDate(){
  await storage.init({
    dir:"bin/node-persist",
  });
  let res = await storage.getItem("latest");
  if (res == undefined  )res = 1230969600; //await(Date.now() -  60*60*24*30*12*14);//14 years ago
  console.log(res);
  return res;
}
//3.154e+10 ms in a year
//2009(StackOverflow creation) - 1970(start of time for js) = 39
//39*3.154 = 1.23e+12 - first date from

export async function setLatestDate(date){
  await storage.init({
    dir:"bin/node-persist",
  });
  storage.setItem("latest",date);
}
