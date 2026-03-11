# Nefer Frontend

The frontend for the Nefer creative professional networking platform. Built with Next.js 16 (App Router), Supabase, and Shadcn UI.

## Getting Started

1. Ensure you have [Bun](https://bun.sh/) installed.
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set up environment variables based on `.env.local` specifications.
4. Run the development server:
   ```bash
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features (MVP)
- **AI Profile Generation:** Automatically builds professional profiles by scraping portfolio URLs via a Python FastAPI backend.
- **Waitlist System:** Gated signup flow requiring an invite code (e.g., `NEFER2026`). Uninvited users are placed on a waitlist.
- **Supabase Integration:** Real-time data storage, PostgreSQL triggers, and secure authentication.
- **Modern UI:** Built with Shadcn UI, Tailwind CSS, and Phosphor Icons for a clean, professional aesthetic.
