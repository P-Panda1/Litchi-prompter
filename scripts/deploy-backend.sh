#!/bin/bash

# Script to deploy the backend locally
# Usage: ./scripts/deploy-backend.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"

echo "🚀 Deploying Lychee-prompter Backend..."
echo ""

# Check if we're in the right directory
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Error: Backend directory not found at $BACKEND_DIR"
    exit 1
fi

cd "$BACKEND_DIR"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/upgrade dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    if [ -f ".env.template" ]; then
        echo "📋 Creating .env from template..."
        cp .env.template .env
        echo "⚠️  Please edit .env and add your GEMINI_KEY before running the server!"
        echo ""
        read -p "Press Enter to continue after updating .env, or Ctrl+C to exit..."
    else
        echo "❌ Error: .env.template not found. Please create .env manually."
        exit 1
    fi
fi

# Check if GEMINI_KEY is set
if ! grep -q "GEMINI_KEY=" .env || grep -q "GEMINI_KEY=your-gemini-api-key-here" .env; then
    echo "⚠️  Warning: GEMINI_KEY not set in .env file!"
    echo "   Please set GEMINI_KEY in .env before starting the server."
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Check if port 8000 is already in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Warning: Port 8000 is already in use!"
    echo "   Please stop the process using port 8000 or change the port in the command below."
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "✅ Backend is ready!"
echo ""
echo "🌐 Starting server on http://localhost:8000"
echo "📚 API docs available at http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

