// Get the carousel elements
const carouselTrack = document.querySelector('.carousel-track'); // The track containing all the items
const prevBtn = document.getElementById('prevBtn2024'); // Previous button
const nextBtn = document.getElementById('nextBtn2024'); // Next button
const covers = document.querySelectorAll('.carousel-track .cover'); // All the individual items in the carousel

// Variables to manage the carousel state
let currentIndex = 0; // Index to track the current position in the carousel
const visibleItems = 3; // Number of items visible at a time in the carousel

// Dynamically calculate coverWidth, considering margin or padding
const coverWidth = covers[0].getBoundingClientRect().width; // Use getBoundingClientRect for accurate width
const totalItems = covers.length; // Total number of items in the carousel
const maxIndex = Math.max(0, Math.ceil(totalItems / visibleItems) - 1); // Maximum index (at least 0)

// Function to update the visibility of navigation buttons
function updateCarouselButtons() {
    prevBtn.style.display = currentIndex === 0 ? 'none' : 'inline-block'; // Hide "Previous" button at the start
    nextBtn.style.display = currentIndex === maxIndex ? 'none' : 'inline-block'; // Hide "Next" button at the end
}

// Function to move to the previous set of items
function showPrev() {
    if (currentIndex > 0) {
        currentIndex--; // Decrease index to move backward
        carouselTrack.style.transform = `translateX(-${currentIndex * visibleItems * coverWidth}px)`; // Move track
        updateCarouselButtons(); // Update button visibility
    }
}

// Function to move to the next set of items
function showNext() {
    if (currentIndex < maxIndex) {
        currentIndex++; // Increase index to move forward
        carouselTrack.style.transform = `translateX(-${currentIndex * visibleItems * coverWidth}px)`; // Move track
        updateCarouselButtons(); // Update button visibility
    }
}

// Attach event listeners to the navigation buttons
prevBtn.addEventListener('click', showPrev);
nextBtn.addEventListener('click', showNext);

// Initialize button visibility on page load
updateCarouselButtons();
