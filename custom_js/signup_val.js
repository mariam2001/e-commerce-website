import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
function submitForm(){
    //e.preventDefault(); // Prevent the form from submitting

    // Get user input values
    var username = document.getElementById('floatingUsername').value; // Updated to get username
    var email = document.getElementById('floatingInput').value;
    var password = document.getElementById('floatingPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    

    // Email validation using a simple regular expression

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Check password length and match
    if (password.length < 6) {
       alert('Password should be 6 characters or more');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Create user with email and password
    createUserWithEmailAndPassword(auth, email, password) 
        .then(async (userCredential) => {
            
            // User signed up successfully
            var user = userCredential.user;
           
            
            // Store the user's username as name in Firestore collection 'users'
            var userDocRef = doc(firestore, 'users', user.uid);
            
            await setDoc(userDocRef, {
                name: username, // Updated to use the provided username
                uid: user.uid,
                email: email,
                balance: 0,
                cart: [],
                wishlist: [],
                pic: "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png",
            }).then(()=>{ window.location.href = '../Browser_page/browser-page.php?name='+email; });

            
        })
        .catch((error) => {
            // Handle authentication errors
            const errorCode = error.code;
            const errorMessage = error.message;
            //alert('Error: ' + errorMessage);
        });
}
window.submitForm = submitForm ;