#!/bin/bash

# Exit on error
set -e

echo "🚀 Running Next.js application locally on Ubuntu 24.04"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✅ Using Node.js $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run the application in development mode
echo "🚀 Starting the development server..."
npm run dev

# To run in production mode instead, comment out the above line and uncomment these lines:
# echo "🏗️ Building the application..."
# npm run build
# echo "🚀 Starting the production server..."
# npm start 