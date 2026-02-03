import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Debug: print the loaded env values (temporary - remove after verification)
/* eslint-disable no-console */
console.log('[firebaseConfig] Verificando variáveis de ambiente...');
console.log('[firebaseConfig] debug values:', {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ? '✅ Presente' : '❌ Ausente',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Presente' : '❌ Ausente',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Presente' : '❌ Ausente',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Presente' : '❌ Ausente',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Presente' : '❌ Ausente',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ? '✅ Presente' : '❌ Ausente',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ? '✅ Presente' : '❌ Ausente',
});
/* eslint-enable no-console */

// Validate required config values (helpful for debugging during startup)
const requiredKeys = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
];

const missing = requiredKeys.filter((k) => !process.env[k]);
if (missing.length) {
  // eslint-disable-next-line no-console
  console.warn(
    `[firebaseConfig] Variáveis de ambiente ausentes: ${missing.join(', ')}. ` +
      'Verifique o arquivo .env e se as variáveis estão sendo exportadas.'
  );
} else {
  // eslint-disable-next-line no-console
  console.log(
    `[firebaseConfig] Todas as variáveis do Firebase encontradas. projectId=${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}`
  );
}

// Initialize Firebase
let app;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  // eslint-disable-next-line no-console
  console.log('[firebaseConfig] Firebase inicializado com sucesso');
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('[firebaseConfig] Erro ao inicializar Firebase:', error);
  // Criar stubs vazios para evitar crash
  app = null;
  auth = null;
  db = null;
  storage = null;
}

export { auth, db, storage };
export default app;
