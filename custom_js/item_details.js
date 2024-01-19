import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, getDocs,doc,arrayUnion,setDoc,updateDoc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

// Function to create product details dynamically
async function createProductDetails() {
    // Get the selected carousel index from localStorage
    const selectedCarouselIndex = localStorage.getItem('selectedCarouselIndex');
    const selectedImageIndex = localStorage.getItem('selectedImageIndex');
    const itemID = localStorage.getItem('itemID');

    if (selectedCarouselIndex == null) {
        console.error('Selected carousel index not found.');
        return;
    }

    try {
        // Replace "items" with the actual collection name in your Firestore
        const itemsCollection = collection(firestore, 'items');
        const snapshot = await getDocs(itemsCollection);

        // Find the document with the corresponding index
        let selectedProductData;
        let index = 0;
        snapshot.forEach((doc) => {
            if (index == parseInt(selectedCarouselIndex)) {
                selectedProductData = doc.data();
            }
            index++;
        });

        if (!selectedProductData) {
            console.error('Selected product data not found.');
            return;
        }

        // Create product details elements
        const row = document.createElement('div');
        row.classList.add('row');

        const imageCol = document.createElement('div');
        imageCol.classList.add('col-md-6', 'themed-grid-col', 'text-center');
        const image = document.createElement('img');
        image.src = selectedProductData.pic[selectedImageIndex];
        image.alt = selectedProductData.name[selectedImageIndex];
        image.classList.add('rounded', 'viewed-item');
        imageCol.appendChild(image);

        const detailsCol = document.createElement('div');
        detailsCol.classList.add('col-md-6', 'themed-grid-col', 'align-self-center');

        const detailsContainer = document.createElement('div');
        detailsContainer.style.width = '500px';

        const productName = document.createElement('h1');
        productName.classList.add('mb-4');
        productName.textContent = selectedProductData.name[selectedImageIndex];

        const productPrice = document.createElement('h3');
        productPrice.textContent = `$${selectedProductData.price}`;

        const productDetails = document.createElement('p');
        productDetails.classList.add('fs-5', 'mb-4');
        productDetails.textContent = selectedProductData.desc;

        const addToCartBtn = document.createElement('button');
        addToCartBtn.classList.add('btn', 'btn-primary');
        addToCartBtn.type = 'button';
        addToCartBtn.textContent = 'Add to cart';
        addToCartBtn.addEventListener('click', (function () {
            return async function (event) {
                // Prevent the default behavior of the click event
                event.preventDefault();
                const auth = getAuth(app);
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        const uid = user.uid;
                        alert(uid);
                        const userDocRef = doc(firestore, 'users', uid);
                        const customData = {};
                        customData[itemID] = selectedImageIndex;
                        await updateDoc(userDocRef, {
                            cart: arrayUnion(customData),
                        });
                        alert("item added to cart");
                    }
                });
            };
        })());

        // Append elements to the container
        detailsContainer.appendChild(productName);
        detailsContainer.appendChild(productPrice);
        detailsContainer.appendChild(productDetails);
        detailsContainer.appendChild(addToCartBtn);

        detailsCol.appendChild(detailsContainer);

        row.appendChild(imageCol);
        row.appendChild(detailsCol);

        // Append the row to the existing layout
        const existingContainer = document.querySelector('.container'); // Adjust this selector based on your layout
        existingContainer.appendChild(row);

        // Add click event to "Add to cart" button if needed
        addToCartBtn.addEventListener('click', () => {
            // Your logic for adding to cart
            console.log('Product added to cart:', selectedProductData.name);
        });
    } catch (error) {
        console.error('Error fetching data from Firestore:', error);
    }
}

// Call the function to create product details dynamically
createProductDetails();