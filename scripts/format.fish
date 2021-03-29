echo "Looking for unformatted source files..."
set -l files (prettier -l **/*.{json,ts} *.{json,ts})
echo $files
if test -z $files
	echo "No unformatted files found."
else
	echo "Oh no! Some files are unformatted!"
	prettier --write $files
end
echo "Done!"
