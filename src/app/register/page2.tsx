'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MenuOne from '@/components/Header/Menu/MenuOne';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Footer from '@/components/Footer/Footer';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "./firebase-config";

async function registerUser(email: string, password: string): Promise<string | null> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);
    return null; // success
  } catch (error: any) {
    return error.message;
  }
}

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  // Simulate OTP for demo
  const generatedOtp = '123456';

  // Email verification logic
  const handleSendEmailVerification = async () => {
    setError('');
    setSuccess('');
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    // Send verification email
    const errMsg = await registerUser(email, password || 'dummyPassword!');
    if (!errMsg) {
      setIsEmailSent(true);
      setShowEmailAlert(true);
      setTimeout(() => setShowEmailAlert(false), 3000);
    } else {
      setError(errMsg);
    }
  };

  const handleVerifyEmail = async () => {
    // Simulate email verification check
    setIsEmailVerified(true);
    setSuccess('Email verified successfully!');
    setTimeout(() => setSuccess(''), 2000);
  };

  // Phone OTP logic
  const handleSendOtp = () => {
    if (!phone) {
      setError('Please enter your phone number.');
      return;
    }
    setIsOtpSent(true);
    setSuccess('OTP sent to your phone.');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleVerifyOtp = () => {
    if (otpInput === generatedOtp) {
      setIsPhoneVerified(true);
      setSuccess('Phone number verified!');
      setTimeout(() => setSuccess(''), 2000);
    } else {
      setError('Invalid OTP.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!isTermsChecked) {
      setError('You must agree to the terms to register.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSuccess('Registration successful!');
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
                {/* Full Name */}
                <div className="fullname">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    type="text"
                    placeholder="Full Name *"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                {/* Email */}
                <div className="email mt-5 relative flex items-center">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg pr-10"
                    type="email"
                    placeholder="Email address *"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isEmailVerified}
                  />
                  {isEmailVerified && <Icon.CheckCircle size={20} color="green" className="absolute right-3" />}
                </div>
                {/* Email Verification Buttons */}
                {!isEmailVerified && (
                  <div className="flex gap-2 mt-2">
                    <button type="button" className="button-main" onClick={handleSendEmailVerification} disabled={isEmailSent}>
                      Send Email Verification
                    </button>
                    {isEmailSent && (
                      <button type="button" className="button-main" onClick={handleVerifyEmail}>
                        Verify Email
                      </button>
                    )}
                  </div>
                )}
                {/* Email Alert */}
                {showEmailAlert && (
                  <div className="mt-2 px-4 py-2 rounded bg-blue-100 text-blue-700 text-sm">
                    Verification link sent. Please click the link and then press the verify email button.
                  </div>
                )}
                {/* Phone */}
                <div className="phone mt-5 relative flex items-center">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg pr-10"
                    type="tel"
                    placeholder="Phone Number *"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEmailVerified || isPhoneVerified}
                  />
                  {isPhoneVerified && <Icon.CheckCircle size={20} color="green" className="absolute right-3" />}
                </div>
                {/* OTP Buttons */}
                {isEmailVerified && !isPhoneVerified && (
                  <div className="flex gap-2 mt-2">
                    {!isOtpSent ? (
                      <button type="button" className="button-main" onClick={handleSendOtp}>
                        Send OTP
                      </button>
                    ) : (
                      <>
                        <input
                          className="border-line px-4 pt-3 pb-3 rounded-lg w-1/2"
                          type="text"
                          placeholder="Enter OTP"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                        />
                        <button type="button" className="button-main" onClick={handleVerifyOtp}>
                          Verify OTP
                        </button>
                      </>
                    )}
                  </div>
                )}
                {/* Password */}
                <div className="pass mt-5">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    type="password"
                    placeholder="Password *"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!isPhoneVerified}
                  />
                </div>
                {/* Confirm Password */}
                <div className="confirm-pass mt-5">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    type="password"
                    placeholder="Confirm Password *"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!isPhoneVerified}
                  />
                </div>
                {/* Terms */}
                <div className='flex items-center mt-5'>
                  <div className="block-input">
                    <input
                      type="checkbox"
                      id='terms'
                      checked={isTermsChecked}
                      onChange={(e) => setIsTermsChecked(e.target.checked)}
                      disabled={!isPhoneVerified}
                    />
                    <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox' />
                  </div>
                  <label htmlFor='terms' className="pl-2 cursor-pointer text-secondary2">
                    I agree to the
                    <Link href={'#!'} className='text-black hover:underline pl-1'>Terms of User</Link>
                  </label>
                </div>
                {/* Error/Success Alerts */}
                {error && (
                  <div className="flex items-center border border-red-500 !text-red-500 px-4 py-2 mt-4 rounded-md text-sm">
                    <Icon.WarningCircle size={20} weight="bold" className="mr-2" color='red' />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="flex items-center border border-green-500 text-green-600 px-4 py-2 mt-4 rounded-md text-sm">
                    <Icon.CheckCircle size={20} weight="bold" className="mr-2" color='green' />
                    <span>{success}</span>
                  </div>
                )}
                {/* Register Button */}
                {isEmailVerified && isPhoneVerified && (
                  <div className="block-button md:mt-7 mt-4">
                    <button className="button-main">Register</button>
                  </div>
                )}
              </form>
            </div>

            <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
              <div className="text-content">
                <div className="heading4">Already have an account?</div>
                <div className="mt-2 text-secondary">
                  Welcome back. Sign in to access your personalized experience, saved preferences, and more.
                </div>
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
  );
};

export default Register;
