/**
 * Dynamic Environment & Host Configuration Utility for Render & Vercel Deployments.
 * 
 * Automatically resolves dynamic URLs across:
 * - Vercel Frontend (VERCEL_URL / NEXT_PUBLIC_VERCEL_URL)
 * - Render Web Services (RENDER_EXTERNAL_URL / RENDER_EXTERNAL_HOSTNAME / PORT)
 * - Custom Environment Overrides (NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_BACKEND_URL, BACKEND_URL)
 * - Local Development fallbacks (localhost:3000 for frontend, localhost:5000 for backend)
 */

/**
 * Returns the dynamic frontend URL.
 * Order of precedence:
 * 1. NEXT_PUBLIC_APP_URL
 * 2. NEXT_PUBLIC_FRONTEND_URL
 * 3. RENDER_EXTERNAL_URL (Render hosted web service)
 * 4. NEXT_PUBLIC_VERCEL_URL / VERCEL_URL (Vercel deployment)
 * 5. window.location.origin (in browser)
 * 6. http://localhost:3000 (local dev fallback)
 */
export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  if (process.env.NEXT_PUBLIC_FRONTEND_URL) {
    return process.env.NEXT_PUBLIC_FRONTEND_URL.replace(/\/$/, '');
  }
  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL.replace(/\/$/, '');
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    const host = process.env.NEXT_PUBLIC_VERCEL_URL.replace(/\/$/, '');
    return host.startsWith('http') ? host : `https://${host}`;
  }
  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/\/$/, '');
    return host.startsWith('http') ? host : `https://${host}`;
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'http://localhost:3000';
}

/**
 * Returns the dynamic backend URL for standalone backend services (e.g. Render backend on port 5000 or production URL).
 * Order of precedence:
 * 1. NEXT_PUBLIC_BACKEND_URL
 * 2. NEXT_PUBLIC_API_URL
 * 3. BACKEND_URL
 * 4. API_BASE_URL
 * 5. RENDER_BACKEND_URL
 */
export function getBackendUrl(): string {
  const envBackend =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.BACKEND_URL ||
    process.env.API_BASE_URL ||
    process.env.RENDER_BACKEND_URL;

  if (envBackend && envBackend.trim()) {
    return envBackend.trim().replace(/\/$/, '');
  }
  return '';
}

/**
 * Returns the custom sign language ML model inference service endpoint.
 * Defaults to SIGN_MODEL_ENDPOINT, BACKEND_URL, or in dev http://localhost:5000
 */
export function getModelEndpoint(): string {
  const endpoint =
    process.env.SIGN_MODEL_ENDPOINT ||
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL;

  if (endpoint && endpoint.trim()) {
    return endpoint.trim().replace(/\/$/, '');
  }
  return process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
}

/**
 * Returns the appropriate API endpoint URL for client or server fetches.
 * - If NEXT_PUBLIC_BACKEND_URL / BACKEND_URL is set (e.g. Render backend service), prefixes with the backend URL.
 * - If running on client without separate backend URL, returns relative path (e.g. /api/v1/...) for same-origin Next.js routes.
 * - If running on server without separate backend URL, prefixes with getAppUrl() to prevent invalid relative URL errors in Node.js fetch.
 */
export function apiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const backend = getBackendUrl();
  if (backend) {
    return `${backend}${cleanPath}`;
  }
  if (typeof window === 'undefined') {
    return `${getAppUrl()}${cleanPath}`;
  }
  return cleanPath;
}
