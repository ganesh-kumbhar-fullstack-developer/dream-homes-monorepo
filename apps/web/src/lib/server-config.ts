// Server-only settings. The browser never sees these values.
export const API_INTERNAL_URL = (process.env.API_INTERNAL_URL ?? "http://localhost:8000").replace(/\/$/, "");
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const ACCESS_COOKIE = "dh_access";
export const REFRESH_COOKIE = "dh_refresh";
