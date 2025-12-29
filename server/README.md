# Link Sharing App - Backend

Backend server for the Link Sharing App with drag-and-drop reordering.

## Tech Stack

- Node.js + Express
- tRPC
- PostgreSQL (Neon)
- TypeScript
- bcrypt for authentication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your values:
- `DATABASE_URL`: Your PostgreSQL connection string
- `CLIENT_URL`: Frontend URL (for CORS)
- `CLOUDINARY_*`: Your Cloudinary credentials

4. Run database migrations (if needed):
```bash
npm run migrate
```

5. Start development server:
```bash
npm run dev
```

## Deployment

### Railway

1. Push code to GitHub
2. Connect repository to Railway
3. Add environment variables in Railway dashboard
4. Deploy!

## API Endpoints

- `/trpc` - tRPC API endpoint
- `/health` - Health check endpoint

## Features

- User authentication (register/login/logout)
- Profile management with image upload
- Links CRUD operations
- **Drag-and-drop link reordering** with transactions
