require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const postsRouter = require('./routes/posts');

const app = express();
const PORT = 5000;

// 1. Middleware MUST come before routes
app.use(express.json()); 
app.use(cors()); // Enable CORS for frontend communication

// 2. MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas!'))
    .catch((error) => console.error('Database connection failed:', error));

// 3. Main Route handling
app.get('/', (req, res) => {
    res.json({ message: "The Data Hub API is running" });
});

// 4. API Routes
app.use('/posts', postsRouter);

// 5. Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});