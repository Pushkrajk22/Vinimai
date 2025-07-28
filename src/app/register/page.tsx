'use client';
export const dynamic = 'force-dynamic';

import React, { useState } from 'react'
import axios from 'axios';
import Link from 'next/link'
import { Check, CheckFat, Checks } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
// import * as Icon from "@phosphor-icons/react/dist/ssr";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "./firebase-config";
import { reload } from 'firebase/auth';
import { ConfirmationResult } from 'firebase/auth';
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import nextDynamic  from 'next/dynamic';
import SuccessAlert from '@/components/AlertNotifications/SuccessNotification';
import ErrorNotification from '@/components/AlertNotifications/ErrorNotification'
const CheckCircle = nextDynamic (() => import("@phosphor-icons/react").then(mod => mod.CheckCircle), { ssr: false });
const WarningCircle = nextDynamic (() =>
  import('@phosphor-icons/react').then((mod) => mod.WarningCircle),
  { ssr: false }
);
const CheckSquare = nextDynamic (() =>
  import('@phosphor-icons/react').then((mod) => mod.CheckSquare),
  { ssr: false }
);
// declare global {
//   interface Window {
//     recaptchaVerifier: any;
//   }
// }
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}


async function registerUser(email: string, password: string): Promise<string | null> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send built-in Firebase email verification
    await sendEmailVerification(user);
    return null; // success
  } catch (error:any) {
    console.error("Error:", error.message);
    return error.message;
  }
}

const X = nextDynamic (() =>
  import('@phosphor-icons/react').then((mod) => mod.X),
  { ssr: false }
);




