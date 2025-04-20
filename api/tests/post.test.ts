import request from 'supertest';
import app from '../../app';
import Post from '../models/post';
import User from '../models/user';
import Community from '../models/community';
import PostVote from '../models/post-vote';
import { CommunityCreationAttributes } from '../models/community.d';
import { PostCreationAttributes } from '../models/post.d';
import { UserCreationAttributes } from '../models/user.d';
import CommunityMember from '../models/community-member';
import { CommunityMemberCreationAttributes } from '../models/community-member.d';

const communityData = [
  {
    name: 'Test Post Community',
    description: 'Test Community for Posts',
    tags: 'test,posts'
  }
]

const postData = [
  {
    title: 'Test Post Title',
    content: 'Test Post Content',
    userId: 1,
  },
  {
    title: 'Test Post Title 2',
    content: 'Test Post Content 2',
    userId: 1,
  }
]

const userData = [
  {
    username: 'testpostuser',
    displayName: 'Test Post User',
    email: 'testpost@mail.com',
    password: 'password',
    role: 'member',
    isVerified: true
  },
  {
    username: 'testpostadmin',
    displayName: 'Test Post Admin',
    email: 'testpostadmin@mail.com',
    password: 'password',
    role: 'admin',
    isVerified: true
  }
]

const communityMemberData = [
  {
    userId: 1,
    communityId: 1
  }
]

