# The Data Hub API - Sprint 9

A RESTful backend API built with Node.js and Express.js. This project demonstrates core backend concepts including server scaffolding, routing, in-memory CRUD operations, custom middleware, and basic mock authentication.

## 🚀 Features

- **Health Check Endpoint:** Simple root endpoint to verify server status.
- **In-Memory CRUD:** Create, Read, Update, and Delete blog posts using an in-memory data array.
- **Custom Request Logger:** Global middleware that intercepts and logs all incoming HTTP requests with timestamps.
- **Mock Authentication:** A `/login` endpoint to simulate a login flow using hardcoded credentials, returning a mock JWT token.
- **Error Handling:** Global 404 handler for invalid routes and proper HTTP status codes for invalid requests.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Testing Tools:** Thunder Client / Postman

## ⚙️ Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
