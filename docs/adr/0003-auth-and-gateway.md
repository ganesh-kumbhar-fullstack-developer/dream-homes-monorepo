# ADR 0003: Sign-in by email code, and a same-origin API gateway

- **Status:** Accepted
- **Date:** 2026-10-26

## Context

The prototype used passwords stored in plain text, a static admin token shipped in the frontend bundle, and browser calls to a separate backend host. The new platform must let visitors browse without an account, and ask for one only when they save or enquire.

## Decision

1. **Sign-in is by a one-time code sent to email.** There are no passwords and no SMS. A code is six digits, valid for ten minutes, usable once, and locked after five wrong attempts. Only a keyed hash is stored. Requests are rate limited, and the response never reveals whether an account exists.
2. **Tokens never reach browser JavaScript.** The web app's server gateway (`app/api/[...path]`) keeps the JWT access and refresh tokens in httpOnly cookies, refreshes them silently, and forwards requests to Django.
3. **Unsafe requests are protected against cross-site request forgery.** They must carry `X-DH-Request: 1` and come from the site's own host. The refresh endpoint is not reachable from the browser.
4. **Roles.** Buyers save homes and enquire. Owners create and edit their own listings, which return to review after an edit. Staff verify, publish and reject listings, and manage enquiries. Verification is required before publishing.
5. **Admin.** The old static-token panel is removed. Staff work in Django admin until a staff console is built.

## Consequences

- Browser calls go to the same origin only, so the content security policy allows `connect-src 'self'`.
- Enquiries are stored, emailed to the team as plain text, and confirmed to the enquirer when they gave an email.
- Email delivery needs a verified sending domain. In development, codes are printed to the API console.
- Accounts imported from the old database sign in with a code too, because their email addresses match.
