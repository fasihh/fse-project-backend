import request from 'supertest';
import app from '../../app';
import User from '../models/user';
import UserFriend from '../models/user-friend';
import { UserCreationAttributes } from '../models/user.d';

const userData: UserCreationAttributes[] = [
  {
    username: 'testuser',
    displayName: 'Test User',
    email: 'test@mail.com',
    password: 'password',
    role: 'member',
    isVerified: true
  },
  {
    username: 'testfriend',
    displayName: 'Test Friend',
    email: 'testfriend@mail.com',
    password: 'password',
    role: 'member',
    isVerified: true
  },
  {
    username: 'testadmin',
    displayName: 'Test Admin',
    email: 'testadmin@mail.com',
    password: 'password',
    role: 'admin',
    isVerified: true
  }
];

describe('User API Tests', () => {
  let authToken: string;
  let testUser: any;
  let testFriend: any;

  beforeAll(async () => {
    // Create test users
    for (const user of userData)
      await User.create(user as UserCreationAttributes);

    testUser = await User.findOne({ where: { username: userData[0].username } });
    testFriend = await User.findOne({ where: { username: userData[1].username } });

    // Login to get auth token
    const response = await request(app)
      .post('/user/login')
      .send({
        email: userData[0].email,
        password: userData[0].password
      });

    authToken = response.body.token;
  });

  afterAll(async () => {
    for (const user of userData)
      await User.destroy({ where: { username: user.username } });
  });

  describe('User Management', () => {
    test('should get user profile', async () => {
      const response = await request(app)
        .get(`/user/id/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe(userData[0].username);
    });

    test('should update user profile', async () => {
      const response = await request(app)
        .patch(`/user/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          displayName: 'Updated Test User',
          email: 'updatedtest@mail.com'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'User updated successfully');
    });

    test('should add friend', async () => {
      const response = await request(app)
        .post(`/user/friends/${testFriend.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Friend added successfully');
    });

    test('should get friends', async () => {
      const response = await request(app)
        .get('/user/friends')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('friends');
      expect(Array.isArray(response.body.friends)).toBe(true);
      expect(response.body.friends.length).toBeGreaterThan(0);
    });

    test('should remove friend', async () => {
      const response = await request(app)
        .delete(`/user/friends/${testFriend.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Friend removed successfully');
    });
  });
}); 