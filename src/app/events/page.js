'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Events.module.css';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading events...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

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
            <li><Link href="/events" className={styles.active}>Events</Link></li>
          </ul>
          <div className={styles.profileIcon}>
            <Link href="/profile">
              <i className="bi bi-person-circle"></i>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.eventsContainer}>
        <div className={styles.hero}>
          <h1>Upcoming Events</h1>
          <p>Join our exciting workshops and masterclasses at FabLab</p>
        </div>

        <div className={styles.eventsGrid}>
          {events.length === 0 ? (
            <div className={styles.noEvents}>
              <p>No events available at the moment.</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventImage}>
                  <img src={event.image} alt={event.title} />
                </div>
                <div className={styles.eventContent}>
                  <h2>{event.title}</h2>
                  <div className={styles.eventDetails}>
                    <p><i className="bi bi-calendar"></i> {event.date}</p>
                    <p><i className="bi bi-clock"></i> {event.time}</p>
                    <p><i className="bi bi-geo-alt"></i> {event.location}</p>
                  </div>
                  <p className={styles.eventDescription}>{event.description}</p>
                  <button className={styles.registerButton}>
                    Register Now
                  </button>
                </div>
              </div>
            ))
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