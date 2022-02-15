import itertools
import os
import shutil
import re

NOTES_STAGING_DIR = '/home/dave/sync/suffering'
NOTES_DIR = '/home/dave/my-gatsby-garden/_notes'

FIX_BLOCK_MATH_SUBSTITUTION = (r'(\n?)\$\$(\n?)', '\n$$\n')

def strip_front_matter(md_string):
    return re.sub(r'---\n(.+\n)+---\n', '', md_string)

def get_front_matter(md_string):
    m = re.search(r'---\n(.+\n)+---\n', md_string)
    if m:
        return m.group(0)
    return ''

def get_explicit_substitutions():
    """Loads substitution regexes from a config file."""
    with open(os.path.join(NOTES_STAGING_DIR,
                           'sanitization rules.md'), 'r') as f:
        s = strip_front_matter(f.read())
    # Assume each line contains a substitution rule with pattern and
    # substitution separated by two spaces '  '.
    lines = s.split('\n')
    return [l.split('  ') for l in lines if l]

def read_private_names():
    """Loads names to replace and generates safe replacements."""
    with open(os.path.join(NOTES_STAGING_DIR, 'private names.md'), 'r') as f:
        s = strip_front_matter(f.read())
    names = []
    for name_line in s.split('\n'):
        r = name_line.split('->')
        name = r[0].strip()
        if not name:
            continue
        if len(r) == 1:
            safe_name = 'NameRedacted'
        elif len(r) == 2:
            safe_name = r[1].strip()
        else:
            raise ValueError(f'Invalid name line: {name_line}')
        names.append((name, safe_name))
    print("READ NAMES", names)
    return names

def get_name_variants(name):
    """'first last ->' ['first last', 'First last', 'first Last', 'First Last']."""
    names = name.split(' ')
    # TODO generate all capitalized varajnts
    variants = [(n.lower(), n.capitalize()) for n in names]
    return [' '.join(n) for n in list(itertools.product(*variants))]

def get_substitutions(footnote=''):
    """Builds the overall list of substitutions (including names) to apply."""
    substitutions = list(get_explicit_substitutions())
    substitutions.append(FIX_BLOCK_MATH_SUBSTITUTION)
    for name, safe_name in read_private_names():
        for variant in get_name_variants(name):
            # TODO: include footnotes
            # TODO: somehow handle out-of-band usage so that 'Daniel Dennett' doesn't end up as 'Person_XXXX Dennett'
            substitutions.append((r'(\b)' + variant + r'(\b)', r'\g<1>' + safe_name + footnote + r'\g<2>'))
    return substitutions    

def apply_substitutions(markdown, substitutions):
   for pattern, replacement in substitutions:
      markdown = re.sub(pattern, replacement, markdown)
   return markdown

substitutions = get_substitutions()

# Remove all existing notes.
shutil.rmtree(NOTES_DIR)
os.mkdir(NOTES_DIR)

for filename in os.listdir(NOTES_STAGING_DIR):
    if not filename.endswith('.md'):
        print(f"skipping non-markdown file {filename}")
        continue
    with open(os.path.join(NOTES_STAGING_DIR, filename), 'r') as f:
        md_string = f.read()
    
    if 'publish: false' in get_front_matter(md_string):
        print(f"Publishing disabled for {filename}")
        continue
    new_filename = apply_substitutions(filename, substitutions)
    if new_filename != filename:
        print(f"Changed filename {filename} to {new_filename}")
    with open(os.path.join(NOTES_DIR, new_filename), 'w') as f:
        f.write(apply_substitutions(md_string, substitutions))
