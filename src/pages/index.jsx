import { graphql, Link } from 'gatsby'
import React from 'react'
import siteConfig from '../../gatsby-config'
import PostList from '../components/post-list'
import TagListComponent from '../components/tag-list'
import Layout from '../layout/layout'
import '../styles/index.css'




export default function Home({data}) {
  return (
    <Layout title="Home" type="home" description="Welcome to this view inside my unreliable mind.">
      <div className="column is-half">
        <div className="block">
          <h1>{siteConfig.siteMetadata.title}</h1>
          Welcome to this view inside my unreliable mind.
          Feel free to explore, or read more <Link to="/notes/about">about this site</Link>.
        </div>
        <div className="block" style={{display: 'block'}}>
          <h3>Recent Posts</h3>
          <PostList posts={data.notes.edges} />
          </div>
        <div className="block" style={{display: 'block'}}>
          <h4>Browse notes by tag:</h4>
          <TagListComponent />
        </div>
        <br/>
        <br/>

      </div>
    </Layout>
  )
}


export const query = graphql`
  query HomeQuery {
    notes: allMdx(
      filter: { fields: { 
        visibility: { eq: "public" }
        source: { eq: "posts" } 
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
            modified(formatString: "MMMM DD, YYYY")
            created(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`
