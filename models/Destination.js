import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'accounts',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  httpMethod: {
    type: String,
    enum: ['GET', 'POST', 'PUT'],
    required: true
  },
  headers: {
    type: Map,
    of: String,
    required: true
  },
  status: {
    type: Number,
    default: 0 // 0 - Active, 1 - Deleted
  },
  created_by: { type: String },
  updated_by: { type: String },

}, { timestamps: true });


export default mongoose.model('destinations', destinationSchema);
