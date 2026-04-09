import express, { Request, Response } from 'express';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../config/s3.js';
import stream from 'stream';

const router = express.Router();

router.get('/:folder/:filename', async (req: Request, res: Response): Promise<void> => {
    try {
        const { folder, filename } = req.params;
        const Key = `${folder}/${filename}`;
        const Bucket = process.env.S3_BUCKET || '';

        const command = new GetObjectCommand({
            Bucket,
            Key
        });

        const { Body, ContentType } = await s3Client.send(command);

        if (Body instanceof stream.Readable) {
            res.setHeader('Content-Type', ContentType || 'image/jpeg');
            // Browser cache for 1 year - critical for image loading performance
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            Body.pipe(res);
        } else {
            res.status(404).send('Not found');
        }
    } catch (err) {
        console.error('Proxy image error:', err);
        res.status(404).send('Not found');
    }
});

export default router;
