'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserBookings(session.user.id);
    }
  }, [session]);

  const fetchUserBookings = async (userId) => {
    try {
      const response = await fetch(`/api/bookings?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setBookings([]);
  };

  const isAuthenticated = () => {
    return status === 'authenticated';
  };

  const addBooking = async (booking) => {
    try {
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...booking,
          userId: session.user.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const newBooking = await response.json();
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (error) {
      console.error('Failed to add booking:', error);
      throw error;
    }
  };

  const getUserBookings = () => {
    return bookings;
  };

  const cancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings?id=${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      const updatedBooking = await response.json();
      setBookings(prev => 
        prev.map(booking => 
          booking._id === bookingId ? updatedBooking : booking
        )
      );
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user: session?.user || null,
      logout, 
      isAuthenticated,
      addBooking,
      getUserBookings,
      cancelBooking
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 