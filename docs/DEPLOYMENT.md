# Deployment & DevOps Guide
## SignBridge AI Production & Staging Deployment

### 1. Environments

| Environment | Purpose | Hosting Recommendation | Database |
|---|---|---|---|
| **Development** | Local feature work | Local `npm run dev` | In-memory fallback or local Docker PostgreSQL |
| **Staging** | Pre-release verification | Vercel / Railway / AWS ECS | Supabase Staging Project |
| **Production** | Live end-user traffic | Docker Swarm / Kubernetes / AWS ECS / Vercel | Supabase Production with HA replicas |

---

### 2. Local Docker Deployment
To run the full stack locally with PostgreSQL container:

```bash
# 1. Clone repository & configure env
cp .env.example .env

# 2. Build and launch containers
docker compose up --build -d

# 3. Check container health
docker compose ps
curl http://localhost:3000/api/v1/health
```

---

### 3. Production Build & Standalone Deployment
```bash
# 1. Install production dependencies
npm ci

# 2. Compile optimized production bundle
npm run build

# 3. Start production server
npm run start
```

---

### 4. Vercel & Render Multi-Host Deployment

SignBridge AI is architected to seamlessly support split hosting across **Vercel** (Frontend UI) and **Render** (Backend API / Python ML Service):

#### A. Frontend on Vercel
1. Import repository on [Vercel](https://vercel.com).
2. Framework Preset: **Next.js**.
3. Configure Environment Variables in Vercel Project Settings:
   - `NEXT_PUBLIC_APP_URL`: `https://your-signbridge.vercel.app` (or Vercel automatically populates `VERCEL_URL`)
   - `NEXT_PUBLIC_BACKEND_URL`: `https://your-backend.onrender.com` (points client API calls to Render)
   - `BACKEND_URL`: `https://your-backend.onrender.com` (points server-side calls to Render)
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `<anon-key>`
4. Deploy: Vercel builds the frontend using `npm run build`.

#### B. Backend on Render
1. Create a **Web Service** on [Render](https://render.com).
2. Root Directory: `.` (or backend microservice directory if separate).
3. Build Command: `npm install && npm run build` (or `pip install -r requirements.txt`).
4. Start Command: `npm start` (or `uvicorn main:app --host 0.0.0.0 --port $PORT`).
5. Configure Environment Variables in Render:
   - `PORT`: (automatically provided by Render, defaults to `10000`)
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: `postgresql://postgres:...@host:5432/signbridge`
   - `SIGN_MODEL_ENDPOINT`: `https://your-backend.onrender.com` (or local port `http://localhost:5000` in dev)
6. Health Check Path: `/api/v1/health`

---

### 5. Database Migrations
To apply migrations to a remote Supabase or PostgreSQL cluster:

```bash
# Using Supabase CLI:
supabase db push

# Using psql:
psql $DATABASE_URL -f supabase/migrations/20260301000000_init_schema.sql
```

---

### 6. Rollback Procedures
* **Application Rollback**: If a release causes regression, rollback the container tag to the previous immutable release image or use Vercel/Render's instant rollback dashboard.
* **Database Rollback**: Migrations must follow backward-compatible expansion before contraction. Destructive column drops must only occur in subsequent deployment phases.
