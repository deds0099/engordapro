import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';
import { UserProfile } from '../types';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setProfile({
            id: doc.id,
            email: data.email,
            name: data.name,
            createdAt: data.createdAt?.toDate() || new Date()
          });
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao carregar perfil:', error);
        setProfile(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { profile, loading };
}; 