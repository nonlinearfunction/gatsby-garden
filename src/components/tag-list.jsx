import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import kebabCase from 'lodash/kebabCase'
import '../styles/tag-list.css'

export default function TagListComponent() {
    const data = useStaticQuery(graphql`
        query TagQuery {
            allMdx(limit: 2000) {
                group(field: frontmatter___tags) {
                    fieldValue
                    totalCount
                }
            }
        }
    `)
    let tags = data.allMdx.group
    tags.sort((a, b) => {
      return b.totalCount - a.totalCount
    })
  
    return (
        <div>
          <ul>
            {tags.map(tag => (
              <li key={tag.fieldValue} className="tag-name">
                <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
                  {tag.fieldValue} <span className="badge">{tag.totalCount}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
    )
  }
  
