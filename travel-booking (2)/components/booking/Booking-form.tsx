'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

interface Tour {
  id: string;
  name: string;
  price: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  adults: number;
  children: number;
  departureDate: string;
  returnDate: string;
  transportationType: string;
  ticketClass: string;
  tourId: string | null;
  totalPrice: string;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  departureDate?: string;
  returnDate?: string;
  submit?: string;
}

const BookingForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tourId = searchParams.get('tourId');

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    adults: 1,
    children: 0,
    departureDate: '',
    returnDate: '',
    transportationType: 'Bus',
    ticketClass: 'Economy',
    tourId: tourId,
    totalPrice: '0',
  });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!tourId) {
      setErrors({ submit: "Tour ID is missing or invalid." });
      setLoading(false);
      return;
    }

    const fetchTour = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://localhost:7129/api/tours/${tourId}`);
        if (!response.ok) {
          throw new Error("Unable to load tour information from the server.");
        }
        const data: Tour = await response.json();
        setTour(data);
        setErrors({}); // Clear any previous errors
      } catch (err) {
        if (err instanceof Error) {
          setErrors({ submit: err.message });
        } else {
          setErrors({ submit: "An unknown error occurred." });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId]);

  const updateTotalPrice = (basePrice: number, values: FormData) => {
    if (!basePrice) return;
    const adults = parseInt(values.adults.toString()) || 0;
    const children = parseInt(values.children.toString()) || 0;

    let total = basePrice * adults + basePrice * 0.7 * children;

    switch (values.ticketClass.toLowerCase()) {
      case 'business':
        total *= 1.3;
        break;
      case 'luxury':
        total *= 1.5;
        break;
    }

    setFormData(prev => ({ ...prev, totalPrice: total.toFixed(2) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (tour) updateTotalPrice(tour.price, updated);
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.departureDate) newErrors.departureDate = 'Departure date is required';
    if (!formData.returnDate) newErrors.returnDate = 'Return date is required';

    if (formData.departureDate && formData.returnDate) {
      const d1 = new Date(formData.departureDate);
      const d2 = new Date(formData.returnDate);
      if (d1 >= d2) newErrors.returnDate = 'Return date must be after departure date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axios.post('https://localhost:7129/api/booking', formData); // Using axios
      router.push(`/payment?bookingId=${response.data.id}`);
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Failed to create booking' });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!tour) return <p>{errors.submit || 'Sorry, the tour could not be found.'}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Book Tour: {tour.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="firstName"
            placeholder="First Name"
            className="w-full p-2 border"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
        </div>
        <div>
          <input
            name="lastName"
            placeholder="Last Name"
            className="w-full p-2 border"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
        </div>
        <div>
          <input
            name="email"
            placeholder="Email"
            className="w-full p-2 border"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        <div>
          <input
            name="phone"
            placeholder="Phone"
            className="w-full p-2 border"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-4">
          <input
            type="number"
            name="adults"
            min="1"
            value={formData.adults}
            onChange={handleChange}
            className="w-full p-2 border"
            placeholder="Adults"
          />
          <input
            type="number"
            name="children"
            min="0"
            value={formData.children}
            onChange={handleChange}
            className="w-full p-2 border"
            placeholder="Children"
          />
        </div>
        <div className="flex gap-4">
          <input
            type="date"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleChange}
            className="w-full p-2 border"
          />
          <input
            type="date"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleChange}
            className="w-full p-2 border"
          />
        </div>
        <div>
          <select
            name="ticketClass"
            className="w-full p-2 border"
            value={formData.ticketClass}
            onChange={handleChange}
          >
            <option>Economy</option>
            <option>Business</option>
            <option>Luxury</option>
          </select>
        </div>
        <div className="font-semibold">Total Price: ${formData.totalPrice}</div>
        {errors.submit && <p className="text-red-500">{errors.submit}</p>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Continue to Payment
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
