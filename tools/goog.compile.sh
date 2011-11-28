#!/bin/sh
#
# Compile all custom page controllers and their dependencies into a single
# js file for the site.
# 
# application.pages is just a namespace for google closure to find all
# page controllers that are available to this site.

# srv25 does not have java installed, so we put a self-contained installation
# in neodates home. Export the java path here:
# PATH=/home/neodates/java/bin/:$PATH

vendor/closure-library/closure/bin/build/closurebuilder.py  \
        --root="js" \
		--root="vendor/closure-library" \
        --namespace="Application" \
        --output_mode=compiled \
        --compiler_jar=vendor/closure-compiler/compiler.jar \
        > js/app.compiled.js

