// This component handles the client-side logic for extracting the productId from the search params and rendering the product details.
'use client'
import React from 'react';
import { useSearchParams } from 'next/navigation';
import BreadcrumbProduct from '@/components/Breadcrumb/BreadcrumbProduct';
import VariableProduct from '@/components/Product/Detail/VariableProduct';
import productData from '@/data/Product.json';

const ProductCombinedOneClient = () => {
    const searchParams = useSearchParams();
    let productId = searchParams.get('id');
    if (productId === null) {
        productId = '1';
    }
    return (
        <>
            {/* <VariableProduct data={productData} productId={productId} /> */}
            {/* <BreadcrumbProduct data={productData} productPage="variable" productId={productId} /> */}
        </>
    );
};

export default ProductCombinedOneClient;
