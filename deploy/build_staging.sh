#!/bin/bash

rm -r /home/dave/nonlinearfunction/gatsby-garden
set -e

cd /home/dave/nonlinearfunction/
gatsby new gatsby-garden https://github.com/nonlinearfunction/gatsby-garden
python3 /home/dave/nonlinearfunction/gatsby-garden/deploy/sanitize.py
python3 /home/dave/nonlinearfunction/gatsby-garden/deploy/create_dummy_notes.py
mkdir /home/dave/nonlinearfunction/gatsby-garden/_notes/attachments/
cp /home/dave/sync/suffering/attachments/* /home/dave/nonlinearfunction/gatsby-garden/_notes/attachments/
cd /home/dave/nonlinearfunction/gatsby-garden/
gatsby clean
gatsby build
