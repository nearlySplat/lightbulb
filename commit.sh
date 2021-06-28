#!/bin/sh
node scripts/incrementSemver.js $@ >/dev/null
pnpx prettier -w package.json
git add package.json
git commit -m "$@"
