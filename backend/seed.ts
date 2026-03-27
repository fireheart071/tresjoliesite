import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const seedProducts = async () => {
    try {
        await connectDB();
        
        // Remove existing products and users
        await Product.deleteMany({});
        await User.deleteMany({});
        
        // Seed Admin User
        const admin = new User({
            username: 'admin',
            password: 'password123' // This will be hashed by the pre-save hook
        });
        await admin.save();
        console.log('Admin user created: admin / password123');

        const products = [
            { name: 'Linen Blouse', category: 'Clothing', price: '€89', featured: true },
            { name: 'Gold Hoop Earrings', category: 'Jewelry', price: '€45', featured: true },
            { name: 'Cotton Midi Dress', category: 'Clothing', price: '€120', featured: true },
            { name: 'Pearl Bracelet', category: 'Jewelry', price: '€65', featured: true },
            { name: 'Summer Dress', category: 'Clothing', price: '€95', featured: false },
            { name: 'Silver Ring', category: 'Jewelry', price: '€30', featured: false },
        ];
        
        await Product.insertMany(products);
        console.log('Database seeded with initial products');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
};

seedProducts();
