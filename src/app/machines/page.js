'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from './Machines.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Hardcoded machines data
const hardcodedMachines = [
  {
    _id: 'hardcoded-1',
    name: '3D Printer',
    image: '/3d.png',
    description: 'Create three-dimensional objects from digital designs',
    capabilities: [
      'Print complex geometries',
      'Rapid prototyping',
      'Custom parts manufacturing'
    ],
    requirements: [
      'Basic 3D modeling knowledge',
      'STL file format',
      'Material specifications'
    ],
    icon: 'bi-printer'
  },
  {
    _id: 'hardcoded-2',
    name: 'Laser Cutter',
    image: '/laser.png',
    description: 'Precise cutting and engraving of various materials',
    capabilities: [
      'Cut wood, acrylic, and paper',
      'Engrave designs',
      'Create intricate patterns'
    ],
    requirements: [
      'Vector file format (SVG)',
      'Material thickness specifications',
      'Safety training'
    ],
    icon: 'bi-scissors'
  },
  {
    _id: 'hardcoded-3',
    name: 'CNC Router',
    image: '/cnc.jpg',
    description: 'Computer-controlled cutting machine for various materials',
    capabilities: [
      'Wood cutting',
      'Plastic machining',
      'Metal engraving'
    ],
    requirements: [
      'CAD/CAM software knowledge',
      'Material specifications',
      'Safety protocols'
    ],
    icon: 'bi-tools'
  },
  {
    _id: 'hardcoded-4',
    name: 'Vinyl Cutter',
    image: '/sew.png',
    description: 'Precise cutting of vinyl and other thin materials',
    capabilities: [
      'Cut vinyl for signs and decals',
      'Create custom stickers',
      'Cut heat transfer vinyl'
    ],
    requirements: [
      'Vector file format (SVG)',
      'Material specifications',
      'Basic design knowledge'
    ],
    icon: 'bi-scissors'
  },
  {
    _id: 'hardcoded-5',
    name: 'Embroidery Machine',
    image: '/sew.png',
    description: 'Computer-controlled embroidery for fabric and textiles',
    capabilities: [
      'Custom embroidery designs',
      'Text and logo embroidery',
      'Multi-color patterns'
    ],
    requirements: [
      'Embroidery file format',
      'Fabric specifications',
      'Thread color selection'
    ],
    icon: 'bi-scissors'
  }
];

export default function Machines() {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [dbMachines, setDbMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const response = await fetch('/api/machines');
      if (!response.ok) {
        throw new Error('Failed to fetch machines');
      }
      const data = await response.json();
      setDbMachines(data);
    } catch (err) {
      setError('Error loading machines');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Combine hardcoded and database machines
  const allMachines = [...hardcodedMachines, ...dbMachines];

  const handleMachineClick = (machine) => {
    setSelectedMachine(machine);
  };

  const closeModal = () => {
    setSelectedMachine(null);
  };

  const handleBookMachine = (machine) => {
    if (!isAuthenticated()) {
      router.push('/signup?redirect=' + encodeURIComponent(`/machines/${machine._id}`));
      return;
    }
    router.push(`/book-machine?machineId=${machine._id}&machineName=${encodeURIComponent(machine.name)}`);
  };

  const handleAddMachine = () => {
    router.push('/admin/machines/add');
  };

  const handleEditMachine = (machineId) => {
    // Only allow editing database machines
    if (!machineId.startsWith('hardcoded-')) {
      router.push(`/admin/machines/edit/${machineId}`);
    }
  };

  const handleDeleteMachine = async (machineId) => {
    if (!confirm('Are you sure you want to delete this machine?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/machines/${machineId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete machine');
      }

      // Refresh the machines list
      fetchMachines();
    } catch (error) {
      console.error('Error deleting machine:', error);
      alert('Failed to delete machine');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading machines...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.machinesContainer}>
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

      {/* Display Machines */}
      <div className={styles.display_machines}>
        <h1>Our CST FabLab has lots of machines to be used. Below are some machines available for use.</h1>
      </div>

      {/* Machines Grid */}
      <div className={styles.machinesGrid}>
        {allMachines.map((machine) => (
          <div 
            key={machine._id} 
            className={styles.machineCard}
            onClick={() => handleMachineClick(machine)}
          >
            <div className={styles.machineImage}>
              <Image 
                src={machine.image} 
                alt={machine.name}
                width={300}
                height={300}
                objectFit="cover"
              />
            </div>
            <div className={styles.machineDetails}>
              <h3>{machine.name}</h3>
              <div className={styles.machineTag}>
                <i className={`bi ${machine.icon}`}></i>
                {machine.description}
              </div>
              {isAdmin && (
                <div className={styles.adminControls}>
                  {!machine._id.startsWith('hardcoded-') && (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditMachine(machine._id);
                        }}
                        className={styles.editButton}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMachine(machine._id);
                        }}
                        className={styles.deleteButton}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isAdmin && (
          <div 
            className={`${styles.machineCard} ${styles.addMachineCard}`}
            onClick={handleAddMachine}
          >
            <div className={styles.machineImage}>
              <div className={styles.addMachineImage}>
                <i className="bi bi-plus-circle"></i>
              </div>
            </div>
            <div className={styles.machineDetails}>
              <h3>Add New Machine</h3>
              <div className={styles.machineTag}>
                <i className="bi bi-plus-circle"></i>
                Click to add a new machine to the FabLab
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Machine Details Modal */}
      {selectedMachine && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button 
              className={styles.closeButton} 
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
            >
              <i className="bi bi-x"></i>
            </button>
            <div className={styles.modalHeader}>
              <div className={styles.modalImage}>
                <Image 
                  src={selectedMachine.image} 
                  alt={selectedMachine.name}
                  width={400}
                  height={300}
                  objectFit="cover"
                />
              </div>
              <h2>{selectedMachine.name}</h2>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.capabilitiesSection}>
                <h3><i className="bi bi-gear"></i> Capabilities</h3>
                <ul>
                  {selectedMachine.capabilities.map((capability, index) => (
                    <li key={index}>{capability}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.requirementsSection}>
                <h3><i className="bi bi-list-check"></i> Requirements</h3>
                <ul>
                  {selectedMachine.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={styles.bookingSection}>
              <button 
                className={styles.bookButton}
                onClick={() => handleBookMachine(selectedMachine)}
              >
                <i className="bi bi-calendar-check"></i>
                Book This Machine
              </button>
              <p className={styles.bookingNote}>
                * Please ensure you meet all requirements before booking
              </p>
            </div>
          </div>
        </div>
      )}

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