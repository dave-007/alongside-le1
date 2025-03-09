# Setup Guide for Ubuntu 24.04

This guide will help you set up and run the Next.js application on Ubuntu 24.04.

## Prerequisites

- Ubuntu 24.04 LTS
- Node.js 20.x
- npm 10.x or later
- Git

## Installation Steps

### 1. Install Node.js and npm

```bash
# Update package lists
sudo apt update

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v  # Should show v20.x.x
npm -v   # Should show v10.x.x
```

### 2. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>
```

### 3. Install Dependencies

```bash
# Install project dependencies
npm install
```

### 4. Development Mode

```bash
# Start the development server
npm run dev
```

The application will be available at http://localhost:3000

### 5. Production Build

```bash
# Build for production
npm run build

# Start the production server
npm start
```

## Using the Helper Script

We've included a helper script to simplify the setup process:

```bash
# Make the script executable
chmod +x ubuntu-dev.sh

# Run the script
./ubuntu-dev.sh
```

This script will:
1. Check if Node.js is installed and install it if needed
2. Install project dependencies
3. Start the development server

## Troubleshooting

### Permission Issues

If you encounter permission issues:

```bash
# Fix file permissions
chmod -R 755 .
```

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill the process using port 3000
sudo kill -9 $(sudo lsof -t -i:3000)

# Or start the server on a different port
PORT=3001 npm run dev
```

### Node.js Version Issues

If you need to use a different Node.js version:

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Restart your terminal or source your profile
source ~/.bashrc

# Install and use Node.js 20
nvm install 20
nvm use 20
```

## Next Steps

After setting up the project, you can:

1. Explore the codebase structure in `docs/PROJECT_STRUCTURE.md`
2. Review the requirements in `docs/REQUIREMENTS.md`
3. Check the API documentation in `docs/API.md` 