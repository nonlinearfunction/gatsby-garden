import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import "katex/dist/katex.min.css"
import React from 'react'
import Layout from '../layout/layout'
import '../styles/graph.css'
import '../styles/post.css'


export default function Post({ pageContext, data }) {
  const post = data.mdx
  return (
    <Layout title={post.fields.title} type="post" description={post.excerpt}>
      <div className="column is-two-thirds">
        <main>
          <div className="post-area post-page-section">
            <h1 className="post-title">{post.fields.title}</h1>
            <div className="post-dates">
              <span className='post-dates-label'>Posted</span> {post.frontmatter.created}
              { post.frontmatter.created === post.frontmatter.modified ? null : (
                <span> (modified {post.frontmatter.modified})</span>
              )}
            </div>            
            <div className="post-content">
              <MDXRenderer>{post.body}</MDXRenderer>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      excerpt(pruneLength: 280)
      fields {
        title
      }
      frontmatter {
        tags
        source
        modified(formatString: "MMMM DD, YYYY")
        created(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
