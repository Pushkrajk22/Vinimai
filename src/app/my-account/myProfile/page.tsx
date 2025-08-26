'use client'

import ErrorNotification from "@/components/AlertNotifications/ErrorNotification";
import SuccessAlert from "@/components/AlertNotifications/SuccessNotification";
import ProtectedRoute from "@/components/ProtectedRoutes/ProtectedRoutes";
import React, { useState, useEffect } from 'react'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import axios from "axios";
import { ThreeCircles } from "react-loader-spinner";
import Image from "next/image";

type UserDetails = {
  name: string;
  email: string;
  phone: string;
};

const MyAddress: React.FC = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [activeAddress, setActiveAddress] = useState<string | null>('billing')
    const [user, setUser] = useState<UserDetails | null>(null);
    const [loadingButton, setLoadingButon] = useState(false);
        const [currentPassword, setCurrentPassword] = useState('');
        const [newPassword, setNewPassword] = useState('');
        const [confirmedNewPassword, setConfirmedNewPassword] = useState('');

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) setToken(savedToken);
    }, []);

    useEffect(() => {
            if (!token) return;
                axios.get('http://localhost:8000/api/profile/getUserDetails', {
                    headers: {
                    Authorization: token || localStorage.getItem('token'), // Fallback to localStorage if token state is null
                    Accept: 'application/json',
                    },
                })
                .then((response) => {
                    const data = response.data; // axios automatically parses JSON
                    setUser(data);
                    console.log('User data:', data); // Log the user data to verify
                })
                .catch((err) => {
                    console.error('Failed to fetch user details', err);
                });
    }, [token]);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError('');
            setLoadingButon(true);
            if (newPassword !== confirmedNewPassword) {
                setError("Passwords do not match");
                setSuccess('');
                // setTimeout(() => setError(''), 3000);
                setConfirmedNewPassword('');
                setNewPassword('');
                setCurrentPassword('');
                return;
            }
            try {
                const response = await axios.post(
                    'https://vinimailoginmicroservice.onrender.com/api/loginService/changePassword',
                // 'http://localhost:8080/api/loginService/changePassword',
                {
                    old_password: currentPassword,
                    new_password: confirmedNewPassword,
                },
                {
                    headers: {
                    Authorization: `${token}`, // Attach JWT in Authorization header
                    'Content-Type': 'application/json',
                    },
                }
                );
                setSuccess('Password changed successfully!');    
                // Clear form fields
                setConfirmedNewPassword('');
                setNewPassword('');
                setCurrentPassword('');
                setLoadingButton(false);
            } catch (err: any) {
                console.error(err);
                const errorMsg = err.response?.data?.detail || 'Password change failed';
                setError(`Error Occured: ${errorMsg}`);
                setSuccess('');
            }
    
        };



    if (loading) return     
    <div style={{
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
            <div className={`tab_address text-content w-full p-7 border border-line rounded-xl`}>

       <div>
                                <form onSubmit={handleSubmit}>
                                    <div className="heading5 pb-4">Information</div>
                                    
                                    <div className='grid sm:grid-cols-2 gap-4 gap-y-5 mt-5'>
                                        <div className="first-name">
                                            <label htmlFor="firstName" className='caption1 capitalize'>Name <span className='text-red'>*</span></label>
                                            <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="firstName" type="text" value={user?.name || ""} placeholder='Name' required readOnly />
                                        </div>
                                        <div className="phone-number">
                                            <label htmlFor="phoneNumber" className='caption1 capitalize'>Phone Number <span className='text-red'>*</span></label>
                                            <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="phoneNumber" type="text" value={user?.phone || ""} placeholder="Phone number" required readOnly />
                                        </div>
                                        <div className="email">
                                            <label htmlFor="email" className='caption1 capitalize'>Email Address <span className='text-red'>*</span></label>
                                            <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="email" type="email" value={user?.email || ""} placeholder="Email address" required readOnly/>
                                        </div>
                                    </div>
                                    <div className="heading5 pb-4 lg:mt-10 mt-6">Change Password</div>
                                    <div className="pass">
                                        <label htmlFor="password" className='caption1'>Current password <span className='text-red'>*</span></label>
                                        <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="password" type="password" value={currentPassword} onChange={(e) => {setCurrentPassword(e.target.value);}} placeholder="Current Password *" required />
                                    </div>
                                    <div className="new-pass mt-5">
                                        <label htmlFor="newPassword" className='caption1'>New password <span className='text-red'>*</span></label>
                                        <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="newPassword" type="password" value={newPassword} onChange={(e) => {setNewPassword(e.target.value);}} placeholder="New Password *" required />
                                    </div>
                                    <div className="confirm-pass mt-5">
                                        <label htmlFor="confirmPassword" className='caption1'>Confirm new password <span className='text-red'>*</span></label>
                                        <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="confirmPassword" type="password" value={confirmedNewPassword} onChange={(e) => {setConfirmedNewPassword(e.target.value);}} placeholder="Confirm Password *" required />
                                    </div>
                                    {error && (                        
                                      <ErrorNotification error={error} setError={setError} />
                                    )}
                                    {success && (                        
                                      <SuccessAlert success={success} setSuccess={setSuccess} />
                                    )}
                                    <div className="block-button lg:mt-10 mt-6">
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
                                                'Save Changes'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            </div>
        </ProtectedRoute>
    );
};

export default MyAddress;
