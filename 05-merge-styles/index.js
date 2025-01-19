const fs = require('fs');
const { readdir } = fs.promises;
const path = require('path');

console.log('╔═══════════════════════════════════════════════════════╗');
const writeableStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);
readdir(path.join(__dirname, 'styles'), { withFileTypes: true }).then(
  (result) =>
    result.forEach((item) => {
      if (item.isFile() && path.extname(item.name) === '.css') {
        const readableStream = fs.createReadStream(
          path.join(__dirname, 'styles', item.name),
          'utf-8',
        );
        let data = '\n';
        readableStream.on('data', (chunk) => (data += chunk));
        readableStream.on('end', () => writeableStream.write(data));
        readableStream.on('error', (error) =>
          console.log('Error', error.message),
        );
        console.log(`║ ${item.name} is written to bundle.css`);
      }
    }),
);
process.on('exit', () => {
  console.log('║\n║ ╔═════════════════════════════════════════════════════╗');
  console.log('║ ║ The job is done! bundle.css is ready  (づ｡◕‿‿◕｡)づ  ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
});
