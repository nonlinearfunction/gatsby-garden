import { graphql } from 'gatsby'
import React from 'react'
import Pager from '../components/pager'
import PostList from '../components/post-list'
import Layout from '../layout/layout'

export default function Sitemap({ pageContext, data }) {
  return (
    <Layout title="All Posts">
      <div className="column is-half">
        <h1>All Posts</h1>

        <PostList posts={data.posts.edges} />

        <Pager context={pageContext} />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($skip: Int!, $limit: Int!) {
    posts: allMdx(
      skip: $skip
      limit: $limit
      filter: { fields: { 
        visibility: { eq: "public" }
        source: { eq: "posts" } 
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
