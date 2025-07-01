import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({
        user,
        loading: false,
        error: null
      });
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setAuthState({
        user: userCredential.user,
        loading: false,
        error: null
      });
      return userCredential.user;
    } catch (error: any) {
      let errorMessage = 'Erro ao fazer login';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta';
          break;
        case 'auth/invalid-email':
          errorMessage = 'E-mail inválido';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
          break;
        default:
          errorMessage = error.message || 'Erro ao fazer login';
      }

      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Criar perfil do usuário no Firestore
      const userProfile = {
        id: userCredential.user.uid,
        email: email,
        name: name,
        createdAt: new Date()
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
      
      setAuthState({
        user: userCredential.user,
        loading: false,
        error: null
      });
      return userCredential.user;
    } catch (error: any) {
      let errorMessage = 'Erro ao criar conta';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'E-mail já está em uso';
          break;
        case 'auth/weak-password':
          errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres';
          break;
        case 'auth/invalid-email':
          errorMessage = 'E-mail inválido';
          break;
        default:
          errorMessage = error.message || 'Erro ao criar conta';
      }

      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: 'Erro ao fazer logout'
      }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await sendPasswordResetEmail(auth, email);
      setAuthState(prev => ({ ...prev, loading: false }));
    } catch (error: any) {
      let errorMessage = 'Erro ao enviar e-mail de recuperação';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'E-mail não encontrado';
          break;
        case 'auth/invalid-email':
          errorMessage = 'E-mail inválido';
          break;
        default:
          errorMessage = error.message || 'Erro ao enviar e-mail de recuperação';
      }

      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    register,
    logout,
    resetPassword,
    clearError
  };
}; 