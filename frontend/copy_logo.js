const fs = require('fs');
const path = require('path');

// Absolute path to source (Artifacts)
const src = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\030593fb-7947-4410-8b50-546d3126c005\\logo_transfer.png';

// Relative path to dest (public/smart_voting_logo.png)
const dest = path.join(__dirname, 'public', 'smart_voting_logo.png');

console.log(`Copying from ${src} to ${dest}`);

try {
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log('Success: Logo copied successfully.');
    } else {
        console.error('Error: Source file does not exist.');
    }
} catch (err) {
    console.error('Example Error:', err);
}
