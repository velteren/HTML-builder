const fs = require('fs');
const { readdir, copyFile } = fs.promises;
const path = require('path');

fs.mkdir(
  path.join(__dirname, 'project-dist'),
  { recursive: true },
  (err) => err,
);

const indexWriteble = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'index.html'),
);
const styleWriteble = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'style.css'),
);
let indexHtml = '';

function prepareHtml() {
  const indexReadable = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  indexReadable.on('data', (chunk) => (indexHtml += chunk));
  indexReadable.on('error', (error) => console.log('Error', error.message));
  indexReadable.on('end', () => {
    readdir(path.join(__dirname, 'components'), { withFileTypes: true }).then(
      (result) => {
        result.forEach((item) => {
          if (item.isFile() && path.extname(item.name) == '.html') {
            const insertReadable = fs.createReadStream(
              path.join(__dirname, 'components', item.name),
              'utf-8',
            );
            let insertData = '';
            insertReadable.on('data', (chunk) => (insertData += chunk));
            insertReadable.on('error', (error) =>
              console.log('Error', error.message),
            );
            insertReadable.on('end', () => {
              indexHtml = indexHtml.replace(
                `{{${path
                  .basename(item.name)
                  .replace(path.extname(item.name), '')}}}`,
                insertData,
              );
            });
          }
        });
      },
    );
  });
}

prepareHtml();

function prepareCSS() {
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
          readableStream.on('end', () => styleWriteble.write(data));
          readableStream.on('error', (error) =>
            console.log('Error', error.message),
          );
        }
      }),
  );
}

prepareCSS();

function copyDir(dir, dest) {
  fs.readdir(path.join(__dirname, dest), (err, files) => {
    if (err) {
      err;
    } else {
      for (const file of files) {
        fs.unlink(path.join(path.join(__dirname, dest), file), (err) => {
          if (err) err;
        });
      }
    }
  });
  fs.mkdir(path.join(__dirname, dest), { recursive: true }, (err) => err);
  readdir(path.join(__dirname, dir), { withFileTypes: true }).then((result) => {
    result.forEach((item) => {
      if (item.isDirectory()) {
        copyDir(path.join(dir, item.name), path.join(dest, item.name));
      } else {
        copyFile(
          path.join(__dirname, dir, item.name),
          path.join(__dirname, dest, item.name),
        );
      }
    });
  });
}

copyDir('assets', path.join('project-dist', 'assets'));

process.on('exit', () => {
  indexWriteble.write(indexHtml);
  console.log('\nThe job is done\n');
});
