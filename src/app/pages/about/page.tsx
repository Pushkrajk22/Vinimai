'use client'
import React from 'react'
import Image from 'next/image';
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Benefit from '@/components/Home1/Benefit'
import Newsletter from '@/components/Home4/Newsletter'
import Instagram from '@/components/Home6/Instagram'
import Brand from '@/components/Home1/Brand'
import Footer from '@/components/Footer/Footer'

const AboutUs = () => {
    return (
        <>
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='About Us' subHeading='About Us' />
            </div>
            <div className='about md:pt-20 pt-10'>
                <div className="about-us-block">
                    <div className="container">
                        <div className="text flex items-center justify-center">
                            <div className="content md:w-5/6 w-full">
                                <div className="heading3 text-center">Welcome to Vinimai, where fashion is fun, affordable, and sustainable!</div>
                                <div className="body1 text-center md:mt-7 mt-5">Why buy once when you can rent, resell, and refresh your style anytime you like Want to clear out your closet? Sell your gently used fashion items in minutes. Need a show-stopping outfit for a night? Rent it at a fraction of the price. Or simply shop from our latest collections to upgrade your wardrobe with ease.
 
We believe shopping should be smart, exciting, and guilt-free. That’s why we created a space where fashion lovers can save money, reduce waste, and stay on-trend without compromise. Join us in reimagining the way of shopping. Your next favorite outfit is just a click away!.</div>
                            </div>
                        </div>
                        <div className="list-img grid sm:grid-cols-3 gap-[30px] md:pt-20 pt-10">
                            <div className="bg-img">
                                <Image
                                    
                                    src={'https://raw.githubusercontent.com/vinimai1/VinimaiImages/refs/heads/main/aboutus/about-us1.jpg'}
                                    width={2000}
                                    height={3000}
                                    alt='bg-img'
                                    className='w-full rounded-[30px]'
                                />
                            </div>
                            <div className="bg-img">
                                <Image
                                    
                                    src={'https://raw.githubusercontent.com/vinimai1/VinimaiImages/refs/heads/main/about-us2.jpg'}
                                    width={2000}
                                    height={3000}
                                    alt='bg-img'
                                    className='w-full rounded-[30px]'
                                />
                            </div>
                            <div className="bg-img">
                                <Image
                                    src={'https://raw.githubusercontent.com/vinimai1/VinimaiImages/refs/heads/main/about-us3.jpg'}
                                    width={2000}
                                    height={3000}
                                    alt='bg-img'
                                    className='w-full rounded-[30px]'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Benefit props="md:pt-20 pt-10" />
            {/* <Newsletter props="bg-green md:mt-20 mt-10" /> */}
            {/* <Instagram /> */}
            <Brand />
            <Footer />
        </>
    )
}

export default AboutUs
