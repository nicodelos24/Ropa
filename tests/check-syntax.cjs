const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('index.html', 'utf8');
new vm.Script(html.match(/<script>([\s\S]*)<\/script>/)[1]);
new vm.Script(fs.readFileSync('sw.js', 'utf8'));
new vm.Script(fs.readFileSync('tests/visual.js', 'utf8'));
console.log('index.html, sw.js and visual harness: syntax OK');
