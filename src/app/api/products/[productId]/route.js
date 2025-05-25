import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

// Static products data (matching the categories array in products/page.js)
const staticProducts = {
  1: {
    id: 1,
    name: 'Table stand',
    image: '/products/table_stand.jpg',
    description: 'Precision-cut wooden or acrylic sign boards with custom designs',
    price: 3500,
    category: 'cnc'
  },
  2: {
    id: 2,
    name: 'Assesstive Chair',
    image: '/products/assestive_chair.jpg',
    description: 'Intricate CNC-cut decorative wall panels',
    price: 5000,
    category: 'cnc'
  },
  3: {
    id: 3,
    name: 'Custom Furniture Parts',
    image: '/products/shelf.jpg',
    description: 'Precision-cut wooden or metal furniture components',
    price: 4000,
    category: 'cnc'
  },
  4: {
    id: 4,
    name: 'Aprons',
    image: '/products/apron.jpg',
    description: 'apron made using the fabric of your choice',
    price: 500,
    category: 'sewing'
  },
  5: {
    id: 5,
    name: 'Sewed bag',
    image: '/products/sew_bag.jpg',
    description: 'Custom-made dress with traditional patterns',
    price: 3500,
    category: 'sewing'
  },
  6: {
    id: 6,
    name: 'Embroidered Bag',
    image: '/products/bag.jpg',
    description: 'Hand-embroidered traditional bag',
    price: 2000,
    category: 'sewing'
  },
  7: {
    id: 7,
    name: 'Custom Phone Stand',
    image: '/products/phone_stand.jpg',
    description: 'Personalized 3D printed phone stand with your name',
    price: 800,
    category: '3d-printing'
  },
  8: {
    id: 8,
    name: 'Miniature Models',
    image: '/products/miniature.jpg',
    description: 'Detailed 3D printed architectural models',
    price: 1500,
    category: '3d-printing'
  },
  9: {
    id: 9,
    name: 'Custom Keychains',
    image: '/products/keychain.jpg',
    description: 'Personalized 3D printed keychains with your design',
    price: 500,
    category: '3d-printing'
  },
  10: {
    id: 10,
    name: 'Wooden Wall Art',
    image: '/products/wall_art.jpg',
    description: 'Intricate laser-cut wooden wall decorations',
    price: 2000,
    category: 'laser-cutting'
  },
  11: {
    id: 11,
    name: 'Acrylic Name Plates',
    image: '/products/name_plate.jpg',
    description: 'Custom laser-cut acrylic name plates',
    price: 1200,
    category: 'laser-cutting'
  },
  12: {
    id: 12,
    name: 'Decorative Boxes',
    image: '/products/box.jpg',
    description: 'Laser-cut wooden boxes with intricate patterns',
    price: 1800,
    category: 'laser-cutting'
  },
  13: {
    id: 13,
    name: 'Custom T-Shirts',
    image: '/products/tshirt.jpg',
    description: 'Machine embroidered custom designs on t-shirts',
    price: 1200,
    category: 'embroidery'
  },
  14: {
    id: 14,
    name: 'Embroidered Cushions',
    image: '/products/cushion.jpg',
    description: 'Hand-embroidered decorative cushions',
    price: 1500,
    category: 'embroidery'
  },
  15: {
    id: 15,
    name: 'Logo Patches',
    image: '/products/patch.jpg',
    description: 'Custom embroidered logo patches',
    price: 800,
    category: 'embroidery'
  }
};

export async function GET(request, { params }) {
  try {
    const productId = params.productId;
    console.log('Received product ID:', productId, 'Type:', typeof productId);
    
    // First check if it's a static product
    const numericId = parseInt(productId);
    if (!isNaN(numericId) && staticProducts[numericId]) {
      console.log('Found static product:', staticProducts[numericId]);
      return NextResponse.json(staticProducts[numericId]);
    }
    
    // If not a static product, try to find it in the database
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to database successfully');
    
    let product;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    }
    
    if (!product) {
      console.log('Product not found with any ID type');
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log('Product found:', product);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in GET /api/products/[productId]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    if (!params.productId) {
      return new NextResponse(
        JSON.stringify({ error: 'Product ID is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Attempting to delete product with ID:', params.productId);
    await connectToDatabase();

    // First check if the product exists
    const existingProduct = await Product.findById(params.productId);
    if (!existingProduct) {
      console.log('Product not found with ID:', params.productId);
      return new NextResponse(
        JSON.stringify({ error: 'Product not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Delete the product
    const deletedProduct = await Product.findByIdAndDelete(params.productId);
    console.log('Successfully deleted product:', deletedProduct);

    return new NextResponse(
      JSON.stringify({ 
        message: 'Product deleted successfully',
        deletedProduct: {
          id: deletedProduct._id,
          name: deletedProduct.name
        }
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in delete endpoint:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete product: ' + error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 