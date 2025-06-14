import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { gamePostService } from '../services/gamepost.service';
import { UserService } from '../services/user.service';
import { container } from 'tsyringe';
import path from 'path';

describe('Game Post API Tests', () => {
  let authToken: string;
  let testUserId: string;
  let testPostId: string;

  beforeAll(async () => {
    // Setup test user and get auth token
    const userService = container.resolve(UserService);
    const testUser = await userService.createUser({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 1
    });
    testUserId = testUser._id.toString();

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    // Cleanup
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /api/posts', () => {
    it('should create a new game post with valid data', async () => {
      const testPost = {
        title: 'Test Game Post',
        content: 'This is a test game post content',
        gameTitle: 'Test Game',
        genre: ['Action', 'Adventure'],
        releaseDate: new Date().toISOString()
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', testPost.title)
        .field('content', testPost.content)
        .field('gameTitle', testPost.gameTitle)
        .field('genre', JSON.stringify(testPost.genre))
        .field('releaseDate', testPost.releaseDate)
        .attach('cover', path.join(__dirname, 'test-files/test-cover.jpg'))
        .attach('images', path.join(__dirname, 'test-files/test-image1.jpg'));

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.title).toBe(testPost.title);
      expect(response.body.data.coverImage).toBeDefined();
      expect(response.body.data.images).toHaveLength(1);
      testPostId = response.body.data._id;
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should validate file types and sizes', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', 'Test Post')
        .field('content', 'Test Content')
        .field('gameTitle', 'Test Game')
        .field('genre', JSON.stringify(['Action']))
        .attach('cover', path.join(__dirname, 'test-files/invalid.txt'));

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Cover image must be JPEG, PNG, or WEBP');
    });
  });

  describe('GET /api/posts', () => {
    it('should get all game posts', async () => {
      const response = await request(app)
        .get('/api/posts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should get a specific game post by ID', async () => {
      const response = await request(app)
        .get(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(testPostId);
    });

    it('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .get(`/api/posts/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/posts/:id', () => {
    it('should update a game post', async () => {
      const updateData = {
        title: 'Updated Game Post',
        content: 'Updated content'
      };

      const response = await request(app)
        .patch(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.content).toBe(updateData.content);
    });

    it('should not allow unauthorized updates', async () => {
      // Create another user
      const userService = container.resolve(UserService);
      const otherUser = await userService.createUser({
        email: 'other@example.com',
        password: 'password123',
        name: 'Other User',
        role: 1
      });

      // Login as other user
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'other@example.com',
          password: 'password123'
        });
      const otherUserToken = loginResponse.body.token;

      const response = await request(app)
        .patch(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({ title: 'Unauthorized Update' });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a game post', async () => {
      const response = await request(app)
        .delete(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify post is deleted
      const getResponse = await request(app)
        .get(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });

    it('should not allow unauthorized deletion', async () => {
      // Create another user
      const userService = container.resolve(UserService);
      const otherUser = await userService.createUser({
        email: 'other2@example.com',
        password: 'password123',
        name: 'Other User 2',
        role: 1
      });

      // Login as other user
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'other2@example.com',
          password: 'password123'
        });
      const otherUserToken = loginResponse.body.token;

      // Create a new post
      const testPost = {
        title: 'Test Game Post 2',
        content: 'This is another test game post',
        gameTitle: 'Test Game 2',
        genre: ['Action']
      };

      const createResponse = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testPost);

      const newPostId = createResponse.body.data._id;

      // Try to delete with other user
      const response = await request(app)
        .delete(`/api/posts/${newPostId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(response.status).toBe(403);
    });
  });
}); 