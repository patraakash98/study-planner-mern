# Study Planner

A small single-user study planner built with MongoDB, Express, React, and Node.js (MERN). You can add tasks, choose a priority and estimated duration, filter tasks by status, and mark pending tasks as completed.

This is a local-development MVP. It has no login, so do not expose it to the public internet.

## Prerequisites

Install these first on Windows:

- Node.js LTS (includes npm)
- MongoDB Community Server running locally, or a MongoDB Atlas connection string
- PowerShell or another terminal

Check Node and npm:

```powershell
node --version
npm --version
```

## Setup

From the repository folder, install the two packages:

```powershell
cd server
npm install
Copy-Item .env.example .env
cd ..\client
npm install
cd ..
```

Open `server/.env` and check the values:

```dotenv
PORT=5000
HOST=127.0.0.1
MONGODB_URI=mongodb://127.0.0.1:27017/study_planner
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string. Keep that file private; it is ignored by Git.

## Run the application

Use two PowerShell terminals.

Terminal 1, start the API:

```powershell
cd server
npm run dev
```

Terminal 2, start the React app:

```powershell
cd client
npm run dev
```

Open the URL printed by Vite, normally `http://127.0.0.1:5173`.

The browser calls relative `/api/...` URLs. Vite proxies those calls to Express on port 5000. Express is the only part that connects to MongoDB.

## API

- `GET /api/tasks` lists all tasks.
- `GET /api/tasks?status=pending` lists pending tasks.
- `GET /api/tasks?status=completed` lists completed tasks.
- `POST /api/tasks` creates a task with `taskName`, `courseName`, `topicName`, `priority`, and `durationMinutes`.
- `PATCH /api/tasks/:id/status` accepts `{ "status": "completed" }`.

The server validates all requests independently of the browser. Task names and topics can contain up to 150 characters, courses up to 100 characters, and duration must be a whole number from 1 through 1440.

## Tests and production build

Backend integration tests use an isolated temporary MongoDB database and never clear your development database:

```powershell
cd server
npm test
```

Build the frontend:

```powershell
cd client
npm run build
```

## Troubleshooting

**MongoDB connection refused**: make sure the MongoDB service is running, or put a valid Atlas URI in `server/.env`. The API will not start without a database connection.

**Port 5000 is busy**: change `PORT` in `server/.env`, then update the proxy target in `client/vite.config.js` to match.

**Port 5173 is busy**: Vite will normally choose another available port and print it in the terminal.

**Tests need an internet connection the first time**: `mongodb-memory-server` may download a MongoDB binary for the isolated test database. Run `npm test` again after the download completes if necessary.

## How the pieces fit together

React owns the form, selected filter, task list, and loading/mutation messages. It sends JSON with `fetch` to Express. Express routes the request to a controller, validates only the expected fields, and uses the Mongoose `Task` model to read or write MongoDB. The response returns to React, which updates the visible list. Refreshing the browser loads the same records again from MongoDB.
