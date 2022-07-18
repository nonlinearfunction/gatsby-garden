module.exports = {
  pathPrefix: `/`, // If your Digital Garden is not published at the root of your website, use this.
  trailingSlash: `never`,
  siteMetadata: {
    title: `Nonlinear Function`,
    description: `A Digital Garden Tended by Gatsby`,

    siteUrl: `https://nonlinearfunction.org/`, // URL at which your site will be published. This should be present if you want RSS feed.
    notesPrefix: `/notes`,
    postsPrefix: `/posts`,
    headerMenu: [ // Top Navbar items
       {type: 'note', item: 'about', title: 'About'}, // Type can be 'page', 'note', 'tag', or 'link'
       {type: 'page', item: 'all', title: 'All Notes'},
       {type: 'page', item: 'tags', title: 'Tags'},
     ],
  },
  plugins: [
    //{
    //  resolve: "gatsby-plugin-webpack-bundle-analyser-v2",
    //  options: {
    //    devMode: true,
    //  },
    //},
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-preact`,
    `gatsby-remark-images`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `notes`,
        path: `${__dirname}/_notes/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/_posts/`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        remarkPlugins: [
          [require('remark-footnotes'), {inlineNotes: true}],
          require("remark-math"),
          // Don't interpret indented lists as code bocks.
          [require("remark-disable-tokenizers"),
           {block: ['indentedCode']}],
        ],
        rehypePlugins: [require("rehype-katex")],
        gatsbyRemarkPlugins: [
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
            resolve: `gatsby-remark-autolink-headers`,
            options: {},
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
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
          },
          `gatsby-remark-tufte`,
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
      resolve: "gatsby-plugin-sitemap",
      options: {
        output: '/',
        query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }
          allSitePage {
            nodes {
              path
            }
          }
          allMdx(filter: {
            fields: { visibility: { eq: "public" } }
          }) {
            nodes {
              fields {
                slug
                source
                intended_url_path
              }
              frontmatter {
                modified
              }
            }
          }
        }`,
        resolvePages: ({
          allSitePage: { nodes: allPages },
          allMdx: { nodes: allPosts },
        }) => {
          const pathToDateMap = {};
          allPosts.map(post => {
            pathToDateMap[post.fields.intended_url_path] = post.frontmatter.modified;
          });
      
          const pages = allPages.map(page => {
            return { ...page, ...{date : pathToDateMap[page.path]} };
          });

          return pages;
        },
        serialize: ({ path, date }) => {
          let entry = {
            url: path,
          };

          if (date) {
            entry.lastmod = date;
          }
      
          return entry;
        }
      },
    },
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
        // engineOptions: 'default',

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
                  intended_url_path
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
        store: ['id', 'slug', 'url_path', 'title', 'excerpt'],

        // Function used to map the result from the GraphQL query. This should
        // return an array of items to index in the form of flat objects
        // containing properties to index. The objects must contain the `ref`
        // field above (default: 'id'). This is required.
        normalizer: ({ data }) =>
          data.allMdx.nodes.map(node => ({
            id: node.id,
            slug: node.fields.slug,
            url_path: node.fields.intended_url_path,
            title: node.fields.title,
            excerpt: node.fields.excerpt ? node.fields.excerpt : node.excerpt,
            tags: node.frontmatter.tags,
            body: node.rawBody,
          })),
      },
    },
    // Add after these plugins if used
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true, // Print removed selectors and processed file names
        develop: true, // Enable while using `gatsby develop`
        // tailwind: true, // Enable tailwindcss support
        ignore: ['tufte.css', 'katex.min.css'], // Ignore files/folders
        // purgeOnly : ['components/', '/main.css', 'bootstrap/'], // Purge only these files/folders
        purgeCSSOptions: {
          // https://purgecss.com/configuration.html#options
          // safelist: ['safelist'], // Don't remove this selector
        },
        // More options defined here https://purgecss.com/configuration.html#options
      },
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      //options: {
      // Setting a color is optional.
      //  color: `tomato`,
      // Disable the loading spinner.
      //  showSpinner: false,
      //},
    },
  ],
}
