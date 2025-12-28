import { graphql } from 'gatsby'
import React from 'react'
import PostList from '../components/post-list'
import Layout from '../layout/layout'

export default function DraftPosts({ data }) {
  return (
    <Layout title="Draft Posts">
      <div className="column is-half">
        <h1>Draft Posts</h1>
        <p><em>These posts are drafts and not visible on public pages.</em></p>

        <PostList posts={data.posts.edges} />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    posts: allMdx(
      filter: { fields: {
        source: { eq: "posts" }
        isDraft: { eq: true }
      } }
      sort: { fields: [frontmatter___created, slug], order: DESC }
    ) {
      edges {
        node {
          excerpt(pruneLength: 500)
          fields {
            slug
            title
            date
            excerpt
            intended_url_path
          }
          frontmatter {
            tags
            modified(formatString: "MMMM DD, YYYY")
            created(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`
