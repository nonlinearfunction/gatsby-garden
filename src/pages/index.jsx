import React from 'react'
import { Link } from 'gatsby'

import Layout from '../layout/layout'
import siteConfig from '../../gatsby-config'
import TagListComponent from '../components/tag-list'
import '../styles/index.css'

export default function Home() {
  return (
    <Layout title="Home" type="home">
      <div className="column is-half">
        <div className="block">
          <h1>{siteConfig.siteMetadata.title}</h1>
          Welcome to my <Link to="https://maggieappleton.com/garden-history">digital garden</Link>: a loose
          collection of interlinked notes with no particular linear structure. These span a wide range of
          topics: from technical material, to informal concepts, to reflections on my own experiences. They are
          unapologetically connected, representing my own personal view-in-progress on how ideas might fit
          together. Disclaimers:
          <ul>
            <li>There's no attempt at completeness: notes may fail to explain relevant background (especially
              if it's something I already know well), and important concepts may be missing.</li>
            <li>Many notes are unpolished, unfinished, or redundant.</li>
            <li>Many of the ideas are bad, and these will not in general be labeled as such. Notes that
              attempt to articulate a position may not represent my current belief, or even my belief at
              the time of writing.</li>
            <li>Some information may be flat-out incorrect.</li>
          </ul>
        </div>
        <div className="block" style={{display: 'block'}}>
          <h4>Tags:</h4>
          <TagListComponent />
        </div>
      </div>
    </Layout>
  )
}
