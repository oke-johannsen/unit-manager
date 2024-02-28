import React from 'react'

const HeaderComponent = () => {
  return (
    <>
      <img
        src='/images/logo.webp'
        alt=''
        style={{
          padding: '0.5rem',
          height: 82,
          position: 'relative',
          zIndex: 2,
          aspectRatio: 1,
        }}
        fetchpriority='high'
        rel='preload'
      />
    </>
  )
}

export default HeaderComponent
