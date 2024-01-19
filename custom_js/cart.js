import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, getDocs, doc, arrayUnion, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// Function to get user cart data
async function getUserCart() {
    try {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                const userDocRef = doc(firestore, 'users', uid);
                const userDocSnap = await getDoc(userDocRef);
    
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    const userCart = userData.cart || [];
    
                    // Call a function to dynamically create cards for each item in the cart
                    createDynamicItemCards(userCart);
                } else {
                    console.error('User document does not exist.');
                }
            } else {
                console.error('No user is signed in.');
            }
        });
        
    }catch (error) {
        console.error('Error getting user information:', error);
    }
}

// Function to create item cards dynamically
async function createDynamicItemCards(cart) {
    const container = document.getElementById('cart-container'); // Adjust the ID based on your HTML structure

    // Iterate through each item in the cart
    for (const cartItem of cart) {
        try {
            const itemID = Object.keys(cartItem)[0];
            const selectedImageIndex = cartItem[itemID];

            // Replace "items" with the actual collection name in your Firestore
            const itemDocRef = doc(firestore, 'items', itemID);
            const itemDocSnap = await getDoc(itemDocRef);

            if (itemDocSnap.exists()) {
                const itemData = itemDocSnap.data();

                // Create card elements
                const card = document.createElement('div');
                card.classList.add('card', 'mb-3');
                card.style.maxWidth = '540px';
                card.style.padding = '30px';

                const row = document.createElement('div');
                row.classList.add('row', 'g-0');

                const imageCol = document.createElement('div');
                imageCol.classList.add('col-md-4');

                const image = document.createElement('img');
                image.src = itemData.pic[selectedImageIndex];
                image.classList.add('img-fluid', 'rounded-start');
                image.alt = '...';

                const contentCol = document.createElement('div');
                contentCol.classList.add('col-md-8');

                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                const title = document.createElement('h5');
                title.classList.add('card-title');
                title.style.margin = '50px';
                title.textContent = itemData.name[selectedImageIndex];

                const price = document.createElement('p');
                price.classList.add('card-text');
                price.style.margin = '50px';
                const small = document.createElement('small');
                small.classList.add('text-body-secondary');
                small.textContent = `$${itemData.price}`;
                price.appendChild(small);

                // Append elements to the card
                imageCol.appendChild(image);
                contentCol.appendChild(title);
                contentCol.appendChild(price);
                row.appendChild(imageCol);
                row.appendChild(contentCol);
                cardBody.appendChild(row);
                card.appendChild(cardBody);

                // Append the card to the container
                container.appendChild(card);
            } else {
                console.error(`Item document with ID ${itemID} does not exist.`);
            }
        } catch (error) {
            console.error('Error fetching data from Firestore:', error);
        }
    }
}

// Call the function to get user cart data and dynamically create cards
getUserCart();

