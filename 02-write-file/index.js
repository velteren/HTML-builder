const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'output.txt'));
stdout.write('\nHi! Enter the text you want to add to the file:\n\n');

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

rl.on('line', (data) => {
  if (data === 'exit') {
    rl.close();
  } else {
    output.write(data);
    output.write('\n');
  }
});

process.on('exit', () => stdout.write('\nBye bye!:)\n\n'));
