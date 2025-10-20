# PodBot - Chat API with Redis Agent Memory Server

## Overview
Built a TypeScript-based chat application using Azure Static Web Apps and Azure Functions that integrates with Redis Agent Memory Server (AMS) to create PodBot - a specialized chatbot that provides podcast recommendations and discusses podcast-related topics.

## Architecture
- **Frontend**: Azure Static Web Apps with Vite + TypeScript SPA
- **Backend**: Azure Functions with v4 programming model and TypeScript
- **Memory**: Redis Agent Memory Server (AMS) for persistent conversation history
- **LLM**: OpenAI GPT-4o via LangChain
- **Local Development**: Docker Compose for Redis and AMS dependencies
- **Deployment**: Azure with azd (Azure Developer CLI)

## API Endpoints
- `GET /api/sessions/:username` - Retrieve conversation history
- `POST /api/sessions/:username` - Send message and get response
- `DELETE /api/sessions/:username` - Clear conversation history

## Key Features
- **Frontend Web Interface**: Modern responsive chat UI with markdown support
- **Persistent Memory**: Conversation history across sessions via AMS
- **PodBot Persona**: Specialized chatbot that only discusses podcasts
- **Azure Functions API**: Clean serverless backend architecture
- **Full Stack TypeScript**: End-to-end type safety
- **Azure Native**: Built with Static Web Apps and Azure Functions
- **Serverless**: No servers to manage, scales automatically
- **Real-time Chat**: Instant messaging with loading states
- **Session Management**: Load, clear, and manage user conversations
- **Local Dev Friendly**: SWA CLI proxies API requests seamlessly

## Project Structure
```
api/                           # Azure Functions backend
├── src/
│   ├── functions/
│   │   ├── sessions.ts        # Function registrations (v4 model)
│   │   ├── fetch-session-history.ts
│   │   ├── request-and-response.ts
│   │   ├── delete-session.ts
│   │   └── http-responses.ts  # Shared response helpers
│   ├── services/
│   │   ├── agent-adapter.ts   # PodBot LLM agent
│   │   ├── memory-server.ts   # AMS client functions
│   │   └── chat-service.ts    # Business logic
│   ├── config.ts              # Environment configuration
│   └── main.ts                # Entry point
├── host.json
├── local.settings.json
├── package.json
└── tsconfig.json

web/                           # Azure Static Web App frontend
├── src/
│   ├── main.ts                # Application entry point
│   ├── api.ts                 # API client for Azure Functions
│   ├── types.ts               # TypeScript type definitions
│   └── style.css              # Application styles
├── public/                    # Static assets
├── dist/                      # Built assets (generated)
├── index.html                 # HTML template
├── staticwebapp.config.json   # SWA routing configuration
├── package.json
└── tsconfig.json

docker-compose.yaml            # Redis + AMS for local development
package.json                   # Root workspace
```

## Environment Variables

**`.env` (for Docker services):**
- `OPENAI_API_KEY` - OpenAI API key

**`api/local.settings.json` (for Azure Functions):**
- `OPENAI_API_KEY` - OpenAI API key
- `AMS_BASE_URL` - Agent Memory Server URL (default: http://localhost:8000)
- `AMS_CONTEXT_WINDOW_MAX` - Token limit for context window (default: 4000)

## Local Services
- `redis` - Redis database (port 6379) - Docker
- `agent-memory-server` - AMS service (port 8000) - Docker
- `api` - Azure Functions backend (port 7071) - Local
- `web` - Static Web App via SWA CLI (port 4280) - Local

## Usage
### Web Interface
1. Start Docker dependencies: `docker compose up`
2. Start Azure Functions: `npm run dev` (from root)
3. Open http://localhost:4280 in your browser (SWA CLI)
4. Enter a username and click "Load" to load existing conversations
5. Type messages about podcasts and get AI-powered recommendations
6. Use "Clear" to delete conversation history

### API Testing
Use curl to test the Azure Functions backend directly:

```bash
# Start conversation
curl -X POST http://localhost:7071/api/sessions/username \
  -H "Content-Type: application/json" \
  -d '{"message": "Recommend some history podcasts"}'

# Get conversation history
curl -X GET http://localhost:7071/api/sessions/username

# Clear conversation
curl -X DELETE http://localhost:7071/api/sessions/username
```

## Key Implementation Details

### Backend (api/)
- **Azure Functions v4**: Uses programming model v4 with `app.http()` registration pattern
- **Function Structure**: Separate handler files for each endpoint, registered in `sessions.ts`
- **Architecture**: Clean separation with functions, services, and shared utilities
- **AMS Integration**: Uses `context_window_max` parameter in AMS calls for memory management
- **Message Conversion**: Converts between AMS message format and LangChain message classes
- **Type Safety**: TypeScript types for consistent message handling across the application
- **Error Handling**: Comprehensive error handling for all AMS operations and API endpoints
- **Import Workaround**: Uses default imports for @azure/functions to handle ESM/CommonJS compatibility

### Frontend (web/)
- **Azure Static Web Apps**: Deployed as SWA, proxied locally with SWA CLI
- **Vite Build System**: Fast development and optimized production builds
- **TypeScript**: Full type safety with consistent message types across frontend/backend
- **API Routing**: `staticwebapp.config.json` routes `/api/*` to Azure Functions
- **Markdown Rendering**: Bot responses rendered with marked.js for rich text display
- **Local Storage**: Persistent username across browser sessions for better UX
- **Error Handling**: User-friendly error messages with detailed API error information
- **Loading States**: Visual feedback during API operations with disabled UI elements
- **FontAwesome Icons**: Modern iconography throughout the interface
- **Responsive Design**: Clean, modern UI that works across different screen sizes

## Development Commands

### Root Workspace
```bash
npm run install          # Install all dependencies
npm run dev              # Start API + SWA CLI
npm run build:api        # Build API only
npm run build:web        # Build web only
docker compose up        # Start Redis + AMS
docker compose down      # Stop Docker services
docker compose logs -f   # View Docker logs
```

### Backend (api/)
```bash
cd api
npm run build    # Build TypeScript
npm start        # Start Azure Functions locally
npm run watch    # Watch mode for TypeScript
```

### Frontend (web/)
```bash
cd web
npm run dev      # Vite development server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Local Development Workflow
1. Start Docker dependencies: `docker compose up`
2. Start Azure Functions and SWA CLI: `npm run dev`
3. Access app at http://localhost:4280
4. Azure Functions API available at http://localhost:7071
5. SWA CLI proxies `/api/*` requests to Functions

## Azure Deployment (Future)
- **Infrastructure as Code**: Bicep templates in `infra/` directory
- **Azure Developer CLI**: `azd up` for one-command deployment
- **Azure Managed Redis**: Replaces containerized Redis in production
- **Container Apps**: AMS deployed to Azure Container Apps
- **Entra ID Authentication**: OAuth2 authentication for AMS
- **Application Insights**: Monitoring and telemetry

## Future Enhancements
- **User Authentication**: Secure login system with protected sessions via Entra ID
- **Multiple Bot Personas**: Different AI assistants for various topics
- **Conversation Analytics**: Usage metrics and conversation insights with Application Insights
- **Export Functionality**: Download conversation history in various formats
- **Real-time Updates**: WebSocket support via Azure SignalR
- **Dark Mode**: Theme switching for better user experience
- **Mobile Optimization**: Enhanced responsive design for mobile devices