'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './ServiceDetails.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function ServiceDetails({ service }) {
  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <Link href="/">Home</Link> / <Link href="/#services">Services</Link> / {service.title}
      </nav>
      
      <div className={styles.serviceContent}>
        <h1>{service.title}</h1>
        
        <div className={styles.imageContainer}>
          <Image 
            src={service.image} 
            alt={service.title} 
            width={800} 
            height={400} 
            className={styles.serviceImage}
          />
        </div>
        
        <div className={styles.description}>
          <p>{service.description}</p>
        </div>
        
        <div className={styles.features}>
          <h2>What We Offer</h2>
          <ul>
            {service.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 