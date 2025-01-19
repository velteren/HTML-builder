const fs = require('fs');
const readdir = fs.promises.readdir;
const path = require('path');

readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }).then(
  (result) =>
    result.forEach((item) => {
      if (item.isFile()) {
        const ext = path.extname(item.name);
        const name = item.name.replace(ext, '');
        const filePath = path.join(__dirname, 'secret-folder', item.name);
        fs.stat(filePath, (err, stats) => {
          console.log(
            `${name} - ${ext.slice(1)} - ${(stats.size / 1024).toFixed(3)} KB`,
          );
        });
      }
    }),
);
