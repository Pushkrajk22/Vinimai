'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ThreeCircles } from 'react-loader-spinner';
import ProtectedRoute from '@/components/ProtectedRoutes/ProtectedRoutes';
import axios from 'axios';

type Order = {
  order_id: string;
  user_email: string;
  product_id: string;
  product_name: string;
  total_price: number;
  order_status: string;
  created_at: string;
};

const OrderDetails = () => {
  const params = useParams();
  const { orderId } = params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [productImage, setProductImage] = useState<string>('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
        const res = await axios.get(`http://localhost:8000/api/orders/getOrder/${orderId}`, {
          headers: { Authorization: token || '', accept: 'application/json' },
        });
        setOrder(res.data.order);
        // Fetch product image
        if (res.data.order && res.data.order.product_id) {
          const imgRes = await axios.get(`http://localhost:8000/api/products/getProductImageURL/${res.data.order.product_id}`, {
            headers: { accept: 'application/json' },
          });
          setProductImage(imgRes.data.image_urls || '');
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  const handleCancelOrReturn = async () => {
    if (!order) return;
    try {
      setActionLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      await axios.put(`http://localhost:8000/api/orders/${order.order_id}/cancel`, {}, {
        headers: { Authorization: token || '', accept: 'application/json' },
      });
      alert('Order cancelled successfully!');
      setOrder({ ...order, order_status: 'Cancelled' });
    } catch (err) {
      console.error(err);
      alert('Failed to cancel order.');
    }
    setActionLoading(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <ThreeCircles visible={true} height="100" width="100" color="#4fa94d" />
    </div>
  );

  if (!order) return <div className="p-8 text-center text-red-500 font-semibold">Order not found</div>;

  return (
    <ProtectedRoute>
<div className="max-w-3xl mx-auto p-6 bg-surface rounded-lg shadow-md mt-8">
  <h1 className="text-3xl font-bold mb-6 text-center text-black">Order Details</h1>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <h2 className="text-lg font-semibold text-secondary">Product Name</h2>
      <p className="text-black">{order.product_name}</p>
    </div>
    <div>
      <h2 className="text-lg font-semibold text-secondary">Order ID</h2>
      <p className="text-black">{order.order_id}</p>
    </div>
    <div>
      <h2 className="text-lg font-semibold text-secondary">Status</h2>
      <p className={`font-semibold ${order.order_status === 'Cancelled' ? 'text-red' : 'text-success'}`}>
        {order.order_status}
      </p>
    </div>
    <div>
      <h2 className="text-lg font-semibold text-secondary">Price</h2>
      <p className="text-black">₹{order.total_price}</p>
    </div>
    <div>
      <h2 className="text-lg font-semibold text-secondary">Product Image</h2>
      {productImage ? (
        <img src={productImage} alt={order.product_name} className="w-32 h-32 object-cover rounded" />
      ) : (
        <span className="text-gray-400">No image available</span>
      )}
    </div>
    <div className="md:col-span-2">
      <h2 className="text-lg font-semibold text-secondary">Ordered On</h2>
      <p className="text-black">{new Date(order.created_at).toLocaleString()}</p>
    </div>
  </div>

  <div className="mt-8 text-center">
    {order.order_status !== 'Cancelled' && (
      <button
        onClick={handleCancelOrReturn}
        disabled={actionLoading}
        className="px-6 py-3 bg-red text-white rounded-lg font-semibold hover:bg-pink transition disabled:opacity-50"
      >
        {actionLoading ? 'Processing...' : 'Cancel / Return Order'}
      </button>
    )}
  </div>
</div>

    </ProtectedRoute>
  );
};

export default OrderDetails;
