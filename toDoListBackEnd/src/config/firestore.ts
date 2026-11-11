import {
  applicationDefault,
  getApp,
  getApps,
  initializeApp,
} from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { env } from './env.js';

let database: Firestore | undefined;

/** Initialize once, on first use, so unrelated routes and tests need no credentials. */
export function getFirestoreDb(): Firestore {
  if (database) return database;

  if (!env.googleCloudProject) {
    throw new Error('Set GOOGLE_CLOUD_PROJECT to your Firebase project ID');
  }

  const firebaseApp = getApps().some((app) => app.name === '[DEFAULT]')
    ? getApp()
    : initializeApp({
        credential: applicationDefault(),
        projectId: env.googleCloudProject,
      });

  database = getFirestore(firebaseApp);
  return database;
}
