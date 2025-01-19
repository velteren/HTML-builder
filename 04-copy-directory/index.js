const fs = require('fs');
const { readdir, copyFile } = fs.promises;
const path = require('path');

function copyDir(dir, dest) {
  fs.readdir(path.join(__dirname, dest), (err, files) => {
    if (err) {
      err;
    } else {
      for (const file of files) {
        fs.unlink(path.join(path.join(__dirname, dest), file), (err) => {
          if (err) throw err;
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
  console.log('\nThe job is done. All files are copied\n');
}

copyDir('files', 'files-copy');
