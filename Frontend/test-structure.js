const fs = require('fs');
const path = require('path');

console.log('Current working directory:', process.cwd());
console.log('Directory contents:', fs.readdirSync(process.cwd()));

const srcPath = path.join(process.cwd(), 'src');
if (fs.existsSync(srcPath)) {
  console.log('src directory exists');
  const appPath = path.join(srcPath, 'app');
  if (fs.existsSync(appPath)) {
    console.log('app directory exists');
    console.log('app directory contents:', fs.readdirSync(appPath));
  } else {
    console.log('app directory does not exist');
  }
} else {
  console.log('src directory does not exist');
}