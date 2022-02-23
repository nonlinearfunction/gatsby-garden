import React from 'react'
import { Link, navigate } from 'gatsby'
import '../styles/note.css'
import siteConfig from '../../gatsby-config'

export default function NoteList({ notes }) {
  notes.sort((data, index) => {return data.node.fields.slug})
  return (
    <div className="block note-cards note-list">
      {notes.map((data, index) => (
        <Link to={siteConfig.siteMetadata.notesPrefix + data.node.fields.slug}>
        <div
          className="note-area box-feed"
          key={index}
          role="button"
          tabIndex={index}
          onKeyDown={event => {
            if (event.keycode === 13) navigate(siteConfig.siteMetadata.notesPrefix + data.node.fields.slug)
          }}
        >
          <h4 className="note-title">
              {data.node.fields.title}
          </h4>
          <p className="note-excerpt">
            {data.node.fields.excerpt
              ? data.node.fields.excerpt
              : data.node.excerpt}
          </p>
          <p className="note-tag-list">
            Tagged with:{' '}
            {data.node.frontmatter && data.node.frontmatter.tags
              ? data.node.frontmatter.tags.map((tag, index) => (
                  <span>#{tag}</span>
                ))
              : 'No Tags'}
          </p>
        </div>
        </Link>
      ))}
    </div>
  )
}
