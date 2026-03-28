import express, { Request, Response } from 'express';
import { Router } from 'express';
import Product, { IProduct } from '../models/Product.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import { uploadAndCompressToS3, deleteFileFromS3 } from '../config/s3.js';

const router: Router = express.Router();

// MULTER SETUP (Memory storage for S3 uploads)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
});

// GET /api/products
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, featured } = req.query;
        const filter: any = {};
        if (category) filter.category = category;
        if (featured === 'true') filter.featured = true;
        
        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching products', error: error instanceof Error ? error.message : String(error) });
    }
});

// POST /api/products
router.post('/', authMiddleware, upload.array('images', 10), async (req: Request, res: Response): Promise<void> => {
    try {
        const files = req.files as Express.Multer.File[];
        const uploadedUrls: string[] = [];

        console.log('Product creation started, received:', req.body.name);

        if (files && files.length > 0) {
            for (const file of files) {
                const url = await uploadAndCompressToS3(file);
                uploadedUrls.push(url);
            }
        }

        // Parse boolean fields correctly from FormData (always strings)
        const productData = {
            ...req.body,
            featured: req.body.featured === 'true' || req.body.featured === true,
            images: uploadedUrls
        };

        const product = new Product(productData);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ 
            message: 'Error creating product', 
            error: error instanceof Error ? error.message : String(error),
            params: req.body 
        });
    }
});

// PUT /api/products/:id
router.put('/:id', authMiddleware, upload.array('images', 10), async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const files = req.files as Express.Multer.File[];
        const oldProduct = await Product.findById(id);

        if (!oldProduct) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        let imagesToKeep: string[] = [];
        if (req.body.existingImages) {
            try {
                imagesToKeep = JSON.parse(req.body.existingImages);
            } catch (e) {
                imagesToKeep = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
            }
        }

        // Delete removed images from S3
        const imagesToDelete = oldProduct.images.filter(img => !imagesToKeep.includes(img));
        for (const imgUrl of imagesToDelete) {
            await deleteFileFromS3(imgUrl);
        }

        // Upload new images
        const newUploadedUrls: string[] = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const url = await uploadAndCompressToS3(file);
                newUploadedUrls.push(url);
            }
        }

        const finalImages = [...imagesToKeep, ...newUploadedUrls];

        const updateData = {
            ...req.body,
            featured: req.body.featured === 'true' || req.body.featured === true,
            images: finalImages
        };
        delete updateData.existingImages;

        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({ 
            message: 'Error updating product', 
            error: error instanceof Error ? error.message : String(error) 
        });
    }
});

// DELETE /api/products/:id
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        if (product.images && product.images.length > 0) {
            for (const imgUrl of product.images) {
                await deleteFileFromS3(imgUrl);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error instanceof Error ? error.message : String(error) });
    }
});

export default router;
