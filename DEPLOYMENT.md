# Deployment Guide

This guide covers how to deploy the Lychee-prompter backend and frontend both locally and in production.

## Quick Start

### Local Development

#### Backend
```bash
./scripts/deploy-backend.sh
```

#### Frontend
```bash
./scripts/deploy-frontend.sh
```

## Environment Setup

### Backend Environment Variables

Create `backend/.env` from `backend/.env.template`:

```bash
cd backend
cp .env.template .env
# Edit .env and add your GEMINI_KEY
```

Required variables:
- `GEMINI_KEY` - Your Google Gemini API key (required)
- `GEMINI_KEY_PATH` - Alternative: path to file containing API key

### Frontend Environment Variables

Create `litchi-prompter-ui/.env` from `litchi-prompter-ui/.env.template`:

```bash
cd litchi-prompter-ui
cp .env.template .env
# Edit .env if your backend is on a different URL
```

Required variables:
- `VITE_API_URL` - Backend API URL (default: `http://localhost:8000`)

## Local Deployment

### Using Scripts (Recommended)

The deployment scripts handle all setup automatically:

**Backend:**
```bash
./scripts/deploy-backend.sh
```

**Frontend:**
```bash
./scripts/deploy-frontend.sh
```

### Manual Deployment

#### Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with GEMINI_KEY
cp .env.template .env
# Edit .env and add your GEMINI_KEY

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend

```bash
cd litchi-prompter-ui

# Install dependencies
npm install

# Create .env file
cp .env.template .env
# Edit .env if needed

# Start development server
npm run dev
```

## Docker Deployment

### Backend

```bash
cd backend

# Build image
docker build -t lychee-prompter-api .

# Run container
docker run -d \
  --name lychee-prompter-api \
  -p 8000:8000 \
  -e GEMINI_KEY=your-api-key-here \
  lychee-prompter-api
```

### Frontend

```bash
cd litchi-prompter-ui

# Build with API URL
docker build --build-arg VITE_API_URL=http://your-api-url:8000 -t lychee-prompter-ui .

# Run container
docker run -d \
  --name lychee-prompter-ui \
  -p 80:80 \
  lychee-prompter-ui
```

### Using Docker Compose

Create a `docker-compose.yml` in the project root:

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
    healthcheck:
      test: ["CMD", "python", "-c", "import http.client; conn = http.client.HTTPConnection('localhost', 8000); conn.request('GET', '/health'); r = conn.getresponse(); exit(0 if r.status == 200 else 1)"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./litchi-prompter-ui
      args:
        VITE_API_URL: http://backend:8000
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Then run:
```bash
# Set environment variable
export GEMINI_KEY=your-api-key-here

# Start services
docker-compose up -d
```

## Production Deployment

### Backend

1. **Set up environment:**
   ```bash
   export GEMINI_KEY=your-production-api-key
   ```

2. **Build and run:**
   ```bash
   cd backend
   docker build -t lychee-prompter-api:latest .
   docker run -d \
     --name lychee-prompter-api \
     -p 8000:8000 \
     -e GEMINI_KEY=$GEMINI_KEY \
     --restart unless-stopped \
     lychee-prompter-api:latest
   ```

### Frontend

1. **Build with production API URL:**
   ```bash
   cd litchi-prompter-ui
   docker build \
     --build-arg VITE_API_URL=https://api.yourdomain.com \
     -t lychee-prompter-ui:latest .
   ```

2. **Run container:**
   ```bash
   docker run -d \
     --name lychee-prompter-ui \
     -p 80:80 \
     --restart unless-stopped \
     lychee-prompter-ui:latest
   ```

## Verification

### Check Backend
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy"}
```

### Check Frontend
Open browser to `http://localhost:8080` (or port shown in terminal)

### Check API Docs
Visit `http://localhost:8000/docs` for interactive API documentation

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
- Find process: `lsof -i :8000`
- Kill process or change port in deployment script

**Missing GEMINI_KEY:**
- Ensure `.env` file exists in `backend/` directory
- Verify `GEMINI_KEY` is set: `grep GEMINI_KEY backend/.env`

**Import errors:**
- Activate virtual environment: `source backend/venv/bin/activate`
- Reinstall dependencies: `pip install -r backend/requirements.txt`

### Frontend Issues

**API connection errors:**
- Verify backend is running: `curl http://localhost:8000/health`
- Check `VITE_API_URL` in `litchi-prompter-ui/.env`
- Ensure CORS is enabled in backend (it is by default)

**Build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

**Port conflicts:**
- Vite will automatically use next available port
- Check terminal output for actual port

## Environment Variables Reference

### Backend (.env)
| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `GEMINI_KEY` | Yes* | Google Gemini API key | - |
| `GEMINI_KEY_PATH` | Yes* | Path to file with API key | - |

*Either `GEMINI_KEY` or `GEMINI_KEY_PATH` must be set

### Frontend (.env)
| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `VITE_API_URL` | No | Backend API URL | `http://localhost:8000` |

## Security Notes

1. **Never commit `.env` files** - They contain sensitive API keys
2. **Use environment variables in production** - Don't hardcode secrets
3. **Rotate API keys regularly** - Especially if exposed
4. **Use HTTPS in production** - For both frontend and backend
5. **Set up CORS properly** - Only allow trusted origins

## Next Steps

- Set up reverse proxy (nginx/traefik) for production
- Configure SSL certificates
- Set up monitoring and logging
- Configure CI/CD pipelines
- Set up database if needed for future features

