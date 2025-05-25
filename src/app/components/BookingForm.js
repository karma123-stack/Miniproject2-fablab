'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from './BookingForm.module.css';

export default function BookingForm({ machine }) {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          machineId: machine.id,
          machineName: machine.name,
          ...formData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      // Redirect to bookings page or show success message
      router.push('/profile?tab=bookings');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.bookingForm}>
      <h2>Book {machine.name}</h2>
      
      <div className={styles.formGroup}>
        <label htmlFor="bookingDate">Date:</label>
        <input
          type="date"
          id="bookingDate"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="startTime">Start Time:</label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          min="09:00"
          max="17:00"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="endTime">End Time:</label>
        <input
          type="time"
          id="endTime"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          min="09:00"
          max="17:00"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="purpose">Purpose:</label>
        <textarea
          id="purpose"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          required
          placeholder="Please describe what you plan to do with the machine"
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? 'Booking...' : 'Book Machine'}
      </button>
    </form>
  );
} 