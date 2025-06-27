import React from "react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import "./BrandLogos.css"

// Import brand logos
import chanelLogo from "../../../assets/chanel 1.png"
import lvLogo1 from "../../../assets/lv 1.png"
import lvLogo2 from "../../../assets/images 1.png"
import pumaLogo from "../../../assets/puma 2.png"
import nikeLogo from "../../../assets/png-clipart-swoosh-nike-logo-brand-top-nike-emblem-company 1.png"

const BrandLogos = () => {
  // Brand logo data
  const brandLogos = [
    { src: chanelLogo, alt: "Chanel" },
    { src: lvLogo1, alt: "Louis Vuitton 1" },
    { src: lvLogo2, alt: "Louis Vuitton 2" },
    { src: pumaLogo, alt: "Puma" },
    { src: nikeLogo, alt: "Nike" },
  ]

  return (
    <div className="brand-logos-container pt-4">

      
      <div className="brand-logos-content">
       
   
        <Swiper
          modules={[Autoplay, FreeMode]}
          spaceBetween={15}
          slidesPerView={3}
          loop={true}
          freeMode={{
            enabled: true,
            sticky: false,
            momentum: true,
            momentumRatio: 0.4,
            momentumVelocityRatio: 0.7,
          }}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            reverseDirection: false,
          }}
          speed={600}
          grabCursor={true}
          centeredSlides={true}
          breakpoints={{
            768: {
              slidesPerView: 5,
              spaceBetween: 30,
              centeredSlides: false,
              freeMode: {
                enabled: false
              }
            }
          }}
          className="brand-logos-swiper"
        >
          {[...brandLogos, ...brandLogos].map((logo, index) => (
            <SwiperSlide key={index}>
              <div className="brand-logo">
                <img src={logo.src} alt={logo.alt} loading="lazy" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default BrandLogos
