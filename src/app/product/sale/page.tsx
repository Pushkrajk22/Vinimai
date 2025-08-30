'use client'

export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne';
import MenuOne from '@/components/Header/Menu/MenuOne';
import BreadcrumbProduct from '@/components/Breadcrumb/BreadcrumbProduct';
import Sale from '@/components/Product/Detail/Sale';
import Footer from '@/components/Footer/Footer';
import productData from '@/data/Product.json';

// ✅ This is the component that uses useSearchParams()
const ProductSaleInner = () => {
    const searchParams = useSearchParams();
    const productId = searchParams.get('id') ?? '1';

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className="relative w-full">
                <MenuOne props="bg-white" />
                {/* <BreadcrumbProduct data={productData} productPage="sale" productId={productId} /> */}
            </div>
            {/* <Sale data={productData} productId={productId} /> */}
            <Footer />
        </>
    );
};

// ✅ Suspense boundary wraps only the component using useSearchParams
const ProductSale = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <ProductSaleInner />
    </Suspense>
);

export default ProductSale;
