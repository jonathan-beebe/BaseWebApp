#!/bin/sh

ctags -R -V \
-f .vim_tags_js \
--exclude=@tools/vim_tags_exclude \
--langdef=js \
--langmap=js:.js \
--regex-js='/([A-Za-z0-9._$]+)[ \t]*[:=][ \t]*\{/\1/,object/' \
--regex-js='/([A-Za-z0-9._$()]+)[ \t]*[:=][ \t]*function[ \t]*\(/\1/,function/' \
--regex-js='/function[ \t]+([A-Za-z0-9._$]+)[ \t]*([^)])/\1/,function/' \
--regex-js='/([A-Za-z0-9._$]+)[ \t]*[:=][ \t]*\[/\1/,array/' \
--regex-js='/([A-Za-z0-9._$]+).prototype.([A-Za-z0-9._$]+) =/\2/,function/' \
--regex-js='/([A-Za-z0-9_$]+) = new Class/\1/,function/' \
--regex-js='/([^= ]+)[ \t]*=[ \t]*[^'\'']\"[^\"]*/\1/,string/' \
--regex-js='/([^= ]+)[ \t]*=[ \t]*[^"]'\''[^'\'']*/\1/,string/'
