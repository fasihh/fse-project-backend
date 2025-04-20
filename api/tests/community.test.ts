// import request from 'supertest';
// import app from '../../app';
// import Community from '../models/community';
// import User from '../models/user';
// import CommunityMember from '../models/community-member';
// import { UserCreationAttributes } from '../models/user.d';
// import { CommunityCreationAttributes } from '../models/community.d';

// const communityData = [
//   {
//     name: 'Test Community',
//     description: 'Test Community Description',
//     tags: 'test,community'
//   },
//   {
//     name: 'Test Community 2',
//     description: 'Test Community Description 2',
//     tags: 'test,community'
//   }
// ]

// const userData = [
//   {
//     username: 'testcommunityuser',
//     displayName: 'Test Community User',
//     email: 'testcommunity@mail.com',
//     password: 'password',
//     role: 'member',
//     isVerified: true
//   },
//   {
//     username: 'testcommunityadmin',
//     displayName: 'Test Community Admin',
//     email: 'testcommunityadmin@mail.com',
//     password: 'password',
//     role: 'admin',
//     isVerified: true
//   }
// ]

// describe('Community API Tests', () => {
//   let authToken: string;
//   let authAdminToken: string;
//   let testUser: any;
//   let testAdmin: any;
//   let testCommunity: any;

//   beforeAll(async () => {
//     // Create test user
//     testUser = await User.create(userData[0] as UserCreationAttributes);
//     testAdmin = await User.create(userData[1] as UserCreationAttributes);

//     for (const community of communityData)
//       await Community.create(community as CommunityCreationAttributes);

//     testCommunity = await Community.findOne({ where: { name: communityData[0].name } });

//     // Login to get auth token
//     const response = await request(app)
//       .post('/user/login')
//       .send({
//         email: userData[0].email,
//         password: userData[0].password
//       });

//     authToken = response.body.token;

//     const adminResponse = await request(app)
//       .post('/user/login')
//       .send({
//         email: userData[1].email,
//         password: userData[1].password
//       });

//     authAdminToken = adminResponse.body.token;
//   });

//   afterAll(async () => {
//     for (const community of communityData)
//       await Community.destroy({ where: { name: community.name } });

//     for (const user of userData)
//       await User.destroy({ where: { username: user.username } });
//   });

//   describe('Community Management', () => {
//     test('should get all communities', async () => {
//       const response = await request(app)
//         .get('/community')
//         .set('Authorization', `Bearer ${authToken}`);

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('communities');
//       expect(Array.isArray(response.body.communities)).toBe(true);
//       expect(response.body.communities.length).toBeGreaterThan(0);
//     });

//     test('should get community by id', async () => {
//       const response = await request(app)
//         .get(`/community/id/${testCommunity.id}`)
//         .set('Authorization', `Bearer ${authToken}`);

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('community');
//       expect(response.body.community.name).toBe(communityData[0].name);
//     });

//     test('should join community', async () => {
//       const response = await request(app)
//         .post(`/community/join/${testCommunity.id}`)
//         .set('Authorization', `Bearer ${authToken}`);

//       expect(response.status).toBe(201);
//       const communityMember = await CommunityMember.findOne({ where: { userId: testUser.id, communityId: testCommunity.id } });
//       expect(communityMember).not.toBeNull();
//     });

//     test('should create a new community (but fail because of permissions)', async () => {
//       const response = await request(app)
//         .post('/community')
//         .set('Authorization', `Bearer ${authToken}`)
//         .send({
//           name: 'New Test Community',
//           description: 'New Test Community Description',
//           tags: ['new', 'test']
//         });

//       expect(response.status).toBe(403);
//       expect(response.body.error.info).toBe('You are not authorized to create a community');
//     });

//     test('should create a new community (but fail because of permissions)', async () => {
//       const response = await request(app)
//         .post('/community')
//         .set('Authorization', `Bearer ${authAdminToken}`)
//         .send({
//           name: 'New Test Community',
//           description: 'New Test Community Description',
//           tags: ['new', 'test']
//         });

//       expect(response.status).toBe(201);
//       expect(response.body).toHaveProperty('community');
//       expect(response.body.community.name).toBe('New Test Community');
//     });

//     test('should delete a community', async () => {
//       const response = await request(app)
//         .delete(`/community/${testCommunity.id}`)
//         .set('Authorization', `Bearer ${authAdminToken}`);

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('message', 'Community deleted successfully');
//     });
//   });

//   describe('Community Error Handling', () => {
//     test('should not join non-existent community', async () => {
//       const response = await request(app)
//         .post(`/community/join/99999`)
//         .set('Authorization', `Bearer ${authToken}`);

//       expect(response.status).toBe(404);
//     });

//     test('should not leave non-existent community', async () => {
//       const response = await request(app)
//         .delete(`/community/leave/99999`)
//         .set('Authorization', `Bearer ${authToken}`);

//       expect(response.status).toBe(404);
//     });

//     test('should not get non-existent community', async () => {
//       const response = await request(app)
//         .get(`/community/id/99999`)
//         .set('Authorization', `Bearer ${authToken}`);

//       expect(response.status).toBe(404);
//     });
//   });
// }); 