import { notFound } from 'next/navigation';
import ServiceDetails from './ServiceDetails';

// Service data mapping
const serviceData = {
  prototyping: {
    title: "Custom Prototyping",
    image: "/prototypes.jpg",
    description: "Our custom prototyping service helps bring your ideas to life. We offer state-of-the-art equipment and expert guidance to help you create high-quality prototypes for your projects.",
    features: [
      "3D Printing Services",
      "Rapid Prototyping",
      "Design Consultation",
      "Material Selection Guidance",
      "Quality Assurance"
    ]
  },
  workshop: {
    title: "Workshop",
    image: "/workshop.jpg",
    description: "Join our hands-on workshops to learn new skills and enhance your understanding of digital fabrication technologies.",
    features: [
      "Regular Training Sessions",
      "Hands-on Experience",
      "Expert Instructors",
      "Small Group Sizes",
      "Certificate of Completion"
    ]
  },
  community: {
    title: "Community Services",
    image: "/services.jpg",
    description: "We're committed to serving our community through various initiatives and support programs.",
    features: [
      "Community Projects",
      "Technical Support",
      "Educational Programs",
      "Collaboration Opportunities",
      "Resource Sharing"
    ]
  },
  orientation: {
    title: "Orientation",
    image: "/orentation.jpg",
    description: "Get started with FabLab through our comprehensive orientation program designed for new members.",
    features: [
      "Lab Safety Training",
      "Equipment Overview",
      "Booking System Guide",
      "Project Planning Tips",
      "Resource Access Guide"
    ]
  },
  "machine-training": {
    title: "Operating Machines",
    image: "/machines.jpg",
    description: "Learn how to operate various machines safely and effectively through our training programs.",
    features: [
      "Safety Protocols",
      "Machine Operation",
      "Maintenance Guidelines",
      "Troubleshooting Tips",
      "Certification Process"
    ]
  },
  products: {
    title: "Products",
    image: "/products.jpg",
    description: "Explore our range of products created by our team to support lab operations and showcase our capabilities.",
    features: [
      "Custom Products",
      "Quality Materials",
      "Innovative Designs",
      "Competitive Pricing",
      "Bulk Orders Available"
    ]
  }
};

// This is a Server Component
export default async function ServicePage({ params }) {
  // Validate the service parameter
  const serviceKey = params?.service;
  
  if (!serviceKey || !serviceData[serviceKey]) {
    notFound();
  }

  // Get the service data
  const service = serviceData[serviceKey];

  // Pass the service data to the client component
  return <ServiceDetails service={service} />;
} 