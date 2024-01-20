const fs = require('fs');
const path = require('path');
const { compile } = require('pug');

let pathFolderCSS = path.join(__dirname, 'styles');
console.log(pathFolderCSS);
// const fullPath = path.join(pathFolderCSS, 'lala.css');
// console.log(fullPath);

let projectPath = path.join(__dirname, 'project-dist/bundle.css');
const bundelFile = fs.createWriteStream(projectPath);

//content folder Styles
fs.readdir(pathFolderCSS, { withFileTypes: true }, (error, folderContents) => {
  if (error) {
    console.log('Error folder content', error);
    return;
  }

  // detect file
  let cssFiles = folderContents
    .filter(
      (content) => content.isFile() && path.extname(content.name) === '.css',
    )
    .map((content) => path.join(pathFolderCSS, content.name));

  readAndCombineCss(cssFiles);
});

//read and merge
function readAndCombineCss(files) {
  files.forEach((file) => {
    let readFile = fs.createReadStream(file, 'utf-8');
    readFile.on('data', (chunk) => {
      bundelFile.write(chunk);
    });
    readFile.on('end', () => {
      bundelFile.end();
    });
  });
}

bundelFile.on('finish', () => {
  console.log('Merge sucsess!');
});

bundelFile.on('error', (error) => {
  console.error(`Error in merge:' ${error.message}`);
});
