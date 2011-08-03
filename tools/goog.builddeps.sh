#!/bin/sh

vendor/closure-library/closure/bin/build/depswriter.py  \
        --root_with_prefix="js ../../../../js" \
        > js/app.deps.js

