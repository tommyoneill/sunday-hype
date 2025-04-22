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
- **AI**: OpenAI GPT-3.5 Turbo
- **API**: Lectserve for lectionary data

## Getting Started

### Prerequisites

- Node.js 18+
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
   npm install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your:
   - `DATABASE_URL`
   - `OPENAI_API_KEY`

4. Set up the database:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

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
4. Configure the following environment variables in Vercel:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_ENV`: Set to "production"

Vercel will automatically:
- Build your Next.js application
- Run database migrations
- Deploy your application
- Set up automatic deployments on every push to your main branch

### Build Settings

The following build settings are recommended for optimal performance:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### Environment Variables

Make sure to add these environment variables in your Vercel project settings:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | OpenAI API key |
| `NODE_ENV` | Set to "production" |

### Custom Domain

To set up a custom domain:
1. Go to your project settings in Vercel
2. Navigate to the "Domains" section
3. Add your domain and follow the DNS configuration instructions

