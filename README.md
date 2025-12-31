# DevLinks - Link Sharing Platform

> A modern full-stack link-in-bio application for developers to showcase their professional presence across multiple platforms.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![tRPC](https://img.shields.io/badge/tRPC-11.0-2596BE?style=flat&logo=trpc&logoColor=white)](https://trpc.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**Live Demo:** [https://fronend-link-app.vercel.app](https://fronend-link-app.vercel.app)

---

## Overview

DevLinks is a production-ready link aggregation platform that allows developers to create a personalized landing page showcasing all their professional links in one place. Built with modern web technologies and deployed on Vercel (frontend) and Railway (backend) with cross-origin authentication.

## Features

### Core Functionality
- **User Authentication** - Secure registration and login with Better Auth
- **Cross-Origin Sessions** - Working cookie-based authentication across domains
- **Profile Management** - Customizable profile with image upload via Cloudinary
- **Link Management** - Add, edit, delete, and drag-to-reorder your professional links
- **Platform Support** - Pre-configured support for 15+ platforms (GitHub, LinkedIn, Twitter, etc.)
- **Live Preview** - Real-time preview of your public profile
- **Public Sharing** - Share your unique profile URL with anyone
- **Responsive Design** - Fully responsive UI that works on all devices

### Technical Features
- **Type-Safe API** - Full type safety across client and server with tRPC
- **Modern Routing** - File-based routing with TanStack Router
- **Optimistic Updates** - Instant UI feedback with TanStack Query
- **Image Optimization** - Cloud-based image storage and delivery
- **Session Management** - Better Auth with database session storage
- **Cross-Origin Cookies** - Custom middleware for SameSite=None cookies
- **Database Transactions** - Reliable data integrity with PostgreSQL

## Tech Stack

### Frontend
- **React 19** - Latest React with modern hooks and features
- **TypeScript** - Full type safety throughout the application
- **TanStack Router** - Type-safe routing solution
- **TanStack Query** - Powerful data synchronization
- **tRPC** - End-to-end type-safe APIs
- **Better Auth React** - Authentication client
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Deployed on Vercel**

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **tRPC** - Type-safe API layer
- **PostgreSQL (Neon)** - Serverless PostgreSQL database
- **Better Auth** - Modern authentication library
- **Kysely** - Type-safe SQL query builder
- **Cloudinary** - Image hosting and transformation
- **Deployed on Railway**

## Architecture

```
┌──────────────────┐
│   Vercel         │
│   (Frontend)     │
│   React + tRPC   │
└────────┬─────────┘
         │ HTTPS + Cookies
         │ (SameSite=None)
         │
┌────────▼─────────┐
│   Railway        │
│   (Backend)      │
│   Express + tRPC │
└────────┬─────────┘
         │
         ├──────────┐
         │          │
    ┌────▼────┐ ┌──▼────────┐
    │ Neon DB │ │Cloudinary │
    │(Session)│ │ (Images)  │
    └─────────┘ └───────────┘
```

## Project Structure
```
├── client/                 # Frontend application (Vercel)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   ├── router/       # Route definitions
│   │   ├── lib/          
│   │   │   ├── auth.ts   # Better Auth client
│   │   │   └── trpc.ts   # tRPC client
│   │   └── constants/    # Platform definitions
│   └── public/           # Static assets
│
└── server/               # Backend application (Railway)
    └── src/
        ├── auth/
        │   └── better-auth.ts  # Auth configuration
        ├── routers/           # tRPC routers
        ├── db/               # Database client
        └── index.ts          # Express server with CORS
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- Cloudinary account (free tier available)

### 1. Clone and Install

```bash
git clone <repository-url>
cd link-sharing-app

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### 2. Database Setup

Better Auth automatically creates required tables (`session`, `account`, `verification`). You only need to create the `users` and `links` tables:

```sql
-- Users table (for custom user data)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  profile_email VARCHAR(255),
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Links table
CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_display_order ON links(display_order);
```

**Note:** Better Auth will automatically create its own `session`, `account`, and `verification` tables when the server starts.

### 3. Configure Environment Variables

**Client (.env):**
```env
VITE_API_URL=http://localhost:3000/trpc
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

**Server (.env):**
```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
BASE_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@host:5432/database
AUTH_SECRET=your-super-secret-key-change-in-production-min-32-chars-long
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Getting Cloudinary Credentials:**
1. Sign up at https://cloudinary.com
2. Create an upload preset in Settings → Upload
3. Copy your cloud name, API key, and API secret

### 4. Start Development

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Production Deployment

### Deployed Services
- **Frontend**: Vercel - https://fronend-link-app.vercel.app
- **Backend**: Railway - https://backend-link-app-production.up.railway.app
- **Database**: Neon (PostgreSQL)
- **Images**: Cloudinary

### Deploy Your Own

#### Frontend (Vercel)
1. Push code to GitHub
2. Import repository in Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Set root directory: `client`
6. Add environment variables:
   ```
   VITE_API_URL=https://your-backend.railway.app/trpc
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
   ```

#### Backend (Railway)
1. Push code to GitHub
2. Import repository in Railway
3. Set root directory: `server`
4. Add environment variables:
   ```
   NODE_ENV=production
   PORT=3000
   CLIENT_URL=https://your-frontend.vercel.app
   BASE_URL=https://your-backend.railway.app
   DATABASE_URL=your_neon_connection_string
   AUTH_SECRET=your-super-secret-key-min-32-chars
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
5. Railway will auto-deploy on push

### Important: Cross-Origin Authentication

The application implements custom middleware to handle cross-origin cookies:
- Backend automatically sets `SameSite=None; Secure` on all cookies
- CORS configured with `credentials: true`
- Frontend sends requests with `credentials: 'include'`
- Works across different domains (Vercel ↔ Railway)

## Supported Platforms

The application supports 15+ platforms including:
- GitHub
- Frontend Mentor
- Twitter
- LinkedIn
- YouTube
- Facebook
- Twitch
- Dev.to
- Codewars
- CodePen
- freeCodeCamp
- GitLab
- Hashnode
- Stack Overflow
- And more...

## API Documentation

### Authentication (Better Auth)
- `POST /api/auth/sign-up/email` - Create account
- `POST /api/auth/sign-in/email` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get current session

### User Management (tRPC)
- `user.me` - Get current user profile
- `user.updateProfile` - Update profile info
- `user.uploadImage` - Upload profile picture

### Links Management (tRPC)
- `links.getAll` - Get all user links
- `links.create` - Create new link
- `links.update` - Update existing link
- `links.delete` - Delete link
- `links.reorder` - Reorder links

## Key Implementation Details

### Cross-Origin Cookie Middleware

The backend includes custom middleware to force `SameSite=None` on all cookies:

```typescript
app.use((req, res, next) => {
  const originalSetHeader = res.setHeader;
  res.setHeader = function(name: string, value: any) {
    if (name.toLowerCase() === 'set-cookie') {
      const cookies = Array.isArray(value) ? value : [value];
      const modifiedCookies = cookies.map((cookie: string) => {
        let modified = cookie.replace(/SameSite=Lax/gi, 'SameSite=None');
        if (!modified.includes('Secure')) {
          modified += '; Secure';
        }
        return modified;
      });
      return originalSetHeader.call(this, name, modifiedCookies);
    }
    return originalSetHeader.call(this, name, value);
  };
  next();
});
```

### Better Auth Configuration

```typescript
export const auth = betterAuth({
  database: {
    provider: "postgres",
    db: db,
    type: "postgres",
  },
  baseURL: "https://backend-link-app-production.up.railway.app",
  trustedOrigins: ["https://fronend-link-app.vercel.app"],
  // ... additional config
});
```

## Known Limitations

- Maximum 100 links per user
- Profile images limited to 5MB
- Session expires after 7 days of inactivity
- Better Auth tables created automatically (no manual schema needed)

## Future Improvements

- [ ] Custom themes and colors
- [ ] Link click analytics
- [ ] QR code generation
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social media preview customization
- [ ] Export profile as JSON
- [ ] Two-factor authentication

## License

This project is open source and available under the MIT License.

## Author

Built as a modern full-stack portfolio project demonstrating:
- Cross-origin authentication
- Type-safe API development
- Modern React patterns
- Production deployment strategies

---

**Note:** This is a production-deployed application. The live demo is available at [https://fronend-link-app.vercel.app](https://fronend-link-app.vercel.app)

