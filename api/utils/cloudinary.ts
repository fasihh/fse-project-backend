import { v2 as cloudinary } from 'cloudinary';
import logger from '../../logs/logger';

export const deleteFileFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        logger.error(`Error deleting file from Cloudinary: ${publicId}` + error as string);
        throw error;
    }
};