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

// === Theme Toggle Functionality ===
const themeToggleBtn = document.getElementById('themeToggle');
const htmlElement = document.documentElement; // This refers to the <html> tag
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

if (themeToggleBtn && htmlElement && sunIcon && moonIcon) {
    // Function to apply the chosen theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            addClass(htmlElement, 'dark');
            removeClass(sunIcon, 'block');
            addClass(sunIcon, 'hidden');
            addClass(moonIcon, 'block');
            removeClass(moonIcon, 'hidden');
        } else {
            removeClass(htmlElement, 'dark');
            addClass(sunIcon, 'block');
            removeClass(sunIcon, 'hidden');
            removeClass(moonIcon, 'block');
            addClass(moonIcon, 'hidden');
        }
    }

    // Check for saved theme preference on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // If no preference saved, check system preference and apply dark mode
        applyTheme('dark');
    } else {
        // Default to light mode if no saved preference and system preference is not dark
        applyTheme('light');
    }

    // Add event listener for the toggle button
    themeToggleBtn.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        } else {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}


// === Typewriter Effect for Hero Title ===
const heroTitleElement = document.getElementById('hero-title');
// Re-checking heroTitleElement as it might not be available immediately in some contexts
// This part assumes heroTitleElement is guaranteed to be there when this script runs (end of body)
const textToType = "The Future of Renewable Energy";
let charIndex = 0;

function typeWriter() {
    if (charIndex < textToType.length) {
        if (heroTitleElement) { // Safety check
            heroTitleElement.innerHTML += textToType.charAt(charIndex);
        }
        charIndex++;
        setTimeout(typeWriter, 100); // Adjust typing speed here (milliseconds per character)
    }
}

// Trigger the typewriter effect when the window loads
window.onload = function() {
    typeWriter(); // Call typewriter here
    // Any other window.onload logic can go here if needed
};


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
const backToTopButton = document.getElementById('back-to-top'); // Changed ID from backToTopBtn to back-to-top for consistency

if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling 300px
            removeClass(backToTopButton, 'invisible'); // Use invisible/visible for better transitions with opacity
            addClass(backToTopButton, 'opacity-100');
        } else {
            addClass(backToTopButton, 'opacity-0');
            setTimeout(() => { // Hide completely after fade out
                addClass(backToTopButton, 'invisible'); // Hide completely after fade out
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
const closeModalBtn = document.getElementById('closeModalBtn'); // This is the 'x' button on the modal
const okModalBtn = document.getElementById('okModalBtn'); // This is the 'OK' button on the modal

// Ensure all necessary elements for the contact form and modal are present before adding listeners
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
    // Note: There are two elements with id 'closeModalBtn' in your HTML.
    // The script is designed to handle both if they are distinct elements or the first one it finds.
    // The image modal close button had a conflicting ID, which was corrected in index.html,
    // so this 'closeModalBtn' should correctly refer to the pop-up modal's close button now.
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

