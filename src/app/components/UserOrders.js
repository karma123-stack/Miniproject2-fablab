'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import styles from './UserOrders.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function UserOrders() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'bi-hourglass-split';
      case 'processing':
        return 'bi-gear-wide-connected';
      case 'completed':
        return 'bi-check-circle';
      case 'cancelled':
        return 'bi-x-circle';
      default:
        return 'bi-question-circle';
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className={styles.error}>
        <i className="bi bi-exclamation-triangle"></i>
        <p>Please sign in to view your orders</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <i className="bi bi-arrow-repeat"></i>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <i className="bi bi-exclamation-triangle"></i>
        <p>{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.noOrders}>
        <i className="bi bi-cart-x"></i>
        <p>You haven&apos;t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.ordersContainer}>
      <h2>Your Orders</h2>
      <div className={styles.ordersList}>
        {orders.map((order) => (
          <div key={order._id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div className={styles.productInfo}>
                <h3>{order.productName}</h3>
                <span className={`${styles.status} ${styles[order.status]}`}>
                  <i className={`bi ${getStatusIcon(order.status)}`}></i>
                  {order.status}
                </span>
              </div>
            </div>
            <div className={styles.orderDetails}>
              <div className={styles.detailRow}>
                <div className={styles.detailItem}>
                  <i className="bi bi-box"></i>
                  <span><strong>Quantity:</strong> {order.quantity}</span>
                </div>
                <div className={styles.detailItem}>
                  <i className="bi bi-currency-dollar"></i>
                  <span><strong>Total Price:</strong> Nu. {order.totalPrice}</span>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailItem}>
                  <i className="bi bi-calendar"></i>
                  <span><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={styles.detailItem}>
                  <i className="bi bi-telephone"></i>
                  <span><strong>Phone:</strong> {order.phoneNumber}</span>
                </div>
              </div>
              <div className={styles.addressSection}>
                <i className="bi bi-geo-alt"></i>
                <div>
                  <strong>Delivery Address:</strong>
                  <p>{order.address}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 