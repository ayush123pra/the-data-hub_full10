# Sprint 10: Distributed Architecture & Deployment Log
**Project:** The Data Hub (MERN Stack)
**Focus:** Cloud Orchestration, Cross-Origin Configuration, and Production Environment Variables

## 1. Frontend Execution (React/Vite & Vercel CDN)
* **Environment Variable Injection Lifecycle:** Debugging Vite environment variable injection: Investigated why `import.meta.env.VITE_API_URL` evaluated to `undefined` during the Vercel production build step, causing the application to unexpectedly fallback to `http://localhost:5000` in the compiled static asset.
* **Network Resolution Protocols:** Resolved a `net::ERR_CONNECTION_REFUSED` exception on the Vercel-deployed React client. Diagnosed the browser console trace to redirect the client fetch target from the local daemon to the secure production URL specified in Vercel's Edge settings.
* **CI/CD Cache Invalidation:** Handled an edge case where Vercel served a stale build despite updating production environment variables. Bypassed the automated build cache and forced a hard redeployment to ensure updated API endpoint configurations were properly baked into the final static bundle.

## 2. Backend Orchestration (Node/Express & Render)
* **Port Binding in Containerized Environments:** Addressed health check timeouts during the Render cloud deployment phase. Reconfigured the Express application to bind strictly to the dynamically injected `process.env.PORT` rather than a hardcoded local port, matching Render's internal container orchestration requirements.
* **CORS Middleware Optimization:** Optimized Express CORS middleware to handle strict cross-domain policies. Resolved Vercel frontend CORS policy violations on `POST` and `PUT` requests by specifically configuring the `cors()` origin and methods payload to successfully process preflight `OPTIONS` requests across separated domains.
* **Secure Variable Management:** Established best practices for Node.js environment variable handling in a web service, ensuring the `MONGO_URI` injected via the Render dashboard securely supersedes any local dotenv package definitions without exposing credentials.

## 3. Database Configurations (MongoDB Atlas)
* **Cluster Connection Troubleshooting:** Diagnosed a critical production database connection failure throwing a `MongooseServerSelectionError` with `TopologyDescription` and `type: 'ReplicaSetNoPrimary'`. Identified this as a strict IP whitelisting rejection triggered by Render's dynamic egress IP addresses.
* **Network Access Security:** Configured MongoDB Atlas Network Access rules to accept cross-domain traffic from the Render-hosted backend by temporarily widening the CIDR block (`0.0.0.0/0`), allowing the decoupled architecture to establish a successful handshake.

## 4. System Architecture & API Design
* **Asynchronous State Management:** Implemented an optimized pattern for handling asynchronous state updates in the React UI while waiting for the cross-origin
  ## 5. Advanced State & Data Fetching (React/Vite)
* **Memory Leak Mitigation:** Addressed asynchronous race conditions in the React component tree. Implemented strategies to handle component unmounting during high-latency cross-origin API calls, ensuring background `fetch` promises do not trigger state updates on destroyed DOM nodes.
* **Build Optimization & Tree Shaking:** Investigated Vite asset compilation discrepancies to ensure strict isolation of environment variables. Verified that development-only `.env` references are properly tree-shaken and do not leak into the production minified chunks during Vercel's build step.

## 6. API Middleware & Security Pipeline (Express.js)
* **Middleware Execution Architecture:** Debugged the Express middleware pipeline sequence. Analyzed how the positional loading of `app.use(cors())` impacts preflight `OPTIONS` network requests, and standardized the middleware chain to ensure headers are injected before route resolution.
* **Event Loop Stability:** Implemented graceful error handling for unhandled Promise rejections during the asynchronous MongoDB Atlas handshake. This prevents the Node.js event loop from crashing the Render container silently if the database cluster experiences transient downtime.

## 7. Cloud Infrastructure & Edge Latency (DevOps)
* **Ephemeral Container Cold Starts:** Analyzed container orchestration lifecycles and cold-start latency. Documented the ~50-second spin-up delay inherent to Render's ephemeral instances when waking from an idle state, and evaluated strategies for client-side loading states to improve UX during container initialization.
* **Cache Invalidation Protocols:** Addressed cross-domain DNS resolution and Edge Network caching behaviors. Ensured Vercel's CDN does not aggressively cache stale JSON payloads from the Render API by evaluating `Cache-Control` header injection on Express response objects.

## 8. Database Connection Pooling (MongoDB Atlas)
* **TCP Connection Management:** Evaluated Mongoose connection pooling metrics within a serverless/ephemeral deployment context. Monitored how the Render container handles concurrent TCP connections to the MongoDB Atlas cluster to prevent port exhaustion and connection timeouts under simulated load.
* **BSON Serialization Auditing:** Reviewed the automated parsing of MongoDB's `_id` ObjectIDs across the network payload, ensuring secure and lossless serialization of BSON data types into JSON when traversing from the Node backend to the React client.
* backend to process destructive (`DELETE`) payloads, ensuring the DOM never renders stale cache data.
* **Performance Evaluation:** Evaluated the architectural impact of standard `fetch` API promises across physically separated edge networks (Vercel CDN to Render web service) to ensure minimal latency during database read/write cycles.
