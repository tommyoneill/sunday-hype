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

