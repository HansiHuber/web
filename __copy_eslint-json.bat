@echo off
copy /Y eslint.json node_modules\grunt-eslint\node_modules\eslint\conf\eslint.json
del /Q __copy_eslint-json.bat
