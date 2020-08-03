import React from 'react'
import './Header.css'

export const Header = ({count}) => {
  return (
    <>
      <h1>Use Arrows to move cubes</h1>
      <h1>{count} points</h1>
    </>
  )
}
