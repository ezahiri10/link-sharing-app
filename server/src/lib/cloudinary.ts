import { v2 as cloudinary } from 'cloudinary';

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error('❌ CLOUDINARY_CLOUD_NAME is not set');
}
if (!process.env.CLOUDINARY_API_KEY) {
  console.error('❌ CLOUDINARY_API_KEY is not set');
}
if (!process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ CLOUDINARY_API_SECRET is not set');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log('🔧 Cloudinary configured with cloud name:', process.env.CLOUDINARY_CLOUD_NAME);

export async function uploadToCloudinary(
  base64Image: string,
  folder: string = 'devlinks/avatars'
): Promise<string> {
  try {
    console.log('📤 Uploading image to Cloudinary...');
    
    const result = await cloudinary.uploader.upload(base64Image, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });
    
    console.log('✅ Image uploaded successfully:', result.secure_url);
    return result.secure_url;
  } catch (error: any) {
    console.error('❌ Cloudinary upload error:', {
      message: error.message,
      name: error.name,
      http_code: error.http_code,
    });
    throw new Error('Failed to upload image');
  }
}

export async function deleteFromCloudinary(imageUrl: string): Promise<void> {
  try {
    const publicId = extractPublicIdFromUrl(imageUrl);
    if (publicId) {
      console.log('🗑️ Deleting old image from Cloudinary:', publicId);
      await cloudinary.uploader.destroy(publicId);
      console.log('✅ Old image deleted');
    }
  } catch (error) {
    console.error('❌ Failed to delete image from Cloudinary:', error);
  }
}

function extractPublicIdFromUrl(url: string): string | null {
  // Extract public_id from Cloudinary URL
  // Example: https://res.cloudinary.com/cloud-name/image/upload/v123456/folder/image.jpg
  const match = url.match(/\/v\d+\/(.+)\./);
  return match ? match[1] : null;
}
