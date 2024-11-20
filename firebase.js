// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiZ_iCqgBO3YgmLBwDwjCNITNI6W9uduk",
  authDomain: "trippy-holiday-planner.firebaseapp.com",
  projectId: "trippy-holiday-planner",
  storageBucket: "trippy-holiday-planner.firebasestorage.app",
  messagingSenderId: "798714188657",
  appId: "1:798714188657:web:92a2419f27bcfc17b7dcd0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };