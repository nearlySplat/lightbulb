

for file in src/**/*.ts

    if not grep -q Copyright "$file"
      cat assets/licenseHeader.txt "$file" > "$file.licensed" && mv "$file.licensed" "$file"
      git add $file
    end
end
