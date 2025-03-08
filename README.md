# Next.js Docker Development

This is a Next.js project set up with Docker for development.

## Getting Started

1. Make sure you have Docker and Docker Compose installed
2. Clone this repository
3. Start the development server:

```bash
docker-compose up
```

The application will be available at http://localhost:3000

## Development

- The app will automatically reload when you make changes to the code
- Node modules are stored in a Docker volume
- The `.next` build directory is excluded from the container

## Building for Production

To build the production image:

```bash
docker build -t nextjs-app --target production .
```

## Features

- Next.js 14
- TypeScript
- Tailwind CSS
- ESLint
- Hot Reloading
- Docker-based development environment 