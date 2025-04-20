import { Model } from 'sequelize';

export interface UserAttributes {
  id?: number;
  username: string;
  displayName?: string;
  email: string;
  password: string;
  role: 'member' | 'admin';
  isVerified: boolean;
  verificationToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id: number;
  public username: string;
  public displayName?: string;
  public email: string;
  public password: string;
  public role: 'member' | 'admin';
  public isVerified: boolean;
  public verificationToken?: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}

export default User; 