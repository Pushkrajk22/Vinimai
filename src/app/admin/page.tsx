// 'use client'

// // app/account/settings/page.tsx
// import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
// import MenuOne from "@/components/Header/Menu/MenuOne";
// import ProtectedRoute from "@/components/ProtectedRoutes/ProtectedRoutes";
// import React from 'react'
// import { ThreeCircles } from 'react-loader-spinner'
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const MyAccount = () => {
//   // Dummy data for demonstration
//   const stats = {
//     users: 1200,
//     orders: 350,
//     products: 85,
//     offers: 15,
//     totalSales: 125000,
//     productRequests: 30
//   };

//   const [totalSales, setTotalSales] = useState(0);
//   useEffect(() => {
//     const fetchTotalSales = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminDashboard/getTotalSalesAmount`,
//           {
//             headers: {
//               Accept: 'application/json',
//             },
//           }
//         );

//         // The response is: { "data": 240 }
//         setTotalSales(response.data.data);
//       } catch (error) {
//         console.error('Failed to fetch total sales:', error);
//       }
//     };

//     fetchTotalSales();
//   }, []);


//   return (
//     <div className="dashboard-container p-8">
//       <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         <div className="stat-card bg-white shadow rounded-lg p-6 flex flex-col items-center">
//           <span className="text-xl font-semibold">Users</span>
//           <span className="text-4xl font-bold mt-2">{stats.users}</span>
//         </div>
//         <div className="stat-card bg-white shadow rounded-lg p-6 flex flex-col items-center">
//           <span className="text-xl font-semibold">Orders</span>
//           <span className="text-4xl font-bold mt-2">{stats.orders}</span>
//         </div>
//         <div className="stat-card bg-white shadow rounded-lg p-6 flex flex-col items-center">
//           <span className="text-xl font-semibold">Products</span>
//           <span className="text-4xl font-bold mt-2">{stats.products}</span>
//         </div>
//         <div className="stat-card bg-white shadow rounded-lg p-6 flex flex-col items-center">
//           <span className="text-xl font-semibold">Offers Made</span>
//           <span className="text-4xl font-bold mt-2">{stats.offers}</span>
//         </div>
//         <div className="stat-card bg-white shadow rounded-lg p-6 flex flex-col items-center">
//           <span className="text-xl font-semibold">Product Requests</span>
//           <span className="text-4xl font-bold mt-2">{stats.productRequests}</span>
//         </div>
//         <div className="stat-card bg-white shadow rounded-lg p-6 flex flex-col items-center col-span-1 md:col-span-3">
//           <span className="text-xl font-semibold">Total Sales</span>
//           <span className="text-4xl font-bold mt-2">₹{totalSales}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyAccount




//===============================


'use client'

import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Container, CircularProgress } from '@mui/material';
import axios from 'axios';

const MyAccount = () => {
  const [data, setData] = useState({
    users: null,
    orders: null,
    products: null,
    offers: null,
    requests: null,
    sales: null,
  });

  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersRes,
          ordersRes,
          productsRes,
          offersRes,
          requestsRes,
          salesRes,
        ] = await Promise.all([
          axios.get(`${API_BASE}/adminDashboard/getUsersCount`),
          axios.get(`${API_BASE}/adminDashboard/getOrdersCount`),
          axios.get(`${API_BASE}/adminDashboard/getProductsCount`),
          axios.get(`${API_BASE}/adminDashboard/getOffersMadeCount`),
          axios.get(`${API_BASE}/adminDashboard/getProductRequestsCount`),
          axios.get(`${API_BASE}/adminDashboard/getTotalSalesAmount`),
        ]);

        setData({
          users: usersRes.data?.data ?? 0,
          orders: ordersRes.data?.data ?? 0,
          products: productsRes.data?.data ?? 0,
          offers: offersRes.data?.data ?? 0,
          requests: requestsRes.data?.data ?? 0,
          sales: salesRes.data?.data ?? 0,
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cardStyle = {
    backgroundColor: '#1F1F1F',
    color: 'white',
    borderRadius: '12px',
    height: '120px',
    width: '200px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box' as const,
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: 600,
    color: 'white',
  };

  const valueStyle = {
    fontSize: '32px',
    fontWeight: 700,
    marginTop: '8px',
    color: 'white',
  };

  const StatCard = ({ label, value }: { label: string; value: number | string | null }) => (
    <Paper
      elevation={0}
      sx={{
        ...cardStyle,
        boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.3)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        '&:hover': {
          boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.45)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Typography sx={titleStyle}>{label}</Typography>
      {value === null ? (
        <CircularProgress size={32} sx={{ color: 'white', marginTop: 2 }} />
      ) : (
        <Typography sx={valueStyle}>{value}</Typography>
      )}
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4} color="#1F1F1F" >
        Admin Panel
      </Typography>

      <Grid
        container
        spacing={3}
        sx={{
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <Grid item sx={{ mb: 3, mr: 3 }}>
          <StatCard label="Users" value={data.users} />
        </Grid>
        <Grid item sx={{ mb: 3, mr: 3 }}>
          <StatCard label="Orders" value={data.orders} />
        </Grid>
        <Grid item sx={{ mb: 3, mr: 3 }}>
          <StatCard label="Products" value={data.products} />
        </Grid>
        <Grid item sx={{ mb: 3, mr: 3 }}>
          <StatCard label="Offers Made" value={data.offers} />
        </Grid>
        <Grid item sx={{ mb: 3, mr: 3 }}>
          <StatCard label="Product Requests" value={data.requests} />
        </Grid>
        <Grid item sx={{ mb: 3, mr: 3 }}>
          <StatCard label="Total Sales" value={`₹${data.sales}`} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MyAccount;
