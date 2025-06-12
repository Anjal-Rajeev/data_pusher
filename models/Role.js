import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role_name: { type: String, required: true, unique: true },

  created_by: { type: String },
  updated_by: { type: String },

}, { timestamps: true });


export default mongoose.model('roles', userSchema);
