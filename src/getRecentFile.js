const fs = require("fs");
const path = require("path");



const getMostRecentFile = (dir) => {
    const files = orderReccentFiles(dir);
    return files.length ? files[0] : undefined;
};

const orderReccentFiles = (dir) => {
    return fs.readdirSync(dir)
        .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
        .sort((a, b) => parseInt(a) - parseInt(b));
};

const getMostRecentFilename = (dir) => {
    return parseInt(getMostRecentFile(dir));
}

module.exports = getMostRecentFilename;


