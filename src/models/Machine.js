import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  capabilities: [{
    type: String,
    required: true
  }],
  requirements: [{
    type: String,
    required: true
  }],
  icon: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
machineSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Machine = mongoose.models.Machine || mongoose.model('Machine', machineSchema);

export default Machine; 