'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './UserBookings.module.css';

export default function UserBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/bookings?userId=${user.id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch bookings');
        }
        
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setDeletingId(bookingId);
    setError('');

    try {
      const response = await fetch(`/api/bookings?id=${bookingId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel booking');
      }

      // Remove the cancelled booking from the state
      setBookings(bookings.filter(booking => booking._id !== bookingId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading bookings...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className={styles.noBookings}>
        <h3>No Bookings Found</h3>
        <p>You haven&apos;t made any machine bookings yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.bookingsContainer}>
      <h2>Your Machine Bookings</h2>
      <div className={styles.bookingsList}>
        {bookings.map((booking) => (
          <div key={booking._id} className={styles.bookingCard}>
            <div className={styles.bookingHeader}>
              <h3>{booking.machineName}</h3>
              <span className={`${styles.status} ${styles[booking.status]}`}>
                {booking.status}
              </span>
            </div>
            <div className={styles.bookingDetails}>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(booking.bookingDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {booking.startTime} - {booking.endTime}
              </p>
              <p>
                <strong>Purpose:</strong> {booking.purpose}
              </p>
            </div>
            {booking.status === 'pending' && (
              <button
                className={styles.cancelButton}
                onClick={() => handleCancelBooking(booking._id)}
                disabled={deletingId === booking._id}
              >
                {deletingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 