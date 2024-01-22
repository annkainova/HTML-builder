const fs = require('fs');
const path = require('path');

let folderPath = path.join(__dirname, 'assets');
let folderCopyPath = path.join(__dirname, 'project-dist/assets');

const createFolder = require('./createFolder');

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
    const folderContents = await fs.readdir(`${pathFromCopy}${addPath}`, {
      withFileTypes: true,
    });

    // where to copy
    const folderCopyContents = fs.readdir(`${pathToCopy}${addPath}`, {
      withFileTypes: true,
    });

    //delete file in copy-folder
    for (let copyContent of folderCopyContents) {
      if (
        !folderContents.some((content) => content.name === copyContent.name)
      ) {
        const fullCopyPath = path.join(
          `${pathToCopy}${addPath}`,
          copyContent.name,
        );
        await fs.unlink(fullCopyPath);
        console.log('Delete file: ', copyContent.name);
      }
    }
    //copy and update file
    for (let content of folderContents) {
      const sourceFile = path.join(`${pathFromCopy}${addPath}`, content.name);
      const copyFile = path.join(`${pathToCopy}${addPath}`, content.name);

      await fs.copyFile(sourceFile, copyFile);
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

module.exports = copyFolders;
