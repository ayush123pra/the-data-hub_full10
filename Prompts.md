# Sprint 9 — Complete Project Documentation (Phases 1, 2 & 3)

---

## Sprint 9 — Phase 1: Server Scaffolding & Setup

### Objective
Initialize a robust Node.js and Express backend server, configure core middleware for JSON parsing, establish health check routes, and implement fallback error handling for unmatched routes.

### Architecture & Implementation
- **Core Framework:** Utilized Express.js to set up the server instance listening on port `5000`.
- **Global Middleware:** Integrated `express.json()` as the primary body parser to handle incoming JSON payloads across all subsequent routing layers.
- **Routing Structure:** 
  - Root Health-Check Route (`GET /`): Returns a JSON response confirming the API is active.
  - Global 404 Handler: Positioned at the very end of the middleware stack to intercept any invalid URL requests and return a standardized JSON error message.

### Testing & Verification
- Tested `GET /` via Thunder Client and confirmed a `200 OK` status response.
- Tested invalid endpoints and verified that the 404 error handler successfully catches them, returning a clean JSON response instead of default HTML pages.

---

## Sprint 9 — Phase 2: In-Memory CRUD Operations

### Objective
Implement a fully functional in-memory data management system for blog posts supporting complete CRUD (Create, Read, Update, Delete) operations, incorporating input validation and precise HTTP status codes.

### Architecture & Implementation
- **Data Source:** Maintained an in-memory array (`blogPosts`) storing post entities with unique identifiers (`id`), titles, and body content.
- **Modular Routing:** Created a dedicated Express Router (`routes/posts.js`) mounted at the `/posts` base path to separate concerns and keep `server.js` clean.
- **Endpoints Built:**
  - `POST /posts`: Validates title and body presence, generates a unique ID, pushes to the array, and returns `201 Created`.
  - `GET /posts`: Retrieves the complete list of blog posts (`200 OK`).
  - `GET /posts/:id`: Fetches a specific post by its ID or returns `404 Not Found` if it does not exist.
  - `PUT /posts/:id`: Updates an existing post's fields with validation checks (`400` / `404`).
  - `DELETE /posts/:id`: Removes a post from the array by ID (`200` / `404`).

### Testing & Verification
- Verified all CRUD interactions using Postman and Thunder Client.
- Ensured appropriate status codes (`201`, `200`, `400`, `404`) are returned under valid and invalid payloads.

---

## Sprint 9 — Phase 3: Custom Middleware + Mock Authentication

### Objective
Implement a custom global request-logging middleware to monitor all incoming HTTP traffic in real time and create a mock `/login` endpoint to simulate user authentication flows without integrating external databases or cryptographic security packages.

### Architecture & Implementation
- **Custom Request Logger:** 
  - Defined a middleware function `requestLogger(req, res, next)` that captures `req.method`, `req.originalUrl`, and generates a localized timestamp using native JavaScript (`new Date().toLocaleString()`).
  - Registered globally using `app.use(requestLogger)` immediately after the JSON body parser and before all route declarations to ensure 100% request coverage.
- **Mock Login Route (`POST /login`):**
  - Reads `username` and `password` from `req.body`.
  - Validates field presence (returns `400 Bad Request` if missing).
  - Performs mock validation against hardcoded credentials (`username: "ayush"`, `password: "test123"`).
  - Returns `200 OK` with a static mock JWT string (`"mock-jwt-token-123456"`) on success, or `401 Unauthorized` on invalid credentials.

### Testing & Verification
- **Middleware Logs:** Verified the server terminal outputs formatted logs (e.g., `[POST] /login - <timestamp>`) for every incoming HTTP request.
- **Authentication Flows:**
  - Valid credentials (`ayush` / `test123`) yielded `200 OK` with the token.
  - Missing body fields returned `400 Bad Request`.
  - Incorrect credentials returned `401 Unauthorized`.
- **Regression Safety:** Confirmed that adding global logging and the login endpoint did not break any existing Phase 1 or Phase 2 CRUD routes.

### Debugging & Result
- Handled `TypeError` issues during early testing by ensuring Thunder Client requests correctly targeted the `Body -> JSON` tab rather than Headers.
- Maintained a lightweight codebase by avoiding heavy external libraries like `jsonwebtoken` or `moment.js`, fully satisfying sprint constraints.
