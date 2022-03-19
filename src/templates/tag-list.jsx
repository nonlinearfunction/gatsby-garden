import React from 'react'
import Layout from '../layout/layout'
import TagListComponent from '../components/tag-list'

export default function TagList() {

  return (
    <Layout title="All Tags" type="tag">
      <div className="column is-one-third">
          <h1>All Tags</h1>
          <TagListComponent></TagListComponent>
      </div>
    </Layout>
  )
}


