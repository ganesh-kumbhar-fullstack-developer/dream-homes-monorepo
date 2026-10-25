// Browser client for the same-origin gateway (/api/...). Tokens live in httpOnly cookies,
// so this module never sees or stores them.

const BASE = "/api"
const UNSAFE_HEADERS = { "Content-Type": "application/json", "X-DH-Request": "1" }

function messageFrom(data) {
  if (!data) return "Something went wrong. Please try again."
  if (typeof data.detail === "string") return data.detail
  const firstField = Object.values(data).flat().find((v) => typeof v === "string")
  return firstField || "Something went wrong. Please try again."
}

async function request(path, { method = "GET", body } = {}) {
  // The gateway adds the trailing slash Django expects. Next.js redirects URLs that end in one.
  const clean = path.replace(/\/(\?|$)/, "$1")
  const res = await fetch(`${BASE}${clean}`, {
    method,
    headers: method === "GET" ? { Accept: "application/json" } : UNSAFE_HEADERS,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "same-origin",
  })
  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const error = new Error(messageFrom(data))
    error.status = res.status
    error.data = data
    throw error
  }
  return data
}

// Follows pagination until every page is loaded.
async function allPages(path) {
  const items = []
  let next = path
  while (next) {
    const page = await request(next)
    items.push(...page.results)
    next = page.next ? new URL(page.next).pathname.replace(/^\/api/, "") + new URL(page.next).search : null
  }
  return items
}

export const api = {
  requestSignInCode: (email) => request("/auth/otp/request/", { method: "POST", body: { email } }),
  verifySignInCode: (email, code, fullName = "") =>
    request("/auth/otp/verify/", { method: "POST", body: { email, code, full_name: fullName } }),
  async getSession() {
    try {
      return await request("/auth/me/")
    } catch (error) {
      if (error.status === 401) return null
      throw error
    }
  },
  updateProfile: (patch) => request("/auth/me/", { method: "PATCH", body: patch }),
  signOut: () => request("/auth/logout/", { method: "POST", body: {} }),

  getListings: () => allPages("/listings/"),
  saveFavourite: (listingId) => request(`/me/favourites/${listingId}/`, { method: "PUT", body: {} }),
  removeFavourite: (listingId) => request(`/me/favourites/${listingId}/`, { method: "DELETE" }),
  getFavourites: () => allPages("/me/favourites/"),

  createEnquiry: (payload) => request("/leads/", { method: "POST", body: payload }),
}
