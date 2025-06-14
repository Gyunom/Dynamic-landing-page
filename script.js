// Function to add a class to an element
function addClass(element, className) {
    if (element) {
        element.classList.add(className);
    }
}

// Function to remove a class from an element
function removeClass(element, className) {
    if (element) {
        element.classList.remove(className);
    }
}

// === Typewriter Effect for Hero Title ===
const heroTitleElement = document.getElementById('hero-title');
const textToType = "The Future of Renewable Energy";
let charIndex = 0;

function typeWriter() {
    if (charIndex < textToType.length) {
        if (heroTitleElement) {
            heroTitleElement.innerHTML += textToType.charAt(charIndex);
        }
        charIndex++;
        setTimeout(typeWriter, 100); // Adjust typing speed here (milliseconds per character)
    }
}

// Trigger the typewriter effect when the window loads
window.onload = typeWriter;

// === Smooth Scrolling for Navigation Links ===
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default jump behavior

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth' // Smooth scroll effect
            });
        }
    });
});

// === "Back to Top" Button Functionality ===
// FIX: Changed ID to match the one in index.html (backToTopBtn)
const backToTopButton = document.getElementById('backToTopBtn'); 

if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling 300px
            removeClass(backToTopButton, 'invisible'); // Remove 'invisible' to make it appear
            addClass(backToTopButton, 'opacity-100');
            removeClass(backToTopButton, 'opacity-0'); // Ensure full opacity
        } else {
            addClass(backToTopButton, 'opacity-0'); // Fade out
            setTimeout(() => { // Hide completely after fade out
                addClass(backToTopButton, 'invisible'); // Make invisible after transition
            }, 300); // Match CSS transition duration
        }
    });

    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// === Interactive Image Modal for Portfolio Section ===
const projectImages = document.querySelectorAll('.project-image');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const imageModalCloseBtn = document.getElementById('imageModalCloseBtn');

if (imageModal && modalImage && imageModalCloseBtn) {
    projectImages.forEach(image => {
        image.addEventListener('click', () => {
            modalImage.src = image.src; // Set modal image source to clicked image
            removeClass(imageModal, 'hidden'); // Show the modal
            setTimeout(() => { // Animate in
                removeClass(imageModal.querySelector('div'), 'opacity-0');
                removeClass(imageModal.querySelector('div'), 'scale-95');
                addClass(imageModal.querySelector('div'), 'opacity-100');
                addClass(imageModal.querySelector('div'), 'scale-100');
            }, 10);
        });
    });

    // Close modal when close button is clicked
    imageModalCloseBtn.addEventListener('click', () => {
        addClass(imageModal.querySelector('div'), 'opacity-0');
        addClass(imageModal.querySelector('div'), 'scale-95');
        setTimeout(() => { // Hide completely after fade out
            addClass(imageModal, 'hidden');
        }, 300);
    });

    // Close modal when clicking outside the image content
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            addClass(imageModal.querySelector('div'), 'opacity-0');
            addClass(imageModal.querySelector('div'), 'scale-95');
            setTimeout(() => {
                addClass(imageModal, 'hidden');
            }, 300);
        }
    });
}

// =========================================================================
// === Contact Form Submission and Pop-up Response Handling ===
// =========================================================================
const contactForm = document.getElementById('contactForm');
const submitButton = document.getElementById('submitButton');
const loadingIndicator = document.getElementById('loadingIndicator');

// Pop-up modal elements
const responseModal = document.getElementById('responseModal');
const modalMessage = document.getElementById('modalMessage');
const closeModalBtn = document.getElementById('closeModalBtn');
const okModalBtn = document.getElementById('okModalBtn');

if (contactForm && submitButton && loadingIndicator && responseModal && modalMessage && closeModalBtn && okModalBtn) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // PREVENT DEFAULT FORM SUBMISSION (stops page refresh)

        // Show loading indicator and disable button
        addClass(loadingIndicator, 'block');
        removeClass(loadingIndicator, 'hidden');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries()); // Convert form data to a plain object

        try {
            const response = await fetch('/submit-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // Send data as JSON
            });

            const result = await response.json(); // Parse the JSON response from the server

            // Display the pop-up message based on server response
            if (result.success) {
                modalMessage.textContent = result.responseMessage; // Set message from server
                addClass(responseModal, 'block'); // Show modal as block
                removeClass(responseModal, 'hidden'); // Remove hidden class
                // Animate modal in
                setTimeout(() => {
                    removeClass(responseModal.querySelector('div'), 'opacity-0');
                    removeClass(responseModal.querySelector('div'), 'scale-95');
                    addClass(responseModal.querySelector('div'), 'opacity-100');
                    addClass(responseModal.querySelector('div'), 'scale-100');
                }, 10);
            } else {
                // Handle server-side validation errors or other failures
                modalMessage.textContent = result.message || 'An unexpected error occurred.';
                addClass(responseModal, 'block');
                removeClass(responseModal, 'hidden');
                setTimeout(() => {
                    removeClass(responseModal.querySelector('div'), 'opacity-0');
                    removeClass(responseModal.querySelector('div'), 'scale-95');
                    addClass(responseModal.querySelector('div'), 'opacity-100');
                    addClass(responseModal.querySelector('div'), 'scale-100');
                }, 10);
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            modalMessage.textContent = 'Failed to connect to the server. Please try again later.';
            addClass(responseModal, 'block');
            removeClass(responseModal, 'hidden');
            setTimeout(() => {
                removeClass(responseModal.querySelector('div'), 'opacity-0');
                removeClass(responseModal.querySelector('div'), 'scale-95');
                addClass(responseModal.querySelector('div'), 'opacity-100');
                addClass(responseModal.querySelector('div'), 'scale-100');
            }, 10);
        } finally {
            // Hide loading indicator and re-enable button
            addClass(loadingIndicator, 'hidden');
            removeClass(loadingIndicator, 'block');
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
            contactForm.reset(); // Optionally clear the form after submission
        }
    });

    // Event listeners to close the modal
    closeModalBtn.addEventListener('click', () => {
        addClass(responseModal.querySelector('div'), 'opacity-0');
        addClass(responseModal.querySelector('div'), 'scale-95');
        setTimeout(() => {
            addClass(responseModal, 'hidden');
            removeClass(responseModal, 'block'); // Ensure it's fully hidden
        }, 300);
    });

    okModalBtn.addEventListener('click', () => {
        addClass(responseModal.querySelector('div'), 'opacity-0');
        addClass(responseModal.querySelector('div'), 'scale-95');
        setTimeout(() => {
            addClass(responseModal, 'hidden');
            removeClass(responseModal, 'block'); // Ensure it's fully hidden
        }, 300);
    });

    // Close modal if clicking outside the content
    responseModal.addEventListener('click', (e) => {
        if (e.target === responseModal) {
            addClass(responseModal.querySelector('div'), 'opacity-0');
            addClass(responseModal.querySelector('div'), 'scale-95');
            setTimeout(() => {
                addClass(responseModal, 'hidden');
                removeClass(responseModal, 'block'); // Ensure it's fully hidden
            }, 300);
        }
    });
}

