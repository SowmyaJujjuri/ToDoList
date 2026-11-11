# To-do List Backend

TypeScript + Express service scaffold. Application features are intentionally unimplemented. The `/api` router is empty, so requests return a JSON 404 until feature routes are added.

## Getting started

Requires Node.js 22.18+ and npm. With nvm installed, run `nvm install` and `nvm use`.

```sh
npm install
cp .env.example .env
npm run dev
```

The server defaults to `http://127.0.0.1:3000`. Set `PORT`, `HOST`, and `NODE_ENV` in `.env` or the process environment. Existing process environment variables take precedence. Use `HOST=0.0.0.0` when external access is needed, such as in a container.

## Commands

| Command                | Purpose                               |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Run TypeScript with automatic restart |
| `npm run build`        | Compile source into `dist/`           |
| `npm start`            | Run the compiled server; build first  |
| `npm run typecheck`    | Check source and test types           |
| `npm run lint`         | Check ESLint rules                    |
| `npm run lint:fix`     | Apply automatic lint fixes            |
| `npm run format`       | Format files with Prettier            |
| `npm run format:check` | Check formatting                      |
| `npm test`             | Run HTTP scaffold smoke tests         |
| `npm run check`        | Run all checks and build              |

The first `npm install` generates `package-lock.json`; commit it and use `npm ci` for subsequent reproducible installs and CI.

For production, run `npm ci`, `npm run build`, and `npm prune --omit=dev`, then start with `NODE_ENV=production npm start`. Supply environment variables through the deployment environment.

## Layout

```text
src/
  app.ts                       Express configuration, without binding a port
  server.ts                    HTTP startup and graceful shutdown
  config/env.ts                Environment loading and validation
  middleware/error-handler.ts  Sanitized JSON errors
  routes/index.ts              Empty router mounted at /api
tests/
  app.test.ts                  Scaffold smoke tests
```

Add future routers in `src/routes/` and register them in `src/routes/index.ts`. Local TypeScript imports use `.js` extensions for the compiled Node.js ESM output.

The scaffold includes Helmet security headers, a 1 MB JSON body limit, JSON fallback errors, and shutdown handling. Firestore client setup is provided below; persistence operations, authentication, CORS policy, and deployment are left to the application. Keep secrets in the ignored `.env` file; `.env.example` contains only nonsecret defaults.

## Firestore

The backend uses `firebase-admin`, which includes TypeScript declarations; no separate Firebase type package or web SDK is needed.

1. Create or select a project in the [Firebase console](https://console.firebase.google.com/).
2. Under **Build > Firestore Database**, create the default database in Standard edition and choose its location. Use production rules; the server authenticates through IAM.
3. Set `GOOGLE_CLOUD_PROJECT` in your local `.env` to the project ID from Project settings (not the display name).
4. Configure Application Default Credentials using one of the options below.

For local development with the Google Cloud CLI installed:

```sh
gcloud auth application-default login
gcloud auth application-default set-quota-project YOUR_PROJECT_ID
```

The signed-in account needs Firestore access to the target project, for example the Cloud Datastore User IAM role. Quota project configuration also requires permission to use services in that project.

Alternatively, use a service account JSON from **Project settings > Service accounts > Generate new private key**. Store it outside this repository and set `GOOGLE_APPLICATION_CREDENTIALS` in `.env` to its absolute path. Never commit or send the private key. On Google-managed deployments, use the runtime's service account and grant it the required Firestore permissions instead of shipping a key.

Future data access modules can import `getFirestoreDb` from `src/config/firestore.ts` (use `.js` in TypeScript imports). It lazily returns a shared Firestore client, so HTTP startup and unrelated tests do not require Firebase credentials. Initializing a client does not verify remote connectivity; authentication and database access are checked when an operation runs. No records are read or written by this setup.

Admin SDK requests use IAM and bypass Firestore Security Rules. Enforce application authorization in the backend before adding data endpoints.

See the [Firebase Admin setup guide](https://firebase.google.com/docs/admin/setup) for authentication details.
