#! /bin/sh

# Compile the js
./tools/goog.builddeps.sh
./tools/goog.compile.sh

# Compile the css
./tools/buildcss.sh

