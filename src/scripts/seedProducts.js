const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fablab';

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  machine: {
    type: String,
    required: true
  },
  machineIcon: {
    type: String,
    required: true
  },
  process: [{
    type: String
  }],
  materials: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

const sampleProducts = [
  {
    id: 1,
    title: "3D Printed Phone Case",
    image: "/images/products/phone-case.jpg",
    price: 500,
    machine: "3D Printer",
    machineIcon: "bi-printer",
    process: ["3D Printing"],
    materials: ["PLA"]
  },
  {
    id: 2,
    title: "Laser Cut Wooden Box",
    image: "/images/products/wooden-box.jpg",
    price: 800,
    machine: "Laser Cutter",
    machineIcon: "bi-scissors",
    process: ["Laser Cutting"],
    materials: ["Wood"]
  },
  {
    id: 3,
    title: "CNC Milled Keychain",
    image: "/images/products/keychain.jpg",
    price: 300,
    machine: "CNC Machine",
    machineIcon: "bi-gear",
    process: ["CNC Milling"],
    materials: ["Aluminum"]
  }
];

async function seedProducts() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database successfully');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const products = await Product.insertMany(sampleProducts);
    console.log('Added sample products:', products);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts(); 