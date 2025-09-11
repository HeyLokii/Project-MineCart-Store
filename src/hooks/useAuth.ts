import { useState, useEffect, useCallback } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider, getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Assuming auth is exported from firebase.ts
import { useQueryClient } from '@tanstack/react-query'; // Import useQueryClient

// Global state to prevent multiple auth listeners
let authListenerSet = false;
let globalUser: FirebaseUser | null = null;
let globalUserProfile: any = null;
let globalNeedsProfileSetup = false;
let globalShowAuthModal = false;
let globalShowProfileModal = false;
let authModalListeners: Array<(show: boolean) => void> = [];
let profileModalListeners: Array<(show: boolean) => void> = [];

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(globalUser);
  const [userProfile, setUserProfile] = useState<any>(globalUserProfile);
  const [loading, setLoading] = useState(!authListenerSet);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(globalNeedsProfileSetup);
  const [showAuthModal, setShowAuthModalLocal] = useState(globalShowAuthModal);
  const [showProfileModal, setShowProfileModalLocal] = useState(globalShowProfileModal);
  const [suspensionData, setSuspensionData] = useState<{
    type: 'suspended' | 'banned';
    reason: string;
    expiresAt?: string;
  } | null>(null);

  const queryClient = useQueryClient(); // Initialize queryClient

  // Subscribe to global modal state changes
  useEffect(() => {
    const updateAuthModal = (show: boolean) => {
      setShowAuthModalLocal(show);
    };

    const updateProfileModal = (show: boolean) => {
      setShowProfileModalLocal(show);
    };

    authModalListeners.push(updateAuthModal);
    profileModalListeners.push(updateProfileModal);

    return () => {
      const authIndex = authModalListeners.indexOf(updateAuthModal);
      if (authIndex > -1) {
        authModalListeners.splice(authIndex, 1);
      }

      const profileIndex = profileModalListeners.indexOf(updateProfileModal);
      if (profileIndex > -1) {
        profileModalListeners.splice(profileIndex, 1);
      }
    };
  }, []);

  const setShowAuthModal = useCallback((show: boolean) => {
    globalShowAuthModal = show;
    authModalListeners.forEach(listener => listener(show));
  }, []);

  const setShowProfileModal = useCallback((show: boolean) => {
    globalShowProfileModal = show;
    profileModalListeners.forEach(listener => listener(show));
  }, []);

  const checkUserProfileStatus = useCallback(async (user: FirebaseUser) => {
    if (!user?.email) {
      console.log('❌ Sem email do usuário');
      globalUserProfile = null;
      globalNeedsProfileSetup = true;
      setUserProfile(null);
      setNeedsProfileSetup(true);
      return;
    }

    try {
      console.log(`🔍 Verificando perfil para: ${user.email}`);

      const response = await fetch(`/api/users/by-email/${encodeURIComponent(user.email)}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (response.ok) {
        const profile = await response.json();
        console.log('✅ Perfil encontrado:', profile);

        // Verificar se o perfil está completo
        const isComplete = profile.isProfileComplete === true &&
                          profile.firstName &&
                          profile.lastName &&
                          profile.displayName;

        // Atualizar estado global PRIMEIRO
        globalUserProfile = profile;
        globalNeedsProfileSetup = !isComplete;

        console.log(`📋 Perfil completo: ${isComplete}`, profile);

        // Depois atualizar estado local
        setUserProfile(profile);
        setNeedsProfileSetup(!isComplete);

        // Verificar se o usuário está suspenso ou banido
        if (profile.isSuspended || profile.isBanned) {
          setSuspensionData({
            type: profile.isBanned ? 'banned' : 'suspended',
            reason: profile.suspensionReason || 'Motivo não especificado',
            expiresAt: profile.suspensionExpiresAt
          });
        } else {
          setSuspensionData(null);
        }
      } else {
        console.log('❌ Perfil não encontrado');
        globalUserProfile = null;
        globalNeedsProfileSetup = true;
        setUserProfile(null);
        setNeedsProfileSetup(true);
        setSuspensionData(null);
      }
    } catch (error) {
      console.error('❌ Erro ao verificar perfil:', error);
      globalUserProfile = null;
      globalNeedsProfileSetup = true;
      setUserProfile(null);
      setNeedsProfileSetup(true);
      setSuspensionData(null);
    }
  }, []);


  useEffect(() => {
    // Only set up listener once globally
    if (authListenerSet) {
      setLoading(false);
      return;
    }

    authListenerSet = true;
    let timeoutId: NodeJS.Timeout;

    // Check if Firebase auth is available
    if (!auth) {
      console.warn('⚠️ Firebase auth não disponível - usando modo offline');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Update global state
      globalUser = firebaseUser;

      // Update all component states
      setUser(firebaseUser);

      // Clear previous timeout
      if (timeoutId) clearTimeout(timeoutId);

      if (firebaseUser) {
        // Check profile after a delay
        timeoutId = setTimeout(async () => {
          await checkUserProfileStatus(firebaseUser);
        }, 500);
        setShowAuthModal(false); // Ensure modal is closed on login
      } else {
        globalUserProfile = null;
        globalNeedsProfileSetup = false;
        setUserProfile(null);
        setNeedsProfileSetup(false);
        setSuspensionData(null); // Limpar dados de suspensão no logout
        // Don't automatically show modal on logout - let components control this
      }

      setLoading(false);
    });

    // Handle redirect result on initial load
    const checkRedirect = async () => {
      try {
        // Firebase does not expose handleRedirectResult directly in the same way
        // We rely on onAuthStateChanged to catch the redirection result.
        // If you need to handle specific redirect results, you might need a different approach
        // or check the URL parameters for specific flags.
      } catch (error) {
        console.error('Error handling redirect:', error);
      }
    };

    checkRedirect();

    return () => {
      unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [checkUserProfileStatus]); // Added checkUserProfileStatus as dependency

  const login = async () => {
    if (!auth) {
      throw new Error('Firebase não configurado - login indisponível');
    }

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      globalUser = firebaseUser;
      setUser(firebaseUser);
      await checkUserProfileStatus(firebaseUser);
      return firebaseUser;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };

  const logout = useCallback(async () => {
    if (!auth) {
      console.warn('⚠️ Firebase auth não disponível - logout simulado');
      setUser(null);
      setUserProfile(null);
      setSuspensionData(null);
      return;
    }

    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setSuspensionData(null); // Limpa os dados de suspensão no logout
      localStorage.removeItem('lastAuthCheck');
      console.log('✅ Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      console.log('🔄 Forçando atualização do perfil...');
      await checkUserProfileStatus(user);
    }
  }, [user, checkUserProfileStatus]);

  const syncUserAvatar = useCallback((avatarUrl: string) => {
    console.log('🖼️ Sincronizando avatar:', avatarUrl);

    // Atualizar estado local do perfil
    setUserProfile((prev: any) => prev ? { ...prev, photoURL: avatarUrl, avatarUrl } : null);

    // Invalidar cache do perfil para forçar reload
    queryClient.invalidateQueries({ queryKey: ['/api/users/by-email'] });

    console.log('✅ Avatar sincronizado em toda aplicação');
  }, [queryClient]);


  const isAdmin = () => {
    // Três emails admin: owner + dois admins
    const adminEmails = ['heylokibr333@gmail.com', 'pixelsengineers@gmail.com', 'juniorbanda216@gmail.com'];
    return user?.email && adminEmails.includes(user.email);
  };

  const getDisplayName = () => {
    return userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Usuário';
  };


  const canCreateProducts = () => {
    return userProfile?.canCreateProducts === true || isAdmin();
  };

  const isSuspendedOrBanned = () => {
    return suspensionData !== null;
  };



  return {
    user,
    userProfile,
    loading,
    needsProfileSetup,
    showAuthModal,
    setShowAuthModal,
    showProfileModal,
    setShowProfileModal,
    login,
    logout,
    refreshProfile,
    syncUserAvatar,
    isAdmin,
    getDisplayName,
    canCreateProducts,
    isSuspendedOrBanned,
    suspensionData
  };
};