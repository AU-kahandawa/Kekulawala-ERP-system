import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyBJ5CTpx5Xw-JSArb0rPjxGsxNJezIgNLc",
  authDomain: "kekulawala-erp.firebaseapp.com",
  projectId: "kekulawala-erp",
  storageBucket: "kekulawala-erp.firebasestorage.app",
  messagingSenderId: "560015673217",
  appId: "1:560015673217:web:da59e652f0bbfcecd84a80"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default db;
