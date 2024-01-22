const fs = require('fs');
const path = require('path');

let templatePath = path.join(__dirname, 'template.html');
const newPath = path.join(__dirname, 'project-dist');
let pathFolderCSS = path.join(__dirname, 'styles');

async function createFolder(pathFromCopy, addPath = '') {
  const fullPath = path.join(pathFromCopy, addPath);
  try {
    await fs.promises.mkdir(fullPath, { recursive: true });
  } catch (error) {
    console.log('Error create folder', error);
  }
}

// 01 html builder
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

async function createHTML() {
  await createFolder(newPath);
  await htmlBuilder(templatePath);
}

createHTML();

//02 merge style

// let pathFolderCSS = path.join(__dirname, 'styles');
let projectPathCSS = path.join(__dirname, 'project-dist/style.css');

//content folder Styles
async function mergeStyle(pathMergeFrom) {
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
const styleFile = fs.createWriteStream(projectPathCSS);

async function readAndCombineCss(files) {
  for (const file of files) {
    try {
      const cssFile = await fs.promises.readFile(file, 'utf-8');
      await new Promise((resolve, reject) => {
        styleFile.write(cssFile, 'utf-8', (error) =>
          error ? reject(error) : resolve(),
        );
      });
    } catch (error) {
      console.log(`Error with reading ${file}:`, error);
    }
  }
  styleFile.end();

  styleFile.on('finish', () => {
    console.log('Merge success!');
  });

  styleFile.on('error', (error) => {
    console.error(`Error in merge: ${error.message}`);
  });
}

mergeStyle(pathFolderCSS);

//03 copy folder

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
  try {
    // foldres contentе
    const folderContents = await fs.promises.readdir(
      `${pathFromCopy}${addPath}`,
      {
        withFileTypes: true,
      },
    );

    // where to copy
    const folderCopyContents = await fs.promises.readdir(
      `${pathToCopy}${addPath}`,
      {
        withFileTypes: true,
      },
    );

    //delete file in copy-folder
    for (let copyContent of folderCopyContents) {
      if (
        !folderContents.some((content) => content.name === copyContent.name)
      ) {
        const fullCopyPath = path.join(
          `${pathToCopy}${addPath}`,
          copyContent.name,
        );
        await fs.promises.unlink(fullCopyPath);
        console.log('Delete file: ', copyContent.name);
      }
    }
    //copy and update file
    for (let content of folderContents) {
      const sourceFile = path.join(`${pathFromCopy}${addPath}`, content.name);
      const copyFile = path.join(`${pathToCopy}${addPath}`, content.name);

      await fs.promises.copyFile(sourceFile, copyFile);
      console.log('Copied file:', content.name);
    }
  } catch (error) {
    console.error('Error in copy process:', error);
  }
}

async function copyFolders() {
  await setupFolders();

  await copyFolderContent(folderPath, folderCopyPath, '/fonts');
  await copyFolderContent(folderPath, folderCopyPath, '/img');
  await copyFolderContent(folderPath, folderCopyPath, '/svg');
}

copyFolders();
