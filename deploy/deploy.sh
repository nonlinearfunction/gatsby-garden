#!/bin/bash
set -e

rm -r /home/dave/my-gatsby-garden/_notes_previous
mv /home/dave/my-gatsby-garden/_notes /home/dave/my-gatsby-garden/_notes_previous
python3 /home/dave/my-gatsby-garden/deploy/sanitize.py
python3 /home/dave/my-gatsby-garden/deploy/create_dummy_notes.py
mkdir /home/dave/my-gatsby-garden/_notes/attachments/
cp /home/dave/sync/suffering/attachments/* /home/dave/my-gatsby-garden/_notes/attachments/
cd /home/dave/my-gatsby-garden/
gatsby build