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

03 copy assets file

let folderPath = path.join(__dirname, 'assets');
let folderCopyPath = path.join(__dirname, 'project-dist/assets');

createFolder(folderCopyPath);
createFolder(folderCopyPath, '/fonts');
createFolder(folderCopyPath, '/img');
createFolder(folderCopyPath, '/svg');

function createFolder(pathFromCopy, addPath = '') {
  fs.mkdir(`${pathFromCopy}${addPath}`, { recursive: true }, (error) => {
    if (error) {
      console.log('Error create folder', error);
      return;
    }
  });
}

copyFolderContent(folderPath, folderCopyPath, '/fonts');
copyFolderContent(folderPath, folderCopyPath, '/img');
copyFolderContent(folderPath, folderCopyPath, '/svg');

function copyFolderContent(pathFromCopy, pathToCopy, addPath = '') {
  // foldres content
  fs.readdir(
    `${pathFromCopy}${addPath}`,
    { withFileTypes: true },
    (error, folderContents) => {
      if (error) {
        console.log('Error folder content', error);
        return;
      }
      console.log('folders file: ', folderContents);

      // where to copy
      fs.readdir(
        `${pathToCopy}${addPath}`,
        { withFileTypes: true },
        (error, folderCopyContents) => {
          if (error) {
            console.log('Error COPY folder content', error);
            return;
          }
          console.log('COPY-folders file: ', folderCopyContents);

          //delete file in copy-folder
          folderCopyContents.forEach((copyContent) => {
            if (
              !folderContents.some(
                (content) => content.name === copyContent.name,
              )
            ) {
              const fullCopyPath = path.join(
                `${pathToCopy}${addPath}`,
                copyContent.name,
              );
              fs.unlink(fullCopyPath, (err) => {
                if (err) {
                  console.log('Error delete file: ', err);
                }
                console.log('Delete file: ', copyContent.name);
              });
            }
          });
        },
      );

      //copy and update file
      folderContents.forEach((content) => {
        const sourceFile = path.join(`${pathFromCopy}${addPath}`, content.name);
        const copyFile = path.join(`${pathToCopy}${addPath}`, content.name);

        fs.copyFile(sourceFile, copyFile, (err) => {
          if (err) {
            console.error('Error in copy process:', err);
            return;
          }
          console.log('Copy sucsess!');
        });
      });
    },
  );
}
