import React from 'react'
import Header from './header'
import '../styles/tufte.css'

export default function Layout({ children, title, type, description }) {
  return (
    <>
      <Header title={title} type={type} description={description}/>
      <section className="section">
        <div className="columns is-centered">{children}</div>
      </section>
    </>
  )
}
