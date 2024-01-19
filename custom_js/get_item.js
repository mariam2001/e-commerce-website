import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, getDocs} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Function to create carousels dynamically
async function createDynamicCarousels() {
    const existingContainer = document.querySelector('.row.row-cols-1.row-cols-sm-2.row-cols-md-3.g-3');

    if (!existingContainer) {
        console.error('Existing container not found.');
        return;
    }

    try {
        // Replace "carouselData" with the actual collection name in your Firestore
        const carouselDataCollection = collection(firestore, 'items');
        const snapshot = await getDocs(carouselDataCollection);

        let carouselIndex = 0;
        snapshot.forEach((doc) => {
            const carouselData = doc.data();

            // Create a unique ID for each carousel
            const containerId = `carouselExampleCaptions${carouselIndex + 1}`;

            // Create carousel container
            const carouselContainer = document.createElement('div');
            carouselContainer.classList.add('col');

            // Create link
            const link = document.createElement('a');
            link.href = '../Item_details/item-details.html';
            carouselContainer.appendChild(link);

            // Create card
            const card = document.createElement('div');
            card.classList.add('card', 'mx-auto');
            card.style.width = '28rem';
            link.appendChild(card);

            // Create carousel element
            const carousel = document.createElement('div');
            carousel.id = containerId;
            carousel.classList.add('carousel', 'slide');
            card.appendChild(carousel);

            // Create carousel indicators
            const indicators = document.createElement('div');
            indicators.classList.add('carousel-indicators');
            carousel.appendChild(indicators);

            // Create carousel inner container
            const innerContainer = document.createElement('div');
            innerContainer.classList.add('carousel-inner');
            carousel.appendChild(innerContainer);

            // Loop through data to create carousel items
            carouselData.pic.forEach((picUrl, index) => {
                // Create indicator button
                const indicatorBtn = document.createElement('button');
                indicatorBtn.type = 'button';
                indicatorBtn.dataset.bsTarget = `#${containerId}`;
                indicatorBtn.dataset.bsSlideTo = index;
                indicatorBtn.setAttribute('aria-label', `Slide ${index + 1}`);
                if (index == 0) {
                    indicatorBtn.classList.add('active');
                }
                indicators.appendChild(indicatorBtn);

                // Create carousel item
                const carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');
                if (index == 0) {
                    carouselItem.classList.add('active');
                }

                // Create image
                const image = document.createElement('img');
                image.src = picUrl;
                image.alt = carouselData.name[index];
                image.style.height = '363px';
                image.style.width = '120px';
                image.classList.add('d-block', 'w-100');

                // Use a closure to capture the correct values
                image.addEventListener('click', (function (carouselIndex, index) {
                    return function (event) {
                        // Prevent the default behavior of the click event
                        event.preventDefault();
                        // Store the carousel and image indices in localStorage
                        localStorage.setItem('selectedCarouselIndex', carouselIndex);
                        localStorage.setItem('selectedImageIndex', index);
                        localStorage.setItem('itemID', doc.id);
                        // Navigate to the item details page
                        window.location.href = '../Item_details/item-details.html';
                    };
                })(carouselIndex, index));

                carouselItem.appendChild(image);

                // Create caption
                const caption = document.createElement('div');
                caption.classList.add('carousel-caption', 'd-none', 'd-md-block');
                const captionText = document.createTextNode(carouselData.name[index]);
                caption.appendChild(captionText);
                carouselItem.appendChild(caption);

                innerContainer.appendChild(carouselItem);
            });


            // Create carousel controls
            const prevButton = document.createElement('button');
            prevButton.classList.add('carousel-control-prev');
            prevButton.type = 'button';
            prevButton.dataset.bsTarget = `#${containerId}`;
            prevButton.dataset.bsSlide = 'prev';
            carousel.appendChild(prevButton);

            const prevIcon = document.createElement('span');
            prevIcon.classList.add('carousel-control-prev-icon');
            prevIcon.setAttribute('aria-hidden', 'true');
            prevButton.appendChild(prevIcon);

            const prevText = document.createElement('span');
            prevText.classList.add('visually-hidden');
            prevText.appendChild(document.createTextNode('Previous'));
            prevButton.appendChild(prevText);

            const nextButton = document.createElement('button');
            nextButton.classList.add('carousel-control-next');
            nextButton.type = 'button';
            nextButton.dataset.bsTarget = `#${containerId}`;
            nextButton.dataset.bsSlide = 'next';
            carousel.appendChild(nextButton);

            const nextIcon = document.createElement('span');
            nextIcon.classList.add('carousel-control-next-icon');
            nextIcon.setAttribute('aria-hidden', 'true');
            nextButton.appendChild(nextIcon);

            const nextText = document.createElement('span');
            nextText.classList.add('visually-hidden');
            nextText.appendChild(document.createTextNode('Next'));
            nextButton.appendChild(nextText);

            // Append the carousel container to the existing layout
            existingContainer.appendChild(carouselContainer);
            carouselIndex++;
        });
    } catch (error) {
        console.error('Error fetching data from Firestore:', error);
    }
}

// Call the function to create carousels dynamically
createDynamicCarousels();