/** Base path for the workflows application shell. */
export const APP_BASE = "/app";

/** Base path for the AI application shell. */
export const AI_BASE = "/ai";

/** Base path for marketing / public website pages. */
export const WEB_BASE = "/web";

export function isAppRoute(pathname: string): boolean {
  return pathname === APP_BASE || pathname.startsWith(`${APP_BASE}/`);
}

export function isAiRoute(pathname: string): boolean {
  return pathname === AI_BASE || pathname.startsWith(`${AI_BASE}/`);
}

export function isWebRoute(pathname: string): boolean {
  return pathname === WEB_BASE || pathname.startsWith(`${WEB_BASE}/`);
}
