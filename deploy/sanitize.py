import itertools
import os
import re
import shutil

NOTES_STAGING_DIR = '/home/dave/sync/suffering'
POSTS_STAGING_DIR = '/home/dave/sync/suffering/posts'

NOTES_DIR = '/home/dave/nonlinearfunction/gatsby-garden/_notes'
POSTS_DIR = '/home/dave/nonlinearfunction/gatsby-garden/_posts'

FIX_BLOCK_MATH_SUBSTITUTION = (r'(\n?)\$\$(\n?)', '\n$$\n')

IMAGE_WIKILINK_SUBSTITUTION = (r'!\[\[([^\n\]]+)\]\]', r'![](\g<1>)')
IMAGE_SPACE_TO_UNDERSCORE_SUBSTITUTION = (r'!\[([^\n\]]*)\]\(([^\n/ \)]+)( )',
                                          r'![\g<1>](\g<2>_')
IMAGE_ATTACHMENTS_FOLDER_SUBSTITUTION = (r'!\[([^\n\]]*)\]\(([^\n/\)]+)\)',
                                         r'![\g<1>](attachments/\g<2>)')
# This should only be necessary for posts, but seems to be useful for some notes
# I guess to help gatsby recognize that this is really a filename rather than
# a relative URL path.
ABSOLUTE_ATTACHMENTS_SUBSTITUTION = (r'\(attachments/',
                                     '(../_notes/attachments/')

BASIC_SUBSTITUTIONS = [
    FIX_BLOCK_MATH_SUBSTITUTION,
    IMAGE_WIKILINK_SUBSTITUTION,
    # Hack to remove up to five spaces in an image filename.
    IMAGE_SPACE_TO_UNDERSCORE_SUBSTITUTION,
    IMAGE_SPACE_TO_UNDERSCORE_SUBSTITUTION,
    IMAGE_SPACE_TO_UNDERSCORE_SUBSTITUTION,
    IMAGE_SPACE_TO_UNDERSCORE_SUBSTITUTION,
    IMAGE_SPACE_TO_UNDERSCORE_SUBSTITUTION,
    IMAGE_ATTACHMENTS_FOLDER_SUBSTITUTION,
    ABSOLUTE_ATTACHMENTS_SUBSTITUTION
]


def strip_front_matter(md_string):
    return re.sub(r'---\n(.+\n)+---\n', '', md_string)


def get_front_matter(md_string):
    m = re.search(r'---\n(.+\n)+---\n', md_string)
    if m:
        return m.group(0)
    return ''


def get_explicit_substitutions():
    """Loads substitution regexes from a config file."""
    with open(os.path.join(NOTES_STAGING_DIR, 'sanitization rules.md'),
              'r') as f:
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


def get_notes_substitutions(footnote=''):
    """Builds the overall list of substitutions (including names) to apply."""
    substitutions = list(get_explicit_substitutions())
    for name, safe_name in read_private_names():
        for variant in get_name_variants(name):
            # TODO: include footnotes
            # TODO: somehow handle out-of-band usage so that 'Daniel Dennett' doesn't end up as 'Person_XXXX Dennett'
            substitutions.append((r'(\b)' + variant + r'(\b)',
                                  r'\g<1>' + safe_name + footnote + r'\g<2>'))
    return substitutions


def slugify(s):
    s = s.lower().strip()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_-]+', '-', s)
    s = re.sub(r'^-+|-+$', '', s)
    return s


def rewrite_wikilinks(markdown):
    wikilinks = re.findall(r'\[\[([^\n\]]+)\]\]', markdown)
    for link in wikilinks:
        markdown = re.sub(r'\[\[' + link + r'\]\]',
                          '[' + link + '](/notes/' + slugify(link) + ')',
                          markdown)
    return markdown


def apply_substitutions(markdown, substitutions):
    for pattern, replacement in substitutions:
        markdown = re.sub(pattern, replacement, markdown)
    return markdown


notes_substitutions = BASIC_SUBSTITUTIONS + get_notes_substitutions()
posts_substitutions = BASIC_SUBSTITUTIONS

# Remove all existing notes.
if os.path.exists(NOTES_DIR):
    shutil.rmtree(NOTES_DIR)
if os.path.exists(POSTS_DIR):
    shutil.rmtree(POSTS_DIR)
os.mkdir(NOTES_DIR)
os.mkdir(POSTS_DIR)

md_files_notes = [s for s in os.listdir(NOTES_STAGING_DIR) if s.endswith('.md')]
md_files_posts = [s for s in os.listdir(POSTS_STAGING_DIR) if s.endswith('.md')]

# Ensure no duplicates with conflicting capitalization.
canonical_capitalization = {}
for filename in md_files_notes:
    if filename.lower() in canonical_capitalization:
        raise ValueError(
            f'Saw notes with conflicting capitalizations {filename} and {canonical_capitalization[filename.lower()]}'
        )
    canonical_capitalization[filename.lower()] = filename

for filename in md_files_notes:
    with open(os.path.join(NOTES_STAGING_DIR, filename), 'r') as f:
        md_string = f.read()

    if 'publish: false' in get_front_matter(md_string):
        print(f"Publishing disabled for {filename}")
        continue
    new_filename = apply_substitutions(filename, notes_substitutions)
    if new_filename != filename:
        print(f"Changed filename {filename} to {new_filename}")
    with open(os.path.join(NOTES_DIR, new_filename), 'w') as f:
        f.write(apply_substitutions(md_string, notes_substitutions))

for filename in md_files_posts:
    with open(os.path.join(POSTS_STAGING_DIR, filename), 'r') as f:
        md_string = f.read()
    if 'publish: false' in get_front_matter(md_string):
        print(f"Publishing disabled for {filename}")
        continue
    md_string = apply_substitutions(md_string, posts_substitutions)
    md_string = rewrite_wikilinks(md_string)
    with open(os.path.join(POSTS_DIR, filename), 'w') as f:
        f.write(md_string)
