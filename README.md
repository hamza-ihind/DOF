# Defenders of Future

## Run locally

Use Node.js 20.9 or later, then:

```sh
npm install
npm run db:init
npm run dev
```

Copy `.env.example` to `.env.local` on a new installation. The existing local database has already been migrated. Initialization is repeatable and never inserts demo content.

The local admin username and newly generated password are in the git-ignored `.env.local`. The old built-in admin credentials and fixed cookie no longer work. For deployment, set a strong `ADMIN_PASSWORD_HASH` (generate with `npm run admin:password`) and `ADMIN_USERNAME`; a unique `ADMIN_PASSWORD` is also supported. Do not commit environment files.

## Features and access

- `/admin`: public sign-in screen, authenticated team and transaction management.
- `/admin/events`: create and edit event reports, cover images, contributors, and day-by-day timelines.
- `/admin/accounts`: approve, reject, or suspend registrations. Public team profiles and login accounts are intentionally separate.
- `/register` and `/login`: member registration and sign-in. Accounts always start pending. Registration never accepts a client-supplied role or approval state.
- `/account`: pending members see approval status; active members submit amount + description and see only their own transactions. This is a record of contributions, not payment processing.
- `/admin/newsletters`: save drafts, edit, publish/unpublish, delete, and send published newsletters to confirmed subscribers.
- `/newsletters`: public archive and subscription form. Subscriptions require email confirmation. Every newsletter has an unsubscribe link.

Sessions are random opaque tokens, stored hashed in PostgreSQL, expire after 12 hours, and are revoked on logout/suspension. Cookies are HTTP-only, SameSite=Lax, and Secure in production. Server handlers enforce roles and transaction ownership independently of navigation. Uploads require admin authorization. State-changing requests check origin; form inputs are validated and database queries parameterized.

## Email setup still required

Set these on the deployed application:

```dotenv
APP_URL=https://your-actual-site.example
RESEND_API_KEY=your-real-resend-api-key
RESEND_FROM_EMAIL=Defenders of Future <updates@your-verified-domain>
RESEND_TO_EMAIL=YOUR_CONTACT_EMAIL@example.com
NEWSLETTER_SECRET=at-least-32-random-characters
UPLOADTHING_TOKEN=your-uploadthing-token
```

`RESEND_TO_EMAIL` is deliberately a placeholder for the address you will provide. Resend also requires a configured sender with a verified domain. Contact requests return success only after Resend accepts the message; provider acceptance is not a guarantee of inbox delivery. Messages are plain text and use the visitor address only as Reply-To. Missing configuration produces a clear error instead of a fake success.

Newsletter confirmation links expire after 24 hours. Sending uses small batches with per-recipient delivery records and stable Resend idempotency keys. Successful recipients are skipped when retrying. Resend's idempotency retention is finite: after a provider success followed by a database failure, review delivery records before retrying days later. No real emails were sent during development verification.

UploadThing needs the current `UPLOADTHING_TOKEN` format. Old app-id/secret variables alone are insufficient. Uploaded images persist through UploadThing; existing HTTPS image URLs are supported. Embedded base64 images are not accepted.

## Deployment and maintenance

- Use HTTPS and set `APP_URL` to the exact public origin. Copy local environment settings into hosting secrets; `.env.local` is not deployed automatically.
- Set `TRUST_PROXY=true` only if the reverse proxy overwrites `x-forwarded-for`. Otherwise public/auth rate limits deliberately share one bucket. Configure the proxy and an edge request-size limit before public launch.
- Keep PostgreSQL backups enabled. Run `npm run db:maintenance` periodically to remove expired sessions and rate-limit buckets.
- Changing credentials does not invalidate existing admin sessions automatically. For emergency revocation, delete admin rows from `sessions` in the database.
- Public images are served without Next's remote image proxy, avoiding server-side requests to arbitrary image hosts.
- Server-rendered pages and all write APIs check access. The admin login screen itself is intentionally reachable by signed-out visitors.
- The contact mailbox, public phone details, and verified sender still need real values. Password reset and email verification for member accounts are not included; member activation is the manual admin review requested.

## Data cleanup

Removed 11 exact seeded member profiles, 3 demo events, and 4 demo newsletter cards, with backups under the git-ignored `.local-backups/`. Preserved the separately added team profile. Removed seeded fallback data and disabled legacy seeding scripts. Writes require a real database and never silently fall back to process memory.

## Verification

```sh
npm run typecheck
npm run lint
npm run build
```

`scripts/verify-flows.mjs` checks registration, approval, roles, ownership, event CRUD, newsletter publication/confirmation/unsubscribe, CSRF, validation, and logout. It creates uniquely named fixtures and removes them in a finally block. Use only against a test database and a local server on port 3100 configured with the test-only admin credentials in the script. Its contact test expects an unconfigured recipient and sends no real email. The completed run passed 38 checks.

Next.js/React and vulnerable runtime dependencies were upgraded. `npm audit` still reports the unpatched `braces` advisory through Tailwind 3 and ESLint's build-time glob tooling (7 high findings including transitive dependents). These tools process repository files, not application form input. Do not treat this work as a complete security audit; recheck advisories during deployment.

Access checks follow the [Next.js authentication guidance](https://nextjs.org/docs/app/guides/authentication).