describe('Post API Tests', () => {
  let authToken: string;
  let authAdminToken: string;
  let testUser: any;
  let testAdmin: any;
  let testCommunity: any;
  let testPost: any;

  beforeAll(async () => {
    for (const community of communityData)
      await Community.create(community as CommunityCreationAttributes);

    for (const communityMember of communityMemberData)
      await CommunityMember.create(communityMember as CommunityMemberCreationAttributes);

    for (const user of userData)
      await User.create(user as UserCreationAttributes);

    testUser = await User.findOne({ where: { username: userData[0].username } });
    testAdmin = await User.findOne({ where: { username: userData[1].username } });
    testCommunity = await Community.findOne({ where: { name: communityData[0].name } });

    for (const post of postData)
      await Post.create({ ...post, communityId: testCommunity.id } as PostCreationAttributes);

    testPost = await Post.findOne({ where: { title: postData[0].title } });

    // Login to get auth token
    const response = await request(app)
      .post('/user/login')
      .send({
        email: userData[0].email,
        password: userData[0].password
      });

    authToken = response.body.token;

    const adminResponse = await request(app)
      .post('/user/login')
      .send({
        email: userData[1].email,
        password: userData[1].password
      });

    authAdminToken = adminResponse.body.token;
  });

  afterAll(async () => {
    for (const post of postData)
      await Post.destroy({ where: { title: post.title } });

    for (const community of communityData)
      await Community.destroy({ where: { name: community.name } });

    for (const user of userData)
      await User.destroy({ where: { username: user.username } });

    for (const communityMember of communityMemberData)
      await CommunityMember.destroy({ where: { userId: communityMember.userId, communityId: communityMember.communityId } });
  });

  describe('Post Management', () => {
    test('should get all posts', async () => {
      const response = await request(app)
        .get('/post')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('posts');
      expect(Array.isArray(response.body.posts)).toBe(true);
      expect(response.body.posts.length).toBeGreaterThan(0);
    });

    test('should get post by id', async () => {
      const response = await request(app)
        .get(`/post/${testPost.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('post');
      console.log(response.body, response.body.post);
      // expect(response.body.post.title).toBe(testPost.title);
    });

    // test('should create a new post (should fail because not in community)', async () => {
    //   const response = await request(app)
    //     .post('/post')
    //     .set('Authorization', `Bearer ${authToken}`)
    //     .send({
    //       title: 'New Test Post',
    //       content: 'New Test Post Content',
    //       communityId: testCommunity.id
    //     });

    //   expect(response.status).toBe(403);
    //   expect(response.body).toHaveProperty('error');
    //   expect(response.body.error.info).toBe('You are not authorized to create a post in this community');
    // });

    // test("should join community and create post", async () => {
    //   const response = await request(app)
    //     .post(`/community/join/${testCommunity.id}`)
    //     .set('Authorization', `Bearer ${authToken}`);

    //   expect(response.status).toBe(201);
    //   const communityMember = await CommunityMember.findOne({ where: { userId: testUser.id, communityId: testCommunity.id } });
    //   expect(communityMember).not.toBeNull();

    //   const postResponse = await request(app)
    //     .post('/post')
    //     .set('Authorization', `Bearer ${authToken}`)
    //     .send({
    //       title: 'New Test Post',
    //       content: 'New Test Post Content',
    //       communityId: testCommunity.id
    //     });

    //   expect(postResponse.status).toBe(201);
    //   expect(postResponse.body).toHaveProperty('post');
    //   expect(postResponse.body.post.title).toBe('New Test Post');
    //   expect(postResponse.body.post.userId).toBe(testUser.id);
    // });

    // test('should update a post', async () => {
    //   const response = await request(app)
    //     .patch(`/post/${testPost.id}`)
    //     .set('Authorization', `Bearer ${authToken}`)
    //     .send({
    //       title: 'Updated Post Title',
    //       content: 'Updated Post Content'
    //     });

    //   expect(response.status).toBe(200);
    //   expect(response.body).toHaveProperty('message', 'Post updated successfully');
    // });

    // test("should update post as admin", async () => {
    //   const response = await request(app)
    //     .patch(`/post/${testPost.id}`)
    //     .set('Authorization', `Bearer ${authAdminToken}`)
    //     .send({
    //       title: 'Updated Post Title 2',
    //       content: 'Updated Post Content 2'
    //     });

    //   expect(response.status).toBe(200);
    //   expect(response.body).toHaveProperty('message', 'Post updated successfully');
    // });

    // test('should delete a post', async () => {
    //   const response = await request(app)
    //     .delete(`/post/${testPost.id}`)
    //     .set('Authorization', `Bearer ${authToken}`);

    //   expect(response.status).toBe(200);
    //   expect(response.body).toHaveProperty('message', 'Post deleted successfully');
    // });

    // test("should create a new post", async () => {
    //   const response = await request(app)
    //     .post('/post')
    //     .set('Authorization', `Bearer ${authToken}`)
    //     .send({
    //       title: 'New Test Post',
    //       content: 'New Test Post Content',
    //       communityId: testCommunity.id
    //     });

    //   testPost = await Post.findOne({ where: { title: 'New Test Post' } });
    //   expect(response.status).toBe(201);
    //   expect(response.body).toHaveProperty('post');
    //   expect(response.body.post.title).toBe('New Test Post');
    // });

    // test("should upvote a post", async () => {
    //   const response = await request(app)
    //     .post(`/post/upvote/${testPost.id}`)
    //     .set('Authorization', `Bearer ${authToken}`);

    //   expect(response.status).toBe(200);
    //   expect(response.body).toHaveProperty('message', 'Post upvoted successfully');

    //   const postVote = await PostVote.findOne({ where: { postId: testPost.id, userId: testUser.id } });
    //   expect(postVote).not.toBeNull();
    //   expect(postVote?.voteType).toBe('up');
    // });

    // test("should downvote a post", async () => {
    //   const response = await request(app)
    //     .post(`/post/downvote/${testPost.id}`)
    //     .set('Authorization', `Bearer ${authToken}`);

    //   expect(response.status).toBe(200);
    //   expect(response.body).toHaveProperty('message', 'Post downvoted successfully');

    //   const postVote = await PostVote.findOne({ where: { postId: testPost.id, userId: testUser.id } });
    //   expect(postVote).not.toBeNull();
    //   expect(postVote?.voteType).toBe('down');
    // });

    // test("should downvote again to remove vote", async () => {
    //   const response = await request(app)
    //     .post(`/post/downvote/${testPost.id}`)
    //     .set('Authorization', `Bearer ${authToken}`);

    //   expect(response.status).toBe(200);
    //   expect(response.body).toHaveProperty('message', 'Post downvoted successfully');

    //   const postVote = await PostVote.findOne({ where: { postId: testPost.id, userId: testUser.id } });
    //   expect(postVote).toBeNull();
    // });
  });
});
