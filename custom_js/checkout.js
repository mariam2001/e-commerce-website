import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, getDocs, doc, arrayUnion, addDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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
                } else {
                    console.error('User document does not exist.');
                }

                // Add an event listener to the form
                const checkoutForm = document.querySelector('.needs-validation');
                checkoutForm.addEventListener('submit', async function (event) {
                    event.preventDefault();

                    // Get the form elements
                    const firstName = document.getElementById('firstName').value;
                    const lastName = document.getElementById('lastName').value;
                    const email = document.getElementById('email').value;
                    const address = document.getElementById('address').value;
                    const address2 = document.getElementById('address2').value;
                    const country = document.getElementById('country').value;
                    const state = document.getElementById('state').value;
                    const zip = document.getElementById('zip').value;

                    // Check if all required fields have values
                    if (firstName && lastName && email && address && country && state && zip) {
                        try {
                            // Replace "orders" with the actual collection name in your Firestore
                            const ordersCollection = collection(firestore, 'orders');

                            // Add a new document to the "orders" collection
                            await addDoc(ordersCollection, {
                                userID: uid,
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                address: address,
                                address2: address2,
                                country: country,
                                state: state,
                                zip: zip,
                            });

                            // Alert for successful purchase
                            alert('Your purchase is successful!');
                        } catch (error) {
                            console.error('Error adding order to Firestore:', error);
                        }
                    } else {
                        // Alert if any required field is missing
                        alert('Please fill in all required fields.');
                    }
                });

            } else {
                console.error('No user is signed in.');
            }
        });

    } catch (error) {
        console.error('Error getting user information:', error);
    }


}
// Function to create item cards dynamically
async function createDynamicCartItems(cart) {
    const cartContainer = document.querySelector('.col-md-5.col-lg-4.order-md-last .list-group.mb-3');
    const badge = document.querySelector('.col-md-5.col-lg-4.order-md-last .badge.bg-primary.rounded-pill');
    const totalContainer = document.querySelector('.col-md-5.col-lg-4.order-md-last .list-group.mb-3 li:last-child');

    // Initialize total price and item count
    let totalPrice = 0;
    let itemCount = 0;

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

                // Increment item count
                itemCount++;

                // Create list item elements
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-sm');

                const itemDetails = document.createElement('div');
                const itemName = document.createElement('h6');
                itemName.classList.add('my-0');
                itemName.textContent = itemData.name[selectedImageIndex];
                const itemDescription = document.createElement('small');
                itemDescription.classList.add('text-body-secondary');
                itemDescription.textContent = 'Brief description';

                itemDetails.appendChild(itemName);
                itemDetails.appendChild(itemDescription);

                listItem.appendChild(itemDetails);

                const itemPrice = document.createElement('span');
                itemPrice.classList.add('text-body-secondary');
                itemPrice.textContent = `$${itemData.price}`;

                listItem.appendChild(itemPrice);

                // Append the list item to the cart container
                cartContainer.insertBefore(listItem, totalContainer);

                // Add the price to the total
                totalPrice += itemData.price;
            } else {
                console.error(`Item document with ID ${itemID} does not exist.`);
            }
        } catch (error) {
            console.error('Error fetching data from Firestore:', error);
        }
    }

    // Update the total price
    totalContainer.querySelector('strong').textContent = `$${totalPrice}`;

    // Update the item count in the badge
    badge.textContent = itemCount;
}

// Function to get user cart data and dynamically create cards
async function getUserCart() {
    const auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const uid = user.uid;
            const userDocRef = doc(firestore, 'users', uid);

            // Get the existing cart data
            const userDocSnap = await getDoc(userDocRef);
            const existingCart = userDocSnap.data().cart || [];

            // Call the function to generate cart items
            createDynamicCartItems(existingCart);
        }
    });
}

// Call the function to get user cart data and dynamically create cards
getUserCart();
getUserInfo();
