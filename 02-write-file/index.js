const fs = require('fs');
const readline = require('readline');
const path = require('path');

let filePath = path.join(__dirname, 'text.txt');
const newFile = fs.createWriteStream(filePath);

let writeProcess = readline.createInterface(process.stdin, process.stdout);

function exitProgram() {
  console.log('Goodbye!');
  writeProcess.close();
}

writeProcess.setPrompt('Write some text: \n');
writeProcess.prompt();

writeProcess.on('line', (text) => {
  if (text.toLowerCase() === 'exit') {
    writeProcess.close();
  } else {
    newFile.write(`${text}\n`);
  }
});

writeProcess.on('close', exitProgram);
process.on('SIGINT', exitProgram);
