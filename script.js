document.addEventListener('DOMContentLoaded', () => {
   
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            formMessage.textContent = 'Sending...';
            formMessage.className = 'text-center text-sm mt-4 text-yellow-500';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/submit-contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    formMessage.textContent = result.message;
                    formMessage.className = 'text-center text-sm mt-4 text-green-500';
                    contactForm.reset();
                } else {
                    formMessage.textContent = result.message || 'An error occurred.';
                    formMessage.className = 'text-center text-sm mt-4 text-red-500';
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                formMessage.textContent = 'Network error or server unavailable.';
                formMessage.className = 'text-center text-sm mt-4 text-red-500';
            }
        });
    }

    
    const taglineElement = document.getElementById('tagline');
    const originalText = taglineElement ? taglineElement.textContent : '';
    const typingSpeed = 50; 
    let charIndex = 0;

    function typeWriter() {
        if (charIndex < originalText.length) {
            taglineElement.textContent = originalText.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeWriter, typingSpeed);
        } else {
            taglineElement.style.width = 'auto';
            taglineElement.style.borderRight = 'none';
            taglineElement.style.animation = 'none';
        }
    }

    if (taglineElement) {
        taglineElement.textContent = '';
        taglineElement.style.opacity = '1';
        setTimeout(typeWriter, 1000);
    }

    
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const navHeight = document.querySelector('nav').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    
    const backToTopBtn = document.getElementById('backToTopBtn');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('opacity-0', 'invisible');
                backToTopBtn.classList.add('opacity-100', 'visible');
            } else {
                backToTopBtn.classList.remove('opacity-100', 'visible');
                backToTopBtn.classList.add('opacity-0', 'invisible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

   
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const projectImages = document.querySelectorAll('.project-image');

    if (imageModal && modalImage && closeModalBtn && projectImages.length > 0) {
        projectImages.forEach(image => {
            image.addEventListener('click', () => {
                const fullSrc = image.getAttribute('data-fullsrc') || image.src;
                modalImage.src = fullSrc;
                imageModal.classList.remove('hidden');
                imageModal.classList.add('modal-active'); 
            });
        });

        closeModalBtn.addEventListener('click', () => {
            imageModal.classList.remove('modal-active');
            imageModal.classList.add('hidden'); 
            modalImage.src = ''; 
        });

        
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                imageModal.classList.remove('modal-active');
                imageModal.classList.add('hidden');
                modalImage.src = '';
            }
        });
    }
});
