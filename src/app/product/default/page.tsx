'use client'

//This tells Next.js to skip rendering this route during build or request time.
export const dynamic = 'error';

import React, { useState } from 'react'
import { Suspense } from 'react';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link'
import MenuOne from '@/components/Header/Menu/MenuOne'
import BreadcrumbProduct from '@/components/Breadcrumb/BreadcrumbProduct'
import Default from '@/components/Product/Detail/Default';
import Footer from '@/components/Footer/Footer'
import { ProductType } from '@/type/ProductType'
import productData from '@/data/Product.json'

const ProductDefault = () => {
    const searchParams = useSearchParams()
    let productId = searchParams.get('id')

    if (productId === null) {
        productId = '1'
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>

            <div id="header" className='relative w-full'>
                <MenuOne props="bg-white" />
                <BreadcrumbProduct data={productData} productPage='default' productId={productId} />
            </div>
            <Default data={productData} productId={productId} />
            <Footer />
        </Suspense>
    )
}

export default ProductDefault