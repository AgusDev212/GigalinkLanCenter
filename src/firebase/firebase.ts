import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

export interface FirebaseConnectionInfo {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  firestoreDatabaseId?: string;
}

export function getActiveFirebaseConfig(): {
  config: FirebaseConnectionInfo;
  isCustom: boolean;
} {
  return {
    config: {
      apiKey: firebaseConfigData.apiKey,
      authDomain: firebaseConfigData.authDomain,
      projectId: firebaseConfigData.projectId,
      storageBucket: firebaseConfigData.storageBucket,
      messagingSenderId: firebaseConfigData.messagingSenderId,
      appId: firebaseConfigData.appId,
      firestoreDatabaseId: firebaseConfigData.firestoreDatabaseId,
    },
    isCustom: false,
  };
}

const active = getActiveFirebaseConfig();

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(active.config);

// Initialize Firestore
export const db =
  active.config.firestoreDatabaseId && active.config.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, active.config.firestoreDatabaseId)
    : getFirestore(app);

// Test initial connection as per skill instructions
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.', error);
    }
  }
}

testConnection();
