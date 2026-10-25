import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, API_INTERNAL_URL, IS_PRODUCTION, REFRESH_COOKIE } from "@/lib/server-config";

// Same-origin gateway to the Django API.
//
// - Tokens stay in httpOnly cookies. Browser JavaScript never reads them.
// - Unsafe methods must carry the X-DH-Request header and come from this site,
//   which blocks cross-site request forgery.
// - An expired access token is refreshed once, using the refresh cookie.
// - The refresh endpoint is not reachable from the browser at all.

type Params = Promise<{ path: string[] }>;

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const ACCESS_MAX_AGE = 60 * 30;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 14;

function cookieOptions(maxAge: number, path: string) {
  return { httpOnly: true, secure: IS_PRODUCTION, sameSite: "lax" as const, path, maxAge };
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // Non-browser clients send no Origin, and the CSRF header still applies.
  // Compare against the Host header the browser used, which stays correct behind a proxy.
  return new URL(origin).host === request.headers.get("host");
}

function upstreamFetch(url: string, method: string, body: Uint8Array | undefined, contentType: string | null, token?: string) {
  const headers = new Headers({ accept: "application/json" });
  if (contentType) headers.set("content-type", contentType);
  if (token) headers.set("authorization", `Bearer ${token}`);
  return fetch(url, { method, headers, body: body as BodyInit | undefined, cache: "no-store" });
}

function clearSession(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", cookieOptions(0, "/"));
  response.cookies.set(REFRESH_COOKIE, "", cookieOptions(0, "/api/auth"));
  return response;
}

async function handle(request: NextRequest, { params }: { params: Params }) {
  const { path } = await params;
  const method = request.method;
  const joined = path.join("/");

  if (joined === "auth/token/refresh") {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }

  if (!SAFE_METHODS.has(method)) {
    if (request.headers.get("x-dh-request") !== "1" || !isSameOrigin(request)) {
      return NextResponse.json({ detail: "Request blocked" }, { status: 403 });
    }
  }

  const body = SAFE_METHODS.has(method) ? undefined : new Uint8Array(await request.arrayBuffer());
  const contentType = request.headers.get("content-type");
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  let access = request.cookies.get(ACCESS_COOKIE)?.value;
  const target = `${API_INTERNAL_URL}/api/${joined}/${request.nextUrl.search}`;

  // Sign-out always clears the cookies, even if the API call fails.
  if (joined === "auth/logout" && method === "POST") {
    if (refresh) {
      await upstreamFetch(
        `${API_INTERNAL_URL}/api/auth/logout/`,
        "POST",
        new TextEncoder().encode(JSON.stringify({ refresh })),
        "application/json",
        access,
      ).catch(() => undefined);
    }
    return clearSession(new NextResponse(null, { status: 204 }));
  }

  let upstream = await upstreamFetch(target, method, body, contentType, access);

  if (upstream.status === 401 && refresh) {
    const refreshed = await upstreamFetch(
      `${API_INTERNAL_URL}/api/auth/token/refresh/`,
      "POST",
      new TextEncoder().encode(JSON.stringify({ refresh })),
      "application/json",
    ).catch(() => null);

    if (!refreshed || !refreshed.ok) {
      return clearSession(await toResponse(upstream, joined));
    }

    const tokens = (await refreshed.json()) as { access: string; refresh?: string };
    access = tokens.access;
    upstream = await upstreamFetch(target, method, body, contentType, access);
    const response = await toResponse(upstream, joined);
    response.cookies.set(ACCESS_COOKIE, access, cookieOptions(ACCESS_MAX_AGE, "/"));
    if (tokens.refresh) {
      response.cookies.set(REFRESH_COOKIE, tokens.refresh, cookieOptions(REFRESH_MAX_AGE, "/api/auth"));
    }
    return response;
  }

  return toResponse(upstream, joined);
}

// Successful sign-in: the tokens move into cookies and are never returned in the body.
async function toResponse(upstream: Response, joined: string) {
  const text = await upstream.text();
  if (joined === "auth/otp/verify" && upstream.ok) {
    const data = JSON.parse(text) as { access: string; refresh: string; user: unknown };
    const response = NextResponse.json({ user: data.user });
    response.cookies.set(ACCESS_COOKIE, data.access, cookieOptions(ACCESS_MAX_AGE, "/"));
    response.cookies.set(REFRESH_COOKIE, data.refresh, cookieOptions(REFRESH_MAX_AGE, "/api/auth"));
    return response;
  }
  if (upstream.status === 204) return new NextResponse(null, { status: 204 });
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
  });
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
