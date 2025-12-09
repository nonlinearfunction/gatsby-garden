# My Gatsby Garden - Codebase Structure

This repository contains a static site built with Gatsby that publishes Markdown notes synced from an Obsidian vault. The site has two main content types: notes (general knowledge) and blog posts.

## 🌐 Live Sites
- **Staging**: `staging.nonlinearfunction.org` 
- **Production**: `nonlinearfunction.org`

## 📁 Repository Structure

### Core Directories

- **`src/`** - Main Gatsby source code
- **`deploy/`** - Build and deployment scripts  
- **`_notes/`** - Processed Markdown notes from Obsidian vault
- **`_posts/`** - Blog posts (subset of notes marked for blog feed)
- **`static/`** - Static assets
- **`public/`** - Generated site output (transient)
- **`.cache/`** - Gatsby cache (transient)

### Ignored/Transient Directories
The following directories are temporary and should be ignored:
- `DZG/`, `_notes_old/`, `Research/`, `node_modules/`, `public/`, `.cache/`

## 🏗️ Source Code Structure (`src/`)

```
src/
├── components/          # React components
│   ├── note-list.jsx   # Lists notes with filtering/sorting
│   ├── post-list.jsx   # Lists blog posts
│   ├── search.jsx      # Search functionality
│   ├── tag-list.jsx    # Tag navigation
│   ├── menu.jsx        # Navigation menu
│   └── pager.jsx       # Pagination
├── layout/             # Layout components
│   ├── layout.jsx      # Main site layout wrapper
│   └── header.jsx      # Site header
├── pages/              # Gatsby page components
│   ├── index.jsx       # Homepage (recent posts + tag browser)
│   └── 404.jsx         # 404 error page
├── templates/          # Dynamic page templates
│   ├── note.jsx        # Individual note pages
│   ├── post.jsx        # Individual blog post pages
│   ├── all-notes.jsx   # All notes listing page
│   ├── all-posts.jsx   # All posts listing page
│   ├── tag.jsx         # Tag-specific note listings
│   └── tag-list.jsx    # All tags listing
├── utils/              # Utility functions
│   ├── make-slug.js    # URL slug generation
│   └── menu-structure.jsx # Menu configuration
└── styles/             # CSS files
    ├── common/         # Shared styles
    ├── note.css        # Note-specific styles
    ├── graph.css       # Network graph styles
    └── index.css       # Homepage styles
```

## 🚀 Build & Deploy Process

### Two-Stage Deployment Pipeline

1. **Stage 1: Build Staging** (`deploy/build_staging.sh`)
   - Checks out fresh copy of code to `/home/dave/nonlinearfunction/gatsby-garden`
   - Runs preprocessing scripts on notes
   - Builds site with `gatsby build`
   - Result immediately visible at `staging.nonlinearfunction.org`

2. **Stage 2: Deploy to Production** (`deploy/deploy.sh`)
   - Copies staging build to production site
   - Updates `nonlinearfunction.org`

### Content Sync Process
Notes are synced from Obsidian via rsync:
```bash
rsync -r --delete /mnt/c/Users/davmr/Documents/suffering dave@nonlinearfunction.org:/home/dave/sync
```

### Preprocessing Scripts (`deploy/`)

- **`sanitize.py`** - Main preprocessing script that:
  - Converts Obsidian wikilinks to Gatsby-compatible format
  - Handles image attachments and embedding
  - Processes math expressions for KaTeX
  - Filters private content based on tags
  - Applies various text substitutions for compatibility

- **`create_dummy_notes.py`** - Creates placeholder notes for missing references
- **`binary_search_note_build_error.py`** - Debug tool for build issues

## ⚙️ Configuration

### Key Configuration Files

- **`gatsby-config.js`** - Main Gatsby configuration
  - Site metadata (title, description, URLs)
  - Plugin configuration (MDX, image processing, search)
  - Navigation menu structure
  
- **`gatsby-node.js`** - Build-time logic
  - Dynamic page creation for notes/posts
  - URL structure definition (`/notes/slug` vs `/posts/YYYY/MM/slug`)
  - Field creation and data processing

- **`package.json`** - Dependencies and scripts
  - Based on gatsby-garden template
  - Includes MDX processing, math rendering, search functionality

### Site Configuration
- **Notes prefix**: `/notes`
- **Posts prefix**: `/posts` (with date-based URLs)
- **Navigation**: About, All Notes, Tags
- **Search**: Local search with FlexSearch
- **Math**: KaTeX for math rendering

## 📝 Content Types

### Notes
- General knowledge/reference notes from Obsidian
- URL structure: `/notes/{slug}`
- Support for wikilinks, backlinks, tags
- Created/modified date tracking

### Posts  
- Blog posts (subset of notes in special `posts/` folder)
- URL structure: `/posts/{YYYY}/{MM}/{slug}`
- Chronological organization
- Separate RSS feed

## 🔍 Key Features

- **Backlink Graph**: Visual network of note connections
- **Tag System**: Hierarchical tag navigation 
- **Search**: Full-text search across all content
- **Math Support**: KaTeX rendering for mathematical expressions
- **Image Handling**: Automatic attachment processing with space-to-underscore conversion
- **Responsive Design**: Mobile-friendly layout

## 🧰 Development Commands

```bash
# Development
npm run develop    # Start development server at http://localhost:8000
npm run build      # Production build
npm run serve      # Serve built site locally
npm run clean      # Clear Gatsby cache

# Deployment (run from /home/dave/my-gatsby-garden/)
./deploy/build_staging.sh && ./deploy/deploy.sh
```

## 🔗 Dependencies

Built on Gatsby v4 with key plugins:
- `gatsby-plugin-mdx` - Markdown/MDX processing
- `gatsby-remark-double-brackets-link` - Wikilink support  
- `gatsby-plugin-local-search` - Search functionality
- `rehype-katex` + `remark-math` - Math rendering
- `gatsby-remark-images` - Image processing
- Custom fork: `gatsby-remark-tufte` for Tufte-style sidenotes

## ⚠️ Important Notes

- Never commit without explicit user request
- Content syncing requires manual rsync from Obsidian machine
- Preprocessing handles private content filtering via tags
- Image files have spaces converted to underscores during processing
- Build errors can be debugged with binary search script