const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const token = 'YOUR_JWT_TOKEN_HERE';
const baseUrl = 'http://localhost:6000/api/v1/';

//  create  a new user
async function createUser(route) {
  const testData = {
    name: 'John Doe we',
    email: 'Joh6n@gmail.com',
    username: 'John Doe we',
    password: 'password123',
    confirmPassword: 'password123',
  };
  const form = new FormData();

  // Append other text fields for the post body
  form.append('name', testData.name);
  form.append('email', testData.email);
  form.append('username', testData.username);
  form.append('password', testData.password);
  form.append('confirmPassword', testData.confirmPassword);

  console.log(form);
  console.log(`${baseUrl}auth/${route}`);

  try {
    axios.post(`${baseUrl}auth/${route}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Upload response:', response.data);
  } catch (error) {
    console.error('Upload failed:', error.response ? error.response.data : error.message);
  }
}

createUser('signup');

//
async function createGamePost(route) {
  const testPost = {
    title: 'Test Game Post',
    content: 'This is a test game post content',
    gameTitle: 'Test Game',
    genre: ['Action', 'Adventure'],
    releaseDate: new Date().toISOString(),
  };
  const form = new FormData();

  // Append the cover image (single file)
  const coverPath = path.join(__dirname, 'file', 'coverimage.png');
  if (!fs.existsSync(coverPath)) {
    console.error('Cover image file does not exist:', coverPath);
    return;
  }
  form.append('cover', fs.createReadStream(coverPath));

  // Append multiple images (multiple files under 'images')
  const imagePaths = [path.join(__dirname, 'file', 'image1.png'), path.join(__dirname, 'file', 'image2.png')];
  for (const imagePath of imagePaths) {
    if (!fs.existsSync(imagePath)) {
      console.error('Image file does not exist:', imagePath);
      return;
    }
    form.append('images', fs.createReadStream(imagePath));
  }

  // Append other text fields for the post body
  form.append('title', testPost.title);
  form.append('content', testPost.content);
  form.append('gameTitle', testPost.gameTitle);
  form.append('releaseDate', testPost.releaseDate);

  // Send genre array as JSON string (safer option)
  form.append('genre', JSON.stringify(testPost.genre));

  try {
    const response = await axios.post(`${baseUrl}auth/${route}`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Upload response:', response.data);
  } catch (error) {
    console.error('Upload failed:', error.response ? error.response.data : error.message);
  }
}
