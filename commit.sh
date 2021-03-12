#!/bin/bash -e
git status
sleep 1
git add *
clear
git commit
clear
cat .git/COMMIT_EDITMSG
