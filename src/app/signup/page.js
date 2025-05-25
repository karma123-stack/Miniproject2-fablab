'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Signup.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to sign up...');
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          adminCode: formData.adminCode || undefined
        }),
      });

      console.log('Response status:', response.status);
      
      // Try to parse response as text first
      const textData = await response.text();
      console.log('Response text:', textData);
      
      let data;
      try {
        data = JSON.parse(textData);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server error: Invalid response format');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Error signing up');
      }

      // Redirect to login page on successful signup
      router.push('/login?registered=true');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
        </div>
      </div>

      {/* Signup Form */}
      <div className={styles.formContainer}>
        <div className={styles.formBox}>
          <h2>Create an Account</h2>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="adminCode">Admin Code (Optional)</label>
              <input
                type="password"
                id="adminCode"
                name="adminCode"
                value={formData.adminCode}
                onChange={handleChange}
                placeholder="Enter admin code if you have one"
              />
            </div>
            <button 
              type="submit" 
              className={styles.signupButton}
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
          <p className={styles.loginLink}>
            Already have an account? <Link href="/login">Login here</Link>
          </p>
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