import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { useFlexSearch } from 'react-use-flexsearch'
import siteConfig from '../../gatsby-config'
import '../styles/search.css'


const SearchResults = ({showExcerpt, query, index, store, onClick}) => {
  const results = useFlexSearch(query, index, store);
  const resultsCode = (<div><ul>
        {results.map(result => (
          <Link to={siteConfig.siteMetadata.notesPrefix + result.slug} onClick={onClick}>
              <li key={siteConfig.siteMetadata.notesPrefix + result.slug}>
                {result.title}
                {showExcerpt ? <p>{result.excerpt}</p> : null}
              </li>
          </Link>
            ))
        }
        </ul></div>)
  const noResultsCode = (<div>No results for "{query}".</div>)
  return results.length > 0 ? resultsCode : noResultsCode
}

export default function Search({ showExcerpt, size }) {
  // Needed for search functionality
  const urls = useStaticQuery(graphql`
    {
      localSearchNotesIndex {
        publicIndexURL
        publicStoreURL
      }
    }
  `)

  const [query, setQuery] = React.useState('')
  const [index, setIndex] = React.useState(null)
  const [store, setStore] = React.useState(null)

  // Load index asynchronously.
  React.useEffect(() => {
    async function fetchData() {
      const queries = await Promise.all([
        fetch(urls.localSearchNotesIndex.publicIndexURL),
        fetch(urls.localSearchNotesIndex.publicStoreURL),
      ]);
      setIndex(await queries[0].text());
      setStore(await queries[1].json());
    }
    fetchData();
  }, [urls])

  let inputClassName = 'input is-small'
  if (size === 'medium') {
    inputClassName = 'input is-medium'
  }

  return (
    <form className="search-form">
      <input
        className={inputClassName}
        type="text"
        placeholder="Search..."
        aria-label="Search..."
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      { query ? (
    <div className="search-result">
      {store && index ? (
        <SearchResults
          showExcerpt={showExcerpt}
          query={query}
          index={index}
          store={store}
          onClick={() => setQuery('')}/>
      ): (<div>Loading search index...</div>)}
      <button
        className="close-search button-link"
        onClick={() => setQuery('')}
      >
        Close
      </button>
    </div>) : null}
    </form>
  )
}