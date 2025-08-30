// 'use client'

// //This tells Next.js to skip rendering this route during build or request time.
// export const dynamic = 'error';

// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { Suspense } from 'react'

// import { useSearchParams } from 'next/navigation';
// import Link from 'next/link'
// import MenuOne from '@/components/Header/Menu/MenuOne'
// import BreadcrumbProduct from '@/components/Breadcrumb/BreadcrumbProduct'
// import Default from '@/components/Product/Detail/Default';
// import Footer from '@/components/Footer/Footer'
// import { ProductType } from '@/type/ProductType'
// import productData from '@/data/Product.json'
// import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

// const ProductDefault = () => {
//     const searchParams = useSearchParams()
//     const [product, setProduct] = useState<ProductType | null>(null)
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState<string | null>(null)
//     let productId = searchParams.get('id')|| '1'

//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 const response = await axios.get(
//                     `http://localhost:8000/api/products/getProduct/${productId}`,
//                     {
//                         headers: {
//                             Accept: 'application/json',
//                         },
//                     }
//                 )
//                 // Transform API data to match ProductType interface
//                 const apiProduct = response.data
//                 const transformedProduct: ProductType = {
//                     id: apiProduct.product_id || apiProduct.id,
//                     name: apiProduct.name,
//                     description: apiProduct.description,
//                     price: apiProduct.discounted_price,
//                     originPrice: apiProduct.original_price,
//                     category: apiProduct.category?.toLowerCase() || 'general',
//                     type: apiProduct.category?.toLowerCase() || 'general',
//                     gender: 'unisex',
//                     sale: apiProduct.discounted_price < apiProduct.original_price,
//                     rate: 0,
//                     brand: apiProduct.brand || 'unknown',
//                     sold: 0,
//                     quantity: apiProduct.quantity || 0,
//                     quantityPurchase: 0,
//                     sizes: apiProduct.size ? [apiProduct.size] : [],
//                     variation: [],
//                     thumbImage: apiProduct.image_urls || [],
//                     images: apiProduct.image_urls || [],
//                     action: 'add to cart',
//                     slug: apiProduct.slug || '',
//                     new: false,
//                 }
//                 setProduct(response.data)
//             } catch (err: any) {
//                 console.error(err)
//                 setError('Failed to fetch product')
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchProduct()
//     }, [productId])



//     return (
//         <Suspense fallback={<div>Loading...</div>}>

//             <div id="header" className='relative w-full'>
//                 <MenuOne props="bg-white" />
//                 <BreadcrumbProduct data={productData} productPage='default' productId={productId} />
//                 {/* <Breadcrumb heading='Product' subHeading={productId} /> */}

//             </div>
//             {/* <Default data={productData} productId={productId} /> */}
//             {/* <Default data={product} productId={productId} /> */}
//             <Default data={product ? [product] : []} productId={productId} />
//             <Footer />
//         </Suspense>
//     )
// }

// export default ProductDefault



'use client'

export const dynamic = 'error';

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation';
import MenuOne from '@/components/Header/Menu/MenuOne'
import BreadcrumbProduct from '@/components/Breadcrumb/BreadcrumbProduct'
import Default from '@/components/Product/Detail/Default';
import Footer from '@/components/Footer/Footer'
import { ProductType } from '@/type/ProductType'
// Remove this import - we don't need static data
// import productData from '@/data/Product.json'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

const ProductDefault = () => {
    const searchParams = useSearchParams()
    const [product, setProduct] = useState<ProductType | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    let productId = searchParams.get('id') || '1'

    // 
    
    useEffect(() => {
    const fetchProduct = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/products/getProduct/${productId}`,
                {
                    headers: {
                        Accept: 'application/json',
                    },
                }
            )

            const apiProduct = response.data.product;

            const transformedProduct: ProductType = {
                id: apiProduct.product_id,
                name: apiProduct.name,
                description: apiProduct.description,
                price: apiProduct.discounted_price,
                originPrice: apiProduct.original_price,
                category: apiProduct.category?.toLowerCase() || 'general',
                type: apiProduct.category?.toLowerCase() || 'general',
                gender: 'unisex',
                sale: apiProduct.discounted_price < apiProduct.original_price,
                rate: 0,
                brand: 'unknown',
                sold: 0,
                quantity: 0,
                quantityPurchase: 0,
                sizes: apiProduct.size ? [apiProduct.size] : [],
                variation: [],
                thumbImage: apiProduct.image_urls || [],
                images: apiProduct.image_urls || [],
                action: 'add to cart',
                slug: '',
                new: false,
                isVinimaiVerified: false // Default value, adjust as needed
            }

            setProduct(transformedProduct)
            console.log("Transformed Product:", transformedProduct)
        } catch (err: any) {
            console.error(err)
            setError('Failed to fetch product')
        } finally {
            setLoading(false)
        }
    }

    fetchProduct()
}, [productId])


    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-white" />
                {/* Only render when product is loaded */}
                {product && (
                    <BreadcrumbProduct data={[product]} productPage='default' productId={productId} />
                )}
            </div>
            {/* Only render when product is loaded */}
            {product && (
                <Default data={[product]} productId={productId} />
            )}
            <Footer />
        </Suspense>
    )
}

export default ProductDefault