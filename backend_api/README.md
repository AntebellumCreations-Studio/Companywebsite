# Blog API (Medium Clone) - Work In Progress

## Introduction

A Blog API designed to clone the main features of the popular blogging platform, Medium. It includes various endpoints for managing blog posts, user authentication, user profiles, and user follow relationships.

## Tech Stack:

- TypeScript
- Node.js
- Express.js
- MongoDB
- Mongoose

## Key Features:

- Authentication and authorization using JWT
- CRUD operations for blog posts
- Search, sort, and filter and paginate blog posts
- User profile management
- Follow and unfollow other users

## Installation

1. Clone the repository: `git clone https://github.com/your-username/express-blog-api.git`
2. Install dependencies: `npm install`
3. Set up environment variables: Create a `.env` file and add the necessary variables (e.g., `PORT`, `MONGODB_URI`, `JWT_SECRET`)
4. Start the server: `npm start`

## API Endpoints

### Authentication Endpoints

- POST /auth/signup: Create a new user
- POST /auth/login: Log in an existing user

### Blog Post Endpoints

- GET /posts: Get all blog posts
- GET /posts/:id: Get a single blog post
- POST /posts: Create a new blog post
- PATCH /posts/:id: Update an existing blog post
- DELETE /posts/:id: Delete an existing blog post

### User Profile Endpoints

- GET /users/me: Get the current user's profile
- PATCH /users/me: Update the current user's profile
- POST /users/me/avatar: Upload a profile picture
- DELETE /users/me/avatar: Delete the current user's profile picture

### User Follow Endpoints

- GET /users/:id: Get a user's profile
- GET /users/:id/following: Get the users that the specified user is following
- GET /users/:id/followers: Get the users that are following the specified user
- POST /users/:id/follow: Follow a user
- GET /users/me/following: Get the users that the current user is following
- GET /users/me/followers: Get the users that are following the current user
- POST /users/me/follow: Follow another user
- POST /users/me/unfollow: Unfollow another user

## API Documentation

The API documentation is available at `/api-docs` when running the application in development mode. It uses Swagger UI to provide an interactive interface for exploring the endpoints.

## Usage

1. Sign up as a new user using the `/auth/signup` endpoint.
2. Log in using the `/auth/login` endpoint to obtain an access token.
3. Use the access token to authenticate requests to protected endpoints.
4. Create, read, update, and delete blog posts using the respective endpoints.
5. Manage user profiles, including updating profile information and uploading profile pictures.
6. Follow and unfollow other users using the `/users/me/follow` and `/users/me/unfollow` endpoints.


