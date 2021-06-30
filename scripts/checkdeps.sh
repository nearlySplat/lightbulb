#!/bin/sh

die() {
  echo "$@"
  exit 1
}

check_port() {
  PORT="$1"

  
  if ! curl -I "$PORT"; then
    die "$2 ($3) not installed. to install, $4"
  fi
}

check_port 5431 unicode-info https://github.com/nearlySplat/unicode-info "clone the repository from the given URL"
#check_port 5000 libretranslate https://github.com/nearlySplat/LibreTranslate "execute \`pip install libretranslate && libretranslate\`"

echo "Success! All external dependencies are installed and running!"