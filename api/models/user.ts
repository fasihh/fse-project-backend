import { Model, CreationOptional, DataTypes } from "sequelize";
import sequelize from "../../config/database";
import bcrypt from 'bcrypt';
import { ExceptionType } from "../errors/exceptions";
import RequestError from "../errors/request-error";
import { UserAttributes, UserCreationAttributes } from "./user.d";

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare displayName?: string;
  declare username: string;
  declare password: string;
  declare role: 'member' | 'admin';
  declare isVerified: boolean;
  declare verificationToken: string | null;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('member', 'admin'),
      allowNull: false,
      defaultValue: 'member'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'User',
    hooks: {
      beforeCreate: async (user: User, options: unknown) => {
        try {
          const hashed = await bcrypt.hash(user.password, 10);
          user.password = hashed;
        } catch (err: unknown) {
          throw new RequestError(ExceptionType.INTERNAL_SERVER_ERROR, "Failed to hash password");
        }
      }
    }
  }
);

export default User;