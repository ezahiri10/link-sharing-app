import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function uploadToCloudinary(base64Image) {
    const result = await cloudinary.uploader.upload(base64Image, {
        folder: 'devlinks/avatars',
        resource_type: 'image',
        transformation: [
            { width: 500, height: 500, crop: 'fill', gravity: 'face' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
        ],
    });
    return result.secure_url;
}
export async function deleteFromCloudinary(imageUrl) {
    const publicId = extractPublicIdFromUrl(imageUrl);
    if (publicId) {
        await cloudinary.uploader.destroy(publicId);
    }
}
function extractPublicIdFromUrl(url) {
    const match = url.match(/\/v\d+\/(.+)\./);
    return match ? match[1] : null;
}
//# sourceMappingURL=cloudinary.js.map