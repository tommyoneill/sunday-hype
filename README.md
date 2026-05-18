# Sunday Hype

A modern, teen-friendly Catholic lectionary app that makes Mass readings more engaging and accessible for young people.

## Overview

Sunday Hype is a web application that:
- Fetches daily Mass readings from the Catholic lectionary
- Provides teen-friendly interpretations of the readings
- Uses AI to make the Bible more relatable and engaging for young people
- Offers a clean, modern interface for viewing readings

## Features

- 📖 **Daily Readings**: Access the complete set of Mass readings for any date
- 🎯 **Teen-Friendly Interpretations**: Get explanations written in a relatable, modern style
- 📱 **Modern UI**: Clean, responsive design that works on all devices
- 🔄 **Real-time Updates**: Readings are fetched and cached for quick access
- 🤖 **AI-Powered**: Uses OpenAI to generate engaging, age-appropriate interpretations

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: tRPC, Prisma
- **Database**: PostgreSQL
- **AI**: OpenAI (`OPENAI_MODEL`, default `gpt-3.5-turbo`; set in `.env`)
- **API**: Lectserve for lectionary data

## Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) (matches `packageManager` in `package.json`)
- PostgreSQL
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sunday-hype.git
   cd sunday-hype
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with at least:
   - `DATABASE_URL`
   - `DIRECT_URL` (required by Prisma in `schema.prisma` for migrations; duplicate `DATABASE_URL` locally when not using pooled connections)
   - `OPENAI_API_KEY`
   - Optional `OPENAI_MODEL` (better quality vs cost tradeoff)

4. Set up the database:
   ```bash
   pnpm exec prisma db push
   ```
   (`pnpm exec prisma migrate deploy` once you rely on migrations in production.)

5. Start the development server:
   ```bash
   pnpm dev
   ```

### Tests

```bash
pnpm test
```

## Operations & caveats

- **Costs / abuse**: The public `lectionary.getReadings` procedure calls OpenAI when a date is uncached; add middleware or an edge rate limiter if the URL receives heavy traffic without auth.
- **Legacy placeholder rows**: Older deployments could cache “No readings available…” rows after Lectserve outages. Safe to delete those rows in Postgres or via Prisma Studio so a retry can regenerate real content.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Lectserve](https://www.lectserve.com/) for providing the lectionary API
- [OpenAI](https://openai.com/) for powering the teen-friendly interpretations
- The Catholic Church for the lectionary readings

## Deployment

### Vercel

Sunday Hype is optimized for deployment on Vercel. Here's how to deploy:

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and create a new project
3. Import your GitHub repository
4. Configure the environment variables listed in [.env.example](.env.example) (Production and Preview if needed)

Vercel will:

- Install with `pnpm` and run **`postinstall` → `prisma generate`** (see [vercel.json](vercel.json) for parity with CLI flags)
- Build with `pnpm run build` (runs `next build`)

### Build Settings

This repo commits [vercel.json](vercel.json) with recommended settings (`pnpm install` + `pnpm run build`). The `outputDirectory` for Next on Vercel is managed automatically—no need to set `.next` manually in the dashboard.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (often pooled on serverless hosts) |
| `DIRECT_URL` | Non-pooled URL for migrations (see Prisma docs; match your provider’s template) |
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_MODEL` | Optional model id (validated in [`src/env.ts`](src/env.ts)) |
| `NEXT_PUBLIC_*` | Optional client keys (e.g. Earshot widget) |

`NODE_ENV` is set automatically in production—you do not need to add it by hand unless your host requires overrides.

### Custom Domain

To set up a custom domain:
1. Go to your project settings in Vercel
2. Navigate to the **Domains** section
3. Add your domain and follow the DNS configuration instructions
