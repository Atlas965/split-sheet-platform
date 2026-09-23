# SplitSheet

Operator-managed music rights documentation and confirmation workflows for studios, producers, labels, and rights teams working with contributors and artists.

Built by SoundLedger Technologies Inc. (Ontario, Canada) · Live: [splitsheet.ca](https://splitsheet.ca)

> SplitSheet is a workflow and evidence platform. It is not a law firm, it is not a party to any agreement, and templates are operational tooling unless and until entertainment counsel approves them as legal instruments for a given use case.

---

## 1. Product summary

SplitSheet helps an operator:

- create a project or rights record,
- assign contributors and ownership splits,
- generate agreement and confirmation flows,
- send a public contributor link with no account required,
- capture confirmation evidence (timestamp, IP, user agent, submitted identity),
- lock the active legal/privacy document version used for that confirmation,
- maintain a rights ledger and operational audit trail,
- bill the operator through Stripe.

The core idea is simple: capture and preserve evidence of contributor acknowledgment in a controlled, auditable workflow without turning the public confirmation page into a legal portal or requiring a user account.

---

## 2. Who it is for

| Role | What they do in SplitSheet |
| --- | --- |
| Operator | Runs projects end-to-end, sends confirmation links, manages contributors, keeps the ledger and billing in order |
| Contributor / artist / writer / producer | Opens the public token link, reviews the split, and confirms or requests a change |
| Admin | Publishes or manages versioned legal documents and operational policies |

This is not a self-serve consumer split-sheet app, a marketplace escrow product, or a court-ready legal automation product by default.

---

## 3. Core product capabilities

### Contribution and confirmation workflow

1. Create a project and assign contributors.
2. Collect ownership and role information.
3. Send a public confirmation link via token or QR.
4. Contributor opens the link without an account.
5. Contributor reviews split, name, email, and active notice text.
6. Confirmation is submitted with evidence and an immutable audit payload.
7. The active legal/privacy document version is bound to the confirmation record.

### Rights ledger and evidence capture

- project-level confirmation records,
- contributor acknowledgment history,
- timestamped operational evidence,
- contract and collaborator tracking,
- rights ledger data for ownership and project states.

### Legal document versioning

- versioned legal documents for ToS / Privacy / DPA / contributor-consent flows,
- public lookup of latest published legal document versions,
- contributor-facing notice summary on the public confirmation page,
- version locking into the confirmation audit payload to preserve the exact notice in effect at the time of response.

### Billing and operator platform

- Stripe-backed operator billing,
- operator-specific project and client management,
- admin-controlled legal document publishing flow.

---

## 4. Legal architecture and product positioning

### Current product state

| Question | Answer |
| --- | --- |
| Ready for counsel scoping / architecture review? | Yes |
| Ready to market as counsel-approved or legally binding by default? | No |

SplitSheet is deliberately built as a workflow, evidence, and documentation system. The platform captures operational evidence, a clear chain of acknowledgment, and versioned legal notices—but legal enforceability depends on the surrounding deal structure, counsel review, and the specific agreement terms used by the operator.

### Current implementation status

The platform already includes:

- versioned legal documents and audit trail support,
- public confirmation links with no account requirement,
- contributor-facing legal notice display,
- confirmation evidence capture including IP and user-agent metadata,
- publication of current legal/privacy versions,
- locking of the active legal doc version in the confirmation payload,
- operator-side terms gate for authenticated sessions,
- Stripe webhooks and session-backed operator auth,
- privacy and account-deletion-oriented compliance plumbing.

### Product-safe legal framing

Where legal language is surfaced in the product, it is intentionally framed around:

- operational evidence,
- electronic records,
- versioned notice disclosure,
- Ontario-neutral / electronic record language,
- clear non-legal-advice disclaimers.

This avoids broad US-only or overclaiming language such as unqualified ESIGN/UETA guarantees.

---

## 5. Architecture

| Layer | Choice |
| --- | --- |
| Frontend | React + TypeScript + Vite + Wouter + TanStack Query + Shadcn/Radix |
| Backend | Express + TypeScript, deployed as Vercel serverless bundle |
| Database | PostgreSQL / Neon + Drizzle ORM |
| Auth | Session cookie auth and provider-based operator login (Auth0 / social / local break-glass) |
| Payments | Stripe Checkout + webhook processing |
| Documenting | Versioned legal docs in the application schema |
| Public confirmation | Token-based public confirmation flow, no contributor account |

```text
Browser → splitsheet.ca
         ├── Vite React app
         └── /api/* → Express API → Neon Postgres
                              → Stripe
                              → Auth provider
```

---

## 6. Key routes and API surfaces

| Area | Examples |
| --- | --- |
| Login | `/login`, `/api/auth/*` |
| Dashboard / ops | `/`, `/projects`, `/projects/:id` |
| Contracts | `/contracts`, `/contracts/:id` |
| Public confirmation | `/confirm/:token`, `/confirm/:contractId/:token` |
| Legal documents | `/api/legal/documents/:docType/latest` |
| Billing | `/billing`, `/api/stripe/*` |
| Rights ledger | `/ownership` |
| Admin legal docs | legal document publish APIs |

---

## 7. Repository layout

```text
SplitSheet-platform/
├── client/                 # React UI and public confirmation pages
├── server/                 # Express endpoints, auth, billing, compliance, legal routing
├── shared/                 # Drizzle schema, shared types, agreement metadata
├── api/                    # generated Vercel serverless bundle
├── docs/                   # engineering and setup docs
├── scripts/                # workspace and operational scripts
├── README.md               # product overview and system truth
├── .env.example            # environment template
├── package.json
├── vite.config.ts
├── vercel.json
└── drizzle.config.ts
```

---

## 8. Environment variables

Typical environment variables include:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` / `NEON_DATABASE_URL` | Postgres access |
| `SESSION_SECRET` | Session signing |
| `APP_URL` | Canonical app URL, e.g. `https://splitsheet.ca` |
| `AUTH_PROVIDER` | `auth0`, `social`, or `local` |
| `AUTH0_DOMAIN` / `AUTH0_CLIENT_ID` / `AUTH0_CLIENT_SECRET` | Auth0 login |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Direct Google login |
| `STRIPE_SECRET_KEY` | Payment processing |
| `LOCAL_DEV` | runtime flag for local development |

Do not commit `.env` files.

---

## 9. Local development

```bash
npm install
cp .env.example .env
npm run db:push
npm run dev
```

Production build:

```bash
npm run build:vercel
```

Deploy by pushing to the production branch and letting Vercel build the Express bundle.

---

## 10. Documentation policy

- This README is the product source of truth for scope, architecture, and implementation status.
- Files in `docs/` are engineering support documentation.
- Legal terms and privacy language should live in the versioned legal document system, not in hardcoded UI essays.
- Public confirmation pages should stay lightweight and accountless.

---

## 11. Disclaimer

SplitSheet and SoundLedger Technologies Inc. provide software for documenting music rights workflows. We do not provide legal advice. Operators and contributors remain responsible for the accuracy of their information, obtaining legal advice where needed, and ensuring the enforceability of any agreement they execute.

Use of electronic confirmation or signature features creates an operational record of acknowledgment; it does not by itself guarantee a particular legal outcome in any jurisdiction.
