const express = require('express');
const postsRouter = require('./routes/posts');

const app = express();
const PORT = 5000;

// Middleware - Body parser
app.use(express.json());

// Phase 3: Custom Request Logging Middleware
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toLocaleString();
    console.log(`[${req.method}] ${req.originalUrl} - ${timestamp}`);
    next();
};

// Register logger globally so it catches all requests
app.use(requestLogger);

// Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({ message: "The Data Hub API is running" });
});

// Phase 3: Mock Login Endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validate presence of fields
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Mock credential check
    if (username === 'raushan' && password === 'test123') {
        return res.status(200).json({
            message: "Login successful",
            token: "mock-jwt-token-123456"
        });
    }

    // Invalid credentials
    return res.status(401).json({ message: "Invalid credentials" });
});

// Mount posts router
app.use('/posts', postsRouter);

// 404 Error handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});