# Link Sharing App - Frontend

Frontend for the Link Sharing App with drag-and-drop reordering.

## Tech Stack

- React 19
- TypeScript
- TanStack Router
- TanStack Query
- tRPC
- Tailwind CSS
- @dnd-kit (drag and drop)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env`:
- `VITE_API_URL`: Backend API URL (with /trpc path)
- `VITE_CLOUDINARY_*`: Cloudinary credentials

4. Start development server:
```bash
npm run dev
```

## Deployment

### Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Deploy!

## Features

- User authentication
- Profile management
- Links management
- **Drag-and-drop to reorder links**
- Live preview
- Responsive design

## Project Structure

```
src/
├── components/     # React components
│   ├── links/     # Link components (with drag-drop)
│   ├── profile/   # Profile components
│   ├── preview/   # Preview components
│   └── ui/        # UI components
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── router/        # TanStack Router setup
├── lib/           # Utilities (trpc, queryClient)
└── constants/     # Platform constants
```
