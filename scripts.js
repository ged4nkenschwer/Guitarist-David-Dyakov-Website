/**
 * Classical Guitarist Portfolio Website
 * Main JavaScript File
 * Spanish Classical Guitar Theme
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Update current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Initialize language preference
    initLanguage();

    // Scroll animations are now handled by anime.js in animations.js

    // Initialize mobile menu functionality
    initMobileMenu();

    // Initialize back-to-top button
    initBackToTop();

    // Initialize lightbox gallery
    initLightbox();

    // Form submission handlers
    initFormSubmissions();

    // Add special animation for technique items
    initTechniqueAnimations();

    // Add subtle guitar pattern animation
    initGuitarPatternAnimation();

    // Initialize Press Quotes animations
    initPressQuotesAnimations();

    // Combined Form Handling
    const combinedForm = document.getElementById('combinedForm');
    const formThanks = document.getElementById('formThanks');
    
    if (combinedForm) {
        combinedForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(combinedForm);
            const formDataObj = {};
            
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // Log form data (for development purposes)
            console.log('Form submitted:', formDataObj);
            
            // In a real implementation, you would send the data to a server here
            // Example with fetch:
            /*
            fetch(combinedForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                // Handle success
                showThankYouMessage();
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle error
            });
            */
            
            // For demo purposes, we'll just show the thank you message
            showThankYouMessage();
        });
    }
    
    function showThankYouMessage() {
        // Hide the form
        combinedForm.style.display = 'none';
        
        // Show the thank you message
        if (formThanks) {
            formThanks.style.display = 'block';
            
            // Scroll to thank you message
            formThanks.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

/**
 * Initialize Press Quotes animations
 * Uses Intersection Observer to trigger animations when quotes enter viewport
 */
function initPressQuotesAnimations() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const quoteItems = document.querySelectorAll('.quote-fade');
        
        // Return if no quote items found
        if (quoteItems.length === 0) return;
        
        const quoteObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If element is in viewport
                if (entry.isIntersecting) {
                    // Play animation by adding class that sets animation-play-state to running
                    entry.target.style.animationPlayState = 'running';
                    // Stop observing after animation
                    quoteObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 }); // Trigger when at least 20% of item is visible
        
        // Set initial animation-play-state to paused
        quoteItems.forEach(item => {
            item.style.animationPlayState = 'paused';
            quoteObserver.observe(item);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        // Simply make all quotes visible
        document.querySelectorAll('.quote-fade').forEach(item => {
            item.style.opacity = 1;
        });
    }
}

/**
 * Add special animations for technique items
 */
function initTechniqueAnimations() {
    const techniqueItems = document.querySelectorAll('.technique-item');
    
    if (techniqueItems.length === 0) return;
    
    techniqueItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.technique-icon i');
            icon.style.transform = 'scale(1.2)';
            icon.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.technique-icon i');
            icon.style.transform = 'scale(1)';
        });
    });
}

/**
 * Add subtle guitar pattern animation
 */
function initGuitarPatternAnimation() {
    // Add subtle movement to quote section on scroll
    const quoteSection = document.querySelector('.quote-section');
    if (!quoteSection) return;
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        if (isElementInViewport(quoteSection)) {
            const offsetY = (scrollPosition * 0.05) % 50;
            quoteSection.style.backgroundPosition = `${offsetY}px ${offsetY}px`;
        }
    });
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom > 0
    );
}

/**
 * Language Switching Functionality
 */
function initLanguage() {
    const langEn = document.getElementById('lang-en');
    const langDe = document.getElementById('lang-de');
    
    // Check localStorage for language preference
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    
    // Set active class on the current language button
    if (savedLang === 'en') {
        langEn.classList.add('active');
        langDe.classList.remove('active');
    } else {
        langDe.classList.add('active');
        langEn.classList.remove('active');
    }
    
    // Add event listeners to language buttons
    langEn.addEventListener('click', function() {
        setLanguage('en');
        langEn.classList.add('active');
        langDe.classList.remove('active');
    });
    
    langDe.addEventListener('click', function() {
        setLanguage('de');
        langDe.classList.add('active');
        langEn.classList.remove('active');
    });
}

/**
 * Apply language changes to all elements with language data attributes
 */
function setLanguage(lang) {
    // Save language preference to localStorage
    localStorage.setItem('language', lang);
    
    // Update all elements with language data attributes
    document.querySelectorAll('[data-en][data-de]').forEach(element => {
        element.textContent = element.getAttribute(`data-${lang}`);
    });
    
    // Update content blocks that have language specific versions
    document.querySelectorAll('.en-content, .de-content').forEach(element => {
        element.style.display = 'none';
    });
    
    document.querySelectorAll(`.${lang}-content`).forEach(element => {
        element.style.display = 'block';
    });
}

// Scroll animations are now handled by anime.js in animations.js

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

/**
 * Initialize back-to-top button
 */
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialize Lightbox Gallery
 */
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').getAttribute('src');
            const imgCaption = this.getAttribute('data-caption');
            
            lightboxImg.setAttribute('src', imgSrc);
            lightboxCaption.textContent = imgCaption;
            lightbox.style.display = 'block';
            
            // Prevent scrolling of the body when lightbox is open
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox when clicking the close button
    closeLightbox.addEventListener('click', function() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close lightbox when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

/**
 * Initialize form submissions
 */
function initFormSubmissions() {
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real implementation, you would send the form data to a server here
            const formData = new FormData(contactForm);
            // Example: fetch('/api/contact', { method: 'POST', body: formData });
            
            // For demo purposes, just show a success message
            alert('Thank you for your message! In a real implementation, this would be sent to the server.');
            contactForm.reset();
        });
    }
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterThanks = document.getElementById('newsletter-thanks');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get the form data
            const formData = new FormData(newsletterForm);
            
            // For development & testing - log the form data to console
            console.log('Newsletter subscription:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
            
            // In production, you would send this data to your email service (Brevo/Mailchimp)
            // Example implementation using fetch:
            /*
            fetch(newsletterForm.getAttribute('action'), {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                // Show thank you message
                showNewsletterThanks();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was a problem with your subscription. Please try again.');
            });
            */
            
            // For demonstration purposes, just show the thank you message
            showNewsletterThanks();
        });
    }
    
    /**
     * Show the thank you message after successful newsletter subscription
     */
    function showNewsletterThanks() {
        // Hide the form
        newsletterForm.style.display = 'none';
        
        // Show the thank you message
        newsletterThanks.style.display = 'block';
        
        // Make sure the message is visible in the viewport
        newsletterThanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Reset the form for if/when the user returns
        newsletterForm.reset();
        
        // Optional: Hide the thank you message and show the form again after some time
        // setTimeout(() => {
        //     newsletterThanks.style.display = 'none';
        //     newsletterForm.style.display = 'block';
        // }, 10000); // 10 seconds
    }
}

/**
 * Update header styling on scroll
 */
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    
    if (window.pageYOffset > 50) {
        header.style.padding = '0.7rem 0';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.padding = '1rem 0';
        header.style.boxShadow = 'none';
    }
}); 