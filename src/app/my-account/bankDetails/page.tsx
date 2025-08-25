'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as Icon from "@phosphor-icons/react/dist/ssr"
import ProtectedRoute from '@/components/ProtectedRoutes/ProtectedRoutes'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'

interface BankAccountFormData {
    account_holder_name: string
    bank_name: string
    account_number: string
    confirm_account_number: string
    ifsc_code: string
    branch_name: string
    account_type: string
    upi_id?: string
    phone_number: string
    is_primary_account: boolean
    is_verified: boolean
}

export default function BankAccountPage() {
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    
    const [formData, setFormData] = useState<BankAccountFormData>({
        account_holder_name: '',
        bank_name: '',
        account_number: '',
        confirm_account_number: '',
        ifsc_code: '',
        branch_name: '',
        account_type: 'savings',
        upi_id: '',
        phone_number: '',
        is_primary_account: true,
        is_verified: false
    })

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
            setMessage({ type: 'error', text: 'Account numbers do not match' })
            return false
        }

        // Validate IFSC code format (basic validation)
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
        if (!ifscRegex.test(formData.ifsc_code)) {
            setMessage({ type: 'error', text: 'Invalid IFSC code format' })
            return false
        }

        // Validate phone number
        const phoneRegex = /^[6-9]\d{9}$/
        if (!phoneRegex.test(formData.phone_number)) {
            setMessage({ type: 'error', text: 'Invalid phone number format' })
            return false
        }

        // Validate account number length
        if (formData.account_number.length < 8 || formData.account_number.length > 18) {
            setMessage({ type: 'error', text: 'Account number should be between 8-18 digits' })
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!token) {
            setMessage({ type: 'error', text: 'No authentication token found. Please log in again.' })
            return
        }

        if (!validateForm()) {
            return
        }

        setIsLoading(true)
        setMessage(null)

        try {
            const response = await axios.post(
                'http://localhost:8000/api/users/addBankAccount',
                formData,
                {
                    headers: {
                        'Authorization': token || localStorage.getItem('token'),
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            )

            setMessage({ type: 'success', text: 'Bank account details added successfully!' })
            
            // Reset form
            setFormData({
                account_holder_name: '',
                bank_name: '',
                account_number: '',
                confirm_account_number: '',
                ifsc_code: '',
                branch_name: '',
                account_type: 'savings',
                upi_id: '',
                phone_number: '',
                is_primary_account: true,
                is_verified: false
            })

        } catch (error: any) {
            console.error('Failed to add bank account:', error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to add bank account details'
            setMessage({ type: 'error', text: errorMessage })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ProtectedRoute>
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Bank Account Details' subHeading='Add Bank Account' />
            </div>

            <div className="bank-account-page">
                {/* Success/Error Messages */}
                {message && (
                    <div className={`message-alert p-4 rounded-lg mb-6 ${
                        message.type === 'success' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                        <div className="flex items-center gap-2">
                            {message.type === 'success' ? (
                                <Icon.CheckCircle size={20} />
                            ) : (
                                <Icon.XCircle size={20} />
                            )}
                            <span>{message.text}</span>
                        </div>
                    </div>
                )}

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
                                name="phone_number"
                                value={formData.phone_number}
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
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="is_primary_account"
                                checked={formData.is_primary_account}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium">Set as Primary Account</span>
                        </label>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-start gap-2">
                                <Icon.Info size={20} className="text-blue-600 mt-0.5" />
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium mb-1">Security Notice:</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li>Your bank details will be encrypted and stored securely</li>
                                        <li>We'll verify your account details before processing payments</li>
                                        <li>This information will only be used for payment processing</li>
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
            <Footer />
        </ProtectedRoute>
    )
}