import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name?: string;
  category: string;
  price?: string;
  currency?: string;
  images: string[];
  featured?: boolean;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: false },
  category: { type: String, required: true },
  price: { type: String, required: false },
  currency: { type: String, required: false, default: 'GHS' },
  images: { type: [String], default: [] },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);
