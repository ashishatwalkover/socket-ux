/** Base path for the workflows application shell. */
export const APP_BASE = "/app";

/** Base path for the AI application shell. */
export const AI_BASE = "/ai";

export function isAppRoute(pathname: string): boolean {
  return pathname === APP_BASE || pathname.startsWith(`${APP_BASE}/`);
}

export function isAiRoute(pathname: string): boolean {
  return pathname === AI_BASE || pathname.startsWith(`${AI_BASE}/`);
}
