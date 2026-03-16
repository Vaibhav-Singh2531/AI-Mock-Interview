import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/client";

/* ---------- Types ---------- */

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

/* ---------- Context ---------- */

const AuthContext = createContext<AuthContextValue | null>(null);

/* ---------- Provider ---------- */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Fetch the user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              name: data.name ?? "",
              email: data.email ?? firebaseUser.email ?? "",
            });
          } else {
            // User exists in Auth but not in Firestore (edge case)
            setUser({
              id: firebaseUser.uid,
              name: "",
              email: firebaseUser.email ?? "",
            });
          }
        } catch {
          setUser({
            id: firebaseUser.uid,
            name: "",
            email: firebaseUser.email ?? "",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /* Sign Up: create Firebase Auth user → write profile to Firestore */
  const handleSignUp = async (name: string, email: string, password: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, "users", credential.user.uid));
      if (userDoc.exists()) {
        return { success: false, message: "User already exists. Please sign in instead." };
      }

      // Write user profile to Firestore
      await setDoc(doc(db, "users", credential.user.uid), { name, email });

      // Sign out after registration so user signs in explicitly
      await signOut(auth);

      return { success: true, message: "Account created successfully. Please sign in." };
    } catch (error: unknown) {
      console.error("Error creating user:", error);

      if (error instanceof Error && "code" in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === "auth/email-already-in-use") {
          return { success: false, message: "Email already in use." };
        }
      }

      return { success: false, message: "Error creating account." };
    }
  };

  /* Sign In: authenticate with Firebase Auth */
  const handleSignIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will pick up the new user and update state
      return { success: true, message: "Signed in successfully." };
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, message: "Failed to sign in. Check your credentials." };
    }
  };

  /* Logout */
  const handleLogout = async () => {
    await signOut(auth);
    // onAuthStateChanged will set user to null
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp: handleSignUp,
        signIn: handleSignIn,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ---------- Hook ---------- */

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
