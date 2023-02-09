const fs = require("fs");
const path = require("path");


//string f(int)
const getMostRecentFile = (dir) => {
    const files = orderReccentFiles(dir);
    return files.length ? files[0] : undefined;
};

//void f(string)
const orderReccentFiles = (dir) => {
    return fs.readdirSync(dir)
        .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
        .sort((a, b) => parseInt(a) - parseInt(b));
};

//int f(string)
const getMostRecentFilename = (dir) => {
    return parseInt(getMostRecentFile(dir));
}

//void f(string,string)
async function move(path_pre,path_post){
    fs.rename(path_pre,path_post,(err)=>{
        if(err){
            console.log(err);
            throw err;
        }
    });
}

exports.move = move;
const curr_dir = process.cwd();
exports.curr_dir = curr_dir;
exports.goto_dir = "file://" + curr_dir + "/bin/scraped_html/";//this variable needs full path to work in puppeteers Chromium
exports.video_dir = "./bin/video/";
exports.html_from_dir = "./bin/scraped_html/";//it'll be dot for now
//const html_from_dir = pth.join(__dirname,"/bin/scraped_html/");
//const html_to_dir = pth.join(__dirname,"/bin/processed_html/");
exports.html_to_dir = "./bin/processed_html/";

exports.getMostRecentFilename = getMostRecentFilename;


