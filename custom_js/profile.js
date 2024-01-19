import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

  // Function to get user information from Firestore
  async function getUserInfo() {
    try {
      // Get the user uid from localStorage
      // const userUid = localStorage.getItem('userUid');

      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          const userDocRef = doc(firestore, 'users', uid);
          const userDocSnap = await getDoc(userDocRef);
    
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            updateUserInfo(userData);
          } else {
            console.error('User document does not exist.');
          }
        } else {
          console.error('No user is signed in.');
        }
      });

    } catch (error) {
      console.error('Error getting user information:', error);
    }
  }

  // Function to update HTML content with user information
  function updateUserInfo(userData) {
    // Update name, email, image, and balance
    document.querySelector('.name').textContent = userData.name;
    document.querySelector('.mail').textContent = userData.email;
    document.querySelector('.profile-image').src = userData.pic;
    document.querySelector('.amount').textContent = `$${userData.balance}`;
  }

  // Call the function to get and update user information
  getUserInfo();
