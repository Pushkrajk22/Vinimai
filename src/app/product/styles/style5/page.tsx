'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopFilterCanvas from '@/components/Shop/ShopFilterCanvas'
import productData from '@/data/Product.json'
import Footer from '@/components/Footer/Footer'

export default function FilterCanvasProductFive() {
    return (
        <Suspense>
            <InnerFilterCanvasProductFive />
        </Suspense>
    )
}

function InnerFilterCanvasProductFive() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
            </div>
            <ShopFilterCanvas data={productData} productPerPage={12} dataType={type} productStyle='style-5' />
            <Footer />
        </>
    )
}
