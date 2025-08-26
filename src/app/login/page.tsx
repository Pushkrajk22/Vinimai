'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ThreeCircles } from 'react-loader-spinner'


const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError('');
            setLoading(true);
            // const router = useRouter();

            try {
                const response = await axios.post(
                    // 'https://vinimailoginmicroservice.onrender.com/api/loginService/login',
                    'http://localhost:8000/api/loginService/login',
                { email, password },
                {
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    },
                }
                );

                console.log('Login successful:', response.data);
                localStorage.setItem('token', response.data.access_token);
                router.push('/')

            } catch (err: any) {
                setError(err.response?.data?.message || 'Login failed');
            } finally {
                setLoading(false);
            }
            };


    return (
        <>
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Login' subHeading='Login' />
            </div>
            <div className="login-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col">
                        <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
                            <div className="heading4">Login</div>
                            <form className="md:mt-7 mt-4" onSubmit={handleSubmit}>
                                
                                <div className="email ">
                                    <input 
                                        className="border-line px-4 pt-3 pb-3 w-full rounded-lg" 
                                        id="username" 
                                        type="text" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder="Email ID *" 
                                        required 
                                    />
                                </div>
                                <div className="pass mt-5">
                                    <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="password" type="password"  value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password *" required />
                                </div>
                                <div className="flex items-center justify-between mt-5">
                                    <div className='flex items-center'>
                                        <div className="block-input">
                                            <input
                                                type="checkbox"
                                                name='remember'
                                                id='remember'
                                            />
                                            <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox' />
                                        </div>
                                        <label htmlFor='remember' className="pl-2 cursor-pointer">Remember me</label>
                                    </div>
                                    <Link href={'/forgot-password'} className='font-semibold hover:underline'>Forgot Your Password?</Link>
                                </div>
                                <div className="block-button md:mt-7 mt-4">
                                    <button className="button-main">
                                        {loading ? (
                                            <ThreeCircles
                                            height="24"
                                            width="24"
                                            color="#ffffff"  // or button text color
                                            ariaLabel="loading"
                                            visible={true}
                                            />
                                        ) : (
                                            'Login'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
                            <div className="text-content">
                                <div className="heading4">New Customer</div>
                                <div className="mt-2 text-secondary">Be part of our growing family of new customers! Join us today and unlock a world of exclusive benefits, offers, and personalized experiences.</div>
                                <div className="block-button md:mt-7 mt-4">
                                    <Link href={'/register'} className="button-main">Register</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Login
