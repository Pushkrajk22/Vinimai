'use client';

import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTag } from 'react-icons/fa';

type Offer = {
    offer_id: string;
    product_id: string;
    original_price?: number;
    offered_price: number;
    offered_by: string;
    offered_to: string;
    status: string;
    created_at: string;
};

const fetchOffers = async (token: string): Promise<Offer[]> => {
    const res = await fetch('http://localhost:8000/api/offers/getReceivedOffers', {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': token,
        },
    });
    if (!res.ok) throw new Error('Failed to fetch offers');
    const data = await res.json();
    return data.offers || [];
};

export default function ReceivedOffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token') || '';
        fetchOffers(token)
            .then(setOffers)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading offers...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
                    <FaTag className="text-blue-500" /> Received Offers
                </h1>
                {offers.length === 0 ? (
                    <div className="text-gray-500 text-center py-12 text-lg">No offers found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-y-2">
                            <thead>
                                <tr className="bg-blue-100 text-blue-700">
                                    <th className="py-3 px-4 rounded-l-xl">Offer ID</th>
                                    <th className="py-3 px-4">Product ID</th>
                                    <th className="py-3 px-4">Original Price</th>
                                    <th className="py-3 px-4">Offered Price</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 rounded-r-xl">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offers.map((offer) => (
                                    <tr key={offer.offer_id} className="bg-white shadow hover:shadow-lg transition rounded-xl">
                                        <td className="py-3 px-4 font-mono text-xs text-gray-700">{offer.offer_id}</td>
                                        <td className="py-3 px-4 font-mono text-xs text-gray-700">{offer.product_id}</td>
                                        <td className="py-3 px-4 text-gray-900 font-semibold">
                                            {offer.original_price !== undefined ? `₹${offer.original_price}` : '-'}
                                        </td>
                                        <td className="py-3 px-4 text-blue-700 font-bold">₹{offer.offered_price}</td>
                                        <td className="py-3 px-4">
                                            {offer.status === 'Accepted' ? (
                                                <span className="flex items-center gap-1 text-green-600 font-semibold"><FaCheckCircle /> Accepted</span>
                                            ) : offer.status === 'Rejected' ? (
                                                <span className="flex items-center gap-1 text-red-500 font-semibold"><FaTimesCircle /> Rejected</span>
                                            ) : (
                                                <span className="text-yellow-600 font-semibold">Pending</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-gray-500">{new Date(offer.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}