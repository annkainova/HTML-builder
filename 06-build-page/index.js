const fs = require('fs');
const path = require('path');

let templatePath = path.join(__dirname, 'template.html');
let textTemplate = '';

let readTemplateFile = fs.createReadStream(templatePath, 'utf-8');

//read template
readTemplateFile.on('data', (chunk) => {
  textTemplate += chunk;
});
readTemplateFile.on('end', () => {
  replaceContentInTemplate('header');
  replaceContentInTemplate('articles');
  replaceContentInTemplate('footer');

  //create folder
});

//replace
function replaceContentInTemplate(tagName) {
  const tagPath = path.join(__dirname, `components/${tagName}.html`);
  let textTag = '';

  let readTagNameFile = fs.createReadStream(tagPath, 'utf-8');
  //read tag name
  readTagNameFile.on('data', (chunk) => {
    textTag += chunk;
  });
  readTagNameFile.on('end', () => {
    let regex = new RegExp(`{{${tagName}}}`, 'g');
    textTemplate = textTemplate.replace(regex, textTag);

    console.log('Это финальный файл: ', textTemplate);

    const newPath = path.join(__dirname, 'project-dist');

    fs.mkdir(newPath, { recursive: true }, (error) => {
      if (error) {
        console.log('Error create folder', error);
        return;
      }
    });

    const newHTMLPath = path.join(newPath, 'index.html');

    const newHTML = fs.createWriteStream(newHTMLPath);
    newHTML.write(textTemplate);
  });
}

//02 merge style

let pathFolderCSS = path.join(__dirname, 'styles');

let projectPath = path.join(__dirname, 'project-dist/style.css');
const styleFile = fs.createWriteStream(projectPath);

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
      styleFile.write(chunk);
    });
    readFile.on('end', () => {
      styleFile.end();
    });
  });
}

styleFile.on('finish', () => {
  console.log('Merge sucsess!');
});

styleFile.on('error', (error) => {
  console.error(`Error in merge:' ${error.message}`);
});


