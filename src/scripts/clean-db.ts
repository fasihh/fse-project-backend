import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { cleanDatabase } from '../api/utils/db-cleaner';

dotenv.config();

const DATABASE_URI = process.env.DATABASE_URI;

if (!DATABASE_URI) {
    console.error('DATABASE_URI is not defined in .env file');
    process.exit(1);
}

const runCleaner = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(DATABASE_URI);
        console.log('Connected to database successfully');

        console.log('Starting database cleanup...');
        await cleanDatabase();
        console.log('Database cleanup completed successfully');

        await mongoose.disconnect();
        console.log('Disconnected from database');
        process.exit(0);
    } catch (error) {
        console.error('Error during database cleanup:', error);
        process.exit(1);
    }
};

runCleaner(); 