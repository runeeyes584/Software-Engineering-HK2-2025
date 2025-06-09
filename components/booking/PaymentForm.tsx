'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

// Định nghĩa kiểu dữ liệu cho Booking và FormData
interface Booking {
  id: string;
  totalPrice: number;
}

interface FormData {
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
}

interface Errors {
  cardName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
  submit?: string;
}

const PaymentForm: React.FC = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (!bookingId) {
      console.error('No bookingId found in the URL');
      setLoading(false); // Không có bookingId, dừng loading
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await axios.get(`/api/booking/${bookingId}`);
        console.log('Booking data:', res.data); // Log dữ liệu để kiểm tra
        if (res.data) {
          setBooking(res.data);
        } else {
          setErrors({ submit: 'Booking not found' });
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setErrors({ submit: 'Failed to fetch booking details' });
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    const { cardName, cardNumber, cardExpiry, cardCVV } = formData;

    if (!cardName) newErrors.cardName = 'Cardholder name required';
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16)
      newErrors.cardNumber = 'Card number must be 16 digits';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry))
      newErrors.cardExpiry = 'Expiry format MM/YY';
    if (!/^\d{3,4}$/.test(cardCVV)) newErrors.cardCVV = 'Invalid CVV';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      await axios.post(`/api/booking/${bookingId}/payment`, formData);
      router.push(`/confirmation/${bookingId}`);
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Payment failed' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!booking) return <p>{errors.submit || 'Booking not found'}</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-2">Payment for Booking #{bookingId}</h2>
      <p className="mb-4">Total: <strong>${booking.totalPrice}</strong></p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="cardName"
            placeholder="Cardholder Name"
            className="w-full p-2 border"
            value={formData.cardName}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            name="cardNumber"
            placeholder="Card Number"
            className="w-full p-2 border"
            value={formData.cardNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            name="cardExpiry"
            placeholder="MM/YY"
            className="w-full p-2 border"
            value={formData.cardExpiry}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            name="cardCVV"
            placeholder="CVV"
            className="w-full p-2 border"
            value={formData.cardCVV}
            onChange={handleChange}
          />
        </div>
        {errors.submit && <p className="text-red-500">{errors.submit}</p>}
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
