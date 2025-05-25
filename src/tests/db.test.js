import mongoose from 'mongoose';
import connectDB from '../lib/db';

async function testMongoDBConnection() {
  try {
    console.log('Starting MongoDB connection test...');

    // Test database connection
    await connectDB();
    console.log('✅ Successfully connected to MongoDB');

    // Create a temporary test collection
    const testSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });

    // Use a unique model name to avoid conflicts
    const TestModel = mongoose.models.TestDocument || mongoose.model('TestDocument', testSchema);

    console.log('\nTesting CRUD operations...');

    // Test Create
    const testDoc = await TestModel.create({ name: 'test_document' });
    console.log('✅ Create operation successful');

    // Test Read
    const foundDoc = await TestModel.findById(testDoc._id);
    if (foundDoc) {
      console.log('✅ Read operation successful');
    } else {
      throw new Error('Failed to read document');
    }

    // Test Update
    const updateResult = await TestModel.findByIdAndUpdate(
      testDoc._id,
      { name: 'updated_test_document' },
      { new: true }
    );
    if (updateResult && updateResult.name === 'updated_test_document') {
      console.log('✅ Update operation successful');
    } else {
      throw new Error('Failed to update document');
    }

    // Test Delete
    await TestModel.findByIdAndDelete(testDoc._id);
    const deletedDoc = await TestModel.findById(testDoc._id);
    if (!deletedDoc) {
      console.log('✅ Delete operation successful');
    } else {
      throw new Error('Failed to delete document');
    }

    console.log('\n🎉 All database operations completed successfully!');

    // Clean up - drop the test collection
    await mongoose.connection.collections['testdocuments'].drop();
    console.log('✅ Test collection cleaned up');

  } catch (error) {
    console.error('\n❌ Database test failed:');
    console.error('Error:', error.message);
    if (!process.env.MONGODB_URI) {
      console.error('\n⚠️ MONGODB_URI environment variable is not set!');
      console.error('Please make sure you have defined MONGODB_URI in your .env.local file');
    }
  } finally {
    // Close the connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n✅ Database connection closed');
    }
  }
}

// Run the test
testMongoDBConnection(); 