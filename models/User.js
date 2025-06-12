import mongoose, { Schema } from 'mongoose';
import bcrypt from "bcrypt"
import { ROLES } from '../config.js';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: "roles", default: ROLES.ADMIN },

  created_by: { type: String },
  updated_by: { type: String },

}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('users', userSchema);
