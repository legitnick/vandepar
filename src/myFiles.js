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

//void f(string)
const ensureDir = ((path)=>{
    if(!fs.existsSync(path))fs.mkdirSync(path);
});

let html_from_dir = "./bin/scraped_html/";//it'll be dot for now
let video_dir = "./bin/video/";
let html_to_dir = "./bin/processed_html/";

//void (void)
function ensureAllDirs (){
    console.log("ensured");
    ensureDir("./bin/");
    ensureDir(video_dir);
    ensureDir(html_from_dir);
    ensureDir(html_to_dir);
}

//bool f(string)
function isHtmlUsed(html_string){
    return html_string.charAt(0)=='u';//using filenames, dk what else to do here, except from some real DB
}

exports.ensureAllDirs = ensureAllDirs;
exports.ensureDir = ensureDir;
exports.move = move;
exports.video_dir = video_dir;
exports.isHtmlUsed = isHtmlUsed;
exports.goto_dir = "file://" + process.cwd()+ "/bin/processed_html/";//this variable needs full path to work in puppeteers Chromium,also process.cwd more suitable than __dirname in this case
exports.html_from_dir = html_from_dir;//it'll be dot for now
//const html_from_dir = pth.join(__dirname,"/bin/scraped_html/");
//const html_to_dir = pth.join(__dirname,"/bin/processed_html/");
exports.html_to_dir = html_to_dir;

exports.getMostRecentFilename = getMostRecentFilename;


