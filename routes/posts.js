const express = require('express');
const router = express.Router();

// In-memory database array and ID tracker
let blogPosts = [];
let nextId = 1;

// GET /posts - Return all posts
router.get('/', (req, res) => {
    res.status(200).json(blogPosts);
});

// GET /posts/:id - Return a specific post
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const post = blogPosts.find(p => p.id === id);
    
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    
    res.status(200).json(post);
});

// POST /posts - Create a new post
router.post('/', (req, res) => {
    const { title, body } = req.body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '' ||
        !body || typeof body !== 'string' || body.trim() === '') {
        return res.status(400).json({ message: "Title and body are required." });
    }

    const newPost = {
        id: nextId++,
        title: title.trim(),
        body: body.trim(),
        createdAt: new Date().toISOString()
    };

    blogPosts.push(newPost);
    res.status(201).json(newPost);
});

// PUT /posts/:id - Update an existing post
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { title, body } = req.body;

    const postIndex = blogPosts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '' ||
        !body || typeof body !== 'string' || body.trim() === '') {
        return res.status(400).json({ message: "Title and body are required." });
    }

    // Update post keeping the same ID and createdAt
    blogPosts[postIndex] = {
        ...blogPosts[postIndex],
        title: title.trim(),
        body: body.trim()
    };

    res.status(200).json(blogPosts[postIndex]);
});

// DELETE /posts/:id - Delete a post
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const postIndex = blogPosts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }

    blogPosts.splice(postIndex, 1);
    res.status(200).json({ message: "Post deleted successfully" });
});

module.exports = router;