const Register = () => {
    // const CheckCircle = nextDynamic (() => import("@phosphor-icons/react").then(mod => mod.CheckCircle), { ssr: false });
    const [mailSent, setMailSent] = useState("false");
    const [isMailVerified, setIsMailVerified] = useState(false);
    const [otpSent, setOTPSent] = useState(false);
    const [otpVerified, setOTPVerified] = useState(false);
    const [otpConfirmationResult, setOTPConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [name, setName] = useState('');
    const [step, setStep] = useState("");
    const [otp, setOTP] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [success, setSuccess] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isTermsChecked, setIsTermsChecked] = useState(true);



    const sendEmailVerificationLink = async () => {
        setError(""); // Clear any existing errors
        setSuccess(""); // Clear any existing success messages
        // Step 1: Validate password match
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '' || !emailRegex.test(email)) {
            setError("Please enter a valid email address");
            setSuccess("");
            return;
        }
        if (password === '' || confirmPassword === '') {
                setError("Please fill in both password fields");
                setSuccess("");
                return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setSuccess("");
            return;
        }
        // Check if user is already registered with same email
        try {
            const { data } = await axios.get('http://localhost:8000/api/loginService/checkEmailExists', { params: { email } });
            if (data.exists) {
                setError("Email is already registered");
                setSuccess("");
                return;
            }
        } catch {
            setError("Error checking email availability");
            setSuccess("");
            return;
        }

        try {
            // Step 2: Create user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Step 3: Send verification email
            await sendEmailVerification(user);

            // 4. Success feedback
            setMailSent("true");
            setSuccess("Verification email sent. Please check your inbox.");
            setError("");
            console.log("Email verification sent to:", email);
        } catch (error: any) {
            // Step 4: Handle Firebase errors
            setError(error.message);
            setSuccess("");
            console.error("Error: ", error);
            return;
        }
    };

    const verifyEmailFromLink = async () => {
        try {
            // Reload the user's auth state to get the latest info
            if (auth.currentUser) {
            await reload(auth.currentUser);

            if (auth.currentUser.emailVerified) {
                setSuccess("Email verified successfully!");
                setError("");
                setIsMailVerified(true);
                setMailSent("verified");
            } else {
                setError("Email not verified yet. Please check your inbox.");
                setSuccess("");
            }
            } else {
            setError("No authenticated user found.");
            setSuccess("");
            }
        } catch (error:any) {
            setError("Verification check failed: " + error.message);
            setSuccess("");
            console.error(error);
        }
        };

    const sendOTP = async () => {
        setError("");
        setSuccess("");
        if (!/^\d{10}$/.test(phone)) {
            setError("Please enter a valid 10-digit phone number");
            setSuccess("");
            return;
        }
        // Check if user is already registered with same email
        try {
            const { data } = await axios.get('http://localhost:8000/api/loginService/checkPhoneExists', { params: { phone } });
            if (data.exists) {
                setError("Phone Number is already registered");
                setSuccess("");
                return;
            }
        } catch {
            setError("Error checking Phone Number availability");
            setSuccess("");
            return;
        }

        try {
                if (typeof window !== 'undefined' && !window.recaptchaVerifier) {

                window.recaptchaVerifier = new RecaptchaVerifier(
                    auth,
                    "recaptcha-container",
                    {
                        size: "invisible",
                        callback: () => console.log("reCAPTCHA solved"),
                    }
                );
                const result = await signInWithPhoneNumber(auth, `+91${phone}`, window.recaptchaVerifier);
                setOTPConfirmationResult(result);
                setOTPSent(true);
                setSuccess("OTP sent successfully!");
                setError("");
            }
    }
        catch (error:any) {
            setError("Failed to send OTP: " + error.message);
            setSuccess("");
        }
        };

    const verifyOTP = async () => {
        setError("");
        setSuccess("");
        if (!otp) {
            setError("OTP is required");
            setSuccess("");
            return;
        }

        if (!otpConfirmationResult) {
            setError("OTP session expired. Please resend.");
            setSuccess("");
            return;
        }

        try {
            const result = await otpConfirmationResult.confirm(otp);
            setOTPVerified(true);
            setSuccess("Phone number verified!");
            setError("");
            console.log("Verified user:", result.user);
        } catch (error) {
            setError("Invalid OTP. Try again.");
            setSuccess("");
        }
        };

    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setTimeout(() => setError(''), 3000);
            setPassword('');
            setConfirmPassword('');
            return;
        }
        
        if (!isTermsChecked) {
            setError("You must agree to the terms to register.");
            setTimeout(() => setError(''), 3000);
            return;
        }

        if (!isMailVerified) {
            setError("Please verify your email before proceeding.");
            setSuccess("");
            return;
        }
        if (!otpVerified) {
            setError("Please verify your phone number before proceeding.");
            setSuccess("");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/loginService/register', {
                name,
                email,
                phone: `+91${phone}`,
                password
            }, {
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }
            });
            setSuccess('Registration successful!');
            setError("");
            router.push('/login');

            } catch (err:any) {
                const apiMessage = err.response?.data?.message || err.response?.data?.detail;
                if (apiMessage) {
                    setError(apiMessage);
                } else {
                    setError('An unexpected error occurred.');
                }
                setSuccess("");
            }
    };



    return (
        <>
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Create An Account' subHeading='Create An Account' />
            </div>
            
            <div className="register-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col">
                        <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
                            <div className="heading4">Register</div>
                            
                            {/* Display error/success components */}

                                {error && (
                                    <ErrorNotification error={error} setError={setError} />
                                )}

                                {success && (
                                    <SuccessAlert success={success} setSuccess={setSuccess} />
                                )}

                            <form className="md:mt-7 mt-4" onSubmit={handleSubmit}>
                                
                                <div className="name mt-5">
                                    <div className="flex items-center gap-2">
                                        <input 
                                            className="border border-line px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-success flex-grow min-w-0" 
                                            id="name" 
                                            type="test" 
                                            placeholder="Full Name *" 
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>  
                                </div>

                                <div className="pass mt-5">
                                    <input 
                                        className="border-line px-4 pt-3 pb-3 w-full rounded-lg" 
                                        id="password" 
                                        type="password" 
                                        placeholder="Password *" 
                                        required 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                    />
                                </div>
                                <div className="confirm-pass mt-5">
                                    <input 
                                        className="border-line px-4 pt-3 pb-3 w-full rounded-lg" 
                                        id="confirmPassword" 
                                        type="password" 
                                        placeholder="Confirm Password *" 
                                        required 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

<div className="email mt-5">
  <div className="flex items-center gap-2">
    <input
      className="border border-line px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-success flex-grow min-w-0"
      id="email"
      type="email"
      placeholder="Email Address *"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    {mailSent === "false" ? (
        <button
        type="button"
        onClick={() => sendEmailVerificationLink()}
        className="bg-black text-white px-5 py-3 rounded-lg text-sm hover:bg-green-600 transition flex-shrink-0 whitespace-nowrap"
        style={{ minWidth: '100px' }} // fixed min width so it doesn’t shrink too small
        >
        Get Link
        </button>
        ) : mailSent === "true"? (
        <button
        type="button"
        onClick={verifyEmailFromLink}
        className="bg-black text-white px-5 py-3 rounded-lg text-sm hover:bg-green-600 transition flex-shrink-0 whitespace-nowrap"
        style={{ minWidth: '100px' }} // fixed min width so it doesn’t shrink too small
        >
        Verify
        </button>
        ) : (
        <button
            type="button"
            disabled
            className="bg-success text-white px-5 py-3 rounded-lg text-sm hover:bg-green-600 transition flex-shrink-0 whitespace-nowrap"
            style={{ minWidth: '100px' }}
        >
            Verified  <Checks size={20} weight="bold" className='inline-block' />
        </button>
    )}
  </div>
</div>

<div className="phone mt-5">
  <div className="flex items-center gap-2">
    <input
      className="border border-line px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-success flex-grow min-w-0"
      id="phone"
      type="tel"
      placeholder="Phone Number *"
      required
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />
    {!otpSent? (
    <button
      type="button"
      className="bg-black text-white px-5 py-3 rounded-lg text-sm hover:bg-green-600 transition flex-shrink-0 whitespace-nowrap"
      style={{ minWidth: '100px' }}
      onClick={sendOTP}
    >
      Get OTP
    </button>
    ) : (
    <button
      // onClick={handleResendOTP}
      type="button"
      className="bg-success text-white px-5 py-3 rounded-lg text-sm hover:bg-green-600 transition flex-shrink-0 whitespace-nowrap"
      style={{ minWidth: '100px' }}
      >
        Sent  <Checks size={20} weight="bold" className='inline-block' />
      </button>
    )}
  </div>
</div>

<div className="otp mt-5">
  <div className="flex items-center gap-2">
    <input
      className="border border-line px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-success flex-grow min-w-0"
      id="otp"
      type="tel"
      inputMode="numeric"
      placeholder="OTP *"
      required
      value={otp}
      onChange={(e) => setOTP(e.target.value)}
    />
    {!otpVerified ? (
    <button
      // onClick={handleVerifyOTP}
      type="button"
      className="bg-black text-white px-5 py-3 rounded-lg text-sm hover:bg-green-600 transition flex-shrink-0 whitespace-nowrap"
      style={{ minWidth: '100px' }}
      onClick={verifyOTP}
    >
      Verify
    </button>
    ) : (
    <button
      type="button"
      disabled
      className="bg-success text-white px-5 py-3 rounded-lg text-sm hover:bg-green-600 transition flex-shrink-0 whitespace-nowrap"
      style={{ minWidth: '100px' }}
    >
      Verified  <Checks size={20} weight="bold" className='inline-block' />
    </button>
    )}
  </div>
</div>

  <div id="recaptcha-container"></div>

  

                                <div className='flex items-center mt-5'>
                                    <div className="block-input">
                                        <input
                                            type="checkbox"
                                            name='remember'
                                            id='remember'
                                            checked={isTermsChecked}
                                            onChange={(e) => {setIsTermsChecked(e.target.checked); 
                                                                const checked = e.target.checked;   
                                                              }}
                                        />
                                        <CheckSquare size={20} weight='fill' className='icon-checkbox' />
                                    </div>
                                    <label htmlFor='remember' className="pl-2 cursor-pointer text-secondary2">I agree to the
                                        <Link href={'https://raw.githubusercontent.com/vinimai1/VinimaiImages/main/Policies/Vinimai%20Privacy%20Policy.pdf'} className='text-black hover:underline pl-1'>Terms of User</Link>
                                    </label>
                                </div>

                                <div className="block-button md:mt-7 mt-4">
                                    <button className="button-main">Register</button>
                                </div>
                            </form>
                            
                        </div>
                        <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
                            <div className="text-content">
                                <div className="heading4">Already have an account?</div>
                                <div className="mt-2 text-secondary">Welcome back. Sign in to access your personalized experience, saved preferences, and more. We{String.raw`'re`} thrilled to have you with us again!</div>
                                <div className="block-button md:mt-7 mt-4">
                                    <Link href={'/login'} className="button-main">Login</Link>
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

export default Register

