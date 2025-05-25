'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import BookingForm from '../components/BookingForm';
import styles from './BookMachine.module.css';

function BookMachineInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [machine, setMachine] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/signup');
      return;
    }

    // Get machine details from URL parameters
    const machineId = searchParams.get('machineId');
    const machineName = searchParams.get('machineName');

    if (!machineId || !machineName) {
      router.push('/machines');
      return;
    }

    setMachine({
      id: parseInt(machineId),
      name: decodeURIComponent(machineName)
    });
  }, [isAuthenticated, router, searchParams]);

  if (!machine) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.bookingContainer}>
        <BookingForm machine={machine} />
      </div>
    </div>
  );
}

export default function BookMachine() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookMachineInner />
    </Suspense>
  );
}