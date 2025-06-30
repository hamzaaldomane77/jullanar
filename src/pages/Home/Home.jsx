import React from 'react'
import Hero from './Components/Hero'
import About from './Components/About'

import Brands from './Components/Brands'
import BestSellers from './Components/BestSellers'
import Offers from './Components/Offers'


const Home = () => {
  return (
    <main>
      <Hero />
      
      <About />
      
      <Brands />
      <BestSellers />
      <Offers />
    
    </main>
  )
}

export default Home