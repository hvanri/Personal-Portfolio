const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = [
  'blog.html',
  'blog/posts.json',
  'js/blog.js',
  'css/pages/blog.css'
];

for (const file of files) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required file: ${file}`);
  }
}

console.log('Blog page scaffold verified');
