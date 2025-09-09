
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Set custom parameters for Google Auth
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Google Sign In Functions - usar apenas popup, mais confiável
export async function signInWithGoogle() {
  try {
    // Limpar qualquer estado anterior
    localStorage.removeItem('firebase:redirectUser:' + firebaseConfig.apiKey + ':' + firebaseConfig.authDomain);
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
  await signOut(auth);
}

// Auth state observer
export function onAuthChange(callback: (user: any) => void) {
  return onAuthStateChanged(auth, callback);
}


