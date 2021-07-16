#!/bin/sh

for file in src/**/*.ts src/*.ts lib/**/*.ts lib/*.ts; do
    if ! grep -q Copyright "$file"; then
      cat assets/licenseHeader.txt "$file" > "$file.licensed" && mv "$file.licensed" "$file"
      git add "$file"
    fi
done
