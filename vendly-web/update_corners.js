const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'app', 'dashboard');

// Regex to match structural border radius classes (but skipping rounded-full and rounded-none)
const regexBasic = /rounded-(2xl|3xl|xl|lg|md|sm|\[\d+px\])/g;
const regexSides = /rounded-(t|b|l|r)-(2xl|3xl|xl|lg|md|sm|\[\d+px\])/g;
const regexCorners = /rounded-(tl|tr|bl|br)-(2xl|3xl|xl|lg|md|sm|\[\d+px\])/g;

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.tsx') || dirPath.endsWith('.jsx')) {
      callback(path.join(dir, f));
    }
  });
}

let modifiedCount = 0;

walkDir(directory, function(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  content = content.replace(regexBasic, 'rounded-[4px]');
  content = content.replace(regexSides, 'rounded-$1-[4px]');
  content = content.replace(regexCorners, 'rounded-$1-[4px]');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
    console.log(`Updated ${path.relative(__dirname, filePath)}`);
  }
});

console.log(`\nSuccessfully updated corners in ${modifiedCount} files.`);
