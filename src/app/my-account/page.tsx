'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { motion } from 'framer-motion'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoutes/ProtectedRoutes';
import ErrorNotification from '@/components/AlertNotifications/ErrorNotification';
import SuccessAlert from '@/components/AlertNotifications/SuccessNotification'
import { ThreeCircles } from 'react-loader-spinner'

type Order = {
    order_id: string;
    user_email: string;
    product_id: string;
    product_name: string;
    total_price: number;
    order_status: string;
    created_at: string;
};

type ImageMap = { [product_id: string]: string };

const MyAccount = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [images, setImages] = useState<ImageMap>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
            try {
                const res = await fetch('http://localhost:8000/api/orders/getMyOrders', {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': token || '',
                    },
                });
                const result = await res.json();
                const ordersData: Order[] = result.data || [];
                setOrders(ordersData);

                // Fetch product images for each order
                const imgPromises = ordersData.map(async (order: Order) => {
                    if (order.product_id) {
                        const imgRes = await fetch(`http://localhost:8000/api/products/getProductImageURL/${order.product_id}`, {
                            method: 'GET',
                            headers: { 'accept': 'application/json' },
                        });
                        const imgData = await imgRes.json();
                        console.log("returned data", { id: order.product_id, url: imgData.image_urls })
                        return { id: order.product_id, url: imgData.image_url };
                    }
                    return { id: order.product_id, url: '' };
                });
                const imgs: { id: string; url: string }[] = await Promise.all(imgPromises);
                const imgMap: ImageMap = {};
                imgs.forEach((img) => { imgMap[img.id] = img.url; });
                setImages(imgMap);
            } catch (err) {
                setOrders([]);
            }
            setLoading(false);
        };
        fetchOrders();
    }, []);

    if (loading) return     <div style={{
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
        </div>
    return (
        <ProtectedRoute>
            <div className="my-account-orders p-8">
                <h1 className="text-2xl font-bold mb-6">My Orders</h1>
                {loading ? (
                    <div>Loading...</div>
                ) : orders.length === 0 ? (
                    <div>No orders found.</div>
                ) : (
                    <div className="order-list grid gap-4">
                        {orders.map((order: Order) => (
                            <Link href={`/my-account/my-orders/${order.order_id}`} key={order.order_id} className="block">
                                <div className="order-row flex items-center bg-white shadow rounded-lg p-4 hover:bg-blue-50 cursor-pointer">
                                    <img
                                        src={images[order.product_id] || '/images/product-placeholder.png'}
                                        alt={order.product_name}
                                        className="w-20 h-30 object-cover rounded mr-4"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold text-lg">{order.product_name}</div>
                                        <div className="text-gray-500">Order ID: {order.order_id}</div>
                                        <div className="text-gray-500">Status: {order.order_status}</div>
                                        <div className="text-gray-500">Ordered On: {new Date(order.created_at).toLocaleString()}</div>
                                    </div>
                                    <div className="font-bold text-xl text-green-600">₹{order.total_price}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </ProtectedRoute>

    )
}

export default MyAccount