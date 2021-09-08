# Blog example

This uses the `getStaticPaths` API, reads some content in the form of _markdown_ posts.

Static pages are then generated from those files.  It is done by parsing `yyyy`, `mm` and `dd` from their file names, and using those parts as _parameters_ &mdash; plus the last part of the filename as _slug_.


Comments inside the code, most of **the meat** it is in the `src/utils/content/*` files, and in the `src/pages/posts/[yyyy]` (etc) pages.

Have fun!
