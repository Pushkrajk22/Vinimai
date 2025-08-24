'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as Icon from "@phosphor-icons/react/dist/ssr"
import ProtectedRoute from '@/components/ProtectedRoutes/ProtectedRoutes'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'

interface ProductFormData {
    name: string
    description: string
    original_price: number
    discounted_price: number
    category: string
    tag: string
    size: string
    image_urls: string[]
    isVinimaiVerifed: boolean
    about: string
}

export default function AddProductPage() {
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [imageUrl, setImageUrl] = useState('')
    
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        original_price: 0,
        discounted_price: 0,
        category: '',
        tag: '',
        size: '',
        image_urls: [],
        isVinimaiVerifed: false,
        about: ''
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
        } else if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: parseFloat(value) || 0
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleAddImageUrl = () => {
        if (imageUrl.trim()) {
            setFormData(prev => ({
                ...prev,
                image_urls: [...prev.image_urls, imageUrl.trim()]
            }))
            setImageUrl('')
        }
    }

    const handleRemoveImageUrl = (index: number) => {
        setFormData(prev => ({
            ...prev,
            image_urls: prev.image_urls.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!token) {
            setMessage({ type: 'error', text: 'No authentication token found. Please log in again.' })
            return
        }

        setIsLoading(true)
        setMessage(null)

        try {
            const response = await axios.post(
                'http://localhost:8000/api/products/addProduct',
                formData,
                {
                    // headers: {
                    //     'accept': 'application/json',
                    //     'X-GitHub-Token': token||localStorage.getItem('token'),
                    //     'Content-Type': 'application/json'
                    // }
                        headers: {
                        'Authorization': token || localStorage.getItem('token'), // Use token from state or localStorage
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            )

            setMessage({ type: 'success', text: 'Product added successfully!' })
            
            // Reset form
            setFormData({
                name: '',
                description: '',
                original_price: 0,
                discounted_price: 0,
                category: '',
                tag: '',
                size: '',
                image_urls: [],
                isVinimaiVerifed: false,
                about: ''
            })

        } catch (error: any) {
            console.error('Failed to add product:', error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to add product'
            setMessage({ type: 'error', text: errorMessage })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ProtectedRoute>
        
        
            <div id="header" className='relative w-full'>
                    <MenuOne props="bg-transparent" />
                    <Breadcrumb heading='Sell a Product' subHeading='Sell Prouct' />
            </div>
        <div className="add-product-page">
            {/* <div className="heading flex items-center justify-between mb-8">
                <h1 className="heading4">Add New Product</h1>
            </div> */}

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

            <form onSubmit={handleSubmit} className="product-form bg-surface lg:px-7 px-4 lg:py-10 py-5 md:rounded-[20px] rounded-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div className="form-group">
                        <label className="block text-sm font-medium mb-2">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label className="block text-sm font-medium mb-2">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter category"
                            required
                        />
                    </div>

                    {/* Original Price */}
                    <div className="form-group">
                        <label className="block text-sm font-medium mb-2">
                            Original Price <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="original_price"
                            value={formData.original_price}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    {/* Discounted Price */}
                    <div className="form-group">
                        <label className="block text-sm font-medium mb-2">
                            Discounted Price
                        </label>
                        <input
                            type="number"
                            name="discounted_price"
                            value={formData.discounted_price}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    {/* Tag */}
                    <div className="form-group">
                        <label className="block text-sm font-medium mb-2">Tag</label>
                        <input
                            type="text"
                            name="tag"
                            value={formData.tag}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter tag"
                        />
                    </div>

                    {/* Size */}
                    <div className="form-group">
                        <label className="block text-sm font-medium mb-2">Size</label>
                        <input
                            type="text"
                            name="size"
                            value={formData.size}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter size (e.g., S, M, L, XL)"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="form-group mt-6">
                    <label className="block text-sm font-medium mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter product description"
                        required
                    />
                </div>

                {/* About */}
                <div className="form-group mt-6">
                    <label className="block text-sm font-medium mb-2">About</label>
                    <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Additional information about the product"
                    />
                </div>

                {/* Image URLs */}
                <div className="form-group mt-6">
                    <label className="block text-sm font-medium mb-2">Product Images</label>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="flex-1 px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter image URL"
                        />
                            <button
                                type="button"
                                onClick={handleAddImageUrl}
                                disabled={!imageUrl.trim()}
                                className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Icon.Plus size={20} className="text-black" />
                                <span className="hidden sm:inline text-black">Add</span>
                            </button>
                    </div>
                    
                    {formData.image_urls.length > 0 && (
                        <div className="image-urls-list space-y-2">
                            {formData.image_urls.map((url, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                    <span className="flex-1 text-sm text-gray-600 truncate">{url}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImageUrl(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Icon.Trash size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Vinimai Verified */}
                <div className="form-group mt-6">
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="isVinimaiVerifed"
                            checked={formData.isVinimaiVerifed}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium">Vinimai Verified Product</span>
                    </label>
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
                                Adding Product...
                            </>
                        ) : (
                            <>
                                <Icon.Plus size={20} />
                                Add Product
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