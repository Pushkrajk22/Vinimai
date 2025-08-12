// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  //VINIMAILogin FIREBASE
  apiKey: "AIzaSyCRs-MbJ38AA6GUsX7CLTH6jsHLBntmjcw",
  authDomain: "vinimailogin.firebaseapp.com",
  projectId: "vinimailogin",
  storageBucket: "vinimailogin.firebasestorage.app",
  messagingSenderId: "395341940893",
  appId: "1:395341940893:web:2ee3530e35537f17426c74",
  measurementId: "G-933HPQB33F",
  sitekey: "6Le3IaArAAAAAEK-Rjt5J7Um6ROMGINFfU4xfTab",
  secretkey: "6Le3IaArAAAAAJXhQT6cXL3kaYbjFOEw-V4HR0p0"

  //OTP LOGIN PROJECT FIREBASE
  // apiKey: "AIzaSyCSfK1U8ahitmudjEMnmij7rDiMwUWhQsw",
  // authDomain: "otplogin-ae76e.firebaseapp.com",
  // projectId: "otplogin-ae76e",
  // storageBucket: "otplogin-ae76e.firebasestorage.app",
  // messagingSenderId: "806378011777",
  // appId: "1:806378011777:web:d22fed1fb6ed86f5d72180"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app); 
// export { auth };