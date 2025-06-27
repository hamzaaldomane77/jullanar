import React from 'react'
import Hero from './Components/Hero'
import About from './Components/About'
import BrandLogos from './Components/BrandLogos'
import Brands from './Components/Brands'
import BestSellers from './Components/BestSellers'
import Offers from './Components/Offers'
import Reviews from './Components/Reviews'

const Home = () => {
  return (
    <main>
      <Hero />
      <BrandLogos />
      <About />
      
      <Brands />
      <BestSellers />
      <Offers />
      <Reviews />
    </main>
  )
}

export default Home