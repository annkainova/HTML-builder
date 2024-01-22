const { error } = require('console');
const fs = require('fs');
const path = require('path');

let templatePath = path.join(__dirname, 'template.html');
const newPath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');

async function createFolder(pathFromCopy, addPath = '') {
  const fullPath = path.join(pathFromCopy, addPath);
  try {
    await fs.promises.mkdir(fullPath, { recursive: true });
  } catch (error) {
    console.log('Error create folder', error);
  }
}

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

async function createHTML() {
  await createFolder(newPath);
  await htmlBuilder(templatePath);
}

createHTML();

// 02 merge style

let pathFolderCSS = path.join(__dirname, 'styles');
let projectPathCSS = path.join(__dirname, 'project-dist/style.css');
const styleFile = fs.createWriteStream(projectPathCSS);

//content folder Styles
async function detectContentFile(pathMergeFrom) {
  try {
    const folderContents = await fs.promises.readdir(pathMergeFrom, {
      withFileTypes: true,
    });
    let cssFiles = folderContents
      .filter(
        (content) => content.isFile() && path.extname(content.name) === '.css',
      )
      .map((content) => path.join(pathMergeFrom, content.name));

    await readAndCombineCss(cssFiles);
  } catch (error) {
    console.log('Error folder content:', error);
  }
}

//read and merge
async function readAndCombineCss(files) {
  try {
    for (const file of files) {
      let readFile = await fs.createReadStream(file, 'utf-8');
      readFile.on('data', (chunk) => styleFile.write(chunk));
      readFile.on('end', () => {
        styleFile.end();
      });
    }
  } catch (error) {
    console.log(`Error with reading ${file}:`, error);
  }
}
styleFile.end();

styleFile.on('finish', () => {
  console.log('Merge sucsess!');
});
styleFile.on('error', (error) => {
  console.error(`Error in merge:' ${error.message}`);
});

detectContentFile(pathFolderCSS);

// 03 copy assets file

let folderPath = path.join(__dirname, 'assets');
let folderCopyPath = path.join(__dirname, 'project-dist/assets');

async function setupFolders() {
  await createFolder(folderCopyPath);
  await createFolder(folderCopyPath, '/fonts');
  await createFolder(folderCopyPath, '/img');
  await createFolder(folderCopyPath, '/svg');
}

setupFolders();

async function copyFolderContent(pathFromCopy, pathToCopy, addPath = '') {
  // foldres content
  fs.readdir(
    `${pathFromCopy}${addPath}`,
    { withFileTypes: true },
    (error, folderContents) => {
      if (error) {
        console.log('Error folder content', error);
        return;
      }

      // where to copy
      fs.readdir(
        `${pathToCopy}${addPath}`,
        { withFileTypes: true },
        (error, folderCopyContents) => {
          if (error) {
            console.log('Error COPY folder content', error);
            return;
          }

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
        });
      });
      console.log('Copy sucsess!');
    },
  );
}

async function copyFolders() {
  await setupFolders();

  await copyFolderContent(folderPath, folderCopyPath, '/fonts');
  await copyFolderContent(folderPath, folderCopyPath, '/img');
  await copyFolderContent(folderPath, folderCopyPath, '/svg');
}

copyFolders();
