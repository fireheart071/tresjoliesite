import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  price: string;
  currency: string;
  images: string[];
  featured?: boolean;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  currency: { type: String, required: true, default: 'GHS' },
  images: { type: [String], default: [] },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);
