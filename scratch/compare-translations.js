const fs = require('fs');
const path = require('path');

const itPath = path.join(__dirname, '..', 'messages', 'it.json');
const enPath = path.join(__dirname, '..', 'messages', 'en.json');

const it = JSON.parse(fs.readFileSync(itPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function getKeys(obj, prefix = '') {
    let keys = [];
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            keys = keys.concat(getKeys(obj[key], prefix + key + '.'));
        } else {
            keys.push(prefix + key);
        }
    }
    return keys;
}

const itKeys = getKeys(it);
const enKeys = getKeys(en);

const missingInEn = itKeys.filter(k => !enKeys.includes(k));
const missingInIt = enKeys.filter(k => !itKeys.includes(k));

console.log("=== TRANSLATION KEY COMPARISON ===");
console.log(`Italian keys: ${itKeys.length}`);
console.log(`English keys: ${enKeys.length}`);

if (missingInEn.length > 0) {
    console.log(`\nMissing in English (en.json) [${missingInEn.length}]:`);
    missingInEn.forEach(k => console.log(` - ${k}`));
} else {
    console.log("\nAll Italian keys are present in English.");
}

if (missingInIt.length > 0) {
    console.log(`\nMissing in Italian (it.json) [${missingInIt.length}]:`);
    missingInIt.forEach(k => console.log(` - ${k}`));
} else {
    console.log("All English keys are present in Italian.");
}
