
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

// Verificar se Firebase está configurado
const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
                              import.meta.env.VITE_FIREBASE_PROJECT_ID;

let app: any = null;

if (isFirebaseConfigured) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  // Initialize Firebase
  app = initializeApp(firebaseConfig);
} else {
  console.warn('⚠️ Firebase não configurado - recursos de autenticação desabilitados');
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = app ? getAuth(app) : null;
export const googleProvider = app ? new GoogleAuthProvider() : null;

// Set custom parameters for Google Auth
if (googleProvider) {
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
}

// Google Sign In Functions - usar apenas popup, mais confiável
export async function signInWithGoogle() {
  if (!auth || !googleProvider) {
    throw new Error('Firebase não configurado - login indisponível');
  }

  try {
    // Limpar qualquer estado anterior
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
    localStorage.removeItem('firebase:redirectUser:' + apiKey + ':' + authDomain);
    sessionStorage.clear();
    
    // Usar apenas popup - mais confiável
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error: any) {
    console.error('Erro no login Google:', error);
    
    // Se popup for bloqueado, mostrar mensagem mais clara
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Por favor, permita popups neste site e tente novamente');
    }
    
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Login cancelado. Tente novamente');
    }
    
    if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Múltiplas tentativas detectadas. Aguarde um momento e tente novamente');
    }
    
    throw error;
  }
}

// Handle redirect result
export async function handleRedirectResult() {
  if (!auth) {
    return null;
  }

  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error) {
    console.error('Error handling redirect result:', error);
    throw error;
  }
}

// Sign out
export async function signOutUser() {
  if (!auth) {
    return;
  }
  await signOut(auth);
}

// Auth state observer
export function onAuthChange(callback: (user: any) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}


