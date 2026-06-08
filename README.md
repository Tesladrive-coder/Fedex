# FedEx Clone - API Server (Vercel Ready)

A modern Express.js API server for FedEx shipping management, fully optimized for **Vercel serverless deployment**.

## ✨ Tech Stack

- **Framework**: Express.js (v5) with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod
- **Logging**: Pino
- **Deployment**: Vercel Serverless Functions
- **Package Manager**: pnpm

## 🚀 Features

- ✅ Shipment management (CRUD operations)
- ✅ Real-time package tracking with events
- ✅ Multiple shipping services (domestic, international, express, overnight)
- ✅ Contact form & pickup scheduling
- ✅ Admin dashboard analytics
- ✅ Authentication & authorization
- ✅ Full CORS support
- ✅ Structured logging with Pino
- ✅ Production-ready error handling
- ✅ Vercel serverless compatible

## 📋 Prerequisites

- Node.js v18+
- pnpm (enforced)
- PostgreSQL database
- Vercel account (for deployment)

## 🛠️ Local Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Copy the example file and configure:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/fedex
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
CORS_ORIGIN=*
ADMIN_TOKEN=dev-token-123
```

### 3. Local Development

```bash
# Standard development server
pnpm run dev

# Or with Vercel CLI (recommended for production-like testing)
pnpm install -g vercel
pnpm run dev:vercel
```

Access API at `http://localhost:3001/api`

## 📡 API Endpoints

### Health & Status
- `GET /api/healthz` - Health check

### Shipments
- `GET /api/shipments` - List all shipments
- `POST /api/shipments` - Create shipment
- `GET /api/shipments/:id` - Get shipment by ID

### Tracking
- `GET /api/track/:trackingNumber` - Track package

### Services
- `GET /api/services` - Available shipping services

### Customer
- `POST /api/contact` - Submit contact form
- `POST /api/pickup` - Schedule pickup

### Dashboard
- `GET /api/dashboard/stats` - Stats overview
- `GET /api/dashboard/recent` - Recent shipments

### Admin (requires `ADMIN_TOKEN`)
- `GET /admin/shipments` - List shipments
- `POST /admin/shipments` - Create shipment
- `PATCH /admin/shipments/:trackingNumber/status` - Update status
- `POST /admin/shipments/:trackingNumber/events` - Add tracking event
- `DELETE /admin/shipments/:trackingNumber` - Delete shipment

## 🚀 Deploy to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from project directory
vercel
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables
6. Click "Deploy"

### Option 3: GitHub Auto-Deploy

1. Connect repo to Vercel
2. Every push to `main` automatically deploys
3. Preview deployments on pull requests

## ⚙️ Vercel Configuration

### Required Environment Variables

Set these in your Vercel project dashboard:

```
DATABASE_URL          → PostgreSQL connection string
ADMIN_TOKEN          → Secure admin authentication token
CORS_ORIGIN          → Your frontend domain (e.g., https://example.com)
NODE_ENV             → production
LOG_LEVEL            → info
```

### Database Setup

For PostgreSQL on Vercel:

1. Use **Vercel PostgreSQL** or external provider (AWS RDS, Supabase, etc.)
2. Set `DATABASE_URL` environment variable
3. Drizzle ORM auto-creates tables on first connection

## 📂 Project Structure

```
Fedex/
├── api/
│   └── index.ts                    # Vercel handler entry point
├── artifacts/
│   └── api-server/
│       ├── src/
│       │   ├── app.ts              # Express app configuration
│       │   ├── index.ts            # Node.js entry point
│       │   ├── index-vercel.ts     # Local dev entry point
│       │   ├── lib/
│       │   │   └── logger.ts       # Pino logging
│       │   └── routes/
│       │       ├── admin.ts        # Admin endpoints
│       │       ├── contact.ts      # Contact/pickup
│       │       ├── dashboard.ts    # Analytics
│       │       ├── health.ts       # Health check
│       │       ├── services.ts     # Services listing
│       │       ├── shipments.ts    # Shipment CRUD
│       │       ├── tracking.ts     # Package tracking
│       │       └── index.ts        # Route aggregator
│       ├── package.json
│       ├── build.mjs               # esbuild configuration
│       └── .vercelignore           # Deployment optimization
├── vercel.json                     # Vercel configuration
├── .env.example                    # Environment template
├── .gitignore
└── README.md
```

## 🔧 Build & Deployment

### Production Build

```bash
# Build the entire workspace
pnpm run build

# Start production server
pnpm run start
```

### Build Output

```
artifacts/api-server/dist/index.mjs    # Compiled server
```

## 🐛 Troubleshooting

### Port Issues
```
Error: PORT environment variable is required
```
**Solution**: Vercel automatically sets PORT. For local dev, use `pnpm run dev:vercel`

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Set `CORS_ORIGIN` to your frontend domain in Vercel environment variables

### Database Connection
```
Error: Could not connect to database
```
**Solution**: 
- Verify `DATABASE_URL` in Vercel environment
- Check PostgreSQL server is running
- Ensure network allows Vercel IPs

### Build Failures
```
Build failed: Command timed out
```
**Solution**:
- Increase build timeout in Vercel dashboard
- Ensure all dependencies are cached
- Check `.vercelignore` for unnecessary files

## 📊 Monitoring

Access logs in Vercel dashboard:
- **Deployments** → View build logs
- **Functions** → Monitor API endpoint calls
- **Analytics** → View traffic patterns

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local` or secrets
   - Use Vercel environment variables for production
   - Rotate tokens regularly

2. **Authentication**
   - Implement JWT for API access
   - Use strong ADMIN_TOKEN in production
   - Validate all requests

3. **Database**
   - Use SSL for database connections
   - Implement connection pooling
   - Regular backups

4. **CORS**
   - Specify allowed origins explicitly
   - Avoid wildcard in production

## 📝 License

MIT

## 🤝 Support

For issues:
- Check Vercel documentation: https://vercel.com/docs
- Review Express.js guide: https://expressjs.com
- Check Drizzle ORM: https://orm.drizzle.team

---

**Ready to deploy? Run `vercel` now!** 🚀
