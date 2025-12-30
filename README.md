# DevLinks - Link Sharing Platform

> A modern full-stack link-in-bio application for developers to showcase their professional presence across multiple platforms.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![tRPC](https://img.shields.io/badge/tRPC-11.0-2596BE?style=flat&logo=trpc&logoColor=white)](https://trpc.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## Overview

DevLinks is a production-ready link aggregation platform that allows developers to create a personalized landing page showcasing all their professional links in one place. Built with modern web technologies and best practices for performance, type safety, and developer experience.

## Features

### Core Functionality
- **User Authentication** - Secure registration and login with Better Auth
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
- **Session Management** - Secure session-based authentication
- **Database Transactions** - Reliable data integrity with PostgreSQL

## Tech Stack

### Frontend
- **React 19** - Latest React with modern hooks and features
- **TypeScript** - Full type safety throughout the application
- **TanStack Router** - Type-safe routing solution
- **TanStack Query** - Powerful data synchronization
- **tRPC** - End-to-end type-safe APIs
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **tRPC** - Type-safe API layer
- **PostgreSQL** - Relational database
- **Better Auth** - Modern authentication library
- **Cloudinary** - Image hosting and transformation
- **Zod** - Schema validation

## Architecture

```
┌─────────────┐
│   Client    │
│  (React +   │
│   tRPC)     │
└──────┬──────┘
       │ HTTP + tRPC
       │
┌──────▼──────┐
│   Server    │
│  (Express + │
│   tRPC)     │
└──────┬──────┘
       │
       ├─────┐
       │     │
  ┌────▼────┐│
  │PostgreSQL││
  │(Neon)   ││
  └─────────┘│
  ┌──────────▼──┐
  │  Cloudinary │
  │  (Images)   │
  └─────────────┘
```

### Project Structure
```
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── layout/   # Layout components
│   │   │   ├── links/    # Link management
│   │   │   ├── preview/  # Public profile
│   │   │   ├── profile/  # User profile
│   │   │   └── ui/       # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   ├── router/       # Route definitions
│   │   ├── lib/          # Utilities and configs
│   │   └── constants/    # Platform definitions
│   └── public/           # Static assets
│
└── server/               # Backend application
    └── src/
        ├── routers/     # tRPC routers
        ├── db/          # Database client
        └── lib/         # Utilities
```



## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Cloudinary account (free tier available)
- Make (usually pre-installed on Linux/macOS, Windows users can use WSL)

### 1. Clone and Install

```bash
git clone <repository-url>
cd link-sharing-app

# Install all dependencies (client + server)
make install
```

### 2. Database Setup

Create a PostgreSQL database and run the schema:

```sql
-- Create tables
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  profile_email VARCHAR(255),
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Configure Environment Variables

Create `.env` files in both `client/` and `server/` directories.

**Client (.env):**
```env
VITE_API_URL=http://localhost:3000/trpc
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

**Server (.env):**
```env
PORT=3000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@host:5432/database
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
# Run both client and server concurrently
make dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Makefile Commands

The project includes a Makefile for simplified development workflow:

```bash
# View all available commands
make help

# Installation
make install              # Install all dependencies
make install-client       # Install client dependencies only
make install-server       # Install server dependencies only

# Development
make dev                  # Run both servers concurrently
make dev-client          # Run client only
make dev-server          # Run server only

# Production Build
make build               # Build both client and server
make build-client        # Build client only
make build-server        # Build server only

# Cleanup
make clean               # Remove all node_modules and builds
make clean-client        # Clean client only
make clean-server        # Clean server only
```

## Building for Production

### Client Build
```bash
cd client
npm run build
# Output will be in client/dist/
```

### Server Build
```bash
cd server
npm run build
# Output will be in server/dist/
npm start  # Run production server
```

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables in dashboard
6. Deploy

### Backend (Railway)
1. Push code to GitHub
2. Connect repository to Railway
3. Add environment variables in dashboard
4. Railway will auto-detect Node.js and deploy
5. Note your production URL

### Environment Variables for Production
- Update `CLIENT_URL` in backend .env to your Vercel URL
- Update `VITE_API_URL` in frontend .env to your Railway URL

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

### Authentication Endpoints
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Login and create session
- `POST /auth/logout` - Logout and destroy session
- `GET /auth/me` - Get current user session

### User Endpoints
- `GET /user/get` - Get user profile
- `POST /user/updateProfile` - Update user profile
- `POST /user/uploadImage` - Upload profile image

### Links Endpoints
- `GET /links/getAll` - Get all user links
- `POST /links/create` - Create new link
- `POST /links/update` - Update existing link
- `POST /links/delete` - Delete link

## Known Limitations

- Maximum 100 links per user
- Profile images limited to 5MB
- Session expires after 7 days
- No email verification (future feature)
- No password reset (future feature)

## Future Improvements

- [ ] Custom themes and colors
- [ ] Link click analytics
- [ ] QR code generation
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social media preview customization
- [ ] Export profile as JSON
- [ ] Migrate to Better Auth for enhanced security features

## License

This project is open source and available under the MIT License.

## Author

Built with modern web development practices as a full-stack portfolio project.

---

**Note:** This is a demonstration project. For production use, consider adding additional security measures, monitoring, and testing infrastructure.
