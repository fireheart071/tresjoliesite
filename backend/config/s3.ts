import { S3Client, DeleteObjectCommand, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();

export const s3Client = new S3Client({
  region: process.env.S3_REGION || 'us-east-1', // Default region
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true, // Often needed for custom S3 endpoints like Railway's
});

export const uploadAndCompressToS3 = async (file: Express.Multer.File) => {
  const Bucket = process.env.S3_BUCKET || '';
  const Key = `uploads/${Date.now()}-${file.originalname}`;
  
  let buffer = file.buffer;
  let contentType = file.mimetype;

  // Compress if larger than 3MB and is an image
  if (file.size > 3 * 1024 * 1024 && file.mimetype.startsWith('image/')) {
    console.log(`Compressing image: ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    // We'll convert to webp for better compression, or keep original format but lower quality
    const pipeline = sharp(file.buffer);
    
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
      buffer = await pipeline.jpeg({ quality: 80, progressive: true }).toBuffer();
    } else if (file.mimetype === 'image/png') {
      buffer = await pipeline.png({ quality: 80, compressionLevel: 8 }).toBuffer();
    } else {
      // Fallback for other image types (like webp)
      buffer = await pipeline.webp({ quality: 80 }).toBuffer();
      contentType = 'image/webp';
    }
    
    console.log(`Compressed to: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
  }

  await s3Client.send(new PutObjectCommand({
    Bucket,
    Key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read' // Just in case, though we use the proxy
  }));

  const finalUrl = `${process.env.BASE_URL}/api/images/${Key}`;
  return finalUrl;
};

export const deleteFileFromS3 = async (url: string) => {
  if (!url || !url.includes('/api/images/')) return;
  
  const Bucket = process.env.S3_BUCKET || '';
  const Key = url.split('/api/images/')[1];

  if (!Key) return;

  try {
    await s3Client.send(new DeleteObjectCommand({
      Bucket,
      Key
    }));
    console.log(`Successfully deleted from S3: ${Key}`);
  } catch (err) {
    console.error(`Failed to delete from S3: ${Key}`, err);
  }
};

export const getUploadPresignedUrl = async (fileName: string, contentType: string) => {
  const Bucket = process.env.S3_BUCKET || '';
  const Key = `uploads/${Date.now()}-${fileName}`;

  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket,
    Key,
    Expires: 3600, // 1 hour
    Fields: {
      acl: 'public-read',
    },
    Conditions: [
      { bucket: Bucket },
      ['eq', '$key', Key],
      ['starts-with', '$Content-Type', contentType],
      ['content-length-range', 0, 5242880], // Max 5MB
      { acl: 'public-read' },
    ],
  });

  // Construct the final URL pointing to our backend proxy instead of direct S3
  const finalUrl = `${process.env.BASE_URL}/api/images/${Key}`;

  return { url, fields, finalUrl };
};
