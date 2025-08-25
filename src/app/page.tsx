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
import { Shield, Handshake, Truck } from 'lucide-react'


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
      
      {/* <WhatNewOne data={productData} start={0} limit={4} /> */}
      <Collection />
      <TabFeatures data={productData} start={0} limit={6} />
      <Banner />
      <Benefit props="md:py-20 py-10" />

      {/* Why Choose Vinimai Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Vinimai?</h2>
            <p className="text-xl text-gray-600">Built for trust, designed for individuals</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Users</h3>
              <p className="text-gray-600">All users verified through mobile OTP. Admin-approved listings ensure quality and safety.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Make Offers</h3>
              <p className="text-gray-600">Negotiate directly with sellers. Accept offers and complete secure transactions.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Returns</h3>
              <p className="text-gray-600">Fashion items: return on spot. Electronics: 2-day return window for peace of mind.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1K+</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Satisfied Users</h3>
              <p className="text-gray-600">1000+ satisfied users and counting. Join our growing community today.</p>
            </div>
          </div>
        </div>
      </section>
      {/* <Testimonial data={testimonialData} limit={6} /> */}
      {/* <Instagram /> */}
      {/* brand are small images below instagram */}
      {/* <Brand /> */}
      <Footer />
{/*       <ModalNewsletter /> */}
    </>
  )
}










// =======================


// 'use client'

// import React from 'react'
// import { useRouter } from 'next/navigation'
// import TopNavOne from '@/components/Header/TopNav/TopNavOne'
// import MenuOne from '@/components/Header/Menu/MenuOne'
// import SliderOne from '@/components/Slider/SliderOne'
// import WhatNewOne from '@/components/Home1/WhatNewOne'
// import productData from '@/data/Product.json'
// import Collection from '@/components/Home1/Collection'
// import TabFeatures from '@/components/Home1/TabFeatures'
// import Banner from '@/components/Home1/Banner'
// import Benefit from '@/components/Home1/Benefit'
// import testimonialData from '@/data/Testimonial.json'
// import Testimonial from '@/components/Home1/Testimonial'
// import Instagram from '@/components/Home1/Instagram'
// import Brand from '@/components/Home1/Brand'
// import Footer from '@/components/Footer/Footer'
// import ModalNewsletter from '@/components/Modal/ModalNewsletter'
// import TopNavThree from '@/components/Header/TopNav/TopNavThree'
// import { Shield, Handshake, Truck } from 'lucide-react'

// export default function Home() {
//   const router = useRouter()
//   const isAuthenticated = false // Replace with your auth logic (useAuth hook, session, etc.)

//   const handleStartSelling = () => {
//     if (isAuthenticated) {
//       router.push('/list-product')
//     } else {
//       router.push('/login')
//     }
//   }

//   const handleBrowseProducts = () => {
//     router.push('/browse')
//   }

//   return (
//     <>
//       {/* Top nav three is absolutely not needed and top nav one is irrelavant */}
//       {/* <TopNavThree props='style-one bg-white' slogan="New customers"/> */}
//       {/* <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" /> */}
      
//       {/* This is the navbar in homepage */}
//       <div id="header" className='relative w-full'>
//         <MenuOne props="bg-white" />
//       </div>

//       {/* Hero Section - Safe & Trusted Exchange Platform */}
//       <section className="hero-section text-white py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <h1 className="text-4xl lg:text-6xl font-bold mb-6">
//                 Safe & Trusted
//                 <span className="block">Exchange Platform</span>
//               </h1>
//               <p className="text-xl mb-8 text-blue-100">
//                 Your personal exchange where privacy meets security. Buy and sell with confidence through our protected platform.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <button 
//                   className="px-6 py-3 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-colors"
//                   onClick={handleStartSelling}
//                 >
//                   Start Selling
//                 </button>
//                 <button
//                   className="px-6 py-3 border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 font-semibold rounded-lg transition-colors"
//                   onClick={handleBrowseProducts}
//                 >
//                   Browse Products
//                 </button>
//               </div>
//             </div>
//             <div className="relative hidden lg:block">
//               <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
//                 <div className="grid grid-cols-2 gap-6 text-center">
//                   <div className="p-4">
//                     <div className="text-3xl font-bold text-white mb-2">1000+</div>
//                     <div className="text-blue-100 text-sm">Happy Users</div>
//                   </div>
//                   <div className="p-4">
//                     <div className="text-3xl font-bold text-white mb-2">50+</div>
//                     <div className="text-blue-100 text-sm">Products Sold</div>
//                   </div>
//                   <div className="p-4">
//                     <div className="text-3xl font-bold text-white mb-2">5★</div>
//                     <div className="text-blue-100 text-sm">User Rating</div>
//                   </div>
//                   <div className="p-4">
//                     <div className="text-3xl font-bold text-white mb-2">24/7</div>
//                     <div className="text-blue-100 text-sm">Support</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* This is the ad slider */}
//       {/* <div className='relative w-full'>
//         <SliderOne />
//       </div> */}
      
//       {/* <WhatNewOne data={productData} start={0} limit={4} /> */}
//       {/* <Collection /> */}
//       {/* <TabFeatures data={productData} start={0} limit={6} /> */}
      
      

//       <Benefit props="md:py-20 py-10" />

//       <Footer />
//       {/* <ModalNewsletter /> */}
//     </>
//   )
// }