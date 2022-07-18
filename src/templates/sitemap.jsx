import { graphql } from 'gatsby'
import React from 'react'
import NoteList from '../components/note-list'
import Pager from '../components/pager'
import Layout from '../layout/layout'

export default function Sitemap({ pageContext, data }) {
  return (
    <Layout title="All Notes">
      <div className="column is-half">
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
      filter: { fields: { 
        visibility: { eq: "public" }
        source: { eq: "notes" } 
      } }
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
            intended_url_path
          }
          frontmatter {
            tags
          }
        }
      }
    }
  }
`
