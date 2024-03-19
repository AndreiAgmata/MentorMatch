// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB13bXTzUAT5fGuvvwfjUGk_ogRye_0jIY",
  authDomain: "mentormatch-f67c3.firebaseapp.com",
  projectId: "mentormatch-f67c3",
  storageBucket: "mentormatch-f67c3.appspot.com",
  messagingSenderId: "269271824920",
  appId: "1:269271824920:web:20baffa383f3b334e6616d",
  measurementId: "G-RW4HKNWQNZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
