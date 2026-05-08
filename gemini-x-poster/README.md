# Gemini X Poster

AI-powered content generator using Next.js and Google Gemini API.

## Features

- Generate content using Google Gemini API
- Store outputs in Neon PostgreSQL database with Prisma ORM
- Modern UI with Tailwind CSS
- Next.js 14 App Router

## Tech Stack

- **Framework**: Next.js 14.2.3
- **UI**: React 18, Tailwind CSS
- **AI**: Google Generative AI
- **Database**: Neon PostgreSQL + Prisma ORM
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- Google Gemini API key
- Neon database URL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Kanta89555/gemini-x-poster.git
cd gemini-x-poster
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
- `GOOGLE_API_KEY`: Your Gemini API key
- `DATABASE_URL`: Your Neon database URL

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
my-gemini-app/
├── app/                    # Next.js app directory
│   ├── api/generate/      # Gemini API endpoint
│   ├── outputs/           # Output list and details pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utilities and configs
├── prisma/               # Database schema
├── public/               # Static assets
└── package.json
```

## Database Schema

The app stores generated content in a `Output` table with:
- id (unique identifier)
- prompt (input text)
- response (generated content)
- createdAt (timestamp)

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
