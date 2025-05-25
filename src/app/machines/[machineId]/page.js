'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import styles from './MachineDetails.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuth } from '../../context/AuthContext';

const machineData = {
  '3d': {
    title: '3D Printer',
    image: '3d.png',
    description: 'An FDM 3D printer builds objects layer by layer using melted plastic filament. Perfect for prototyping and creating custom parts.',
    specifications: [
      'Build Volume: 220 x 220 x 250mm',
      'Layer Resolution: 0.1-0.4mm',
      'Filament Types: PLA, ABS, PETG',
      'Nozzle Temperature: Up to 250°C',
      'Heated Bed: Up to 100°C'
    ],
    features: [
      'Auto bed leveling',
      'Resume printing after power loss',
      'Touch screen interface',
      'WiFi connectivity',
      'Multiple filament compatibility'
    ],
    usageTips: [
      'Always level the bed before printing',
      'Use appropriate temperature for different filaments',
      'Clean the build plate regularly',
      'Monitor first layer adhesion',
      'Keep filament dry and stored properly'
    ]
  },
  'sewing': {
    title: 'Sewing Machine',
    image: '/sew.png',
    description: 'Electric sewing machine powered by a motor for fast and precise stitching. Ideal for both beginners and experienced users.',
    specifications: [
      'Stitch Types: 23 built-in stitches',
      'Speed: Up to 850 stitches per minute',
      'Automatic needle threader',
      'LED workspace lighting',
      'Drop-in bobbin system'
    ],
    features: [
      'Variable speed control',
      'Automatic thread tension',
      'Free arm capability',
      'Multiple presser feet included',
      'Built-in thread cutter'
    ],
    usageTips: [
      'Change needle regularly',
      'Clean lint after each project',
      'Use quality thread',
      'Maintain proper tension',
      'Oil machine regularly'
    ]
  },
  'laser': {
    title: 'Laser Cutting',
    image: '/laser.png',
    description: 'Laser cutter uses focused light to cut and engrave various materials with high precision. Perfect for detailed work.',
    specifications: [
      'Working Area: 600 x 400mm',
      'Laser Power: 40W CO2',
      'Resolution: 0.025mm',
      'Maximum Material Thickness: 10mm',
      'Red Dot Pointer for Alignment'
    ],
    features: [
      'Air assist system',
      'Water cooling system',
      'Emergency stop button',
      'Exhaust system',
      'Compatible with various materials'
    ],
    usageTips: [
      'Always use ventilation',
      'Check material compatibility',
      'Clean lens regularly',
      'Maintain focus distance',
      'Keep area clean and dust-free'
    ]
  },
  'cnc': {
    title: 'CNC Machine',
    image: '/cnc.jpg',
    description: 'Computer Numerical Control machine for precise cutting and carving of materials. Excellent for complex designs.',
    specifications: [
      'Working Area: 1000 x 1000mm',
      'Spindle Power: 2.2kW',
      'Maximum Speed: 24000 RPM',
      'Accuracy: ±0.05mm',
      'Supported Materials: Wood, Plastic, Soft Metals'
    ],
    features: [
      'Automatic tool changer',
      'Dust collection system',
      'Safety enclosure',
      'Multiple axis control',
      'Digital readout'
    ],
    usageTips: [
      'Secure workpiece properly',
      'Use appropriate cutting speeds',
      'Regular maintenance checks',
      'Keep tools sharp',
      'Follow safety protocols'
    ]
  },
  'car': {
    title: 'Carpentry Tools',
    image: '/carpentary.jpg',
    description: 'Complete woodworking station with various tools for furniture making and wood crafting.',
    specifications: [
      'Table Saw: 10-inch blade',
      'Band Saw: 14-inch',
      'Drill Press: 1/2-inch chuck',
      'Router Table',
      'Various Hand Tools'
    ],
    features: [
      'Dust collection system',
      'Safety guards',
      'Precision measuring tools',
      'Multiple work stations',
      'Storage for tools'
    ],
    usageTips: [
      'Wear safety equipment',
      'Keep tools sharp',
      'Measure twice, cut once',
      'Clean workspace after use',
      'Follow proper tool handling'
    ]
  }
};

export default function MachinePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const machine = machineData[params.machineId];

  const handleBooking = () => {
    if (!isAuthenticated()) {
      // If not authenticated, redirect to signup page
      router.push('/signup?redirect=' + encodeURIComponent(`/machines/${params.machineId}`));
      return;
    }
    // If authenticated, proceed with booking
    router.push('/book-machine');
  };

  if (!machine) {
    return (
      <div className={styles.errorContainer}>
        <h1>Machine not found</h1>
        <Link href="/machines" className={styles.backButton}>
          Back to Machines
        </Link>
      </div>
    );
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
            <li><Link href="/machines" className={styles.active}>Machines</Link></li>
            <li><Link href="/my-bookings">My Bookings</Link></li>
            <li><Link href="/help">Help</Link></li>
          </ul>
          <div className={styles.profileIcon}>
            <Link href="/profile">
              <i className="bi bi-person-circle"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Machine Content */}
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/machines">Machines</Link> / {machine.title}
        </div>

        <div className={styles.machineContent}>
          <h1>{machine.title}</h1>
          
          <div className={styles.imageContainer}>
            <Image 
              src={machine.image} 
              alt={machine.title}
              width={800}
              height={400}
              objectFit="cover"
              className={styles.machineImage}
            />
          </div>

          <div className={styles.description}>
            <p>{machine.description}</p>
          </div>

          <div className={styles.section}>
            <h2>Specifications</h2>
            <ul>
              {machine.specifications.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Features</h2>
            <ul>
              {machine.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Usage Tips</h2>
            <ul>
              {machine.usageTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className={styles.cta}>
            <button onClick={handleBooking} className={styles.bookButton}>
              Book This Machine
            </button>
          </div>
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