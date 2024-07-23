import React from 'react'

const HeaderComponent = () => {
  return (
    <a
      href='https://www.taskforce11.de/'
      target='_blank'
      rel='noopener noreferrer'
    >
      <img
        src='/images/logo.webp'
        alt=''
        style={{
          padding: '0.5rem',
          height: 82,
          position: 'relative',
          zIndex: 2,
          aspectRatio: 1,
          cursor: 'pointer',
        }}
        fetchpriority='high'
        rel='preload'
      />
    </a>
  )
}

export default HeaderComponent
