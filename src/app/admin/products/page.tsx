// 'use client'

// import React, { useState, useEffect } from 'react'
// import {
//   DataTable,
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableHeader,
//   TableBody,
//   TableCell,
//   Loading,
//   InlineNotification,
//   Button,
//   Tag
// } from '@carbon/react'

// const OrdersPage = () => {
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // Define table headers
//   const headers = [
//     { key: 'product_id', header: 'Product ID' },
//     { key: 'name', header: 'Product Name' },
//     { key: 'category', header: 'Category' },
//     { key: 'original_price', header: 'Original Price' },
//     { key: 'discounted_price', header: 'Discounted Price' },
//     { key: 'size', header: 'Size' },
//     { key: 'quantity', header: 'Quantity' },
//     { key: 'status', header: 'Status' }
//   ]

//   useEffect(() => {
//     fetchProducts()
//   }, [])

//   const fetchProducts = async () => {
//     try {
//       setLoading(true)
      
//       // Get token from localStorage
//       const token = localStorage.getItem('token')
      
//       if (!token) {
//         throw new Error('No authentication token found')
//       }

//       const response = await fetch('http://localhost:8000/api/products/getAllProducts', {
//         method: 'GET',
//         headers: {
//           'accept': 'application/json',
//           // 'Authorization': `${token}`,
//           'Content-Type': 'application/json'
//         }
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       console.log('API Response:', data)

//       // Transform data for the table
//       const transformedData = data.products?.map((product:any, index: any) => ({
//         id: `${index}`,
//         product_id: product.product_id || 'N/A',
//         name: product.name || 'Unknown Product',
//         category: product.category || 'N/A',
//         original_price: `$${product.original_price || 0}`,
//         discounted_price: `$${product.discounted_price || 0}`,
//         size: product.size || 'N/A',
//         quantity: product.quantity || 0,
//         status: product.discounted_price < product.original_price ? 'On Sale' : 'Regular'
//       })) || []

//       setProducts(transformedData)
//     } catch (err: any) {
//       console.error('Error fetching products:', err)
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleRefresh = () => {
//     fetchProducts()
//   }

//   if (loading) {
//     return (
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '400px' 
//       }}>
//         <Loading description="Loading products..." withOverlay={false} />
//       </div>
//     )
//   }

//   return (
//     <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
//       <div style={{ marginBottom: '2rem' }}>
//         <h1 style={{ 
//           fontSize: '2rem', 
//           fontWeight: '400', 
//           marginBottom: '1rem',
//           color: '#161616'
//         }}>
//           Products Overview
//         </h1>
//         <p style={{ 
//           fontSize: '1rem', 
//           color: '#525252', 
//           marginBottom: '1.5rem' 
//         }}>
//           Manage and view all your products in one place
//         </p>
        
//         <Button 
//           kind="primary" 
//           onClick={handleRefresh}
//           style={{ marginBottom: '1rem' }}
//         >
//           Refresh Data
//         </Button>
//       </div>

//       {error && (
//         <div style={{ marginBottom: '1rem' }}>
//           <InlineNotification
//             kind="error"
//             title="Error"
//             subtitle={error}
//             onCloseButtonClick={() => setError(null)}
//           />
//         </div>
//       )}

//       {products.length === 0 && !error ? (
//         <InlineNotification
//           kind="info"
//           title="No Products"
//           subtitle="No products found in the system"
//           hideCloseButton
//         />
//       ) : (
//         <DataTable
//           rows={products}
//           headers={headers}
//           render={({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
//             <TableContainer
//               title="Products Data"
//               description="Complete list of all products with their details"
//             >
//               <Table {...getTableProps()} size="md">
//                 <TableHead>
//                   <TableRow>
//                     {headers.map((header) => (
//                       <TableHeader {...getHeaderProps({ header })} key={header.key}>
//                         {header.header}
//                       </TableHeader>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {rows.map((row) => (
//                     <TableRow {...getRowProps({ row })} key={row.id}>
//                       {row.cells.map((cell) => (
//                         <TableCell key={cell.id}>
//                           {cell.info.header === 'status' ? (
//                             <Tag
//                               type={cell.value === 'On Sale' ? 'red' : 'cool-gray'}
//                               size="sm"
//                             >
//                               {cell.value}
//                             </Tag>
//                           ) : (
//                             cell.value
//                           )}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         />
//       )}

//       {products.length > 0 && (
//         <div style={{ marginTop: '1rem', color: '#525252', fontSize: '0.875rem' }}>
//           Showing {products.length} products
//         </div>
//       )}
//     </div>
//   )
// }

// export default OrdersPage




//==========================================================================================


'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Product {
  product_id: string;
  name: string;
  description: string;
  original_price: number;
  image_url?: string;
}

const ProductsListingPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products/getAllProducts`);
        const rawProducts: Product[] = res.data.products || [];

        const productsWithImages = await Promise.all(
          rawProducts.map(async (product) => {
            try {
              const imageRes = await axios.get(
                `${API_BASE}/products/getProductImageURL/${product.product_id}`
              );
              return {
                ...product,
                image_url: imageRes.data.image_url,
              };
            } catch {
              return {
                ...product,
                image_url: '/placeholder.png',
              };
            }
          })
        );

        setProducts(productsWithImages);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCardClick = (productId: string) => {
    router.push(`/admin/products/edit/${productId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        All Products
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} key={product.product_id}>
            <Card
              onClick={() => handleCardClick(product.product_id)}
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                height: isMobile ? 'auto' : 220,
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                image={product.image_url || '/placeholder.png'}
                alt={product.name}
                sx={{
                  width: isMobile ? '100%' : 220,
                  height: isMobile ? 200 : '100%',
                  objectFit: 'contain',
                }}
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = '/placeholder.png')
                }
              />

              <CardContent
                sx={{
                  flex: 1,
                  padding: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  ID: {product.product_id}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold' }}
                  noWrap
                >
                  {product.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: isMobile ? 4 : 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {product.description}
                </Typography>

                <Typography
                  variant="subtitle1"
                  color="primary"
                  fontWeight="bold"
                  mt={1}
                >
                  ₹{product.original_price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductsListingPage;
