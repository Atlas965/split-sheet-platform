SoundLedger Technologies Inc. — SplitSheet Documentation

Product: SplitSheet
Company: SoundLedger Technologies Inc.
Jurisdiction: Ontario, Canada
Website: https://splitsheet.ca
Documentation repository: soundledger-documentation
Status: Product documentation and engineering reference

⸻

1. Overview

SplitSheet is an operator-managed music rights documentation and contributor confirmation platform developed by SoundLedger Technologies Inc.

It supports songwriters, producers, audio engineers, labels, managers and rights teams in documenting contributor information, ownership allocations, acknowledgments and project records.

The platform is designed to help operators:

* Create and manage music projects and rights records.
* Assign contributors, roles and ownership allocations.
* Generate contributor confirmation workflows.
* Share public confirmation links without requiring contributor accounts.
* Capture timestamped confirmation evidence.
* Preserve the legal and privacy notice version presented at the time of confirmation.
* Maintain project-level rights records and operational audit trails.
* Manage operator billing through Stripe.

SplitSheet is the first technology product within SoundLedger’s broader music-industry technology and information business.

2. Product positioning

SplitSheet is a workflow, documentation and evidence platform.

It is not:

* A law firm or legal service provider.
* A party to agreements between contributors.
* A substitute for independent legal advice.
* A guarantee that an agreement or electronic confirmation is legally enforceable.
* A royalty collection society or music distributor.
* A marketplace or escrow service.

Templates and confirmation workflows are operational tools unless entertainment counsel approves them as legal instruments for the relevant use case.

The accuracy of contributor information, ownership allocations and agreements remains the responsibility of the relevant parties.

3. Product users

User role	Responsibilities
Operator	Creates projects, manages contributors, sends confirmation links and maintains project records.
Contributor	Reviews project information, confirms submitted information or requests a change.
Admin	Manages platform administration and publishes approved legal and privacy document versions.

The product is designed around operator-managed workflows rather than a contributor-account-based consumer application.

4. Core capabilities

4.1 Project and contributor management

Operators can:

* Create projects and rights records.
* Assign contributors and roles.
* Record ownership allocations.
* Manage project and contributor information.
* Track confirmation and project status.

4.2 Public contributor confirmation

The contributor workflow is designed to operate without a mandatory account.

The intended workflow is:

1. An operator creates a project and assigns contributors.
2. The operator generates a contributor confirmation link.
3. The contributor opens the public token-based link.
4. The contributor reviews the presented project and allocation information.
5. The contributor confirms the information or requests a change.
6. The platform records the submitted response and associated evidence.
7. The confirmation record references the applicable legal and privacy document versions.

4.3 Evidence and operational records

The platform includes functionality for recording:

* Confirmation timestamps.
* Submitted contributor identity information.
* IP address metadata.
* User-agent metadata.
* Confirmation and acknowledgment history.
* Associated legal document versions.
* Project-level rights and operational records.

The existence of an evidence record does not independently establish the truth of submitted information or guarantee legal enforceability.

4.4 Legal document versioning

SplitSheet supports versioned legal and privacy documents.

The intended governance model includes:

* Document types and version identifiers.
* Publication of active document versions.
* Public retrieval of applicable published documents.
* Contributor-facing notice summaries.
* Association of the active document version with confirmation records.
* Historical version retrieval for audit and review.

Changes to legal documents should be reviewed and approved through the company’s designated governance process before publication.

4.5 Operator billing

SplitSheet uses Stripe for operator billing.

The application includes Stripe Checkout and webhook processing.

Payment processing, billing status and subscription access should be documented separately from contributor confirmation and rights records.

5. Technical architecture

5.1 Current application stack

Layer	Technology
Frontend	React
Programming language	TypeScript
Frontend build tooling	Vite
Routing	Wouter
Data fetching	TanStack Query
UI components	Shadcn UI / Radix
Backend	Express.js
Backend language	TypeScript
Hosting and deployment	Vercel
Database	PostgreSQL
Database provider	Neon
ORM	Drizzle ORM
Authentication	Session-cookie authentication and provider-based operator login
Payments	Stripe Checkout and webhooks
Document generation	jsPDF

