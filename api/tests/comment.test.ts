// import request from 'supertest';
// import app from '../../app';
// import Comment from '../models/comment';
// import User from '../models/user';
// import Post from '../models/post';
// import Community from '../models/community';
// import CommentVote from '../models/comment-vote';

// describe('Comment API Tests', () => {
//   let authToken: string;
//   let testUser: any;
//   let testPost: any;
//   let testCommunity: any;
//   let testComment: any;
//   let testNestedComment: any;

//   beforeAll(async () => {
//     // Create test community
//     testCommunity = await Community.create({
//       name: 'Test Community',
//       description: 'Test Community Description',
//       tags: 'test,community'
//     });

//     // Create test user
//     testUser = await User.create({
//       username: 'testuser',
//       displayName: 'Test User',
//       email: 'test@mail.com',
//       password: 'password',
//       role: 'member',
//       isVerified: true
//     });

//     // Create test post
//     testPost = await Post.create({
//       title: 'Test Post',
//       content: 'Test Post Content',
//       userId: testUser.id,
//       communityId: testCommunity.id
//     });

//     // Create test comments
//     testComment = await Comment.create({
//       content: 'Test Comment',
//       postId: testPost.id,
//       userId: testUser.id,
//       parentId: null
//     });

//     testNestedComment = await Comment.create({
//       content: 'Test Nested Comment',
//       postId: testPost.id,
//       userId: testUser.id,
//       parentId: testComment.id
//     });

//     // Login to get auth token
//     const response = await request(app)
//       .post('/user/login')
//       .send({
//         email: 'test@mail.com',
//         password: 'password'
//       });

//     authToken = response.body.token;
//   });

//   afterAll(async () => {
//     // Clean up test data
//     await CommentVote.destroy({ where: {} });
//     await Comment.destroy({ where: {} });
//     await Post.destroy({ where: {} });
//     await User.destroy({ where: { id: testUser.id } });
//     await Community.destroy({ where: { id: testCommunity.id } });
//   });

//   describe('Comment Management', () => {
//     test('should get comments for a post', async () => {
//       const response = await request(app)
//         .get(`/comment/post/${testPost.id}`)
//         .set('Authorization', `Bearer ${authToken}`);

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('comments');
//       expect(Array.isArray(response.body.comments)).toBe(true);
//       expect(response.body.comments.length).toBeGreaterThan(0);
      
//       // Verify the first comment has children
//       const firstComment = response.body.comments[0];
//       expect(firstComment.content).toBe('Test Comment');
//       expect(Array.isArray(firstComment.children)).toBe(true);
//       expect(firstComment.children.length).toBe(1);
//     });

//     test('should get comment by id', async () => {
//       const response = await request(app)
//         .get(`/comment/${testComment.id}`)
//         .set('Authorization', `Bearer ${authToken}`);

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('comment');
//       expect(response.body.comment.content).toBe('Test Comment');
//     });

//     test('should create a new comment', async () => {
//       const response = await request(app)
//         .post(`/comment/${testPost.id}`)
//         .set('Authorization', `Bearer ${authToken}`)
//         .send({
//           content: 'New test comment'
//         });

//       expect(response.status).toBe(201);
//       expect(response.body).toHaveProperty('comment');
//       expect(response.body.comment.content).toBe('New test comment');
//       expect(response.body.comment.userId).toBe(testUser.id);
//     });

//     test('should create a nested comment', async () => {
//       const response = await request(app)
//         .post(`/comment/${testPost.id}`)
//         .set('Authorization', `Bearer ${authToken}`)
//         .send({
//           content: 'New nested comment',
//           parentId: testComment.id
//         });

//       expect(response.status).toBe(201);
//       expect(response.body).toHaveProperty('comment');
//       expect(response.body.comment.content).toBe('New nested comment');
//       expect(response.body.comment.parentId).toBe(testComment.id);
//     });

//     test('should update a comment', async () => {
//       const response = await request(app)
//         .patch(`/comment/${testComment.id}`)
//         .set('Authorization', `Bearer ${authToken}`)
//         .send({
//           content: 'Updated comment content'
//         });

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('message', 'Comment updated successfully');
//     });

//     test('should delete a comment', async () => {
//       const response = await request(app)
//         .delete(`/comment/${testNestedComment.id}`)
//         .set('Authorization', `Bearer ${authToken}`);

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('message', 'Comment deleted successfully');
//     });

//     test('should upvote a comment', async () => {
//       const comment = await Comment.findOne({
//         where: { content: 'This is a comment' }
//       });

//       const response = await request(app)
//         .post(`/comment/upvote/${comment?.id}`)
//         .set('Authorization', `Bearer ${authToken}`);

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('message', 'Comment voted successfully');
//     });

//     test('should downvote a comment', async () => {
//       const comment = await Comment.findOne({
//         where: { content: 'This is a comment' }
//       });
      
//       const response = await request(app)
//         .post(`/comment/downvote/${comment?.id}`)
//         .set('Authorization', `Bearer ${authToken}`);

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('message', 'Comment voted successfully');
//     });

//     test('should downvote already downvoted comment', async () => {
//       const comment = await Comment.findOne({
//         where: { content: 'This is a comment' }
//       });

//       const response = await request(app)
//         .post(`/comment/downvote/${comment?.id}`)
//         .set('Authorization', `Bearer ${authToken}`);

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('message', 'Comment voted successfully');
//       const downvotes = await CommentVote.findOne({
//         where: { commentId: comment?.id, voteType: 'down' }
//       });
//       expect(downvotes).toBeNull();
//     });
//   });
// });
