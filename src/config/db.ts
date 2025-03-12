import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbUri = process.env.DATABASE_URI;

export async function connect() {
  dbUri && await mongoose.connect(dbUri);
}
