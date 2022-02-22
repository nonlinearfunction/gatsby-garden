import React from 'react'
import Header from './header'
import '../styles/tufte.css'

export default function Layout({ children, title, type }) {
  return (
    <>
      <Header title={title} type={type} />
      <section className="section">
        <div className="columns is-centered">{children}</div>
      </section>
    </>
  )
}
