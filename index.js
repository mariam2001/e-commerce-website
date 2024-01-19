// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtPw1MdvB5mRuLUkUlJpAhso0eQnAwZTk",
  authDomain: "quick-buy-da5f6.firebaseapp.com",
  projectId: "quick-buy-da5f6",
  storageBucket: "quick-buy-da5f6.appspot.com",
  messagingSenderId: "404102408170",
  appId: "1:404102408170:web:58f43ddfdc09c68ccaf493",
  measurementId: "G-F1PJVFN3PB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();
console.log(app);