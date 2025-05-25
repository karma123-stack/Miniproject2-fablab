'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import UserBookings from '../components/UserBookings';
import UserOrders from '@/app/components/UserOrders';
import styles from './Profile.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Profile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, logout, getUserBookings, cancelBooking } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/signup?redirect=/profile');
    } else {
      // Load user's bookings
      const loadBookings = async () => {
        try {
          const userBookings = await getUserBookings();
          setBookings(userBookings);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      loadBookings();
    }
  }, [isAuthenticated, router, getUserBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await fetch(`/api/bookings?id=${bookingId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to cancel booking');
        }

        // Remove the cancelled booking from the local state
        setBookings(bookings.filter(booking => booking._id !== bookingId));
        
        // Show success message
        alert('Booking cancelled successfully');
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        alert(error.message || 'Failed to cancel booking. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Don't render anything while checking authentication
  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Info Section */}
      <div className={styles.info}>
        <div className={styles.location}>
          <i className="bi bi-geo-alt"></i> Phuentsholing, Bhutan
        </div>
        <div className={styles.time}>
          <i className="bi bi-clock"></i> Monday - Friday: 9 AM to 6 PM
        </div>
      </div>

      {/* Navbar */}
      <div className={styles.navbar}>
        <div className={styles['navbar-logo']}>
          <Image src="/fablab_logo.jpg" alt="CST FABLAB Logo" width={150} height={50} />
        </div>
        <div className={styles.menu}>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/machines">Machines</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/events">Events</Link></li>
          </ul>
          <div className={styles.profileIcon}>
            <Link href="/profile">
              <i className="bi bi-person-circle"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Container */}
      <div className={styles.profileContainer}>
        <div className={styles.sidebar}>
          <div className={styles.profileHeader}>
            <div className={styles.profileImage}>
              <i className="bi bi-person-circle"></i>
            </div>
            <h2>{user?.name || 'User'}</h2>
            <p>{user?.email}</p>
          </div>
          
          <nav className={styles.nav}>
            <button 
              className={`${styles.navItem} ${activeTab === 'account' ? styles.active : ''}`}
              onClick={() => setActiveTab('account')}
            >
              <i className="bi bi-person"></i>
              Account Information
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'bookings' ? styles.active : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <i className="bi bi-calendar-check"></i>
              Machine Bookings
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'training' ? styles.active : ''}`}
              onClick={() => setActiveTab('training')}
            >
              <i className="bi bi-book"></i>
              Events
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <i className="bi bi-cart"></i>
              Orders
            </button>
            <button 
              className={styles.navItem}
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right"></i>
              Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Account Information */}
          {activeTab === 'account' && (
            <div className={styles.section}>
              <h1>Account Information</h1>
              <div className={styles.infoCard}>
                <div className={styles.infoItem}>
                  <label>Full Name</label>
                  <p>{user?.name}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Email</label>
                  <p>{user?.email}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Member Since</label>
                  <p>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
                <button className={styles.editButton}>
                  Edit Profile
                </button>
              </div>
            </div>
          )}

          {/* Machine Bookings */}
          {activeTab === 'bookings' && (
            <UserBookings />
          )}

          {/* Training */}
          {activeTab === 'training' && (
            <div className={styles.section}>
              <h1>Training Sessions</h1>
              <div className={styles.trainingList}>
                {/* Placeholder for training sessions */}
                <div className={styles.trainingCard}>
                  <div className={styles.trainingInfo}>
                    <h3>3D Printing Basics</h3>
                    <p>Date: March 20, 2024</p>
                    <p>Time: 2:00 PM - 4:00 PM</p>
                    <p>Status: <span className={styles.statusUpcoming}>Upcoming</span></p>
                  </div>
                  <button className={styles.viewButton}>View Details</button>
                </div>
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <UserOrders />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerInfo}>
            <h3>Contact Us</h3>
            <p><i className="bi bi-geo-alt"></i> Phuentsholing, Bhutan</p>
            <p><i className="bi bi-envelope"></i> fablab@cst.edu.bt</p>
            <p><i className="bi bi-telephone"></i> +975-12345678</p>
          </div>
          <div className={styles.footerTime}>
            <h3>Operating Hours</h3>
            <p><i className="bi bi-clock"></i> Monday - Friday: 9 AM to 6 PM</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2025 CST FabLab. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
} 