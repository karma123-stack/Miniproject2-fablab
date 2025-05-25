import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    trim: true
  },
  machineId: {
    type: String,
    required: [true, 'Machine ID is required'],
    trim: true
  },
  machineName: {
    type: String,
    required: [true, 'Machine name is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    trim: true
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    trim: true
  },
  purpose: {
    type: String,
    required: [true, 'Purpose is required'],
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Delete the model if it exists to prevent the OverwriteModelError
if (mongoose.models.Booking) {
  delete mongoose.models.Booking;
}

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking; 