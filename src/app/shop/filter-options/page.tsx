'use client'

//added later to make as client component because of the use of useSearchParams
export const dynamic = 'force-dynamic';

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopFilterOptions from '@/components/Shop/ShopFilterOptions'
import productData from '@/data/Product.json'
import Footer from '@/components/Footer/Footer'

export default function FilterOptions() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    return (
        <>
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
            </div>
            <ShopFilterOptions data={productData} productPerPage={12} />
            <Footer />
        </>
    )
}
