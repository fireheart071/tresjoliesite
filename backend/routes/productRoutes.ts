import express, { Request, Response } from 'express';
import { Router } from 'express';
import Product, { IProduct } from '../models/Product.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import { uploadAndCompressToS3, deleteFileFromS3 } from '../config/s3.js';

const router: Router = express.Router();

// MULTER SETUP (Memory storage for S3 uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET /api/products
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, featured } = req.query;
        const filter: any = {};
        if (category) filter.category = category;
        if (featured === 'true') filter.featured = true;
        
        const products: IProduct[] = await Product.find(filter);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : String(error) });
    }
});

// POST /api/products
router.post('/', authMiddleware, upload.single('image'), async (req: Request, res: Response): Promise<void> => {
    try {
        let imageUrl = undefined;
        if (req.file) {
            imageUrl = await uploadAndCompressToS3(req.file);
        }

        const product = new Product({
            ...req.body,
            image: imageUrl
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error: error instanceof Error ? error.message : String(error) });
    }
});

// PUT /api/products/:id
router.put('/:id', authMiddleware, upload.single('image'), async (req: Request, res: Response): Promise<void> => {
    try {
        const updateData: any = { ...req.body };
        if (req.file) {
            // Delete old image if possible (optional but good)
            const oldProduct = await Product.findById(req.params.id);
            if (oldProduct?.image) {
                await deleteFileFromS3(oldProduct.image);
            }
            updateData.image = await uploadAndCompressToS3(req.file);
        }
        
        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error updating product', error: error instanceof Error ? error.message : String(error) });
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

        if (product.image) {
            await deleteFileFromS3(product.image);
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error instanceof Error ? error.message : String(error) });
    }
});

export default router;
