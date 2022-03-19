import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../layout/layout'
import NoteList from '../components/note-list'
import Pager from '../components/pager'

export default function Sitemap({ pageContext, data }) {
  return (
    <Layout>
      <div className="column is-one-third">
        <h1>All Notes</h1>

        <NoteList notes={data.notes.edges} />

        <Pager context={pageContext} />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($skip: Int!, $limit: Int!) {
    notes: allMdx(
      skip: $skip
      limit: $limit
      filter: { fields: { visibility: { eq: "public" } } }
      sort: { fields: [slug] , order: ASC }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
            title
            date
            excerpt
          }
          frontmatter {
            tags
          }
        }
      }
    }
  }
`
