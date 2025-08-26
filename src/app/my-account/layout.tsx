    'use client'

    // app/account/layout.tsx
    import React, { useState, useEffect } from 'react'
    import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
    import Footer from '@/components/Footer/Footer';
    import MenuOne from '@/components/Header/Menu/MenuOne';
    import ProtectedRoute from '@/components/ProtectedRoutes/ProtectedRoutes';
    import * as Icon from "@phosphor-icons/react/dist/ssr";
    import Link from 'next/link';
    import { useRouter } from 'next/navigation';
    import axios from 'axios';
import Image from 'next/image';

    type UserDetails = {
            name: string;
            email: string;
            phone: string;
    };

    export default function AdminLayout({ children }: { children: React.ReactNode }) {
        const router = useRouter();
        const [user, setUser] = useState<UserDetails | null>(null);
        const [token, setToken] = useState<string | null>(null);
        const [activeTab, setActiveTab] = useState<string>('dashboard'); // Default to 'dashboard'

        // Load token from localStorage on mount
        useEffect(() => {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
            setToken(savedToken);
            }
        }, []);

        // Fetch user details once token is available
    useEffect(() => {
        if (!token) return;

        axios
        .get('http://localhost:8000/api/profile/getUserDetails', {
            headers: {
            Authorization: token,
            Accept: 'application/json',
            },
        })
        .then((response) => {
            setUser(response.data);
        })
        .catch((error) => {
            console.error('Failed to fetch user details', error);
        });
    }, [token]);

    return (
            // <ProtectedRoute>
            <>
                <div id="header" className='relative w-full'>
                    <MenuOne props="bg-transparent" />
                    <Breadcrumb heading='My Account' subHeading='My Account' />
                </div>
                <div className="profile-block md:py-20 py-10">
                    <div >
                        <div className="content-main flex gap-y-8 max-md:flex-col w-full">
                            <div className="left md:w-1/3 w-full xl:pr-[3.125rem] lg:pr-[28px] md:pr-[16px]">
                                {/* Left Panel */}
                                <div className="user-infor bg-surface lg:px-7 px-4 lg:py-10 py-5 md:rounded-[20px] rounded-xl">
                                    <div className="heading flex flex-col items-center justify-center">
                                        <div className="name heading6 mt-4 text-center">{user?.name}</div>
                                        <div className="mail heading6 font-normal normal-case text-secondary text-center mt-1">{user?.email}</div>
                                    </div>
                                        <div className="menu-tab w-full max-w-none lg:mt-10 mt-6">
                                            {/* <Link href={'#!'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                                                <Icon.HouseLine size={20} />
                                                <strong className="heading6">Dashboard</strong>
                                            </Link> */}
                                            <Link href={'#!'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                                                <Icon.Package size={20} />
                                                <strong className="heading6">History Orders</strong>
                                            </Link>
                                            <Link href={'/my-account/myAddress'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'address' ? 'active' : ''}`} onClick={() => setActiveTab('address')}>
                                                <Icon.Tag size={20} />
                                                <strong className="heading6">My Address</strong>
                                            </Link>
                                            <Link href={'/my-account/bankDetails'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                                                <Icon.Bank size={20} />
                                                <strong className="heading6">Bank Account</strong>
                                            </Link>
                                            <Link href={'/my-account/myProfile'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'setting' ? 'active' : ''}`} onClick={() => setActiveTab('setting')}>
                                                <Icon.GearSix size={20} />
                                                <strong className="heading6">Profile</strong>
                                            </Link>
                                            <Link href={'/my-account/offers'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white`}>
                                                    <Icon.PlusSquare size={20} />
                                                    <strong className="heading6">Offers Received</strong>
                                            </Link>
                                            <Link href={'/my-account/sellProduct'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white`}>
                                                    <Icon.PlusSquare size={20} />
                                                    <strong className="heading6">Add Product</strong>
                                            </Link>

                                            <Link href={'#!'} className="item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5" 
                                                                                            onClick={(e) => {
                                                        e.preventDefault();
                                                        const confirmLogout = window.confirm("Logging out? Don't forget to come back!");
                                                        if (confirmLogout) {
                                                            localStorage.removeItem('token');
                                                            router.push('/login');
                                                        }
                                                    }}>
                                                <Icon.SignOut size={20} />
                                                <strong className="heading6">Logout</strong>
                                            </Link>
                                        </div>
                                </div>
                            </div>

                            <div className="right md:w-2/3 w-full pl-2.5">
                                {/* Right Panel: This is used to render all the children elements in /admin */}
                                <main style={{ flex: 1, padding: '1rem' }}>
                                    {children}
                                </main>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
            // </ProtectedRoute>
    );
    }














