'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as Icon from "@phosphor-icons/react/dist/ssr"
import ProtectedRoute from '@/components/ProtectedRoutes/ProtectedRoutes'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import SuccessAlert from '@/components/AlertNotifications/SuccessNotification'
import ErrorNotification from '@/components/AlertNotifications/ErrorNotification'
import { ThreeCircles } from 'react-loader-spinner'


interface BankAccountFormData {
    account_holder_name: string
    bank_name: string
    account_number: string
    confirm_account_number: string
    ifsc_code: string
    branch_name: string
    account_type: string
    upi_id?: string
    registered_phone: string
    user_email: string
}

export default function BankAccountPage() {
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")
    const [formData, setFormData] = useState<BankAccountFormData>({
        account_holder_name: '',
        bank_name: '',
        account_number: '',
        confirm_account_number: '',
        ifsc_code: '',
        branch_name: '',
        account_type: 'savings',
        upi_id: '',
        registered_phone: '',
        user_email: 'abc@test.com'
    })

    useEffect(() => {
        fetchBankDetails();
    }, []);


    const fetchBankDetails = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await axios.get(
            "http://localhost:8000/api/bankDetailsService/getBankDetails",
            {
                headers: {
                "accept": "application/json",
                "Authorization": token
                }
            }
            );

            // ✅ Update formData
            setFormData(prev => ({
            ...prev,
            ...response.data,   // API response overrides defaults
            user_email: prev.user_email // keep default email if API doesn’t return it
            }));

        } catch (error: any) {
            console.error("Error fetching bank details:", error.response?.data || error.message);
        }
    };


    // Load token from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('token')
        if (savedToken) {
            setToken(savedToken)
        }
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const validateForm = () => {
        // Check if account numbers match
        if (formData.account_number !== formData.confirm_account_number) {
            setError('Account numbers do not match')
            return false
        }

        // Validate IFSC code format (basic validation)
        // const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
        // if (!ifscRegex.test(formData.ifsc_code)) {
        //     setError('Invalid IFSC code format')
        //     return false
        // }

        // Validate phone number
        const phoneRegex = /^[6-9]\d{9}$/
        if (!phoneRegex.test(formData.registered_phone)) {
            setError('Invalid phone number format')
            return false
        }

        // Validate account number length
        if (formData.account_number.length < 8 || formData.account_number.length > 18) {
            setError('Account number should be between 8-18 digits')
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.account_holder_name || !formData.bank_name || !formData.account_number || !formData.confirm_account_number || !formData.ifsc_code || !formData.branch_name || !formData.account_type || !formData.registered_phone) {
            setError('Please fill in all required fields')
            return
        }
        if (!token) {
            setError('No authentication token found. Please log in again.')
            return
        }

        if (!validateForm()) {
            return
        }

        setIsLoading(true)
        setSuccess("")
        const { confirm_account_number, ...payload } = formData

        try {
            const response = await axios.put(
                'http://localhost:8000/api/bankDetailsService/addOrUpdateBankDetails',
                payload,
                {
                    headers: {
                        'Authorization': token || localStorage.getItem('token'),
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            )

            setSuccess(response.data.message || 'Bank account details added successfully')

        } catch (error: any) {
            console.error('Failed to add bank account:', error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to add bank account details'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ProtectedRoute>
            {error && (<ErrorNotification error={error} setError={setError} />)}
            {success && (<SuccessAlert success={success} setSuccess={setSuccess} /> )}
            <div className="bank-account-page">
                <form onSubmit={handleSubmit} className="bank-form bg-surface lg:px-7 px-4 lg:py-10 py-5 md:rounded-[20px] rounded-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Account Holder Name */}
                        <div className="form-group">
                            <label className="block text-sm font-medium mb-2">
                                Account Holder Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="account_holder_name"
                                value={formData.account_holder_name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter account holder name"
                                required
                            />
                        </div>

                        {/* Bank Name */}
                        <div className="form-group">
                            <label className="block text-sm font-medium mb-2">
                                Bank Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="bank_name"
                                value={formData.bank_name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter bank name"
                                required
                            />
                        </div>

                        {/* Account Number */}
                        <div className="form-group">
                            <label className="block text-sm font-medium mb-2">
                                Account Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="account_number"
                                value={formData.account_number}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter account number"
                                required
                            />
                        </div>

                        {/* Confirm Account Number */}
                        <div className="form-group">
                            <label className="block text-sm font-medium mb-2">
                                Confirm Account Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="confirm_account_number"
                                value={formData.confirm_account_number}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Re-enter account number"
                                required
                            />
                        </div>

                        {/* IFSC Code */}
                        <div className="form-group">
                            <label className="block text-sm font-medium mb-2">
                                IFSC Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="ifsc_code"
                                value={formData.ifsc_code}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter IFSC code (e.g., SBIN0001234)"
                                style={{ textTransform: 'uppercase' }}
                                required
                            />
                        </div>

                        {/* Branch Name */}
                        <div className="form-group">
                            <label className="block text-sm font-medium mb-2">
                                Branch Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="branch_name"
                                value={formData.branch_name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter branch name"
                                required
                            />
                        </div>

                        {/* Account Type */}
                        <div className="form-group">
                            <label className="block text-sm font-medium mb-2">
                                Account Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="account_type"
                                value={formData.account_type}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="savings">Savings Account</option>
                                <option value="current">Current Account</option>
                                <option value="salary">Salary Account</option>
                            </select>
                        </div>

                        {/* Phone Number */}
                        <div className="form-group">
                            <label className="block text-sm font-medium mb-2">
                                Registered Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="registered_phone"
                                value={formData.registered_phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter 10-digit phone number"
                                required
                            />
                        </div>
                    </div>

                    {/* UPI ID (Optional) */}
                    <div className="form-group mt-6">
                        <label className="block text-sm font-medium mb-2">
                            UPI ID (Optional)
                        </label>
                        <input
                            type="text"
                            name="upi_id"
                            value={formData.upi_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter UPI ID (e.g., user@paytm, user@googlepay)"
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className="form-group mt-6 space-y-3">

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-start gap-2">
                                <Icon.Info size={20} className="text-blue-600 mt-0.5" />
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium mb-1">Notice:</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li>This information will only be used for payment processing</li>
                                        <li>Please ensure all details are accurate to avoid payment delays</li>
                                        <li>We recommed adding UPI ID for faster transactions.</li>
                                        <li>If UPI ID is present, all the transactions will be done through that ID</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="form-actions mt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full lg:w-auto px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Adding Bank Account...
                                </>
                            ) : (
                                <>
                                    <Icon.Bank size={20} />
                                    Add Bank Account
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </ProtectedRoute>
    )
}