'use client'

//added later to make as client component because of the use of useSearchParams
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopFilterOptions from '@/components/Shop/ShopFilterOptions'
import productData from '@/data/Product.json'
import Footer from '@/components/Footer/Footer'
import { ThreeCircles } from 'react-loader-spinner';

export default function FilterOptions() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const apiUrl = "http://localhost:8000/api/products/getAllProducts"

        axios.get(apiUrl)
            .then(response => {
                // Assuming your API returns { products: [...] }
                const apiData = response.data.products

                // Transform API data to expected component format
                const transformedData = apiData.map((product: any) => ({
                id: product.product_id,
                name: product.name,
                description: product.description,
                price: product.discounted_price,
                originPrice: product.original_price,
                category: product.category.toLowerCase(),
                type: product.category.toLowerCase(),  // adjust mapping as needed
                gender: 'unisex',                     // default or map if available
                sale: product.discounted_price < product.original_price,
                rate: 0,
                brand: 'unknown',                    // change if you have brand info
                sold: 0,
                quantity: 0,
                quantityPurchase: 0,
                sizes: product.size ? [product.size] : [],
                variation: [],
                thumbImage: product.image_urls,
                images: product.image_urls,
                action: '',
                slug: '',
                new: false,
                }))

                setData(transformedData)
                setLoading(false)
                console.log("Transformed Data:", transformedData)
            })
            .catch(err => {
                setError('Failed to load products')
                setLoading(false)
            })
        }, [type, category]) // re-fetch if type or category changes

    return (
        <>
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
            </div>
            {loading && <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100vh',
                    }}>
                      <ThreeCircles
                        visible={true}
                        height="100"
                        width="100"
                        color="#4fa94d"
                        ariaLabel="three-circles-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                      />
                    </div>}
            {error && <div className="text-red-600">{error}</div>}
            {/* <ShopFilterOptions data={productData} productPerPage={12} /> */}
            {!loading && !error && <ShopFilterOptions data={data} productPerPage={12} />}            
            <Footer />
        </>
    )
}
