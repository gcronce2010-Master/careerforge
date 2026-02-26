'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';

export function initializeFirebase() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  return { app, firestore, auth };
}

export * from './provider';
export * from './client-provider';
export { errorEmitter } from './error-emitter';
export { FirestorePermissionError } from './errors';
export { useDoc, useMemoFirebase } from './firestore/use-doc';
export { useCollection } from './firestore/use-collection';