Authentication provider configuration may include Auth0, social login or local development access. The active production configuration should be verified against the deployed environment before this documentation is treated as the definitive authentication specification.

5.2 High-level system architecture

flowchart TD
    A[Operator Browser] --> B[SplitSheet Web Application]
    C[Contributor Browser] --> D[Public Confirmation Page]
    B --> E[Vercel Deployment]
    D --> E
    E --> F[Express API]
    F --> G[Neon PostgreSQL]
    F --> H[Authentication Provider]
    F --> I[Stripe]
    G --> J[Projects and Contributor Records]
    G --> K[Confirmation and Evidence Records]
    G --> L[Versioned Legal Documents]
    G --> M[Operational Audit Records]

This diagram represents the documented logical architecture. It should be updated when production infrastructure or application responsibilities change.

5.3 Repository architecture

The application repository is organized around the following structure:

SplitSheet-platform/
├── client/
│   └── React frontend and public confirmation pages
├── server/
│   └── Express API, authentication, billing and routing
├── shared/
│   └── Shared types, database schema and metadata
├── api/
│   └── Vercel serverless entry point or generated bundle
├── docs/
│   └── Application-specific engineering documentation
├── scripts/
│   └── Development and operational scripts
├── README.md
├── .env.example
├── package.json
├── vite.config.ts
├── vercel.json
└── drizzle.config.ts

The actual repository structure should be checked before treating every listed directory as present in the production codebase.

6. API and application routes

The following routes describe the documented application surfaces.

