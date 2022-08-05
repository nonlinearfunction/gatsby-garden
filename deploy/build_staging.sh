#!/bin/bash

rm -rf /home/dave/nonlinearfunction/gatsby-garden
set -e

cd /home/dave/nonlinearfunction/
gatsby new gatsby-garden https://github.com/nonlinearfunction/gatsby-garden
python3 /home/dave/nonlinearfunction/gatsby-garden/deploy/sanitize.py
python3 /home/dave/nonlinearfunction/gatsby-garden/deploy/create_dummy_notes.py
mkdir /home/dave/nonlinearfunction/gatsby-garden/_notes/attachments/
cd /home/dave/sync/suffering/attachments/
for f in *; do cp "$f" "/home/dave/nonlinearfunction/gatsby-garden/_notes/attachments/${f// /_}"; done
# cp /home/dave/sync/suffering/attachments/* /home/dave/nonlinearfunction/gatsby-garden/_notes/attachments/
cd /home/dave/nonlinearfunction/gatsby-garden/
gatsby clean
gatsby build
