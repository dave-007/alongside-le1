# Next.js Presentation Platform

A modern web application built with Next.js for creating and sharing AI-powered presentations on Ubuntu 24.04.

## Overview

This platform allows:
- **Presenters** to create presentations with markdown summaries, videos, and GitHub repository links
- **Learners** to browse presentations, interact with them, and request additional content

## Getting Started

### Running on Ubuntu 24.04

1. Make sure you have Node.js 20.x installed
2. Clone this repository
3. Start the development server:

```bash
# Use our helper script for development
./ubuntu-dev.sh

# Or manually
npm install
npm run dev
```

The application will be available at http://localhost:3000

### For Production

To build and run the application in production mode:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the production server
npm start
```

## Features

- **Presentation Creation**: Create presentations with markdown, videos, and GitHub links
- **Presentation Browsing**: Discover and interact with presentations
- **Comments & Questions**: Engage with presenters through comments
- **Content Requests**: Request additional content or courses with payment offers
- **Modern UI**: Responsive design with dark/light mode support

## Technical Stack

- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- JSON-based local database (migration-ready)
- shadcn/ui component library

## Documentation

- [Setup Guide](docs/SETUP_GUIDE.md): Instructions for setting up the project
- [API Documentation](docs/API.md): Details of the API endpoints
- [Project Structure](docs/PROJECT_STRUCTURE.md): Overview of the codebase organization
- [Requirements](docs/REQUIREMENTS.md): Project requirements specification
- [Architecture Decisions](docs/ARCHITECTURE.md): Key architectural decisions
- [Contributing Guidelines](docs/CONTRIBUTING.md): How to contribute to the project

## Ubuntu 24.04 Specific Notes

- This project has been optimized to run on Ubuntu 24.04
- If you encounter permission issues, you may need to adjust file permissions:
  ```bash
  chmod -R 755 .
  ```

## Development

- The app will automatically reload when you make changes to the code
- For best performance, ensure you have at least 4GB of RAM available 