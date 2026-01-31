# Lychee-prompter UI

A modern, classroom-friendly web interface for transforming vague or complex prompts into clear, structured thinking steps. Built with Vite, React, TypeScript, and shadcn-ui.

## Features

- ✨ **English Improvement**: Automatically improves grammar, spelling, and clarity
- 💭 **Smart Clarification**: Asks targeted questions when more information is needed
- 📋 **Structured Output**: Provides clear goals, thinking steps, and sentence starters
- 🎨 **Calm Interface**: Designed for learners and educators with a friendly, accessible UI
- 🌐 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Fast**: Built with Vite for lightning-fast development and builds

## Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or pnpm/yarn)
- Backend API running (see [backend README](../backend/README.md))

## Quick Start

### 1. Install Dependencies

```bash
cd litchi-prompter-ui
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
VITE_API_URL=http://localhost:8000
```

**Note**: If your backend is running on a different URL or port, update this value accordingly.

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:8080](http://localhost:8080)

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
litchi-prompter-ui/
├── src/
│   ├── pages/
│   │   ├── Index.tsx              # Main chat page
│   │   └── NotFound.tsx           # 404 page
│   ├── components/
│   │   ├── PromptInput.tsx        # Prompt input form
│   │   ├── ClarifyingQuestions.tsx # Question answering interface
│   │   ├── PromptOutput.tsx       # Final answer display
│   │   ├── LoadingState.tsx        # Loading indicator
│   │   ├── Header.tsx              # App header
│   │   └── ui/                     # shadcn-ui components
│   ├── lib/
│   │   ├── api.ts                  # API client for backend communication
│   │   ├── types.ts                # TypeScript type definitions
│   │   └── utils.ts                # Utility functions
│   ├── hooks/
│   │   └── use-toast.ts            # Toast notification hook
│   ├── App.tsx                     # Root component with routing
│   └── main.tsx                    # Entry point
├── public/                         # Static assets
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Usage

### Basic Workflow

1. **Enter Your Prompt**: Type or paste your prompt in the text area. It's okay if your English isn't perfect!

2. **Review Improvements**: The system will improve your prompt and show you what was changed.

3. **Answer Questions** (if needed): If clarification is needed, answer the questions to help the system understand better.

4. **Get Your Guide**: Receive a structured guide with:
   - Clear goal
   - Thinking steps
   - Sentence starters

### Example Prompts

- "write a reflection about your project"
- "create a landing page for a product"
- "explain how photosynthesis works"
- "write an essay about climate change"

## API Integration

The UI communicates with the backend API using the following endpoints:

- `POST /api/v1/chat` - Process initial prompt
- `POST /api/v1/chat/clarify` - Submit clarification answers

See the [backend README](../backend/README.md) for detailed API documentation.

### State Management

The UI manages conversation state client-side and passes it to the backend. This allows for:
- Stateless backend architecture
- Better scalability
- No session management required

The state flow:
1. User submits prompt → API returns improved prompt + state
2. If clarification needed → User answers questions → API returns final answer
3. If no clarification → API returns final answer directly

## Customization

### Changing the API URL

Update the `VITE_API_URL` in `.env`:

```bash
VITE_API_URL=https://your-api-url.com
```

Or set it when running:

```bash
VITE_API_URL=https://api.example.com npm run dev
```

### Styling

The project uses Tailwind CSS with shadcn-ui components. You can customize:

- **Colors**: Update `tailwind.config.ts` theme colors
- **Components**: Modify shadcn-ui components in `src/components/ui/`
- **Global Styles**: Edit `src/index.css`

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### TypeScript

The project uses TypeScript for type safety. Types are defined in `src/lib/types.ts` and match the backend API models.

### Hot Module Replacement

Vite provides instant HMR. Changes to components will reflect immediately in the browser.

## Troubleshooting

### API Connection Issues

1. **Check Backend Status**: Ensure the backend API is running
   ```bash
   curl http://localhost:8000/health
   ```

2. **Verify API URL**: Check that `VITE_API_URL` matches your backend URL in `.env`

3. **CORS Issues**: Ensure the backend has CORS enabled for your frontend origin (default: `http://localhost:8080`)

4. **Network Errors**: Check browser console for detailed error messages

### Build Errors

- Ensure Node.js version is 18.0.0 or higher
- Delete `node_modules` and `dist` folder, then run `npm install` again
- Check that all dependencies are installed: `npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### Port Already in Use

If port 8080 is already in use, Vite will automatically try the next available port. You can also specify a port:

```bash
npm run dev -- --port 3000
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variable: `VITE_API_URL`
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set environment variable: `VITE_API_URL`

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables

Make sure to set `VITE_API_URL` in your deployment environment to point to your backend API.

**Important**: Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client.

## Design Philosophy

The UI is designed with the following principles:

- **Calm & Friendly**: No overwhelming colors or complex interfaces
- **Accessible**: Clear labels, good contrast, keyboard navigation
- **Educational**: Feels like a guided worksheet, not a chatbot
- **Multilingual-Friendly**: Simple language, no idioms or jargon
- **Responsive**: Works on all device sizes

## Technology Stack

- **Vite**: Fast build tool and dev server
- **React 18**: UI library with hooks
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn-ui**: High-quality component library
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching and caching
- **React Hook Form**: Form management
- **Zod**: Schema validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license information here]

## Support

For issues and questions:
- Check the [backend README](../backend/README.md) for API documentation
- Review the [WORKFLOW.md](../WORKFLOW.md) for design requirements
- Open an issue on GitHub

## Related Documentation

- [Backend API Documentation](../backend/README.md)
- [Workflow Requirements](../WORKFLOW.md)
