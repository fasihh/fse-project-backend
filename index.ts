import http from 'http';
import app from './app';
import dotenv from 'dotenv';
import sequelize from './config/database';
dotenv.config();

const port = process.env.PORT || "3001";
const server = http.createServer(app);

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: process.env.MODE === 'dev' });

    console.log('connected to db');
    server.listen(port);
    console.log(`http://localhost:${port}`);
  } catch(error: unknown) {
    console.error(error);
  }
}

start();
