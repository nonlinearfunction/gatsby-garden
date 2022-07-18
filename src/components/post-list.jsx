import { Link, navigate } from 'gatsby'
import React from 'react'
import siteConfig from '../../gatsby-config'
import '../styles/post.css'

export default function PostList({ posts }) {
  posts.sort((data, index) => {return data.node.fields.slug})
  return (
    <div className="block post-cards post-list">
      {posts.map((data, index) => (
        <Link to={data.node.fields.intended_url_path}>
        <div
          className="post-area box-feed"
          key={index}
          role="button"
          tabIndex={index}
          onKeyDown={event => {
            if (event.keycode === 13) navigate(siteConfig.siteMetadata.postsPrefix + data.node.fields.slug)
          }}
        >
          <h4 className="post-title">
              {data.node.fields.title}
          </h4>
          <span className='post-dates-label'>Posted</span> {data.node.frontmatter.created}
          <p className="post-excerpt">
            {data.node.fields.excerpt
              ? data.node.fields.excerpt
              : data.node.excerpt}
          </p>
          
        </div>
        </Link>
      ))}
    </div>
  )
}
