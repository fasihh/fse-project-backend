import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  username: string;
  email: string;
  password: string;
  friendIds: mongoose.Schema.Types.ObjectId[];
};

interface IUserDocument extends IUser, Document {
  comparePassword(incommingPassword: string): Promise<boolean>;
};

const userSchema = new mongoose.Schema<IUserDocument>({
  _id: mongoose.Schema.ObjectId,
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
  },
  password: {
    type: String,
    required: true,
  },
  friendIds: {
    type: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    default: []
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
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.methods.comparePassword = async function(incomingPassword: string) {
  return await bcrypt.compare(incomingPassword, this.password);
}

export const User = mongoose.model('User', userSchema);
