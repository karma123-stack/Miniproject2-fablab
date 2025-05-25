'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './OrderPage.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuth } from '../../context/AuthContext';

export default function OrderPage() {
  const { productId } = useParams();
  const router = useRouter();
  const auth = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!auth.isAuthenticated()) {
      router.push('/signup?redirect=' + encodeURIComponent(`/order/${productId}`));
      return;
    }

    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', productId);
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Error response from API:', data);
          throw new Error(data.error || 'Failed to fetch product');
        }
        
        console.log('Product data received:', data);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, auth, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: productId,
          quantity,
          address,
          phoneNumber,
          totalPrice: product.price * quantity
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }

      const orderData = await response.json();
      console.log('Order created:', orderData);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (err) {
      console.error('Order submission error:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!product) return <div className={styles.error}>Product not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/products" className={styles.backButton}>
          <i className="bi bi-arrow-left"></i> Back to Products
        </Link>
        <h1>Place Your Order</h1>
      </div>

      {success ? (
        <div className={styles.successMessage}>
          <i className="bi bi-check-circle"></i>
          <h2>Order Placed Successfully!</h2>
          <p>Redirecting to your profile...</p>
        </div>
      ) : (
        <div className={styles.orderContainer}>
          <div className={styles.productInfo}>
            <div className={styles.imageContainer}>
              <Image
                src={product.image}
                alt={product.name || 'Product image'}
                width={400}
                height={300}
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  console.error('Error loading image:', product.image);
                  e.target.src = '/placeholder.jpg'; // Fallback image
                }}
                priority
              />
            </div>
            <div className={styles.productDetails}>
              <h2>{product.name}</h2>
              <div className={styles.price}>
                <i className="bi bi-tag"></i>
                Nu. {product.price}
              </div>
              <div className={styles.machine}>
                <i className={`bi ${product.machineIcon}`}></i>
                {product.machine}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.orderForm}>
            <div className={styles.formGroup}>
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address">Delivery Address:</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your complete delivery address"
                required
                rows="3"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your contact number"
                required
              />
            </div>

            <div className={styles.orderSummary}>
              <h3>Order Summary</h3>
              <div className={styles.summaryItem}>
                <span>Subtotal:</span>
                <span>Nu. {product.price * quantity}</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Total:</span>
                <span>Nu. {product.price * quantity}</span>
              </div>
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
} 