import React from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import SliderOne from '@/components/Slider/SliderOne'
import WhatNewOne from '@/components/Home1/WhatNewOne'
import productData from '@/data/Product.json'
import Collection from '@/components/Home1/Collection'
import TabFeatures from '@/components/Home1/TabFeatures'
import Banner from '@/components/Home1/Banner'
import Benefit from '@/components/Home1/Benefit'
import testimonialData from '@/data/Testimonial.json'
import Testimonial from '@/components/Home1/Testimonial'
import Instagram from '@/components/Home1/Instagram'
import Brand from '@/components/Home1/Brand'
import Footer from '@/components/Footer/Footer'
import ModalNewsletter from '@/components/Modal/ModalNewsletter'
import TopNavThree from '@/components/Header/TopNav/TopNavThree'


export default function Home() {
  return (
    <>
      {/* Top nav three is absolutely not needed and top nav one is irrelavant */}
      {/* <TopNavThree props='style-one bg-white' slogan="New customers"/> */}
      {/* <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" /> */}
      {/* This is the navbar in homepage */}
      <div id="header" className='relative w-full'>
        <MenuOne props="bg-white" />
      </div>
      {/* This is the ad slider */}
      <div className='relative w-full'>
        <SliderOne />
      </div>
      
      <WhatNewOne data={productData} start={0} limit={4} />
      <Collection />
      <TabFeatures data={productData} start={0} limit={6} />
      <Banner />
      <Benefit props="md:py-20 py-10" />
      <Testimonial data={testimonialData} limit={6} />
      <Instagram />
      {/* brand are small images below instagram */}
      <Brand />
      <Footer />
{/*       <ModalNewsletter /> */}
    </>
  )
}
