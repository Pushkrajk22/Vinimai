'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  TextField,
  Switch,
  Typography,
  FormControlLabel,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Snackbar, Alert } from '@mui/material'
import SuccessAlert from '@/components/AlertNotifications/SuccessNotification'


const readOnlyFields = ['product_id', 'added_by', 'created_at']
const booleanFields = ['isAvailable', 'isVinimaiVerified']

const EditProductPage = () => {
  const { product_id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [success, setSuccess] = useState('') // ✅ Success message state
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products/getProduct/${product_id}`)
        const fetchedProduct = res.data.product

        // Normalize boolean string values to actual booleans
        booleanFields.forEach(field => {
          if (fetchedProduct[field] === 'True') fetchedProduct[field] = true
          else if (fetchedProduct[field] === 'False') fetchedProduct[field] = false
        })

        setProduct(fetchedProduct)
      } catch (err) {
        console.error(err)
        setError('Failed to fetch product data')
      } finally {
        setLoading(false)
      }
    }

    if (product_id) fetchProduct()
  }, [product_id])

  const handleChange = (key: string, value: any) => {
    setProduct(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!product) return
    setSaving(true)

    const token = localStorage.getItem('token')

    // Convert booleans to 'True'/'False' strings
    const updatedProduct = { ...product }
    booleanFields.forEach(field => {
      if (field in updatedProduct) {
        updatedProduct[field] = updatedProduct[field] ? 'True' : 'False'
      }
    })

    try {
      await axios.put(
        `${API_BASE}/products/updateProduct/${product_id}`,
        updatedProduct,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token || '',
          },
        }
      )
      setSuccess('Product updated successfully!') // ✅ Set success message
      setSnackbarOpen(true) // ✅ Show success toast

      // router.push('/admin/products')
    } catch (err) {
      console.error(err)
      setError('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    )
  }

  if (!product) return <Box p={4}>No product found</Box>

  return (
    <Box maxWidth={700} mx="auto" p={4} boxShadow={2} borderRadius={2} bgcolor="white">
      <Typography variant="h5" gutterBottom>
        Edit Product
      </Typography>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSave()
        }}
      >
        <Stack spacing={3}>
          {Object.entries(product).map(([key, value]) => {
            if (Array.isArray(value)) {
              return (
                <TextField
                  key={key}
                  label={key}
                  value={value.join(', ')}
                  onChange={(e) =>
                    handleChange(key, e.target.value.split(',').map(i => i.trim()))
                  }
                  multiline
                  fullWidth
                />
              )
            }

            // ✅ Render Switch for boolean fields
            if (booleanFields.includes(key)) {
              const boolValue = value === true

              return (
                <FormControlLabel
                  key={key}
                  control={
                    <Switch
                      checked={boolValue}
                      onChange={(e) => handleChange(key, e.target.checked)}
                    />
                  }
                  label={key}
                />
              )
            }

            if (typeof value === 'number') {
              return (
                <TextField
                  key={key}
                  label={key}
                  type="number"
                  value={value}
                  onChange={(e) => handleChange(key, parseFloat(e.target.value))}
                  fullWidth
                />
              )
            }

            if (readOnlyFields.includes(key)) {
              return (
                <TextField
                  key={key}
                  label={key}
                  value={value}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              )
            }

            return (
              <TextField
                key={key}
                label={key}
                value={value || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                multiline={typeof value === 'string' && value.length > 80}
                fullWidth
              />
            )
          })}

          {error && (
            <Typography color="error" fontSize="0.9rem">
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={saving}
            fullWidth
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Stack>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {/* <SuccessAlert success={success} setSuccess={setSuccess} />         */}
        <Alert severity="success" sx={{ width: '100%' }} onClose={() => setSnackbarOpen(false)}>
          Product updated successfully!
        </Alert>
      </Snackbar>

    </Box>
  )
}

export default EditProductPage
