# RTO Predictor SaaS

[cloudflarebutton]

A production-ready SaaS template built on Cloudflare Workers, featuring a React frontend with shadcn/ui components and a backend powered by Durable Objects for scalable entity management and real-time chat functionality.

## Description

This template provides a complete full-stack foundation for building SaaS applications on Cloudflare's edge network. It includes a modern React SPA, typed API client, and a robust Durable Object-based backend with automatic indexing and CRUD operations. The starter demo showcases user management and multi-user chat boards.

## Key Features

- **Cloudflare Workers + Durable Objects**: Global, consistent storage with CAS operations and prefix-based indexing
- **Entity System**: Reusable base classes for users, chats, and custom entities with built-in seeding and pagination
- **React Frontend**: TypeScript, React Router, TanStack Query, and Tailwind CSS with shadcn/ui components
- **Real-time Ready**: Chat board entities with message persistence and API endpoints
- **Developer Experience**: Bun scripts, full type safety across frontend/worker/shared, error boundaries, and theme support
- **Production Ready**: CORS, logging, health checks, client error reporting, and Wrangler deployment configuration

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Radix UI, React Router, TanStack Query, Sonner, Lucide icons
- **Backend**: Cloudflare Workers, Hono, Durable Objects (GlobalDurableObject for KV-style storage)
- **Shared**: TypeScript types, mock data, and API response contracts
- **Tooling**: Bun, ESLint, PostCSS, Wrangler

## Installation & Setup

This project uses **Bun** as the package manager and runtime.

```bash
# Clone the repository
git clone <repository-url>
cd rto-predictor-saas-df09yiizpi3whrezu_p0w

# Install dependencies
bun install

# Start the development server (frontend + worker)
bun run dev
```

The development server runs on the port specified by the `PORT` environment variable (defaults to 3000).

## Development

- **Frontend development**: Edit files in `src/` — hot module replacement is enabled via Vite.
- **Worker development**: Edit files in `worker/` (especially `user-routes.ts` and `entities.ts`). Changes require a server restart.
- **Adding entities**: Extend `IndexedEntity` in `worker/entities.ts` and expose routes in `worker/user-routes.ts`.
- **API client**: Use the typed helper in `src/lib/api-client.ts` for requests to `/api/*`.
- **Styling**: Customize `tailwind.config.js` and `src/index.css`. shadcn components are available in `src/components/ui/`.
- **Testing the demo**: The home page includes a working chat and user demo. Use the sidebar components if needed.

Run linting with:

```bash
bun run lint
```

Generate Cloudflare types:

```bash
bun run cf-typegen
```

## Deployment

Deploy directly to Cloudflare Workers with a single command:

```bash
bun run deploy
```

[cloudflarebutton]

The `wrangler.jsonc` file configures Durable Object migrations and asset handling for the SPA. Update the `name` field before deploying your own instance.

## Project Structure

- `src/` — React application (pages, components, hooks, lib)
- `worker/` — Cloudflare Worker entrypoint, entity definitions, and routes
- `shared/` — Types and mock data shared between frontend and backend
- Configuration files: `vite.config.ts`, `wrangler.jsonc`, `tailwind.config.js`, `tsconfig*.json`

## Contributing

Contributions are welcome. Please open an issue or pull request with clear descriptions of changes. Follow existing code style and ensure TypeScript checks pass.

## License

This project is provided as a template. See the repository for license details.