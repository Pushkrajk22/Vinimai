'use client'

import React, { useState, useEffect } from 'react'
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Loading,
  InlineNotification,
  Button,
  Tag
} from '@carbon/react'

const OrdersPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Define table headers
  const headers = [
    { key: 'product_id', header: 'Product ID' },
    { key: 'name', header: 'Product Name' },
    { key: 'category', header: 'Category' },
    { key: 'original_price', header: 'Original Price' },
    { key: 'discounted_price', header: 'Discounted Price' },
    { key: 'size', header: 'Size' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'status', header: 'Status' }
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      // Get token from localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch('http://localhost:8000/api/products/getAllProducts', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          // 'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response:', data)

      // Transform data for the table
      const transformedData = data.products?.map((product, index) => ({
        id: `${index}`,
        product_id: product.product_id || 'N/A',
        name: product.name || 'Unknown Product',
        category: product.category || 'N/A',
        original_price: `$${product.original_price || 0}`,
        discounted_price: `$${product.discounted_price || 0}`,
        size: product.size || 'N/A',
        quantity: product.quantity || 0,
        status: product.discounted_price < product.original_price ? 'On Sale' : 'Regular'
      })) || []

      setProducts(transformedData)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchProducts()
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <Loading description="Loading products..." withOverlay={false} />
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '400', 
          marginBottom: '1rem',
          color: '#161616'
        }}>
          Products Overview
        </h1>
        <p style={{ 
          fontSize: '1rem', 
          color: '#525252', 
          marginBottom: '1.5rem' 
        }}>
          Manage and view all your products in one place
        </p>
        
        <Button 
          kind="primary" 
          onClick={handleRefresh}
          style={{ marginBottom: '1rem' }}
        >
          Refresh Data
        </Button>
      </div>

      {error && (
        <div style={{ marginBottom: '1rem' }}>
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            onCloseButtonClick={() => setError(null)}
          />
        </div>
      )}

      {products.length === 0 && !error ? (
        <InlineNotification
          kind="info"
          title="No Products"
          subtitle="No products found in the system"
          hideCloseButton
        />
      ) : (
        <DataTable
          rows={products}
          headers={headers}
          render={({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
            <TableContainer
              title="Products Data"
              description="Complete list of all products with their details"
            >
              <Table {...getTableProps()} size="md">
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })} key={header.key}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow {...getRowProps({ row })} key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>
                          {cell.info.header === 'status' ? (
                            <Tag
                              type={cell.value === 'On Sale' ? 'red' : 'cool-gray'}
                              size="sm"
                            >
                              {cell.value}
                            </Tag>
                          ) : (
                            cell.value
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        />
      )}

      {products.length > 0 && (
        <div style={{ marginTop: '1rem', color: '#525252', fontSize: '0.875rem' }}>
          Showing {products.length} products
        </div>
      )}
    </div>
  )
}

export default OrdersPage