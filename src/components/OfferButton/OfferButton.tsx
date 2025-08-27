'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import ProtectedRoute from '../ProtectedRoutes/ProtectedRoutes';
import SuccessAlert from '../AlertNotifications/SuccessNotification';
import ErrorAlert from '../AlertNotifications/ErrorNotification';
import axios from 'axios';


export default function OfferButton() {
  const [open, setOpen] = useState(false);
  const [offered_price, setOfferedPrice] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const product_id = searchParams.get('id'); 


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  if (!token) return setError('You must be logged in to make an offer.');

  try {
    const res = await axios.post(
      'http://localhost:8000/api/offers/placeOffer',
      { product_id, offered_price },
      {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    setSuccess('Offer submitted successfully!');
  } catch (err: any) {
    // Axios error handling
    if (err.response && err.response.data && err.response.data.detail) {
      setError(err.response.data.detail);
    } else {
      setError(err.detail || 'Something went wrong.');
    }
  }
};


  return (
    <ProtectedRoute>
      <div className="share flex items-center gap-3 cursor-pointer" onClick={() => setOpen(true)}>
        <div className="share-btn md:w-12 md:h-12 w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white">
          <Icon.Money weight="fill" className="heading4" />
        </div>
        <span>Make Offer</span>
      </div>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-secondary2"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <SuccessAlert success={success} setSuccess={setSuccess} />
            <ErrorAlert error={error} setError={setError} />
            <h2 className="text-lg font-bold mb-4">Make an Offer</h2>
            <p className="mb-4 text-sm text-secondary">
              Please note that you can only make an offer once per product. We recommend
              not offering below 50% of the original price to avoid rejection.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="number"
                placeholder="Enter amount you want to offer"
                className="border border-line rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green"
                value={offered_price}
                onChange={(e) => setOfferedPrice(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-green text-black font-semibold py-2 rounded-lg hover:bg-green/90 duration-300"
              >
                Submit Offer
              </button>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
