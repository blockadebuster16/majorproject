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

### 4. Database Migrations
To apply migrations to a remote Supabase or PostgreSQL cluster:

```bash
# Using Supabase CLI:
supabase db push

# Using psql:
psql $DATABASE_URL -f supabase/migrations/20260301000000_init_schema.sql
```

---

### 5. Rollback Procedures
* **Application Rollback**: If a release causes regression, rollback the container tag to the previous immutable release image (e.g. `ghcr.io/org/signbridge:v1.0.4`).
* **Database Rollback**: Migrations must follow backward-compatible expansion before contraction. Destructive column drops must only occur in subsequent deployment phases.
