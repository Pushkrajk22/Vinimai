'use client'

//This tells Next.js to skip rendering this route during build or request time.
export const dynamic = 'error';


//added later to make as client component because of the use of useSearchParams
//export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import React from 'react'
import { useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import BreadcrumbProduct from '@/components/Breadcrumb/BreadcrumbProduct'
import OutOfStock from '@/components/Product/Detail/OutOfStock';
import Footer from '@/components/Footer/Footer'
import productData from '@/data/Product.json'

const ProductOutOfStock = () => {
    const searchParams = useSearchParams()
    let productId = searchParams.get('id')

    if (productId === null) {
        productId = '1'
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>

            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-white" />
                {/* <BreadcrumbProduct data={productData} productPage='out-of-stock' productId={productId} /> */}
            </div>
            {/* <OutOfStock data={productData} productId={productId} /> */}
            <Footer />
        </Suspense>
    )
}

export default ProductOutOfStock