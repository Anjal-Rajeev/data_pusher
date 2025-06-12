import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const accountSchema = new mongoose.Schema({
  account_id: { type: String, default: uuidv4, index: true },
  account_name: { type: String, required: true, index: true },
  app_secret_token: { type: String, default: () => crypto.randomBytes(32).toString('hex'), index: true },
  website: { type: String },
  status: { type: Number, default: 0 }, // 0 - Active, 1 - Deleted

  created_by: { type: Schema.Types.ObjectId, ref: "users" },
  updated_by: { type: Schema.Types.ObjectId, ref: "users" },

}, { timestamps: true });


export default mongoose.model('accounts', accountSchema);
