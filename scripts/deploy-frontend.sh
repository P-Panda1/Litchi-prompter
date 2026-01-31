#!/bin/bash

# Script to deploy the frontend locally
# Usage: ./scripts/deploy-frontend.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/litchi-prompter-ui"

echo "🚀 Deploying Lychee-prompter Frontend..."
echo ""

# Check if we're in the right directory
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Error: Frontend directory not found at $FRONTEND_DIR"
    exit 1
fi

cd "$FRONTEND_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "📦 Dependencies already installed"
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    if [ -f ".env.template" ]; then
        echo "📋 Creating .env from template..."
        cp .env.template .env
        echo "✅ Created .env file. Using default API URL: http://localhost:8000"
        echo "   Edit .env if your backend is running on a different URL."
    else
        echo "⚠️  Warning: .env.template not found. Using default API URL."
    fi
fi

# Check if port 8080 is already in use
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Warning: Port 8080 is already in use!"
    echo "   Vite will automatically try the next available port."
fi

echo ""
echo "✅ Frontend is ready!"
echo ""
echo "🌐 Starting development server..."
echo "   The app will be available at http://localhost:8080"
echo "   (Vite may use a different port if 8080 is busy)"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev

