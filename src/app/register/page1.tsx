'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "./firebase-config";

async function registerUser(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send built-in Firebase email verification
    await sendEmailVerification(user);

    console.log("Verification email sent to", email);
  } catch (error:any) {
    console.error("Error:", error.message);
  }
}



const Register = () => {
    
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isTermsChecked, setIsTermsChecked] = useState(false);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!isTermsChecked) {
        setError("You must agree to the terms to register.");
        return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setTimeout(() => setError(''), 3000);
            setPassword('');
            setConfirmPassword('');
            return;
        }
        alert("Registration successful!");
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
                            <form className="md:mt-7 mt-4" onSubmit={handleSubmit}>

                                <div className="email ">
                                    <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="username" type="email" placeholder="Email address *" required />
                                </div>
                                <div className="phone mt-5">
                                    <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="phone" type="phone" placeholder="Phone Number *" required />
                                </div>
                                <div className="pass mt-5">
                                    <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="password" type="password" placeholder="Password *" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="confirm-pass mt-5">
                                    <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="confirmPassword" type="password" placeholder="Confirm Password *" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
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
                                                                alert(checked ? 'Checked' : 'Unchecked');}}
                                        />
                                        <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox' />
                                    </div>
                                    <label htmlFor='remember' className="pl-2 cursor-pointer text-secondary2">I agree to the
                                        <Link href={'#!'} className='text-black hover:underline pl-1'>Terms of User</Link>
                                    </label>
                                </div>
{error && (
  <div className="flex items-center border border-red-500 !text-red-500 px-4 py-2 mt-4 rounded-md text-sm">
    <Icon.WarningCircle size={20} weight="bold" className="mr-2" color='red' />
    <span>{error}</span>
  </div>
)}
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
