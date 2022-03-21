#!/usr/bin/python3

import os
import shutil
import subprocess

NOTES_STAGING_DIR = '/home/dave/sync/suffering'
NOTES_DIR = '/home/dave/nonlinearfunction/gatsby-garden/_notes'
GATSBY_DIR = '/home/dave/nonlinearfunction/gatsby-garden/'

def reset_notes_dir():
    if os.path.exists(NOTES_DIR):
        shutil.rmtree(NOTES_DIR)
    os.mkdir(NOTES_DIR)
    shutil.copytree(os.path.join(NOTES_STAGING_DIR, 'attachments'),
                    os.path.join(NOTES_DIR, 'attachments'))

def build_with_subset_of_notes(notes):
    reset_notes_dir()
    for note in notes:
        shutil.copy(os.path.join(NOTES_STAGING_DIR, note),
                    os.path.join(NOTES_DIR, note))
    os.chdir(GATSBY_DIR)
    subprocess.run(['gatsby', 'clean'])
    return subprocess.run(['gatsby', 'build'])


all_notes = [n for n in os.listdir(NOTES_STAGING_DIR) if n.endswith('.md')]
broken_notes = all_notes  # Assume there's breakage somewhere.
while len(broken_notes) > 1:
    candidate_notes = broken_notes[:len(broken_notes) // 2]
    result = build_with_subset_of_notes(candidate_notes)
    if result.returncode == 0:
        print("FOUND GOOD SUBSET:", candidate_notes)
        broken_notes = [n for n in broken_notes if n not in candidate_notes]
    else:
        print("RESULT BROKEN WITH RETURN CODE", result.returncode)
        broken_notes = candidate_notes
    print("NARROWED DOWN BREAKAGE TO", broken_notes)
