'use client'

import React, { useState } from 'react';

const AddProductPage: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('{\n  "name": "string",\n  "description": "string",\n  "original_price": 0,\n  "discounted_price": 0,\n  "category": "string",\n  "tag": "string",\n  "size": "string",\n  "image_urls": ["string"],\n  "isVinimaiVerifed": false,\n  "about": "string"\n}');
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setResponse('❌ Token not found in localStorage.');
        return;
      }

      const payload = JSON.parse(jsonInput); // Validate JSON input

      const res = await fetch('http://localhost:8000/api/products/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'X-GitHub-Token': token,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Request failed');
      }

      setResponse(`✅ Success:\n${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setResponse(`❌ Error:\n${error.message}`);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Add Product</h2>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        rows={18}
        cols={80}
        style={{ fontFamily: 'monospace', fontSize: '14px' }}
      />
      <br />
      <button onClick={handleSubmit} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        Submit Product
      </button>
      {response && (
        <pre style={{ marginTop: '1rem', background: '#f0f0f0', padding: '1rem' }}>
          {response}
        </pre>
      )}
    </div>
  );
};

export default AddProductPage;
