'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
// import * as Icon from "@phosphor-icons/react/dist/ssr";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "./firebase-config";
import { reload } from 'firebase/auth';
import dynamic from 'next/dynamic';
const CheckCircle = dynamic(() => import("@phosphor-icons/react").then(mod => mod.CheckCircle), { ssr: false });
const WarningCircle = dynamic(() =>
  import('@phosphor-icons/react').then((mod) => mod.WarningCircle),
  { ssr: false }
);
const CheckSquare = dynamic(() =>
  import('@phosphor-icons/react').then((mod) => mod.CheckSquare),
  { ssr: false }
);


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

const X = dynamic(() =>
  import('@phosphor-icons/react').then((mod) => mod.X),
  { ssr: false }
);




const Register = () => {
    // const CheckCircle = dynamic(() => import("@phosphor-icons/react").then(mod => mod.CheckCircle), { ssr: false });
    const [mailSent, setMailSent] = useState("false");
    const [isMailVerified, setIsMailVerified] = useState(false);
    const [otpSent, setOTPSent] = useState(false);
    const [otpVerified, setOTPVerified] = useState(false);
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

    const tempClick = () => {
        console.log("inside tempclick");
    };

    const sendEmailVerificationLink = async () => {
        setError(""); // Clear any existing errors
        setSuccess(""); // Clear any existing success messages
        // Step 1: Validate password match
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '' || !emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }
        if (password === '' || confirmPassword === '') {
                setError("Please fill in both password fields");
                return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
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
            console.log("Email verification sent to:", email);
        } catch (error: any) {
            // Step 4: Handle Firebase errors
            setError(error.message);
            console.error("Error: ", error);
        }
    };

    const verifyEmailFromLink = async () => {
        try {
            // Reload the user's auth state to get the latest info
            if (auth.currentUser) {
            await reload(auth.currentUser);

            if (auth.currentUser.emailVerified) {
                // setMailSent(true);
                console.log("Email verified successfully!");
                setSuccess("Email verified successfully!");
                setIsMailVerified(true);
                setMailSent("verified");
            } else {
                setError("Email not verified yet. Please check your inbox.");
            }
            } else {
            setError("No authenticated user found.");
            }
        } catch (error:any) {
            setError("Verification check failed: " + error.message);
            console.error(error);
        }
        };

    
    const handleSubmit = async (e: React.FormEvent) => {
        console.log("inside handleSubmit");
        e.preventDefault();
        setError('');
        setSuccess('');

        // if (password !== confirmPassword) {
        //     setError("Passwords do not match");
        //     setTimeout(() => setError(''), 3000);
        //     setPassword('');
        //     setConfirmPassword('');
        //     return;
        // }
        
        // if (!isTermsChecked) {
        //     setError("You must agree to the terms to register.");
        //     setTimeout(() => setError(''), 3000);
        //     return;
        // }

        // const errMsg = await registerUser(email, password);
        // if (errMsg) {
        // setError(errMsg);
        // } else {
        // setSuccess("Verification email sent. Please check your inbox.");
        // setTimeout(() => setSuccess(''), 3000);
        // }
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
                                <div
                                    className="flex items-center justify-between border px-4 py-2 mt-4 rounded-md text-sm text-red border-red"
                                    style={{ backgroundColor: 'rgba(219, 68, 68, 0.1)' }} // custom red with 10% opacity
                                >
                                    <div className="flex items-center">
                                    <WarningCircle size={20} weight="bold" className="mr-2 text-red" />
                                    <span>{error}</span>
                                    </div>
                                    <button onClick={() => setError("")} className="ml-4 hover:text-red-700">
                                    <X size={18} weight="bold" />
                                    </button>
                                </div>
                                )}

                                {success && (
                                <div
                                    className="flex items-center justify-between border px-4 py-2 mt-4 rounded-md text-sm shadow-sm text-success"
                                    style={{ backgroundColor: 'rgba(61, 171, 37, 0.15)', borderColor: '#3DAB25'  }}
                                >
                                    <div className="flex items-center">
                                    <CheckCircle size={20} weight="bold" className="mr-2 text-success" />
                                    <span>{success}</span>
                                    </div>
                                    <button onClick={() => setSuccess("")} className="ml-4 hover:text-green-900">
                                    <X size={18} weight="bold" />
                                    </button>
                                </div>
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
            className="bg-black text-white px-5 py-3 rounded-lg text-sm hover:bg-green-600 transition flex-shrink-0 whitespace-nowrap"
            style={{ minWidth: '100px' }}
        >
            Verified
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
      // onClick={handleGetOTP}
      className="bg-black text-white px-5 py-3 rounded-lg text-sm hover:bg-green-600 transition flex-shrink-0 whitespace-nowrap"
      style={{ minWidth: '100px' }}
    >
      Get OTP
    </button>
    ) : (
    <button
      // onClick={handleResendOTP}
      className="bg-black text-white px-5 py-3 rounded-lg text-sm hover:bg-green-600 transition flex-shrink-0 whitespace-nowrap"
      style={{ minWidth: '100px' }}
      >
        Sent
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
      className="bg-black text-white px-5 py-3 rounded-lg text-sm hover:bg-green-600 transition flex-shrink-0 whitespace-nowrap"
      style={{ minWidth: '100px' }}
    >
      Verify
    </button>
    ) : (
    <button
      disabled
      className="bg-black text-white px-5 py-3 rounded-lg text-sm hover:bg-green-600 transition flex-shrink-0 whitespace-nowrap"
      style={{ minWidth: '100px' }}
    >
      Verified
    </button>
    )}
  </div>
</div>
  

                                <div className='flex items-center mt-5'>
                                    <div className="block-input">
                                        <input
                                            type="checkbox"
                                            name='remember'
                                            id='remember'
                                            checked={isTermsChecked}
                                            onChange={(e) => {setIsTermsChecked(e.target.checked); 
                                                                const checked = e.target.checked;   
                                                                setIsTermsChecked(checked);   
                                                                }}
                                        />
                                        <CheckSquare size={20} weight='fill' className='icon-checkbox' />
                                    </div>
                                    <label htmlFor='remember' className="pl-2 cursor-pointer text-secondary2">I agree to the
                                        <Link href={'https://test.io/terms-of-service'} className='text-black hover:underline pl-1'>Terms of User</Link>
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

