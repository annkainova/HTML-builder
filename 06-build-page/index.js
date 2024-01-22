const path = require('path');

const htmlBuilder = require('./htmlBuilder');
const createFolder = require('./createFolder');
const mergeStyle = require('./mergeStyles');
const copyFolders = require('./copyAssets');

let templatePath = path.join(__dirname, 'template.html');
const newPath = path.join(__dirname, 'project-dist');
let pathFolderCSS = path.join(__dirname, 'styles');

async function createHTML() {
  await createFolder(newPath);
  await htmlBuilder(templatePath);
}

createHTML();

mergeStyle(pathFolderCSS);

copyFolders();
