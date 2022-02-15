module.exports = {
  pathPrefix: `/`, // If your Digital Garden is not published at the root of your website, use this.
  siteMetadata: {
    title: `Nonlinear Function`,
    description: `A Digital Garden Tended by Gatsby`,

    siteUrl: `https://nonlinearfunction.org/`, // URL at which your site will be published. This should be present if you want RSS feed.
    notesPrefix: `/notes`,
    headerMenu: [ // Top Navbar items
       {type: 'note', item: 'about', title: 'About'}, // Type can be 'page', 'note', 'tag', or 'link'
       {type: 'page', item: 'sitemap', title: 'All Notes'},
       {type: 'page', item: 'tags', title: 'Tags'},
     ],
  },
  plugins: [
    `gatsby-plugin-sharp`,
    `gatsby-remark-images`,
    `gatsby-plugin-remove-trailing-slashes`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `notes`,
        path: `${__dirname}/_notes/`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        remarkPlugins: [
          require("remark-math"),
          // Don't interpret indented lists as code bocks.
          [require("remark-disable-tokenizers"),
           {block: ['indentedCode']}],
        ],
        rehypePlugins: [require("rehype-katex")],
        gatsbyRemarkPlugins: [
          {
            resolve: "@weknow/gatsby-remark-twitter",
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (e.g. <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (e.g. for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              classPrefix: "language-",
              // This is used to allow setting a language for inline code
              // (i.e. single backticks) by creating a separator.
              // This separator is a string and will do no white-space
              // stripping.
              // A suggested value for English speakers is the non-ascii
              // character '›'.
              inlineCodeMarker: null,
              // This lets you set up language aliases.  For example,
              // setting this to '{ sh: "bash" }' will let you use
              // the language "sh" which will highlight using the
              // bash highlighter.
              aliases: {},
              // This toggles the display of line numbers globally alongside the code.
              // To use it, add the following line in gatsby-browser.js
              // right after importing the prism color scheme:
              //  require("prismjs/plugins/line-numbers/prism-line-numbers.css")
              // Defaults to false.
              // If you wish to only show line numbers on certain code blocks,
              // leave false and use the {numberLines: true} syntax below
              showLineNumbers: false,
              // If setting this to true, the parser won't handle and highlight inline
              // code used in markdown i.e. single backtick code like `this`.
              noInlineHighlight: false,
              // This adds a new language definition to Prism or extend an already
              // existing language definition. More details on this option can be
              // found under the header "Add new language definition or extend an
              // existing language" below.
              languageExtensions: [
                {
                  language: "superscript",
                  extend: "javascript",
                  definition: {
                    superscript_types: /(SuperType)/,
                  },
                  insertBefore: {
                    function: {
                      superscript_keywords: /(superif|superelse)/,
                    },
                  },
                },
              ],
              // Customize the prompt used in shell output
              // Values below are default
              prompt: {
                user: "root",
                host: "localhost",
                global: false,
              },
              // By default the HTML entities <>&'" are escaped.
              // Add additional HTML escapes by providing a mapping
              // of HTML entities and their escape value IE: { '}': '&#123;' }
              escapeEntities: {},
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
            },
          },
          {
            resolve: `gatsby-remark-footnotes`,
            options: {
              footnoteBackRefPreviousElementDisplay: "inline",
              footnoteBackRefDisplay: "inline",
              footnoteBackRefInnerText: "^", // Defaults to: "↩"
              //use if you want the Wikipedia style ^ link without an underline beneath it
              footnoteBackRefAnchorStyle: `text-decoration: none;`,
              //use "front" for Wikipedia style ^ links
              footnoteBackRefInnerTextStartPosition: "front",
              useFootnoteMarkerText: false, // Defaults to false
              useCustomDivider: "<hr/><strong>References:</strong>" // Defaults to <hr/>
            },
          },
          //'gatsby-remark-mermaid',
          // {
          //   resolve: `gatsby-remark-double-brackets-link`,
          //   options: {
          //     titleToURLPath: `${__dirname}/src/utils/make-slug.js`,
          //     stripBrackets: true,
          //     parseWikiLinks: true,
          //   },
          // },
          {
            resolve: `gatsby-remark-wiki-links`,
            options: {
              slugify: `${__dirname}/src/utils/make-slug.js`,
              stripBrackets: true
            }
          }
        ],
      },
    },

    // {
    //   resolve: `gatsby-plugin-google-fonts`,
    //   options: {
    //     fonts: [`IBM Plex Sans:ital,wght@0,400;0,600;1,400;1,600`],
    //     display: `swap`,
    //   },
    // },

    {
      resolve: 'gatsby-plugin-local-search',
      options: {
        // A unique name for the search index. This should be descriptive of
        // what the index contains. This is required.
        name: 'notes_index',

        // Set the search engine to create the index. This is required.
        // The following engines are supported: flexsearch, lunr
        engine: 'flexsearch',

        // Provide options to the engine. This is optional and only recommended for advanced users.
        // Note: Only the flexsearch engine supports options.
        engineOptions: 'speed',

        // GraphQL query used to fetch all data for the search index. This is required.
        query: `
          {
            allMdx(filter: {
                fields: { visibility: { eq: "public" } }
              }) {
              nodes {
                id
                fields {
                  title
                  slug
                  excerpt
                }
                frontmatter {
                  tags
                }
                rawBody
                excerpt
              }
            }
          }
        `,

        // Field used as the reference value for each document. Default: 'id'.
        ref: 'id',

        // List of keys to index. The values of the keys are taken from the normalizer function below.
        // Default: all fields
        index: ['title', 'body', 'tags'],

        // List of keys to store and make available in your UI. The values of
        // the keys are taken from the normalizer function below.
        // Default: all fields
        store: ['id', 'slug', 'title', 'excerpt'],

        // Function used to map the result from the GraphQL query. This should
        // return an array of items to index in the form of flat objects
        // containing properties to index. The objects must contain the `ref`
        // field above (default: 'id'). This is required.
        normalizer: ({ data }) =>
          data.allMdx.nodes.map(node => ({
            id: node.id,
            slug: node.fields.slug,
            title: node.fields.title,
            excerpt: node.fields.excerpt ? node.fields.excerpt : node.excerpt,
            tags: node.frontmatter.tags,
            body: node.rawBody,
          })),
      },
    },
  ],
}
