import React from 'react'
import { Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import { startCase, camelCase } from 'lodash'
import siteConfig from '../../gatsby-config'
import Search from '../components/search'
import {
  DefaultMenuStructure,
  MenuItemPage,
  MenuItemText,
  MenuItemNote,
  MenuItemTag,
  MenuItemExternalLink,
} from '../utils/menu-structure'

export default function Header({ title, type, description }) {
  const menu = DefaultMenuStructure('header')
  const pageTitle =
    (title ? `${title}: ` : '') +
    (siteConfig.siteMetadata.title)


  // :TODO:
  // <meta content="{{ site.url }}{{ page.url }}" property="og:url"> - NOTE: site.url might NOT be there in the config file.

  return (
    <>
      <Helmet>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content={siteConfig.siteMetadata.title} property="og:site_name" />
        <meta content={title ? title : pageTitle} property="og:title" />
        {description ? (
          <meta content={description} property="og:description" />
        ) : null}

        {type === 'note' ? (
          <meta content="article" property="og:type"></meta>
        ) : (
          <meta content="website" property="og:type"></meta>
        )}

        <title>{pageTitle}</title>

        <link rel="apple-touch-icon" href="/img/favicon.png" />
        <link
          rel="icon"
          href="/img/favicon.png"
          type="image/png"
          sizes="16x16"
        />
        {/*
          These are included using gatsby-browser.js - if I include these like shown here, there is a horrible FOUC
        <link href="/css/style.css" rel="stylesheet" media="all" className="default" />
        <link href="/css/main.css" rel="stylesheet" media="all" className="default" />
        <link href="/css/custom.css" rel="stylesheet" media="all" className="default" />
        <link href="/css/Util.css" rel="stylesheet" media="all" className="default" />
        */}
      </Helmet>

      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
          <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
          <g>
            <path transform="rotate(-180 18.5 28.5)" stroke-width="4" stroke="#333333" id="svg_1" d="m3,11.08537m3.60465,-8.08537m1.44186,51c0.72093,-5.59756 12.25581,-45.71341 17.66279,-4.35366c5.40698,-17.72561 7.2093,-14.30488 8.2907,-21.14634" stroke-linejoin="round" stroke-linecap="round" fill="none"/>
          </g>
          </svg>
            <h4>{siteConfig.siteMetadata.title}</h4>
          </Link>
        </div>
        <div className="navbar-menu" id="navbar-main">
          <div className="navbar-start">
            {menu.map((item, index) => {
              return item.menu ? (
                <span key={index} className="navbar-item dropdown">
                  <Link
                    to={`/${item.item}`}
                    id={`dropdown-${item.item}`}
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {item.title ? item.title : startCase(camelCase(item.item))}
                  </Link>
                  <div
                    className="dropdown-menu"
                    aria-labelledby={`dropdown-${item.item}`}
                  >
                    {item.menu.map((subItem, subIndex) => {
                      return (
                        <MenuItem
                          className="navbar-item"
                          item={subItem}
                          key={subIndex}
                        />
                      )
                    })}
                  </div>
                </span>
              ) : (
                <MenuItem className="navbar-item" item={item} key={index} />
              )
            })}
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <Search size="small" showExcerpt={true} />
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

function MenuItem({ item, className }) {
  let itm
  if (item.type === 'page')
    itm = <MenuItemPage item={item} className={className} />
  else if (item.type === 'tag')
    itm = <MenuItemTag item={item} className={className} />
  else if (item.type === 'note')
    itm = <MenuItemNote item={item} className={className} />
  else if (item.type === 'link')
    itm = <MenuItemExternalLink item={item} className={className} />
  else if (item.type === 'text')
    itm = <MenuItemText item={item} className={className} />

  return itm
}
