import React from 'react'
import { Link } from 'gatsby'

import Layout from '../layout/layout'
import siteConfig from '../../gatsby-config'
import TagListComponent from '../components/tag-list'
import '../styles/index.css'

export default function Home() {
  return (
    <Layout title="Home" type="home" description="Welcome to this view inside my unreliable mind.">
      <div className="column is-half">
        <div className="block">
          <h1>{siteConfig.siteMetadata.title}</h1>
          Welcome to this view inside my unreliable mind.
          Feel free to explore, or read more <Link to="/notes/about">about this site</Link>.
        </div>
        <div className="block" style={{display: 'block'}}>
          <h4>Tags:</h4>
          <TagListComponent />
        </div>
      </div>
    </Layout>
  )
}
