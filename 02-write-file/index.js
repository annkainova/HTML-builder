const fs = require('fs');
const readline = require('readline');
const path = require('path');

let filePath = path.join(__dirname, 'text.txt');
const newFile = fs.createWriteStream(filePath);

let rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('Write some text: \n');
rl.prompt();
rl.on('line', (text) => {
  if (text.toLowerCase() === 'exit') {
    console.log('Goodbye!');
    rl.close();
  } else {
    newFile.write(`${text}\n`);
  }
});
