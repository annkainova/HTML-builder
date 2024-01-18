const fs = require('fs');
const path = require('path');

let pathFile = path.join(__dirname, 'text.txt');
let stream = fs.createReadStream(pathFile, 'utf-8');
stream.pipe(process.stdout);
