import request from 'supertest';
import app from '../../app';
import User from '../models/user';
import Community from '../models/community';
import Post from '../models/post';
import Comment from '../models/comment';

describe('Full API Integration Tests', () => {
  let userToken: string, adminToken: string;
  let user: any, admin: any, community: any, post: any, comment: any;

  beforeAll(async () => {
    // Register and login as a regular user
    await request(app).post('/user/register').send({
      username: 'testuser',
      displayName: 'Test User',
      email: 'testuser@example.com',
      password: 'password'
    });
    let res = await request(app).post('/user/login').send({
      email: 'testuser@example.com',
      password: 'password'
    });
    expect(res.status).toBe(200);
    userToken = res.body.token;
    user = await User.findOne({ where: { email: 'testuser@example.com' } });

    // Register and login as admin
    await request(app).post('/user/register').send({
      username: 'adminuser',
      displayName: 'Admin User',
      email: 'adminuser@example.com',
      password: 'password',
      key: process.env.ADMIN_KEY || 'adminkey'
    });
    res = await request(app).post('/user/login').send({
      email: 'adminuser@example.com',
      password: 'password'
    });
    expect(res.status).toBe(200);
    adminToken = res.body.token;
    admin = await User.findOne({ where: { email: 'adminuser@example.com' } });
  });

  // USER
  test('should get all users', async () => {
    const res = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  // COMMUNITY
  test('should create, get, join, and leave a community', async () => {
    // Create
    let res = await request(app)
      .post('/community')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Community',
        description: 'A test community',
        tags: ['test', 'community']
      });
    if (![201, 409].includes(res.status)) console.log('POST /community error:', res.body);
    expect([201, 409]).toContain(res.status);

    // If 409, fetch the existing community by listing all and finding by name
    if (res.status === 409) {
      let getRes = await request(app)
        .get('/community')
        .set('Authorization', `Bearer ${adminToken}`);
      if (getRes.status === 200 && Array.isArray(getRes.body.communities)) {
        community = getRes.body.communities.find((c: any) => c.name === 'Test Community');
        if (!community) throw new Error('Could not fetch existing community');
      } else {
        throw new Error('Could not fetch existing community');
      }
    } else {
      expect(res.body.community).toBeDefined();
      community = res.body.community;
    }

    // Get by id
    res = await request(app)
      .get(`/community/id/${community.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);

    // Join
    res = await request(app)
      .post(`/community/join/${community.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect([200, 201, 409]).toContain(res.status);

    // Leave
    res = await request(app)
      .post(`/community/leave/${community.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect([200, 201, 404]).toContain(res.status);
  });

  // POST
  test('should create, get, update, and delete a post', async () => {
    // Join community first
    await request(app)
      .post(`/community/join/${community.id}`)
      .set('Authorization', `Bearer ${userToken}`);

    // Create
    let res = await request(app)
      .post('/post')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Test Post',
        content: 'Test Content',
        communityId: community.id,
        tags: ['test']
      });
    if (res.status !== 201) console.log('POST /post error:', res.body);
    expect(res.status).toBe(201);
    expect(res.body.post).toBeDefined();
    post = res.body.post;

    // Get by id
    res = await request(app)
      .get(`/post/${post.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    if (res.status !== 200) console.log('GET /post/:id error:', res.body);
    expect(res.status).toBe(200);

    // Update
    res = await request(app)
      .patch(`/post/${post.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Updated Title', content: 'Updated Content' });
    if (res.status !== 200) console.log('PATCH /post/:id error:', res.body);
    expect(res.status).toBe(200);

    // Delete
    res = await request(app)
      .delete(`/post/${post.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    if (res.status !== 200) console.log('DELETE /post/:id error:', res.body);
    expect(res.status).toBe(200);
  });

  // POST VOTE
  test('should upvote and downvote a post', async () => {
    // Create a post
    let res = await request(app)
      .post('/post')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Vote Post',
        content: 'Vote Content',
        communityId: community.id
      });
    if (res.status !== 201) console.log('POST /post (vote) error:', res.body);
    expect(res.status).toBe(201);
    const votePost = res.body.post;

    // Upvote
    res = await request(app)
      .post(`/post/upvote/${votePost.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    if (res.status !== 200) console.log('POST /post/upvote error:', res.body);
    expect(res.status).toBe(200);

    // Downvote
    res = await request(app)
      .post(`/post/downvote/${votePost.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    if (res.status !== 200) console.log('POST /post/downvote error:', res.body);
    expect(res.status).toBe(200);
  });

  // COMMENT
  test('should create, get, and delete a comment', async () => {
    // Create a post for comment
    let res = await request(app)
      .post('/post')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Comment Post',
        content: 'Comment Content',
        communityId: community.id
      });
    if (res.status !== 201) console.log('POST /post (comment) error:', res.body);
    expect(res.status).toBe(201);
    const commentPost = res.body.post;

    // Create comment
    res = await request(app)
      .post(`/comment/${commentPost.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ content: 'Test Comment' });
    if (res.status !== 201) console.log('POST /comment error:', res.body);
    expect(res.status).toBe(201);
    expect(res.body.comment).toBeDefined();
    comment = res.body.comment;

    // Get by post id
    res = await request(app)
      .get(`/comment/post/${commentPost.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    if (res.status !== 200) console.log('GET /comment/post/:id error:', res.body);
    expect(res.status).toBe(200);

    // Delete
    res = await request(app)
      .delete(`/comment/${comment.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    if (res.status !== 200) console.log('DELETE /comment/:id error:', res.body);
    expect(res.status).toBe(200);
  });

  // COMMENT VOTE
  test('should upvote and downvote a comment', async () => {
    // Create a post and comment
    let res = await request(app)
      .post('/post')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Vote Comment Post',
        content: 'Vote Comment Content',
        communityId: community.id
      });
    if (res.status !== 201) console.log('POST /post (vote comment) error:', res.body);
    expect(res.status).toBe(201);
    const voteCommentPost = res.body.post;

    res = await request(app)
      .post(`/comment/${voteCommentPost.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ content: 'Vote Comment' });
    if (res.status !== 201) console.log('POST /comment (vote) error:', res.body);
    expect(res.status).toBe(201);
    const voteComment = res.body.comment;

    // Upvote
    res = await request(app)
      .post(`/comment/upvote/${voteComment.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    if (res.status !== 200) console.log('POST /comment/upvote error:', res.body);
    expect(res.status).toBe(200);

    // Downvote
    res = await request(app)
      .post(`/comment/downvote/${voteComment.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    if (res.status !== 200) console.log('POST /comment/downvote error:', res.body);
    expect(res.status).toBe(200);
  });

  // FRIENDSHIP
  test('should add and remove a friend', async () => {
    // Add friend
    let res = await request(app)
      .post(`/user/friends/${admin.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect([200, 201, 409]).toContain(res.status);

    // Remove friend
    res = await request(app)
      .delete(`/user/friends/${admin.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect([200, 404]).toContain(res.status);
  });
});
