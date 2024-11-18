// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_RmP8KhvEy38FhWVNod42r2uE8Smow24",
  authDomain: "trippy-holiday-app.firebaseapp.com",
  projectId: "trippy-holiday-app",
  storageBucket: "trippy-holiday-app.firebasestorage.app",
  messagingSenderId: "405488491571",
  appId: "1:405488491571:web:5ab8c92445794fcf8b5746",
  measurementId: "G-RC2K2G5XV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };