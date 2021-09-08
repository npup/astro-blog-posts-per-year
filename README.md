# Blog example

This site  reads some content in the form of _markdown_ posts, and then uses the `getStaticPaths` API to generate pages.

So, static pages are generated from those files.  It is done by parsing `yyyy`, `mm` and `dd` from their file names, and using those parts as _parameters_ &mdash; plus the last part of the filename as _slug_.


Comments inside the code, most of **the meat** it is in the `src/utils/content/*` files, and in the `src/pages/posts/[yyyy]` (etc) pages.

Some of the juggling of the params is a bit gnarly written, admittedly, but there are some comments (as mentioned) and TypeScript types there, which may help to understand the broader picture.  

Have fun!
