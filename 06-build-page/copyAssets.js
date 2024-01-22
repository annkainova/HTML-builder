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

module.exports = copyFolders;
