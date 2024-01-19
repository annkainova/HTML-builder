const fs = require('fs');
const path = require('path');

let filePath = path.join(__dirname, 'secret-folder');

fs.readdir(filePath, { withFileTypes: true }, (error, dirContents) => {
  if (error) {
    console.log('Error', error);
    return;
  }
  //all contents

  // files detect
  const filesContent = dirContents.filter((content) => content.isFile());

  filesContent.forEach((file) => {
    // files extension
    const fileExt = path.extname(file.name).slice(1);
    const fullPath = path.join(filePath, file.name);

    //file size
    fs.stat(fullPath, (err, stats) => {
      if (err) {
        console.log(err);
        return;
      } else {
        const fileSize = stats.size / 1000;
        console.log(`${file.name} - ${fileExt} - ${fileSize}kb`);
      }
    });
  });
});
