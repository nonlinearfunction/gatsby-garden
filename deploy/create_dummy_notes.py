import os
import re
import collections

NOTES_DIR = '/home/dave/nonlinearfunction/gatsby-garden/_notes'

md_files = [fname for fname in os.listdir(NOTES_DIR) if fname.endswith('.md')]

existing_notes = [fname[:-3] for fname in md_files]
refs = collections.defaultdict(int)
linked_notes = set()

for filename in md_files:
    with open(os.path.join(NOTES_DIR, filename), 'r') as f:
        md_str = f.read()
    wikilinks = re.findall(r'\[\[([^\]]+)\]\]', md_str)
    wikilinks = set([s.split('|')[0] for s in wikilinks])
    for s in wikilinks:
        refs[s] += 1
    # print(f"File: {filename} wikilinks: {wikilinks}")
    linked_notes = linked_notes.union(wikilinks)

new_notes = linked_notes - set(existing_notes)
trivial_notes = set()
for s in new_notes:
    if refs[s] > 1:
        print(f'creating {s} with {refs[s]} refs')
        with open(os.path.join(NOTES_DIR, s + '.md'), 'w') as f:
            f.write('')
    else:
        trivial_notes.add(s)

for filename in md_files:
    with open(os.path.join(NOTES_DIR, filename), 'r') as f:
        md_str = f.read()
    for s in trivial_notes:
        new_md_str = re.sub(r'\[\[' + s + r'(\|([^\]]+))?\]\]',
                            lambda m: m.group(2) if m.group(2) else s,
                            md_str)
        if new_md_str != md_str:
            print(f"{filename}: removed trivial link '{s}'")
        md_str = new_md_str
    with open(os.path.join(NOTES_DIR, filename), 'w') as f:
        f.write(md_str)
