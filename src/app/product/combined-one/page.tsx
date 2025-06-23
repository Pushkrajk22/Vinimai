import React, { Suspense } from 'react';
import TopNavOne from '@/components/Header/TopNav/TopNavOne';
import MenuOne from '@/components/Header/Menu/MenuOne';
import Footer from '@/components/Footer/Footer';
import ProductCombinedOneClient from './ProductCombinedOneClient';

const ProductCombinedOne = () => {
    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-white" />
                <Suspense fallback={<div>Loading...</div>}>
                    <ProductCombinedOneClient />
                </Suspense>
            </div>
            <Footer />
        </>
    );
};

export default ProductCombinedOne;