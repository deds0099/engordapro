import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/firebase";

// Login com email e senha
export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Cadastro com email e senha
export async function register(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Logout
export async function logout() {
  return signOut(auth);
} 