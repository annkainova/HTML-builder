const fs = require('fs');
const path = require('path');

async function createFolder(pathFromCopy, addPath = '') {
  const fullPath = path.join(pathFromCopy, addPath);
  try {
    await fs.promises.mkdir(fullPath, { recursive: true });
  } catch (error) {
    console.log('Error create folder', error);
  }
}

module.exports = createFolder;
