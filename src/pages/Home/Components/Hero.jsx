import React from 'react';
import Homepage from '../../../assets/homepage.jpg';



export default function Hero() {
  return (
    <div className="">
    {/* Hero Section */}
    <div className="relative h-[600px] md:h-[800px]">
      <img
        src={Homepage}
        alt="Homepage Background"
        className="absolute inset-0 w-full h-full "
      />
     
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

    
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4  pt-9">
        <h1 className="text-5xl md:text-7xl font-bold mb-8">
          مرحباً بكم في جُلّنار
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl">
          نقدم لكم أفضل الخدمات والمنتجات بجودة عالية
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <button className="bg-white text-blue-900 hover:bg-blue-100 px-12 py-4 rounded-lg font-bold text-xl transition-all duration-300 transform hover:scale-105">
          اكتشف أكثر
          </button>
          <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-12 py-4 rounded-lg font-bold text-xl transition-all duration-300 transform hover:scale-105">
          المزيد
          </button>
        </div>
      </div>
    </div>

  
  </div>
  )
}
