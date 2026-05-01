import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPwU34pK2QriLBiNHtINnVM81LmFa90Ns",
  authDomain: "issuedek.firebaseapp.com",
  projectId: "issuedek",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);