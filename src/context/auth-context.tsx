"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, storage } from "@/lib/firebase";
import { generateUserProfile } from "@/ai/flows/generate-user-profile";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface User {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (name: string, email: string, photoFile?: File | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const formatUser = (user: FirebaseUser): User => ({
  uid: user.uid,
  email: user.email,
  name: user.displayName,
  photoURL: user.photoURL,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(formatUser(firebaseUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
    router.push("/dashboard");
  };

  const signup = async (email: string, pass: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const firebaseUser = userCredential.user;

    if (firebaseUser) {
      const { photoDataUri } = await generateUserProfile({ name });
      await updateProfile(firebaseUser, {
        displayName: name,
        photoURL: photoDataUri,
      });
      setUser(formatUser(firebaseUser)); // Update context with new user info
    }
    router.push("/dashboard");
  };

  const logout = () => {
    signOut(auth).then(() => {
      setUser(null);
      router.push("/login");
    });
  };

  const updateUserProfile = async (name: string, email: string, photoFile?: File | null) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error("No user is signed in.");

    let photoURL = firebaseUser.photoURL;

    if (photoFile) {
      const storageRef = ref(storage, `profile-images/${firebaseUser.uid}`);
      const snapshot = await uploadBytes(storageRef, photoFile);
      photoURL = await getDownloadURL(snapshot.ref);
    }
    
    // Note: Firebase Auth does not directly support email updates via this method.
    // This requires a more complex flow with verification, which is beyond this scope.
    // We will update the name and photoURL.
    await updateProfile(firebaseUser, {
      displayName: name,
      photoURL: photoURL,
    });

    // Update the user state in the context
    setUser(formatUser(firebaseUser));
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
