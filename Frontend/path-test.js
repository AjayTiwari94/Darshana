const path = require('path');
const fs = require('fs');

// Get the current working directory
console.log('Current working directory:', process.cwd());

// Check if src directory exists
const srcPath = path.join(process.cwd(), 'src');
console.log('src path:', srcPath);
console.log('src exists:', fs.existsSync(srcPath));

// Check if app directory exists
const appPath = path.join(srcPath, 'app');
console.log('app path:', appPath);
console.log('app exists:', fs.existsSync(appPath));

// List contents of app directory
if (fs.existsSync(appPath)) {
  console.log('app directory contents:', fs.readdirSync(appPath));
}

// Check if page.tsx exists
const pagePath = path.join(appPath, 'page.tsx');
console.log('page.tsx path:', pagePath);
console.log('page.tsx exists:', fs.existsSync(pagePath));

// Check if layout.tsx exists
const layoutPath = path.join(appPath, 'layout.tsx');
console.log('layout.tsx path:', layoutPath);
console.log('layout.tsx exists:', fs.existsSync(layoutPath));