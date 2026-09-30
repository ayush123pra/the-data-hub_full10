const express = require('express');
const postsRouter = require('./routes/posts');

const app = express();
const PORT = 5000;

// Middleware - JSON data read karne ke liye
app.use(express.json());

// Health Check Route (Test karne ke liye)
app.get('/', (req, res) => {
    res.status(200).json({ message: "The Data Hub API is running" });
});

// Posts ke routes ko link karna
app.use('/posts', postsRouter);

// 404 Error handler (Agar koi galat URL daale)
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});