const fs = require('fs');
const path = require('path');

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

module.exports = mergeStyle;
