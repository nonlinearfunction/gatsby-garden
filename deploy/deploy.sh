#!/bin/bash
set -e

python3 /home/dave/my-gatsby-garden/deploy/sanitize.py
cd /home/dave/my-gatsby-garden/
gatsby build