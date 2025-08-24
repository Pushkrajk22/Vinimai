'use client'

// app/account/settings/page.tsx
import axios from 'axios';
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import MenuOne from "@/components/Header/Menu/MenuOne";
import ProtectedRoute from "@/components/ProtectedRoutes/ProtectedRoutes";
import React, { useState } from 'react'
import { ThreeCircles } from 'react-loader-spinner'
import { useRouter } from 'next/navigation';


const MyAccount = () => {
  // Dummy data for demonstration
  const stats = {
    users: 1200,
    orders: 350,
    products: 85,
    offers: 15,
    totalSales: 125000,
    productRequests: 30
  };

  return (
    <div className="dashboard-container p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="stat-card bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <span className="text-xl font-semibold">Users</span>
          <span className="text-4xl font-bold mt-2">{stats.users}</span>
        </div>
        <div className="stat-card bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <span className="text-xl font-semibold">Orders</span>
          <span className="text-4xl font-bold mt-2">{stats.orders}</span>
        </div>
        <div className="stat-card bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <span className="text-xl font-semibold">Products</span>
          <span className="text-4xl font-bold mt-2">{stats.products}</span>
        </div>
        <div className="stat-card bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <span className="text-xl font-semibold">Offers Made</span>
          <span className="text-4xl font-bold mt-2">{stats.offers}</span>
        </div>
        <div className="stat-card bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <span className="text-xl font-semibold">Product Requests</span>
          <span className="text-4xl font-bold mt-2">{stats.productRequests}</span>
        </div>
        <div className="stat-card bg-white shadow rounded-lg p-6 flex flex-col items-center col-span-1 md:col-span-3">
          <span className="text-xl font-semibold">Total Sales</span>
          <span className="text-4xl font-bold mt-2">₹{stats.totalSales.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default MyAccount
