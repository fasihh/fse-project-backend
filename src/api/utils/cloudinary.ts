import { v2 as cloudinary } from 'cloudinary';

export const deleteFileFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error(`Error deleting file from Cloudinary: ${publicId}`, error);
        throw error;
    }
};