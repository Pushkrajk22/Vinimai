'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { motion } from 'framer-motion'
import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoutes/ProtectedRoutes';
import ErrorNotification from '@/components/AlertNotifications/ErrorNotification';
import SuccessAlert from '@/components/AlertNotifications/SuccessNotification'
import { ThreeCircles } from 'react-loader-spinner'


type UserDetails = {
  name: string;
  email: string;
  phone: string;
};


const MyAccount = () => {
    const router = useRouter();
    const [user, setUser] = useState<UserDetails | null>(null);
    const [activeTab, setActiveTab] = useState<string | undefined>('dashboard') //dashboard
    const [activeOrders, setActiveOrders] = useState<string | undefined>('all')
    const [openDetail, setOpenDetail] = useState<boolean | undefined>(false)

    const [error, setError] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [success, setSuccess] = useState("");
    //ORDER RELATED VARIABLES
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);


    
    useEffect(() => {
        const fetchOrders = async () => {
            // const token = localStorage.getItem('auth_token');
            // if (!token) return setError('Auth token not found'), setLoading(false);

            try {
                const res = await axios.get('http://localhost:8000/api/orders/getMyOrders', {
                headers: {
                    Authorization: token || localStorage.getItem('token'),
                    Accept: 'application/json',
                },
                });
                setOrders(res.data.data || []);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch orders');
            } finally {
                setLoading(false);
                setError("")
            }
            };

            fetchOrders();
        }, 
    []);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken)

        }, []);

    useEffect(() => {
        if (!token) return;

        fetch("http://localhost:8000/api/profile/getUserDetails", {
            method: "GET",
            headers: {
            Authorization: token,
            Accept: "application/json",
            },
        })
            .then((res) => res.json())
            .then((data: UserDetails) => setUser(data))
            .catch((err) => console.error("Failed to fetch user details", err));
        }, [token]);





    


    const handleActiveOrders = (order: string) => {
        setActiveOrders(order)
    }

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
            <div className="profile-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col w-full">

                        
                        <div className="right md:w-2/3 w-full pl-2.5">
                            <div className={`tab text-content w-full ${activeTab === 'dashboard' ? 'block' : 'hidden'}`}>
                                {/* <div className="overview grid sm:grid-cols-3 gap-5">
                                    <div className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="counter">
                                            <span className="text-secondary">Awaiting Pickup</span>
                                            <h5 className="heading5 mt-1">4</h5>
                                        </div>
                                        <Icon.HourglassMedium className='text-4xl' />
                                    </div>
                                    <div className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="counter">
                                            <span className="text-secondary">Cancelled Orders</span>
                                            <h5 className="heading5 mt-1">12</h5>
                                        </div>
                                        <Icon.ReceiptX className='text-4xl' />
                                    </div>
                                    <div className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="counter">
                                            <span className="text-secondary">Total Number of Orders</span>
                                            <h5 className="heading5 mt-1">200</h5>
                                        </div>
                                        <Icon.Package className='text-4xl' />
                                    </div>
                                </div> */}
                                <div className="recent_order pt-5 px-5 pb-2 mt-7 border border-line rounded-xl">
                                    <h6 className="heading6">Recent Orders</h6>
                                    <div className="list overflow-x-auto w-full mt-5">
                                        <table className="w-full max-[1400px]:w-[700px] max-md:w-[700px] border-collapse">
                                            <thead className="border-b border-line">
                                                <tr>
                                                    <th scope="col" className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">Products</th>
                                                    <th scope="col" className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">Price</th>
                                                    <th scope="col" className="pb-3 text-centre text-sm font-bold uppercase text-secondary whitespace-nowrap">Status</th>
                                                    <th scope="col" className="pb-3 text-centre text-sm font-bold uppercase text-secondary whitespace-nowrap">Ordered On</th>
                                                    <th scope="col" className="pb-3 text-centre text-sm font-bold uppercase text-secondary whitespace-nowrap">Order ID</th>
                                                </tr>
                                            </thead>
                                                  {/* Show error message */}
                                            {orders.length===0 && (
                                                <div className="text-red-500 text-left font-medium mb-4">
                                                    No orders found.
                                                </div>
                                            )}
                                            <tbody>
                                                {orders.map((order: any) => (
                                                    <tr  key={order.order_id} className="item duration-300 border-b border-line">
                                                        <td className="py-4">
                                                            <Link href={'/product/default'} className="product flex items-center gap-5">
                                                                <Image src={'/images/product/1000x1000.png'} width={400} height={400} alt='Contrasting sweatshirt' className="flex-shrink-0 w-12 h-12 rounded" />
                                                                <div className="info flex flex-col">
                                                                    <strong className="product_name text-button">{order.product_name}</strong>
                                                                    {/* <span className="product_tag caption1 text-secondary">Women, Clothing</span> */}
                                                                </div>
                                                            </Link>
                                                            
                                                        </td>
                                                    <td className="py-3 price text right">₹{order.total_price}</td>
                                                    <td className="py-3 text-left">
                                                        <span className="tag px-3 py-1.5 rounded-full bg-opacity-10 bg-yellow text-yellow caption1 font-semibold">{order.order_status}</span>
                                                    </td>

                                                    <td className="py-3 date text right">{order.created_at.slice(0,10)}</td>

                                                    <td className="py-3 text-right">
                                                        <th scope="row" className="py-3 text-left">
                                                                <strong className="text-title text">{order.order_id}</strong>
                                                        </th>
                                                    </td>
                                                </tr>
                                                 ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className={`tab text-content overflow-hidden w-full p-7 border border-line rounded-xl ${activeTab === 'orders' ? 'block' : 'hidden'}`}>
                                <h6 className="heading6">Your Orders</h6>
                                <div className="w-full overflow-x-auto">
                                    <div className="menu-tab grid grid-cols-5 max-lg:w-[500px] border-b border-line mt-3">
                                        {['all', 'pending', 'delivery', 'completed', 'canceled'].map((item, index) => (
                                            <button
                                                key={index}
                                                className={`item relative px-3 py-2.5 text-secondary text-center duration-300 hover:text-black border-b-2 ${activeOrders === item ? 'active border-black' : 'border-transparent'}`}
                                                onClick={() => handleActiveOrders(item)}
                                            >
                                                {/* {activeOrders === item && (
                                                <motion.span layoutId='active-pill' className='absolute inset-0 border-black border-b-2'></motion.span>
                                                )} */}
                                                <span className='relative text-button z-[1]'>
                                                    {item}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="list_order">
                                    <div className="order_item mt-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-line">
                                            <div className="flex items-center gap-2">
                                                <strong className="text-title">Order Number:</strong>
                                                <strong className="order_number text-button uppercase">s184989823</strong>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <strong className="text-title">Order status:</strong>
                                                <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-purple text-purple caption1 font-semibold">Delivery</span>
                                            </div>
                                        </div>
                                        <div className="list_prd px-5">
                                            <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                                                <Link href={'/product/default'} className="flex items-center gap-5">
                                                    <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                                        <Image
                                                            src={'/images/product/1000x1000.png'}
                                                            width={1000}
                                                            height={1000}
                                                            alt={'Contrasting sheepskin sweatshirt'}
                                                            className='w-full h-full object-cover'
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                                                        <div className="caption1 text-secondary mt-2">
                                                            <span className="prd_size uppercase">XL</span>
                                                            <span>/</span>
                                                            <span className="prd_color capitalize">Yellow</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className='text-title'>
                                                    <span className="prd_quantity">1</span>
                                                    <span> X </span>
                                                    <span className="prd_price">$45.00</span>
                                                </div>
                                            </div>
                                            <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                                                <Link href={'/product/default'} className="flex items-center gap-5">
                                                    <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                                        <Image
                                                            src={'/images/product/1000x1000.png'}
                                                            width={1000}
                                                            height={1000}
                                                            alt={'Contrasting sheepskin sweatshirt'}
                                                            className='w-full h-full object-cover'
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                                                        <div className="caption1 text-secondary mt-2">
                                                            <span className="prd_size uppercase">XL</span>
                                                            <span>/</span>
                                                            <span className="prd_color capitalize">White</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className='text-title'>
                                                    <span className="prd_quantity">2</span>
                                                    <span> X </span>
                                                    <span className="prd_price">$70.00</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-4 p-5">
                                            <button className="button-main" onClick={() => setOpenDetail(true)}>Order Details</button>
                                            <button className="button-main bg-surface border border-line hover:bg-black text-black hover:text-white">Cancel Order</button>
                                        </div>
                                    </div>
                                    <div className="order_item mt-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-line">
                                            <div className="flex items-center gap-2">
                                                <strong className="text-title">Order Number:</strong>
                                                <strong className="order_number text-button uppercase">s184989824</strong>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <strong className="text-title">Order status:</strong>
                                                <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-yellow text-yellow caption1 font-semibold">Pending</span>
                                            </div>
                                        </div>
                                        <div className="list_prd px-5">
                                            <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                                                <Link href={'/product/default'} className="flex items-center gap-5">
                                                    <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                                        <Image
                                                            src={'/images/product/1000x1000.png'}
                                                            width={1000}
                                                            height={1000}
                                                            alt={'Contrasting sheepskin sweatshirt'}
                                                            className='w-full h-full object-cover'
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                                                        <div className="caption1 text-secondary mt-2">
                                                            <span className="prd_size uppercase">L</span>
                                                            <span>/</span>
                                                            <span className="prd_color capitalize">Pink</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className='text-title'>
                                                    <span className="prd_quantity">1</span>
                                                    <span> X </span>
                                                    <span className="prd_price">$69.00</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-4 p-5">
                                            <button className="button-main" onClick={() => setOpenDetail(true)}>Order Details</button>
                                            <button className="button-main bg-surface border border-line hover:bg-black text-black hover:text-white">Cancel Order</button>
                                        </div>
                                    </div>
                                    <div className="order_item mt-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-line">
                                            <div className="flex items-center gap-2">
                                                <strong className="text-title">Order Number:</strong>
                                                <strong className="order_number text-button uppercase">s184989824</strong>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <strong className="text-title">Order status:</strong>
                                                <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-success text-success caption1 font-semibold">Completed</span>
                                            </div>
                                        </div>
                                        <div className="list_prd px-5">
                                            <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                                                <Link href={'/product/default'} className="flex items-center gap-5">
                                                    <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                                        <Image
                                                            src={'/images/product/1000x1000.png'}
                                                            width={1000}
                                                            height={1000}
                                                            alt={'Contrasting sheepskin sweatshirt'}
                                                            className='w-full h-full object-cover'
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                                                        <div className="caption1 text-secondary mt-2">
                                                            <span className="prd_size uppercase">L</span>
                                                            <span>/</span>
                                                            <span className="prd_color capitalize">White</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className='text-title'>
                                                    <span className="prd_quantity">1</span>
                                                    <span> X </span>
                                                    <span className="prd_price">$32.00</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-4 p-5">
                                            <button className="button-main" onClick={() => setOpenDetail(true)}>Order Details</button>
                                            <button className="button-main bg-surface border border-line hover:bg-black text-black hover:text-white">Cancel Order</button>
                                        </div>
                                    </div>
                                    <div className="order_item mt-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-line">
                                            <div className="flex items-center gap-2">
                                                <strong className="text-title">Order Number:</strong>
                                                <strong className="order_number text-button uppercase">s184989824</strong>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <strong className="text-title">Order status:</strong>
                                                <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-red text-red caption1 font-semibold">Canceled</span>
                                            </div>
                                        </div>
                                        <div className="list_prd px-5">
                                            <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                                                <Link href={'/product/default'} className="flex items-center gap-5">
                                                    <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                                        <Image
                                                            src={'/images/product/1000x1000.png'}
                                                            width={1000}
                                                            height={1000}
                                                            alt={'Contrasting sheepskin sweatshirt'}
                                                            className='w-full h-full object-cover'
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                                                        <div className="caption1 text-secondary mt-2">
                                                            <span className="prd_size uppercase">M</span>
                                                            <span>/</span>
                                                            <span className="prd_color capitalize">Black</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className='text-title'>
                                                    <span className="prd_quantity">1</span>
                                                    <span> X </span>
                                                    <span className="prd_price">$49.00</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-4 p-5">
                                            <button className="button-main" onClick={() => setOpenDetail(true)}>Order Details</button>
                                            <button className="button-main bg-surface border border-line hover:bg-black text-black hover:text-white">Cancel Order</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`tab_address text-content w-full p-7 border border-line rounded-xl ${activeTab === 'address' ? 'block' : 'hidden'}`}>
                                {error && (
                                    <ErrorNotification error={error} setError={setError} />
                                )}

                                {success && (
                                    <SuccessAlert success={success} setSuccess={setSuccess} />
                                )}
                                <form >
                                    {/* <button
                                        type='button'
                                        className={`tab_btn flex items-center justify-between w-full pb-1.5 border-b border-line ${activeAddress === 'billing' ? 'active' : ''}`}
                                        onClick={() => handleActiveAddress('billing')}
                                    >
                                        <strong className="heading6">Billing address</strong>
                                        <Icon.CaretDown className='text-2xl ic_down duration-300' />
                                    </button>
                                    <div className={`form_address ${activeAddress === 'billing' ? 'block' : 'hidden'}`}>
                                        <div className='grid sm:grid-cols-2 gap-4 gap-y-5 mt-5'>
                                            <div className="first-name">
                                                <label htmlFor="billingFirstName" className='caption1 capitalize'>Name <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="billingFirstName" type="text" required />
                                            </div>
                                            <div className="last-name">
                                                <label htmlFor="billingLastName" className='caption1 capitalize'>Last Name <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="billingLastName" type="text" required />
                                            </div>
                                            <div className="company">
                                                <label htmlFor="billingCompany" className='caption1 capitalize'>Company name (optional)</label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="billingCompany" type="text" required />
                                            </div>
                                            <div className="country">
                                                <label htmlFor="billingCountry" className='caption1 capitalize'>Country / Region <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="billingCountry" type="text" required />
                                            </div>
                                            <div className="street">
                                                <label htmlFor="billingStreet" className='caption1 capitalize'>street address <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="billingStreet" type="text" required />
                                            </div>
                                            <div className="city">
                                                <label htmlFor="billingCity" className='caption1 capitalize'>Town / city <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="billingCity" type="text" required />
                                            </div>
                                            <div className="state">
                                                <label htmlFor="billingState" className='caption1 capitalize'>state <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="billingState" type="text" required />
                                            </div>
                                            <div className="zip">
                                                <label htmlFor="billingZip" className='caption1 capitalize'>ZIP <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="billingZip" type="text" required />
                                            </div>
                                            <div className="phone">
                                                <label htmlFor="billingPhone" className='caption1 capitalize'>Phone <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="billingPhone" type="text" required />
                                            </div>
                                            <div className="email">
                                                <label htmlFor="billingEmail" className='caption1 capitalize'>Email <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="billingEmail" type="email" required />
                                            </div>
                                        </div>
                                    </div> */}

                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            


        </ProtectedRoute>

    )
}

export default MyAccount