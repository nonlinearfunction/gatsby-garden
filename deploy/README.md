The deployment pipeline is as follows. First, changes from the Obsidian vault are pushed by running something like
```
rsync -r --delete /mnt/c/Users/davmr/Documents/suffering dave@nonlinearfunction.org:/home/dave/sync
```
on a remote machine with Obsidian sync. This updates the local copy of the vault in '/home/dave/sync/suffering'.

Then we locally run
```
/home/dave/my-gatsby-garden/deploy/build_staging.sh && /home/dave/my-gatsby-garden/deploy/deploy.sh
```

which

1. Sanitizes and otherwise preprocesses the notes, and copies them to the Gatsby `_notes` folder (moving the old folder to `_notes_old`).
2. Builds the new site (automatically visible at `staging.nonlinearfunction.org`)
3. If this was successful, copies it to 