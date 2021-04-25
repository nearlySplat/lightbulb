#!/usr/bin/env node
const fs = require('fs');

const current = JSON.parse(fs.readFileSync('./package.json'));
const msg = process.argv.slice(2).join(' ');
const old = current.version;
if (msg.match(/^(feat|fix)(\(.*?\))?!:/gi))
  current.version = 1 + +current.version.match(/^\d+/) + '.0.0';
else if (msg.match(/^feat(\(.*?\))?:/gi)) {
  const FULL = current.version.match(/(\d+)\.(\d+)\.(\d+)/i);
  const BREAKING = FULL[1],
    MAJOR = FULL[2];
  current.version = BREAKING + '.' + (1 + +MAJOR) + '.0';
} else if (msg.match(/^fix(\(.*?\))?:/gi)) {
  const MINOR = current.version.match(/\d+$/gi);
  current.version = current.version.replace(/\d+$/gi, +MINOR + 1);
}

console.log('changed old version of', old, 'to', current.version);
fs.writeFileSync('./package.json', JSON.stringify(current));
