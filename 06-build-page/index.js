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
