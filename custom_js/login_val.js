import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const auth = getAuth(app);
const firestore = getFirestore(app);

// Event listener for the "Sign Up" button
function submitForm2() {
    // Get user input values
    var email = document.getElementById('floatingInput').value;
    var password = document.getElementById('floatingPassword').value;

    // Sign in existing user
    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // User signed in successfully
            var user = userCredential.user;
            

            // Store the user's email as name in Firestore collection 'users'
            var userDocRef = doc(firestore, 'users', user.uid);

              // Retrieve the user document to get uid
            var userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                // User document exists, update the HTML content
                const userData = userDocSnap.data();

                // Store uid in localStorage
                localStorage.setItem('userUid', user.uid);

                // Redirect to the desired page after successful sign-in
                window.location.href = '../Browser_page/browser-page.php?name='+email;
            } else {
                // User document does not exist
                console.error('User document does not exist.');
                alert('User not found. Please check your email and try again.');
            }
        })
        .catch((error) => {
            // Handle authentication errors
            const errorCode = error.code;
            const errorMessage = error.message;

            // Alert for specific error cases
            if (errorCode == 'auth/user-not-found') {
                alert('User not found. Please check your email and try again.');
            } else if (errorCode == 'auth/wrong-password') {
                alert('Incorrect password. Please check your password and try again.');
            } else {
                alert('Error: ' + errorMessage);
            }
        });
}

// Assign the function to the global scope
window.submitForm2 = submitForm2;
