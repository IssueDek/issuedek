// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPwU34pK2QriLBiNHtINnVM81LmFa90Ns",
  authDomain: "issuedek.firebaseapp.com",
  projectId: "issuedek",
  storageBucket: "issuedek.firebasestorage.app",
  messagingSenderId: "279713674035",
  appId: "1:279713674035:web:c5392feb183a1f59f04446",
  measurementId: "G-CFQTE0C428"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);