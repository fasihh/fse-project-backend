import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'Admin' | 'Member';
  friendIds: mongoose.Schema.Types.ObjectId[];
  joinedCommunityIds: mongoose.Schema.Types.ObjectId[];
};

export interface IUserDocument extends IUser, Document {
  comparePassword(incomingPassword: string): Promise<boolean>;
};

const userSchema = new mongoose.Schema<IUserDocument>({
  _id: mongoose.Schema.ObjectId,
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Member'],
    default: 'Member',
    required: true,
  },
  friendIds: {
    type: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    default: [],
  },
  joinedCommunityIds: {
    type: [{ type: mongoose.Schema.ObjectId, ref: 'Community' }],
    default: [],
  }
}, {
  versionKey: false,
  timestamps: true,
  toObject: {
    transform: (doc, ret) => {
      const id = ret._id;
      delete ret._id;
      delete ret.password;
      return { id, ...ret };
    },
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password'))
    return next();

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.methods.comparePassword = async function(incomingPassword: string) {
  return await bcrypt.compare(incomingPassword, this.password);
}

export const User = mongoose.model('User', userSchema);