Area	Example routes
Authentication	/login, /api/auth/*
Dashboard	/
Projects	/projects, /projects/:id
Contracts	/contracts, /contracts/:id
Public confirmation	/confirm/:token
Public confirmation	/confirm/:contractId/:token
Legal documents	/api/legal/documents/:docType/latest
Billing	/billing, /api/stripe/*
Rights ledger	/ownership
Administration	Legal document publishing APIs

These are representative routes, not a complete API specification. The actual implementation should be inspected before publishing a formal API reference.

7. Data and information governance

SplitSheet processes information relating to music projects, contributors, ownership allocations, confirmation activity and operator accounts.

Documentation should distinguish:

* Personal information.
* Project and rights information.
* Authentication information.
* Payment and billing information.
* Confirmation evidence.
* Legal document versions.
* Operational and security logs.

Data governance requirements

The company should maintain documented procedures covering:

1. Data collection and purpose limitation.
2. Access restrictions and permissions.
3. Data retention and deletion.
4. Database backups and restoration.
5. Security incident response.
6. Third-party service providers.
7. Privacy requests.
8. Evidence record integrity.

IP addresses and user-agent information can constitute personal information depending on the context and applicable law. Their collection, use, retention and disclosure should be reviewed accordingly.

8. Security architecture

Security documentation should describe the implemented controls and distinguish them from planned improvements.

Areas requiring documentation include:

* Authentication and session management.
* Password and secret management.
* Role-based access control.
* Project and tenant isolation.
* Database access restrictions.
* API authorization.
* Input validation.
* Rate limiting.
* Public token security.
* Stripe webhook verification.
* Audit logging.
* Dependency vulnerability management.
* Backup and recovery.
* Security incident response.

No security certification or independent security audit should be claimed unless independently obtained.

9. Legal document governance

SplitSheet supports versioned legal and privacy document workflows.

The company’s legal document governance process should define:

* Who can draft legal documents.
* Who reviews and approves them.
* Who can publish a new version.
* How published versions are identified.
* How historical versions are retained.
* How affected users are notified.
* How document changes are reflected in confirmation workflows.

Legal language and agreement templates must be reviewed by qualified entertainment and privacy counsel for the intended use cases and jurisdictions.

SplitSheet does not provide legal advice.

10. Billing and payments

Stripe is used for operator billing.

The technical documentation should cover:

* Checkout session creation.
* Webhook signature verification.
* Webhook event processing.
* Idempotency.
* Subscription state.
* Failed payment handling.
* Cancellation and renewal.
* Refund procedures.
* Billing access controls.

Payment card information should be handled through Stripe’s supported payment infrastructure rather than stored directly in SplitSheet’s application database unless a specifically reviewed requirement exists.

11. Environment configuration

Typical environment variables include:

Variable	Purpose
DATABASE_URL	PostgreSQL connection
NEON_DATABASE_URL	Alternative Neon database connection
SESSION_SECRET	Session signing secret
APP_URL	Canonical application URL
AUTH_PROVIDER	Authentication provider selection
AUTH0_DOMAIN	Auth0 domain
AUTH0_CLIENT_ID	Auth0 client identifier
AUTH0_CLIENT_SECRET	Auth0 client secret
GOOGLE_CLIENT_ID	Google OAuth client identifier
GOOGLE_CLIENT_SECRET	Google OAuth client secret
STRIPE_SECRET_KEY	Stripe secret API key
LOCAL_DEV	Local development configuration

The actual required environment variables must be verified against the application code and deployment configuration.

Security requirements:

* Never commit .env files.
* Never publish production secrets.
* Use deployment environment variables for production credentials.
* Restrict production secret access.
* Rotate credentials when compromise is suspected.
* Keep .env.example limited to placeholder values.

12. Development and deployment

Local development

The documented setup process is:

npm install
cp .env.example .env
npm run db:push
npm run dev

Production build

npm run build:vercel

Production deployment is managed through Vercel’s build and deployment process.

The exact build commands, database migration process, environment requirements and deployment branch should be verified against the current application repository before being treated as definitive operational instructions.

13. Documentation governance

This repository is the central documentation reference for SplitSheet’s product and engineering architecture.

Documentation must follow these principles:

1. Describe actual product functionality accurately.
2. Separate implemented capabilities from planned capabilities.
3. Record architecture and configuration changes.
4. Keep sensitive information out of public documentation.
5. Maintain version history through Git.
6. Review security and privacy documentation regularly.
7. Require appropriate review before publishing legal or compliance claims.
8. Avoid claiming certifications or legal guarantees without evidence.

Documentation update process

Changes should follow this process:

1. Create a Git branch.
2. Update the relevant Markdown document.
3. Review technical accuracy.
4. Check for confidential information.
5. Submit a pull request.
6. Review and approve the changes.
7. Merge into the main branch.

14. Documentation directory

The documentation repository should progressively include:

soundledger-documentation/
├── README.md
├── docs/
│   ├── product/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   ├── security/
│   ├── privacy/
│   ├── compliance/
│   ├── legal/
│   ├── operations/
│   ├── billing/
│   ├── user-guides/
│   └── ai-governance/
├── .github/
│   └── workflows/
└── package.json

The README is the central entry point. Supporting documents should provide the detailed technical, operational and governance information.

15. Product roadmap documentation

Future capabilities should be documented separately from existing production functionality.

Potential areas of future development include:

* Improved rights ledger capabilities.
* Expanded music rights intelligence.
* AI-assisted rights data analysis.
* Advanced contributor and operator reporting.
* Enterprise integrations.
* Catalogue and ownership analytics.
* Music asset valuation research.

Future capital markets products, investment services or securities-related activities will require separate legal, regulatory and operational assessment.

16. Company and product disclaimer

SplitSheet is software developed by SoundLedger Technologies Inc., an Ontario, Canada corporation.

The platform supports music rights documentation and contributor confirmation workflows. It does not provide legal advice, guarantee agreement enforceability or replace qualified legal counsel.

Operators and contributors remain responsible for the accuracy of submitted information, the agreements they enter into and obtaining appropriate legal advice.

Electronic confirmation records document activity within the platform. They do not, by themselves, establish a particular legal outcome in any jurisdiction.

⸻

Maintained by: SoundLedger Technologies Inc.
Product: SplitSheet
Official website: https://splitsheet.ca