import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, firestore } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userRole: string | null;
  userProfile: any | null;
  loading: boolean;
  register: (email: string, password: string, role: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get user role and profile from Firestore
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
            setUserProfile(userData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserRole(null);
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function register(email: string, password: string, role: string, name: string) {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        email,
        role,
        name,
        createdAt: new Date().toISOString(),
      });
      
      setUserRole(role);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async function updateUserProfile(data: any) {
    if (!currentUser) return;
    
    try {
      const userRef = doc(firestore, 'users', currentUser.uid);
      await setDoc(userRef, data, { merge: true });
      
      // Update local state
      setUserProfile({ ...userProfile, ...data });
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  const value = {
    currentUser,
    userRole,
    userProfile,
    loading,
    register,
    login,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};