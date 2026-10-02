const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Imported our new schema

// GET: Fetch all posts from the database
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find(); // Fetches everything from the database
        res.status(200).json(posts);
    } catch (error) {
        console.error("GET Route Error:", error); // <-- Asli error yahan print hoga
        res.status(500).json({ message: 'Server error fetching posts' });
    }
});

// POST: Save a new post to the database
router.post('/', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        
        if (!title || !content || !author) {
            return res.status(400).json({ message: 'Title, content, and author are required' });
        }

        const newPost = new Post({ title, content, author });
        await newPost.save(); // Saves to the database
        
        res.status(201).json(newPost);
    } catch (error) {
        console.error("POST Route Error:", error); // <-- Yahan print hoga
        res.status(500).json({ message: 'Server error saving post' });
    }
});

// PUT: Update an existing post by its ID
router.put('/:id', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        
        // findByIdAndUpdate takes the ID, the new data, and {new: true} to return the updated version
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { title, content, author },
            { new: true } 
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("PUT Route Error:", error); // <-- Yahan print hoga
        res.status(500).json({ message: 'Server error updating post' });
    }
});

// DELETE: Remove a post by its ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error("DELETE Route Error:", error); // <-- Yahan print hoga
        res.status(500).json({ message: 'Server error deleting post' });
    }
});

module.exports = router;