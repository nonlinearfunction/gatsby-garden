import itertools
import os
import re
import shutil

NOTES_STAGING_DIR = '/home/dave/sync/suffering'
POSTS_STAGING_DIR = '/home/dave/sync/suffering/posts'

NOTES_DIR = '/home/dave/nonlinearfunction/gatsby-garden/_notes'
POSTS_DIR = '/home/dave/nonlinearfunction/gatsby-garden/_posts'

IMAGE_EXTENSIONS = ('jpg', 'jpeg', 'gif', 'png', 'svg', 'webp')

PRIVATE_TAGS = ('personal', 'ideas')

FIX_BLOCK_MATH_SUBSTITUTION = (r'(\n?)\$\$(\n?)', '\n$$\n')

IMAGE_WIKILINK_SUBSTITUTIONS = [(f'!\\[\\[([^\\n\\]]+\\.{ext})\\]\\]', r'![](\g<1>)') for ext in IMAGE_EXTENSIONS]
EMBED_WIKILINK_MD_SUBSTITUTION = (r'!\[\[([^\n\]]+\.md)\]\]', '[[\\g<1>]]:\n\n<blockquote>\n\n`markdown:\\g<1>.md`\n\n</blockquote>\n')
EMBED_WIKILINK_SUBSTITUTION = (r'!\[\[([^\n\]]+)\]\]', '[[\\g<1>]]:\n\n<blockquote>\n\n`markdown:\\g<1>.md`\n\n</blockquote>\n') 


IMAGE_SPACE_TO_UNDERSCORE_SUBSTITUTION = (r'!\[([^\n\]]*)\]\(([^\n/ \)]+)( )',
                                          r'![\g<1>](\g<2>_')
IMAGE_ATTACHMENTS_FOLDER_SUBSTITUTION = (r'!\[([^\n\]]*)\]\(([^\n/\)]+)\)',
                                         r'![\g<1>](attachments/\g<2>)')
# This should only be necessary for posts, but seems to be useful for some notes
# I guess to help gatsby recognize that this is really a filename rather than
# a relative URL path.
ABSOLUTE_ATTACHMENTS_SUBSTITUTION = (r'\(attachments/',
                                     '(../_notes/attachments/')

# Convert tweet image embeds to bare URLs for gatsby-remark-twitter
TWEET_EMBED_SUBSTITUTION = (r'!\[\]\((https://twitter\.com/[^\n\)]+)\)', r'\g<1>')

BASIC_SUBSTITUTIONS = [
    FIX_BLOCK_MATH_SUBSTITUTION ] + IMAGE_WIKILINK_SUBSTITUTIONS + [
    EMBED_WIKILINK_MD_SUBSTITUTION,
    EMBED_WIKILINK_SUBSTITUTION,
    # Hack to remove up to five spaces in an image filename.
    IMAGE_SPACE_TO_UNDERSCORE_SUBSTITUTION,
    IMAGE_SPACE_TO_UNDERSCORE_SUBSTITUTION,
    IMAGE_SPACE_TO_UNDERSCORE_SUBSTITUTION,
    IMAGE_SPACE_TO_UNDERSCORE_SUBSTITUTION,
    IMAGE_SPACE_TO_UNDERSCORE_SUBSTITUTION,
    IMAGE_ATTACHMENTS_FOLDER_SUBSTITUTION,
    ABSOLUTE_ATTACHMENTS_SUBSTITUTION,
    TWEET_EMBED_SUBSTITUTION
]


def strip_front_matter(md_string):
    return re.sub(r'---\n(.+\n)+---\n', '', md_string)


def get_front_matter(md_string):
    m = re.search(r'---\n(.+\n)+---\n', md_string)
    if m:
        return m.group(0)
    return ''


def normalize_tags_in_frontmatter(md_string):
    """Strip leading # symbols from tags in frontmatter."""
    front_matter = get_front_matter(md_string)
    if not front_matter:
        return md_string

    # Find tags in array format: tags: [tag1, tag2, #tag3]
    def normalize_tag_array(match):
        tags_content = match.group(1)
        # Strip leading # from each tag
        normalized = re.sub(r'(^|,\s*)#+', r'\1', tags_content)
        return f'tags: [{normalized}]'

    normalized_fm = re.sub(r'tags: \[([^\]]+)\]', normalize_tag_array, front_matter)

    # Find tags in list format:
    # tags:
    #   - tag1
    #   - #tag2
    normalized_fm = re.sub(r'^(\s*- )#+', r'\1', normalized_fm, flags=re.MULTILINE)

    # Replace the old frontmatter with normalized version
    return md_string.replace(front_matter, normalized_fm)

def should_publish(md_front_matter_string: str):
    """Determine from a note's header if it should be published."""
    md_front_matter_string = md_front_matter_string.lower()
    
    # Always respect the 'publish' attribute if present.
    if 'publish: false' in md_front_matter_string:
        return False
    elif 'publish: true' in md_front_matter_string:
        return True

    # Tags not to publish.    
    for private_tag in PRIVATE_TAGS:
        if private_tag in md_front_matter_string:
            return False
        
    return True
    

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
    people_dir = os.path.join(NOTES_STAGING_DIR, 'people')
    names = []
    for fname in os.listdir(people_dir):
        if not fname.endswith(".md"):
            continue
        name = os.path.splitext(fname)[0]
        with open(os.path.join(people_dir, fname), 'r') as f:
            front_matter = get_front_matter(f.read())
        print("read", os.path.join(people_dir, fname))
        m = re.search(r'redact-as: (\S+)', front_matter)
        # Redact all names by default unless explicitly tagged otherwise.
        redact_as = m.group(1) if m else 'NameRedacted'
        print(front_matter)
        print(redact_as)
        if redact_as.lower() == "false" or redact_as.lower() == "none":
            continue
        print(f"Redacting {name} as {redact_as}")
        names.append((name, redact_as))
    return names


def get_notes_substitutions(footnote=''):
    """Builds the overall list of substitutions (including names) to apply."""
    substitutions = list(get_explicit_substitutions())
    for name, redact_as in read_private_names():
        substitutions.append((r'\[\[' + name + r'(|[^\]])*\]\]', redact_as))
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
    # Normalize tags in frontmatter
    md_string = normalize_tags_in_frontmatter(md_string)
    new_filename = apply_substitutions(filename, notes_substitutions)
    if new_filename != filename:
        print(f"Changed filename {filename} to {new_filename}")
    with open(os.path.join(NOTES_DIR, new_filename), 'w') as f:
        f.write(apply_substitutions(md_string, notes_substitutions))

for filename in md_files_posts:
    with open(os.path.join(POSTS_STAGING_DIR, filename), 'r') as f:
        md_string = f.read()
    if not should_publish(get_front_matter(md_string)):
        print(f"Publishing disabled for {filename}")
        continue
    # Normalize tags in frontmatter
    md_string = normalize_tags_in_frontmatter(md_string)
    md_string = apply_substitutions(md_string, posts_substitutions)
    md_string = rewrite_wikilinks(md_string)
    with open(os.path.join(POSTS_DIR, filename), 'w') as f:
        f.write(md_string)
