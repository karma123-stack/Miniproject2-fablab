'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from './Home.module.css';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const handleReadMore = (link) => {
    router.push(link);
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
            <li><Link href="/" className={styles.active}>Home</Link></li>
            <li><Link href="/machines">Machines</Link></li>
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

      {/* Image Section */}
      <div className={styles.image}>
        <Image src="/team.jpg" alt="cover" width={1200} height={600} />
        {!isAuthenticated() && (
          <div className={styles.authButtons}>
            <Link href="/signup">
              <button className={styles.signupBtn}>Sign Up</button>
            </Link>
            <Link href="/login">
              <button className={styles.loginBtn}>Login</button>
            </Link>
          </div>
        )}
        <h2>Welcome to CST FabLAB</h2>
        <p>Innovation & Creativity</p>
      </div>

      {/* Description */}
      <div className={styles.description}>
        <div className={styles.dis}>
          <h2>What we do at CST FabLab</h2>
          <p>FabLab CST was inaugurated on 25th August 2022 in the College of Science and Technology, Bhutan...</p>
          <h2>Vision</h2>
          <p>&ldquo;Provide Digital Design Tools to Ignite a Culture of Innovation&rdquo;</p>
          <p>&ldquo;Inspire the Future of Learning and Creating&rdquo;</p>
        </div>
        <div className={styles.show}>
          <Image src="/show.jpg" alt="deco" width={600} height={400} />
        </div>
      </div>

      {/* Services */}
      <div className={styles.services}>
        <h1>Our Services</h1>
        <p>Our FabLab student management will guide you to build your ideas to reality</p>
      </div>

      {/* Card Container */}
      <div className={styles.cardContainer}>
        {[
          { 
            title: "Custom Prototyping", 
            img: "/prototypes.jpg", 
            description: "Bring your ideas to life with our cutting-edge prototyping services.",
            link: "/services/prototyping"
          },
          { 
            title: "Workshop", 
            img: "/workshop.jpg", 
            description: "Unlock your potential with our hands-on workshops.",
            link: "/services/workshop"
          },
          { 
            title: "Community Services", 
            img: "/services.jpg", 
            description: "Our student team helps the community by providing services.",
            link: "/services/community"
          },
          { 
            title: "Orientation", 
            img: "/orentation.jpg", 
            description: "We orient students of our college to join FabLab activities.",
            link: "/services/orientation"
          },
          { 
            title: "Operating Machines", 
            img: "/machines.jpg", 
            description: "Our student team teaches how to operate machines.",
            link: "/services/machine-training"
          },
          { 
            title: "Products", 
            img: "/products.jpg", 
            description: "Our team produces commercial products for lab finances.",
            link: "/services/products"
          },
        ].map((card, index) => (
          <div key={index} className={styles.card}>
            <div>
              <Image src={card.img} alt={card.title} width={300} height={200} />
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
            <button 
              className={styles.readMoreBtn}
              onClick={() => handleReadMore(card.link)}
            >
              Read More
            </button>
          </div>
        ))}
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
