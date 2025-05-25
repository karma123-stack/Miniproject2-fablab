'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './AddMachine.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function AddMachine() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    capabilities: [''],
    requirements: [''],
    icon: 'bi-tools'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload image');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        image: data.url
      }));
      setPreviewUrl(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form data
      if (!formData.name || !formData.image || !formData.description) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.capabilities.some(cap => !cap) || formData.requirements.some(req => !req)) {
        throw new Error('Please fill in all capabilities and requirements');
      }

      const response = await fetch('/api/admin/machines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add machine');
      }

      // Redirect to machines page on success
      router.push('/machines');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
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

      <div className={styles.content}>
        <h1>Add New Machine</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Machine Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter machine name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Machine Image *</label>
            <div className={styles.imageUpload}>
              <input
                type="file"
                id="image"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className={styles.fileInput}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={styles.uploadButton}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Choose Image'}
              </button>
              {previewUrl && (
                <div className={styles.imagePreview}>
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={200}
                    height={200}
                    objectFit="cover"
                  />
                </div>
              )}
            </div>
            <p className={styles.uploadNote}>
              Supported formats: JPG, PNG, GIF. Max size: 5MB
            </p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter machine description"
              rows="3"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Capabilities *</label>
            {formData.capabilities.map((capability, index) => (
              <div key={index} className={styles.arrayInput}>
                <input
                  type="text"
                  value={capability}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'capabilities')}
                  required
                  placeholder="Enter capability"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'capabilities')}
                    className={styles.removeButton}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('capabilities')}
              className={styles.addButton}
            >
              <i className="bi bi-plus"></i> Add Capability
            </button>
          </div>

          <div className={styles.formGroup}>
            <label>Requirements *</label>
            {formData.requirements.map((requirement, index) => (
              <div key={index} className={styles.arrayInput}>
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'requirements')}
                  required
                  placeholder="Enter requirement"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'requirements')}
                    className={styles.removeButton}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('requirements')}
              className={styles.addButton}
            >
              <i className="bi bi-plus"></i> Add Requirement
            </button>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="icon">Icon Class *</label>
            <select
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              required
            >
              <option value="bi-tools">Tools</option>
              <option value="bi-printer">Printer</option>
              <option value="bi-scissors">Scissors</option>
              <option value="bi-gear">Gear</option>
              <option value="bi-hammer">Hammer</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => router.push('/machines')}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className={styles.submitButton}
            >
              {loading ? 'Adding...' : 'Add Machine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 