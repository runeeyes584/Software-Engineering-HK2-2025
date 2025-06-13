const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const componentsDir = path.join(rootDir, 'components');
const appDir = path.join(rootDir, 'app');

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Thay thế import cũ bằng import mới
    content = content.replace(
      /from ["']@\/components\/language-provider-fixed["']/g,
      'from "@/components/language-provider"'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      updateFile(filePath);
    }
  });
}

// Xóa các file language provider cũ
const oldFiles = [
  'language-provider-fixed.tsx',
  'language-provider-fixed-new.tsx',
  'language-provider.tsx'
];

oldFiles.forEach(file => {
  const filePath = path.join(componentsDir, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted: ${filePath}`);
  }
});

// Cập nhật tất cả các file
processDirectory(componentsDir);
processDirectory(appDir);

console.log('Language provider update completed!'); 