import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { initializeAdmin } from './utils/adminInit.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import imageRoutes from './routes/imageRoutes.js';

dotenv.config();

const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;

// Connect to Database & Initialize Admin
connectDB().then(() => {
    initializeAdmin();
});

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(/\|\||,/).map(origin => origin.trim()) 
    : 'http://localhost:5173';

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

// Simple health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
