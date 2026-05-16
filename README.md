# BookMyShow Lite++

This is a full-stack MERN application for the BookMyShow Lite++ machine test.

## Project Setup

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB running locally on port `27017` (or modify `MONGO_URI` in `server/.env`)

### Backend Setup
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## API Endpoints

### Admin APIs
- `POST /api/admin/movies` - Create a new movie
- `GET /api/admin/movies` - List all movies
- `POST /api/admin/shows` - Create a show for a movie
- `GET /api/admin/shows` - List all shows

### User APIs
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/shows/:movieId` - Shows for a movie
- `GET /api/show/:id` - Get a specific show by ID
- `POST /api/seats/lock` - Lock selected seats for 2 minutes
- `POST /api/book` - Confirm a booking
- `GET /api/bookings/:userId` - User booking history

## Assumptions
- For testing purposes, a mock `userId = 'user_001'` is hardcoded in the frontend.
- When creating a show, the backend automatically generates 30 seats with `isBooked: false`.
- The user cannot book seats that are locked by another user unless the 2-minute lock has expired.
- Mongoose transactions are used for concurrency control (requires MongoDB Replica Set for full transactional safety, but gracefully falls back if not available in standard local setups).

## Known Issues
- None at the moment. Core requirements and validations have been implemented.
