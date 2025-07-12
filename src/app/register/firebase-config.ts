// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRs-MbJ38AA6GUsX7CLTH6jsHLBntmjcw",
  authDomain: "vinimailogin.firebaseapp.com",
  projectId: "vinimailogin",
  storageBucket: "vinimailogin.firebasestorage.app",
  messagingSenderId: "395341940893",
  appId: "1:395341940893:web:2ee3530e35537f17426c74",
  measurementId: "G-933HPQB33F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app); 
// export { auth };