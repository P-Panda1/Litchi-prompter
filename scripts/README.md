# Deployment Scripts

This directory contains scripts to help you deploy the backend and frontend locally.

## Prerequisites

### Backend
- Python 3.11 or higher
- pip

### Frontend
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

## Usage

### Deploy Backend

```bash
./scripts/deploy-backend.sh
```

This script will:
1. Create a virtual environment if it doesn't exist
2. Install/update Python dependencies
3. Check for `.env` file and create from template if needed
4. Validate that `GEMINI_KEY` is set
5. Start the FastAPI server on `http://localhost:8000`

**First time setup:**
1. The script will create `.env` from `.env.template`
2. Edit `backend/.env` and add your `GEMINI_KEY`
3. Run the script again

### Deploy Frontend

```bash
./scripts/deploy-frontend.sh
```

This script will:
1. Install npm dependencies if needed
2. Check for `.env` file and create from template if needed
3. Start the Vite development server (usually on `http://localhost:8080`)

**First time setup:**
1. The script will create `.env` from `.env.template`
2. Edit `litchi-prompter-ui/.env` if your backend is on a different URL
3. Run the script again

## Environment Variables

### Backend (.env)
- `GEMINI_KEY` - Your Google Gemini API key (required)
- `GEMINI_KEY_PATH` - Alternative: path to file containing API key

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: `http://localhost:8000`)

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
- Stop the process using port 8000, or
- Modify the script to use a different port

**Missing GEMINI_KEY:**
- Make sure `.env` file exists in `backend/` directory
- Add `GEMINI_KEY=your-key-here` to the `.env` file

### Frontend Issues

**Port 8080 already in use:**
- Vite will automatically try the next available port
- Check the terminal output for the actual port

**API connection errors:**
- Verify backend is running: `curl http://localhost:8000/health`
- Check `VITE_API_URL` in `litchi-prompter-ui/.env`
- Ensure backend CORS is configured correctly

## Manual Deployment

If you prefer to deploy manually:

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Create .env file with GEMINI_KEY
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```bash
cd litchi-prompter-ui
npm install
# Create .env file with VITE_API_URL
npm run dev
```

## Production Deployment

For production, use Docker:

### Backend
```bash
cd backend
docker build -t lychee-prompter-api .
docker run -p 8000:8000 -e GEMINI_KEY=your-key lychee-prompter-api
```

### Frontend
```bash
cd litchi-prompter-ui
docker build -t lychee-prompter-ui .
docker run -p 80:80 -e VITE_API_URL=http://your-api-url lychee-prompter-ui
```

Or use docker-compose (create a `docker-compose.yml` in the root):

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - GEMINI_KEY=${GEMINI_KEY}
    restart: unless-stopped

  frontend:
    build: ./litchi-prompter-ui
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://backend:8000
    depends_on:
      - backend
    restart: unless-stopped
```

