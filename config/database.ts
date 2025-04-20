import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "../logs/logger";
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true } },
  logging: (msg: string) => logger.info(msg),
});

export default sequelize;
