import { S3Client, DeleteObjectCommand, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();

// Ensure mandatory S3 bits are present
if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY || !process.env.S3_BUCKET) {
  console.warn('⚠️ S3 Environment variables are missing! Uploads will fail.');
}

export const s3Client = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  // Railway often provides a custom endpoint. If empty string, must be undefined for AWS SDK.
  endpoint: process.env.S3_ENDPOINT || undefined,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true, // Required for custom S3 providers
});

export const uploadAndCompressToS3 = async (file: Express.Multer.File) => {
  const Bucket = process.env.S3_BUCKET || '';
  const Key = `uploads/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
  
  let buffer = file.buffer;
  let contentType = file.mimetype;

  console.log(`Processing file: ${file.originalname}, size: ${file.size}`);

  // Web-optimal processing
  if (file.mimetype.startsWith('image/')) {
    try {
        // Resize to max-width 1200px (large enough for gallery) and convert to webp
        buffer = await sharp(file.buffer)
          .resize(1200, null, { withoutEnlargement: true })
          .webp({ quality: 75, effort: 6 }) // Convert all images to WebP
          .toBuffer();
        
        contentType = 'image/webp';
        console.log(`Optimized: ${file.originalname} -> WebP (${buffer.length} bytes)`);
    } catch (sharpError) {
        console.error('Sharp optimization failed, using original buffer:', sharpError);
        buffer = file.buffer;
    }
  }

  await s3Client.send(new PutObjectCommand({
    Bucket,
    Key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read'
  }));

  // Construct the final URL via our proxy
  const baseUrl = process.env.BASE_URL || '';
  if (!baseUrl) console.warn('⚠️ BASE_URL is not set. Image URLs may be broken.');
  
  const finalUrl = `${baseUrl}/api/images/${Key}`;
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
    console.log(`Deleted S3 object: ${Key}`);
  } catch (err) {
    console.error(`Failed to delete S3 object: ${Key}`, err);
  }
};

export const getUploadPresignedUrl = async (fileName: string, contentType: string) => {
  const Bucket = process.env.S3_BUCKET || '';
  const Key = `uploads/${Date.now()}-${fileName}`;

  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket,
    Key,
    Expires: 3600,
    Fields: {
      acl: 'public-read',
    },
    Conditions: [
      { bucket: Bucket },
      ['eq', '$key', Key],
      ['starts-with', '$Content-Type', contentType],
      ['content-length-range', 0, 10485760], // Max 10MB
      { acl: 'public-read' },
    ],
  });

  const finalUrl = `${process.env.BASE_URL}/api/images/${Key}`;
  return { url, fields, finalUrl };
};
