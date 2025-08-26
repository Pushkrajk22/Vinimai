'use client'

import ErrorNotification from "@/components/AlertNotifications/ErrorNotification";
import SuccessAlert from "@/components/AlertNotifications/SuccessNotification";
import ProtectedRoute from "@/components/ProtectedRoutes/ProtectedRoutes";
import React, { useState, useEffect } from 'react'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import axios from "axios";
import { ThreeCircles } from "react-loader-spinner";

const MyAddress: React.FC = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [activeAddress, setActiveAddress] = useState<string | null>('billing')
    const [user, setUser] = useState<UserDetails | null>(null);
    //Form Variables for address
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');
        const [company, setCompany] = useState('');
        const [country, setCountry] = useState('');
        const [streetAddress, setStreetAddress] = useState('');
        const [city, setCity] = useState('');
        const [state, setState] = useState('');
        const [postalCode, setPostalCode] = useState('');
        const [shippingPhone, setShippingPhone] = useState('');
        const [shippingEmail, setShippingEmail] = useState('');

        const handleActiveAddress = (order: string) => {
            setActiveAddress(prevOrder => prevOrder === order ? null : order)
        }

        const handleSubmitAddress = async (e: React.FormEvent) => {
                e.preventDefault();


                // Basic required field validation
                if (
                    !firstName ||
                    !lastName ||
                    !country ||
                    !streetAddress ||
                    !city ||
                    !state ||
                    !postalCode ||
                    !shippingPhone ||
                    !shippingEmail
                ) {
                    setError('Please fill in all required fields.');
                    return;
                }



                const payload = {
                    userid: user!.email,
                    first_name: firstName,
                    last_name: lastName,
                    company_name: company,
                    country: country,
                    street_address: streetAddress,
                    city: city,
                    state: state,
                    postal_code: postalCode,
                    phone: shippingPhone,
                    shipping_email: shippingEmail
                };

                try {
                    const response = await axios.put(
                        'http://localhost:8000/api/profile/addOrUpdateAddress',
                        payload,
                        {
                            headers: {
                                'Authorization': token || localStorage.getItem('token'), // Use token from state or localStorage
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            }
                        }
                    );

                    setSuccess('Address updated successfully!');
                    setError(''); // Clear any previous errors
                } catch (error: any) {
                    console.error('Error updating address:', error);
                    setSuccess(''); // Clear any previous success messages
                    setError(`Failed to update address: ${error?.response?.data?.message || error.message}`);
                }
        };

            useEffect(() => {
            if (!token) return;
                axios.get('http://localhost:8000/api/profile/getUserDetails', {
                    headers: {
                    Authorization: token,
                    Accept: 'application/json',
                    },
                })
                .then((response) => {
                    const data = response.data; // axios automatically parses JSON
                    setUser(data);
                })
                .catch((err) => {
                    console.error('Failed to fetch user details', err);
                });
        }, [token]);

    
        useEffect(() => {

                fetchAddress();
        }, []);

        const fetchAddress = async () => {
            const storedToken = localStorage.getItem('token');
            setToken(storedToken)
            try {
                const response = await axios.get('http://localhost:8000/api/profile/getAddress', {
                    headers: {
                        'Authorization': storedToken || token, // Use storedToken if available
                        'Accept': 'application/json',
                    },
                });

                const data = response.data;

                if (data) {
                    setFirstName(data.first_name || '');
                    setLastName(data.last_name || '');
                    setCompany(data.company_name || '');
                    setCountry(data.country || '');
                    setStreetAddress(data.street_address || '');
                    setCity(data.city || '');
                    setState(data.state || '');
                    setPostalCode(data.postal_code || '');
                    setShippingPhone(data.phone || '');
                    setShippingEmail(data.shipping_email || '');
                }
            } catch (error:any) {
                console.error('Error fetching address:', error);
                setError(`Failed to fetch address details: ${error.message}`);
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
                                {error && (
                                    <ErrorNotification error={error} setError={setError} />
                                )}

                                {success && (
                                    <SuccessAlert success={success} setSuccess={setSuccess} />
                                )}
                                <form onSubmit={handleSubmitAddress}>
                                    
                                    {/* Billing Address */}
                                    <button
                                        type='button'
                                        className={`tab_btn flex items-center justify-between w-full mt-10 pb-1.5 border-b border-line`}
                                        onClick={() => handleActiveAddress('shipping')}
                                    >
                                        <strong className="heading6">Shipping address</strong>
                                    </button>
                                    {/* <div className={`form_address ${activeAddress === 'shipping' ? 'block' : 'hidden'}`}> */}
                                    <div>
                                        <div className='grid sm:grid-cols-2 gap-4 gap-y-5 mt-5'>
                                            <div className="first-name">
                                                <label htmlFor="shippingFirstName" className='caption1 capitalize'>First Name <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="shippingFirstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                            </div>
                                            <div className="last-name">
                                                <label htmlFor="shippingLastName" className='caption1 capitalize'>Last Name <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="shippingLastName" type="text" value={lastName} onChange={(e)=> setLastName(e.target.value)} required/>
                                            </div>
                                            <div className="company">
                                                <label htmlFor="shippingCompany" className='caption1 capitalize'>Company name (optional)</label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="shippingCompany" type="text" value={company} onChange={(e)=> setCompany(e.target.value)}  required />
                                            </div>
                                            <div className="country">
                                                <label htmlFor="shippingCountry" className='caption1 capitalize'>Country / Region <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="shippingCountry" type="text" value={country} onChange={(e)=> setCountry(e.target.value)}  required />
                                            </div>
                                            <div className="street">
                                                <label htmlFor="shippingStreet" className='caption1 capitalize'>street address <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="shippingStreet" type="text"  value={streetAddress} onChange={(e)=> setStreetAddress(e.target.value)}  required />
                                            </div>
                                            <div className="city">
                                                <label htmlFor="shippingCity" className='caption1 capitalize'>Town / city <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="shippingCity" type="text" value={city} onChange={(e)=> setCity(e.target.value)}  required />
                                            </div>
                                            <div className="state">
                                                <label htmlFor="shippingState" className='caption1 capitalize'>state <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="shippingState" type="text" value={state} onChange={(e)=> setState(e.target.value)}  required />
                                            </div>
                                            <div className="zip">
                                                <label htmlFor="shippingZip" className='caption1 capitalize'>ZIP <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="shippingZip" type="text" value={postalCode} onChange={(e)=> setPostalCode(e.target.value)}  required />
                                            </div>
                                            <div className="phone">
                                                <label htmlFor="shippingPhone" className='caption1 capitalize'>Phone <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="shippingPhone" type="text"  value={shippingPhone} onChange={(e)=> setShippingPhone(e.target.value)}  required />
                                            </div>
                                            <div className="email">
                                                <label htmlFor="shippingEmail" className='caption1 capitalize'>Email <span className='text-red'>*</span></label>
                                                <input className="border-line mt-2 px-4 py-3 w-full rounded-lg" id="shippingEmail" type="email"  value={shippingEmail} onChange={(e)=> setShippingEmail(e.target.value)}  required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="block-button lg:mt-10 mt-6">
                                        <button className="button-main">Update Details</button>
                                    </div>
                                </form>
                            </div>
        </ProtectedRoute>
    );
};

export default MyAddress;