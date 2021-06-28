const { execSync } = require('child_process');
const { join } = require('path');

const semverBlame = execSync(
  'git blame ' + join(__dirname, '..', 'package.json')
)
  .toString()
  .match(/^.*\n.*\n([\da-f]{8})/i)[1];

if (semverBlame !== '0'.repeat(8)) process.exit(1);
