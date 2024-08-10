import React from 'react'
import SearchBar from './SearchBar'
import StockTable from './StockTable'

function Portfolio() {
  return (
    <div className='portfolio'>
     
        <SearchBar />
        <StockTable/>

    </div>
  )
}

export default Portfolio