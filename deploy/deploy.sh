#!/bin/bash
set -e

rm -r /home/dave/nonlinearfunction/public_old
mv /home/dave/nonlinearfunction/public /home/dave/nonlinearfunction/public_old
cp -R /home/dave/nonlinearfunction/gatsby-garden/public /home/dave/nonlinearfunction/public
