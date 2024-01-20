const fs = require('fs');
const path = require('path');

let folderPath = path.join(__dirname, 'files');
let folderCopyPath = path.join(__dirname, 'files-copy');

//create folder
createFolder(folderCopyPath);

function createFolder(pathCopy, addPath = '') {
  fs.mkdir(`${pathCopy}${addPath}`, { recursive: true }, (error) => {
    if (error) {
      console.log('Error create folder', error);
      return;
    }
  });
}

// foldres content

fs.readdir(folderPath, { withFileTypes: true }, (error, folderContents) => {
  if (error) {
    console.log('Error folder content', error);
    return;
  }
  console.log('folders file: ', folderContents);

  // copy-foldres content
  fs.readdir(
    folderCopyPath,
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
          !folderContents.some((content) => content.name === copyContent.name)
        ) {
          const fullCopyPath = path.join(folderCopyPath, copyContent.name);
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
    const sourceFile = path.join(folderPath, content.name);
    const copyFile = path.join(folderCopyPath, content.name);

    fs.copyFile(sourceFile, copyFile, (err) => {
      if (err) {
        console.error('Error in copy process:', err);
        return;
      }
      console.log('Copy sucsess!');
    });
  });
});
