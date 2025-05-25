'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Events.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function AdminEventsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: '',
    capacity: '',
    status: 'upcoming'
  });

  useEffect(() => {
    // Check authentication status
    if (status === 'loading') {
      return; // Wait for session to load
    }

    if (status === 'unauthenticated') {
      router.push('/login?redirect=/admin/events');
      return;
    }

    // Check if user is admin
    if (session?.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    // If authenticated and admin, fetch events
    fetchEvents();
  }, [status, session, router]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${session?.user?.accessToken}` // Add authorization header
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/login?redirect=/admin/events');
          return;
        }
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

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setEventForm({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      image: '',
      capacity: '',
      status: 'upcoming'
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      date: new Date(event.date).toISOString().split('T')[0],
      time: event.time,
      location: event.location,
      description: event.description,
      image: event.image,
      capacity: event.capacity,
      status: event.status
    });
    setShowEventModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate capacity
      if (eventForm.capacity < 1) {
        throw new Error('Capacity must be at least 1');
      }

      const url = selectedEvent 
        ? `/api/events?id=${selectedEvent._id}`
        : '/api/events';
      
      const method = selectedEvent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.accessToken}` // Add authorization header
        },
        body: JSON.stringify(eventForm),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/login?redirect=/admin/events');
          return;
        }
        const data = await response.json();
        throw new Error(data.error || 'Failed to save event');
      }

      setShowEventModal(false);
      setNotification({
        type: 'success',
        message: selectedEvent ? 'Event updated successfully' : 'Event created successfully'
      });
      fetchEvents();
    } catch (err) {
      setError(err.message);
      setNotification({
        type: 'error',
        message: err.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`/api/events?id=${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.user?.accessToken}` // Add authorization header
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/login?redirect=/admin/events');
          return;
        }
        throw new Error('Failed to delete event');
      }

      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  // Show loading state while checking authentication
  if (status === 'loading' || loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  // Show error if not admin
  if (session?.user?.role !== 'admin') {
    return <div className={styles.error}>Access denied. Admin privileges required.</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <h1>Events Management</h1>
      
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
          <button 
            className={styles.closeNotification}
            onClick={() => setNotification(null)}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>All Events</h2>
          <button 
            className={styles.addButton}
            onClick={handleAddEvent}
          >
            <i className="bi bi-plus"></i> Add Event
          </button>
        </div>

        <div className={styles.eventsList}>
          {events.length === 0 ? (
            <div className={styles.noEvents}>
              <p>No events available at the moment.</p>
              <button 
                className={styles.addFirstEventButton}
                onClick={handleAddEvent}
              >
                <i className="bi bi-plus"></i> Create Your First Event
              </button>
            </div>
          ) : (
            events.map((event) => (
              <div key={event._id} className={styles.eventCard}>
                <div className={styles.eventImage}>
                  <img src={event.image} alt={event.title} />
                </div>
                <div className={styles.eventInfo}>
                  <h3>{event.title}</h3>
                  <p><i className="bi bi-calendar"></i> {new Date(event.date).toLocaleDateString()}</p>
                  <p><i className="bi bi-clock"></i> {event.time}</p>
                  <p><i className="bi bi-geo-alt"></i> {event.location}</p>
                  <p><i className="bi bi-people"></i> Capacity: {event.capacity}</p>
                  <p><i className="bi bi-person-check"></i> Registered: {event.registeredUsers.length}</p>
                  <p><i className="bi bi-circle"></i> Status: {event.status}</p>
                </div>
                <div className={styles.eventActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditEvent(event)}
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{selectedEvent ? 'Edit Event' : 'Add New Event'}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowEventModal(false)}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image">Image URL</label>
                <input
                  type="url"
                  id="image"
                  value={eventForm.image}
                  onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                  required
                />
                {eventForm.image && (
                  <div className={styles.imagePreview}>
                    <img src={eventForm.image} alt="Event preview" />
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="capacity">Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  min="1"
                  value={eventForm.capacity}
                  onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={eventForm.status}
                  onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                  required
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton} 
                  onClick={() => setShowEventModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.saveButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="bi bi-arrow-repeat spin"></i>
                      {selectedEvent ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    selectedEvent ? 'Update Event' : 'Add Event'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 