const fs = require('fs');
const path = require('path');

const newPath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');

async function detectNameFile(pathFolder) {
  try {
    const folderContents = await fs.promises.readdir(pathFolder, {
      withFileTypes: true,
    });
    return folderContents
      .filter(
        (content) => content.isFile() && path.extname(content.name) === '.html',
      )
      .map((content) => content.name.slice(0, -5));
  } catch (error) {
    console.log('Error folder content', error);
    return [];
  }
}

async function replaceContentInTemplate(tagName, textHTML) {
  const tagPath = path.join(__dirname, `components/${tagName}.html`);
  try {
    const textTag = await fs.promises.readFile(tagPath, 'utf-8');

    let regex = new RegExp(`{{${tagName}}}`, 'g');
    return textHTML.replace(regex, textTag);
  } catch (error) {
    console.log(`Error reading file: ${tagName}`, error);
    return textHTML;
  }
}

//read template
async function htmlBuilder(pathFromCopy) {
  try {
    let textHTML = await fs.promises.readFile(pathFromCopy, 'utf-8');
    const fileNames = await detectNameFile(componentsPath);
    for (const fileName of fileNames) {
      textHTML = await replaceContentInTemplate(fileName, textHTML);
    }

    const newHTMLPath = path.join(newPath, 'index.html');
    await fs.promises.writeFile(newHTMLPath, textHTML);
  } catch (error) {
    console.log('Error building HTML: ', error);
  }
}

module.exports = htmlBuilder;
