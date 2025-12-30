# DevLinks - Link Sharing Application

A full-stack web application that allows users to create a personalized profile page with custom links to their social media accounts and professional platforms. Built with modern web technologies and designed for simplicity and performance.

## Features

- **User Authentication**: Secure registration and login system with session management
- **Link Management**: Create, read, update, and delete custom platform links
- **Drag & Drop Reordering**: Intuitive drag-and-drop interface to reorder links
- **Profile Customization**: Upload profile picture, set name, and email
- **Live Preview**: Real-time mobile preview of your profile while editing
- **Public Profile Pages**: Share your personalized link page with a unique URL
- **Responsive Design**: Fully responsive UI optimized for mobile, tablet, and desktop
- **Form Validation**: Client and server-side validation for all inputs
- **Image Upload**: Profile picture upload with Cloudinary integration
- **Platform Support**: 14+ supported platforms including GitHub, LinkedIn, Twitter, YouTube, and more

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Data fetching and caching
- **tRPC** - End-to-end typesafe APIs
- **Tailwind CSS** - Utility-first CSS framework
- **@dnd-kit** - Drag and drop functionality
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **tRPC** - Type-safe API layer
- **PostgreSQL** - Relational database
- **Bcrypt** - Password hashing
- **Cloudinary** - Image hosting and optimization
- **Zod** - Schema validation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   React UI   │→ │ TanStack     │→ │  tRPC Client │  │
│  │  Components  │  │  Router      │  │              │  │
│  └──────────────┘  └──────────────┘  └──────┬───────┘  │
└────────────────────────────────────────────────│──────────┘
                                                 │
                                      HTTP (tRPC batching)
                                                 │
┌────────────────────────────────────────────────│──────────┐
│                        SERVER                  │          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────▼───────┐  │
│  │  tRPC Router │  │  Middleware  │  │  Express App   │  │
│  │   (routers)  │→ │   (CORS,     │  │                │  │
│  └──────┬───────┘  │    Auth)     │  └────────────────┘  │
│         │          └──────────────┘                       │
│         ▼                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │  Cloudinary  │  │   Sessions   │  │
│  │   Database   │  │  (Images)    │  │   (Auth)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Environment Variables

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:3000/trpc
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### Server (`server/.env`)
```env
PORT=3000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@localhost:5432/devlinks
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Local Development Setup

### Prerequisites
- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone https://github.com/ezahiri10/link-sharing-app.git
cd link-sharing-app
```

### Step 2: Database Setup
```bash
# Create PostgreSQL database
createdb devlinks

# Run the schema
psql devlinks < server/src/db/schema.sql
```

Or manually create tables:
```sql
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
  platform VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_display_order ON links(display_order);
```

### Step 3: Install Dependencies
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Step 4: Configure Environment Variables
Create `.env` files in both `client/` and `server/` directories with the variables listed above.

### Step 5: Run Development Servers
```bash
# Terminal 1 - Run server
cd server
npm run dev

# Terminal 2 - Run client
cd client
npm run dev
```

The application will be available at:
- Client: http://localhost:5173
- Server: http://localhost:3000

## Build & Deployment

### Client Build
```bash
cd client
npm run build
```
Output: `client/dist/`

### Server Build
```bash
cd server
npm run build
```
Output: `server/dist/`

### Production Start
```bash
cd server
npm start
```

### Deployment Platforms

#### Recommended Stack
- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **Backend**: Railway, Render, or Fly.io
- **Database**: Railway PostgreSQL, Supabase, or Neon

#### Environment Configuration
Ensure all environment variables are properly set in your deployment platform's dashboard.

## Project Structure

```
link-sharing-app/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and configs
│   │   ├── pages/         # Page components
│   │   ├── router/        # Route definitions
│   │   └── constants/     # App constants
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── routers/       # tRPC route handlers
│   │   ├── db/            # Database client
│   │   ├── lib/           # Utilities (Cloudinary, etc.)
│   │   └── trpc.ts        # tRPC setup
│   └── package.json
│
├── Makefile              # Development commands
└── README.md             # This file
```

## API Endpoints (tRPC)

### Authentication
- `auth.register` - Register new user
- `auth.login` - Login user
- `auth.logout` - Logout user

### User Management
- `user.me` - Get current user profile
- `user.getUserById` - Get user by ID (public)
- `user.updateProfile` - Update user profile

### Link Management
- `links.getAll` - Get all links for current user
- `links.getByUserId` - Get links by user ID (public)
- `links.create` - Create new link
- `links.update` - Update existing link
- `links.delete` - Delete link
- `links.reorder` - Reorder links

## Known Limitations

- Image uploads are limited to 1MB
- Maximum 5 links displayed in mobile preview
- Session expiry is 7 days
- No email verification system
- No password reset functionality

## Future Improvements

- [ ] Email verification system
- [ ] Password reset via email
- [ ] Analytics dashboard for link clicks
- [ ] Custom themes and color schemes
- [ ] QR code generation for profiles
- [ ] Social sharing preview optimization
- [ ] Link click tracking
- [ ] Custom domain support
- [ ] Export profile as PDF
- [ ] Dark mode support

## Author

**Ezahiri**
- GitHub: [@ezahiri10](https://github.com/ezahiri10)
- Project Link: [https://github.com/ezahiri10/link-sharing-app](https://github.com/ezahiri10/link-sharing-app)

## License

This project was created as part of a Frontend Mentor challenge. See the original challenge here: [Link-sharing app](https://www.frontendmentor.io/challenges/linksharing-app-Fbt7yweGsT)

---

Built with ❤️ using modern web technologies
