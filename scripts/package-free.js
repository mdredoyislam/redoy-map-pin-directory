const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PLUGIN_SLUG = 'redoy-map-pin-directory';
const ROOT_DIR = path.join(__dirname, '..');
const TEMP_DIR = path.join(ROOT_DIR, 'dist-temp');
const TEMP_PLUGIN_DIR = path.join(TEMP_DIR, PLUGIN_SLUG);
const OUTPUT_DIR = path.join(ROOT_DIR, '..', 'redoy-map-pin-directory-builds');
const OUTPUT_FILE = path.join(OUTPUT_DIR, `${PLUGIN_SLUG}-free.zip`);

// 1. Clean up
if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
if (fs.existsSync(OUTPUT_FILE)) fs.unlinkSync(OUTPUT_FILE);

fs.mkdirSync(TEMP_PLUGIN_DIR, { recursive: true });

// 2. Copy files manually
const copyRecursiveSync = function (src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
        path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

console.log('Copying assets...');
if (fs.existsSync(path.join(ROOT_DIR, 'assets'))) {
  copyRecursiveSync(path.join(ROOT_DIR, 'assets'), path.join(TEMP_PLUGIN_DIR, 'assets'));
}

console.log('Copying includes...');
if (fs.existsSync(path.join(ROOT_DIR, 'includes'))) {
  copyRecursiveSync(path.join(ROOT_DIR, 'includes'), path.join(TEMP_PLUGIN_DIR, 'includes'));
}

const rootFiles = ['redoy-map-pin-directory.php', 'readme.txt', 'index.php'];
rootFiles.forEach(file => {
  const src = path.join(ROOT_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(TEMP_PLUGIN_DIR, file));
  }
});

// 3. Zip it using powershell
console.log('Zipping...');
try {
  execSync(`Compress-Archive -Path '${TEMP_PLUGIN_DIR}' -DestinationPath '${OUTPUT_FILE}' -Force`, { stdio: 'inherit', shell: 'powershell.exe' });
  console.log(`✅ Packaging Complete! Output: ${OUTPUT_FILE}`);
} catch (e) {
  console.error('Failed to zip:', e);
}

// 4. Cleanup temp
fs.rmSync(TEMP_DIR, { recursive: true, force: true });
