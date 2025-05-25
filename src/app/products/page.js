'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Products.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Product categories data
const categories = [
  {
    id: 'cnc',
    name: 'CNC Machining',
    icon: 'bi-gear',
    items: [
      {
        id: 1,
        name: 'Table stand',
        image: 'table_stand.jpg',
        description: 'Precision-cut wooden or acrylic sign boards with custom designs',
        price: 'Nu. 3,500',
        category: 'cnc'
      },
      {
        id: 2,
        name: 'Assesstive Chair',
        image: 'assestive_chair.jpg',
        description: 'Intricate CNC-cut decorative wall panels',
        price: 'Nu. 5,000',
        category: 'cnc'
      },
      {
        id: 3,
        name: 'Custom Furniture Parts',
        image: 'shelf.jpg',
        description: 'Precision-cut wooden or metal furniture components',
        price: 'Nu. 4,000',
        category: 'cnc'
      }
    ]
  },
  {
    id: 'sewing',
    name: 'Sewing',
    icon: 'bi-scissors',
    items: [
      {
        id: 4,
        name: 'Aprons',
        image: 'apron.jpg',
        description: 'apron made using the fabric of your choice',
        price: 'Nu. 500',
        category: 'sewing'
      },
      {
        id: 5,
        name: 'Sewed bag',
        image: 'sew_bag.jpg',
        description: 'Custom-made dress with traditional patterns',
        price: 'Nu. 3,500',
        category: 'sewing'
      },
      {
        id: 6,
        name: 'Embroidered Bag',
        image: '/products/bag.jpg',
        description: 'Hand-embroidered traditional bag',
        price: 'Nu. 2,000',
        category: 'sewing'
      }
    ]
  },
  {
    id: '3d-printing',
    name: '3D Printing',
    icon: 'bi-printer',
    items: [
      {
        id: 7,
        name: 'Custom Phone Stand',
        image: '/products/phone_stand.jpg',
        description: 'Personalized 3D printed phone stand with your name',
        price: 'Nu. 800',
        category: '3d-printing'
      },
      {
        id: 8,
        name: 'Miniature Models',
        image: '/products/miniature.jpg',
        description: 'Detailed 3D printed architectural models',
        price: 'Nu. 1,500',
        category: '3d-printing'
      },
      {
        id: 9,
        name: 'Custom Keychains',
        image: '/products/keychain.jpg',
        description: 'Personalized 3D printed keychains with your design',
        price: 'Nu. 500',
        category: '3d-printing'
      }
    ]
  },
  {
    id: 'laser-cutting',
    name: 'Laser Cutting',
    icon: 'bi-tools',
    items: [
      {
        id: 10,
        name: 'Wooden Wall Art',
        image: '/products/wall_art.jpg',
        description: 'Intricate laser-cut wooden wall decorations',
        price: 'Nu. 2,000',
        category: 'laser-cutting'
      },
      {
        id: 11,
        name: 'Acrylic Name Plates',
        image: '/products/name_plate.jpg',
        description: 'Custom laser-cut acrylic name plates',
        price: 'Nu. 1,200',
        category: 'laser-cutting'
      },
      {
        id: 12,
        name: 'Decorative Boxes',
        image: '/products/box.jpg',
        description: 'Laser-cut wooden boxes with intricate patterns',
        price: 'Nu. 1,800',
        category: 'laser-cutting'
      }
    ]
  },
  {
    id: 'embroidery',
    name: 'Embroidery',
    icon: 'bi-thread',
    items: [
      {
        id: 13,
        name: 'Custom T-Shirts',
        image: '/products/tshirt.jpg',
        description: 'Machine embroidered custom designs on t-shirts',
        price: 'Nu. 1,200',
        category: 'embroidery'
      },
      {
        id: 14,
        name: 'Embroidered Cushions',
        image: '/products/cushion.jpg',
        description: 'Hand-embroidered decorative cushions',
        price: 'Nu. 1,500',
        category: 'embroidery'
      },
      {
        id: 15,
        name: 'Logo Patches',
        image: '/products/patch.jpg',
        description: 'Custom embroidered logo patches',
        price: 'Nu. 800',
        category: 'embroidery'
      }
    ]
  }
];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      console.log('Fetched products from DB:', data);
      setDbProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      console.log('Attempting to delete product with ID:', productId);
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete product');
        } else {
          throw new Error('Failed to delete product');
        }
      }

      console.log('Product deleted successfully');
      // Refresh the products list
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error.message || 'Failed to delete product. Please try again.');
    }
  };

  const allProducts = [
    ...categories.flatMap(category => category.items),
    ...dbProducts.map(product => ({
      ...product,
      price: `Nu. ${product.price.toLocaleString()}`
    }))
  ];

  const filteredItems = selectedCategory === 'all' 
    ? allProducts
    : allProducts.filter(item => item.category === selectedCategory);

  const handleProductClick = (product) => {
    router.push(`/order/${product.id}`);
  };

  const handleAddProduct = (categoryId) => {
    router.push(`/admin/products/add?category=${categoryId}`);
  };

  if (loading) {
    return <div className={styles.loading}>Loading products...</div>;
  }

  return (
    <div className={styles.container}>
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
            <li><Link href="/products" className={styles.active}>Products</Link></li>
            <li><Link href="/events">Events</Link></li>
          </ul>
          <div className={styles.profileIcon}>
            <Link href="/profile">
              <i className="bi bi-person-circle"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className={styles.categoryFilter}>
        <button
          className={`${styles.categoryButton} ${selectedCategory === 'all' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          <i className="bi bi-grid"></i> All Products
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.active : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <i className={`bi ${category.icon}`}></i> {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className={styles.productsGrid}>
        {filteredItems.map((item, index) => (
          <div key={item._id || index} className={styles.productCard}>
            <div className={styles.productImage}>
              <Image
                src={item.image}
                alt={item.name}
                width={300}
                height={200}
                objectFit="cover"
              />
            </div>
            <div className={styles.productInfo}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className={styles.productPrice}>{item.price}</div>
              <div className={styles.productActions}>
                <button className={styles.orderButton} onClick={() => handleProductClick(item)}>
                  <i className="bi bi-cart-plus"></i> Order Now
                </button>
                {isAdmin && item._id && (
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDeleteProduct(item._id)}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isAdmin && selectedCategory !== 'all' && (
          <div className={styles.addProductCard} onClick={() => handleAddProduct(selectedCategory)}>
            <div className={styles.addProductContent}>
              <i className="bi bi-plus-circle"></i>
              <h3>Add New Product</h3>
              <p>Click to add a new product to this category</p>
            </div>
          </div>
        )}
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