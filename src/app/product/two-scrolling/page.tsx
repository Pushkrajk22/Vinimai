'use client'
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import BreadcrumbProduct from '@/components/Breadcrumb/BreadcrumbProduct'
import CountdownTimer from '@/components/Product/Detail/CountdownTimer';
import Footer from '@/components/Footer/Footer'
import productData from '@/data/Product.json'

const ProductTwoScrollingContent = () => {
    const searchParams = useSearchParams()
    let productId = searchParams.get('id')

    if (productId === null) {
        productId = '1'
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-white" />
                <BreadcrumbProduct data={productData} productPage='countdown-timer' productId={productId} />
            </div>
            <CountdownTimer data={productData} productId={productId} />
            <Footer />
        </>
    )
}

const ProductTwoScrolling = () => {
    return (
        <Suspense>
            <ProductTwoScrollingContent />
        </Suspense>
    )
}

export default ProductTwoScrolling