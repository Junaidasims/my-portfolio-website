# Portfolio platform (Full-Stack)

Multi-user portfolio app: **React + Vite + Tailwind + Framer Motion** frontend and **Node + Express + MongoDB + JWT** backend. Each user has their own profile, skills, projects, resume (PDF upload), and a shareable public portfolio URL.

## Prerequisites

- **Node.js** 18+
- **MongoDB** (local or [Atlas](https://www.mongodb.com/cloud/atlas))

## Project structure

```
portfolio-website/
├── backend/
├── frontend/
└── README.md
```

## Backend

1. Copy **`.env.example`** → **`.env`** and set:

   | Variable | Description |
   |----------|-------------|
   | `PORT` | API port (default `5000`) |
   | `MONGO_URI` | MongoDB connection string |
   | `FRONTEND_URL` | Frontend origin for CORS (e.g. `http://localhost:5173`) |
   | `JWT_SECRET` | Long random string used to sign JWTs (required) |

2. Run:

   ```bash
   cd portfolio-website/backend
   npm install
   npm run dev
   ```

3. Uploaded files are stored under `backend/uploads/` (excluded from git).

## Frontend

1. Copy **`frontend/.env.example`** → **`.env`**. Set `VITE_API_URL` to the API base URL (**no trailing slash**), e.g. `http://localhost:5000`.

2. Run:

   ```bash
   cd portfolio-website/frontend
   npm install
   npm run dev
   ```

3. Open `http://localhost:5173`.

## User flow

1. **Sign up** → JWT stored in `localStorage` (`portfolio_jwt`).
2. **Complete profile** (name, role, short description, plus optional about fields) → unlocks the main portfolio view.
3. **Dashboard** (`/dashboard`) — edit profile, upload **PDF resume** and profile image, manage **skills** (Beginner / Intermediate / Advanced) and **projects**.
4. **Public portfolio** — `http://localhost:5173/u/<yourUserId>` — same layout; includes **contact** form (messages stored with `recipientId`).

## API overview

| Area | Path | Notes |
|------|------|--------|
| Auth | `POST /api/auth/signup`, `POST /api/auth/login` | Returns `{ token, user }` |
| Me | `GET/PATCH /api/users/me` | Bearer JWT |
| Complete profile | `POST /api/users/me/complete-profile` | Sets `profileCompleted` |
| Resume | `POST /api/users/me/resume` (multipart field `resume`, PDF only), `GET /api/users/me/resume` | Auth |
| Avatar | `POST /api/users/me/profile-image` (field `image`) | Auth |
| Portfolio bundle | `GET /api/users/me/portfolio` | Auth; `{ user, skills, projects }` |
| Skills | `GET/POST /api/skills`, `PUT/DELETE /api/skills/:id` | Auth; scoped by user |
| Projects | `GET/POST /api/projects`, `PUT/DELETE /api/projects/:id` | Auth; scoped by user |
| Public | `GET /api/public/portfolio/:userId`, `GET /api/public/resume/:userId` | No auth |
| Contact | `POST /api/contact` | Body: `recipientId`, `name`, `email`, `message` |

## Production notes

- Use a strong `JWT_SECRET` and HTTPS.
- Point `FRONTEND_URL` at your deployed SPA origin.
- Serve `frontend/dist` from a static host; ensure `VITE_API_URL` is your API URL.
- Persist `uploads/` on the server or move storage to S3/Cloudinary for scale.

## License

MIT
