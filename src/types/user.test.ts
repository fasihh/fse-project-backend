import { describe, test, expect, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import { IUser, User } from "../api/models/user";
import app from '../app';
import { connect } from '../config/db';
import dotenv from 'dotenv';
dotenv.config();

const users: Omit<IUser, 'role' | 'friendIds'>[] = [
  {
    username: 'test1',
    email: 'test1@mail.com',
    password: 'test1',
  },
  {
    username: 'test2',
    email: 'test2@mail.com',
    password: 'test2',
  },
];

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  for (const user of users)
    await User.deleteOne({ username: user.username });
});

describe('Create and login users', () => {
  for (const user of users) {
    test(`Create user "${user.username}": expected response <201>`, async () => {
      const response = await request(app)
        .post('/user/register')
        .send({ ...user, ...(user.username === 'test1' && { code: process.env.ADMIN_KEY }) });
      expect(response.status).toBe(201);
    });
  
    test(`Login user "${user.username}": expected response <200>`, async () => {
      const response = await request(app)
        .post('/user/login')
        .send({ username: user.username, password: user.password });
      expect(response.status).toBe(200);
    });
  }
});

describe('Fetch all users', () => {
  test(`Fetch users: expected response <200>`, async () => {
    const response = await request(app)
      .get('/user')
    expect(response.status).toBe(200);
    
    // might need to implement a get by id feature too
    const test_users = new Set(users.map(user => user.username));
    console.log(response.body.data.filter((item: any) => test_users.has(item.username)));
  });
});
