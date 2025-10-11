// routes/posts.js
const express = require('express');
const router = express.Router();

// In-memory posts array for demo
let posts = [
  { id: 1, title: 'First Post', content: 'This is a test post', createdAt: new Date() },
  { id: 2, title: 'Second Post', content: 'This is another test post', createdAt: new Date() },
];

// GET all posts with optional search query
router.get('/', (req, res) => {
  const { q } = req.query;
  let filteredPosts = posts;

  if (q) {
    filteredPosts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        p.content.toLowerCase().includes(q.toLowerCase())
    );
  }

  res.json(filteredPosts);
});

// POST a new post
router.post('/', (req, res) => {
  const { title, body } = req.body; // use 'body' to match frontend
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const newPost = {
    id: posts.length ? posts[posts.length - 1].id + 1 : 1,
    title,
    content: body || '',
    createdAt: new Date(),
  };

  posts.push(newPost);
  res.status(201).json({ message: 'Post created successfully', post: newPost });
});

// DELETE a post by id
router.delete('/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const index = posts.findIndex((p) => p.id === postId);

  if (index === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }

  posts.splice(index, 1);
  res.json({ message: 'Post deleted successfully' });
});

module.exports = router;
