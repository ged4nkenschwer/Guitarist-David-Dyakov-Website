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

    // Enhanced Combined Form Handling for Netlify Forms
    const combinedForm = document.getElementById('combinedForm');
    const formThanks = document.getElementById('form-thanks');
    
    if (combinedForm) {
        // Add client-side validation
        combinedForm.addEventListener('submit', function(e) {
            // Validate required fields
            const email = combinedForm.querySelector('#email');
            let isValid = true;
            
            // Clear previous error messages
            clearErrorMessages();
            
            // Validate email field
            if (!email.value.trim()) {
                showFieldError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showFieldError(email, 'Please enter a valid email address');
                isValid = false;
            }
            
            // If validation fails, prevent submission
            if (!isValid) {
                e.preventDefault();
                return false;
            }
            
            // If validation passes, show loading state and let Netlify handle the rest
            showLoadingState();
            
            // Don't prevent default - let Netlify Forms handle the submission
            // The form will redirect to the thank-you page on success
        });
        
        // Add real-time validation feedback
        const inputs = combinedForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Remove error styling when user starts typing
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    const errorMsg = this.parentNode.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
        });
    }
    
    // Validation helper functions for Netlify Forms
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }
    
    function clearErrorMessages() {
        const errorMessages = combinedForm.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        const errorFields = combinedForm.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }
    
    function validateField(field) {
        if (field.id === 'email' && field.value.trim()) {
            if (!isValidEmail(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        return true;
    }
    
    function showLoadingState() {
        const submitBtn = combinedForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
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
    
    // Update all elements with language data attributes (except reveal triggers which need special handling)
    document.querySelectorAll('[data-en][data-de]').forEach(element => {
        // Skip reveal trigger buttons - they need special handling based on their state
        if (!element.classList.contains('reveal-trigger')) {
            element.textContent = element.getAttribute(`data-${lang}`);
        }
    });
    
    // Handle reveal trigger buttons based on their current state
    document.querySelectorAll('.reveal-trigger').forEach(trigger => {
        const triggerText = trigger.querySelector('.trigger-text');
        const isActive = trigger.classList.contains('active');
        
        if (isActive) {
            // Button is in "fold" state
            const foldTextEn = trigger.getAttribute('data-en-fold');
            const foldTextDe = trigger.getAttribute('data-de-fold');
            if (foldTextEn && foldTextDe) {
                triggerText.textContent = lang === 'de' ? foldTextDe : foldTextEn;
            }
        } else {
            // Button is in "unfold" state
            const unfoldTextEn = trigger.getAttribute('data-en');
            const unfoldTextDe = trigger.getAttribute('data-de');
            if (unfoldTextEn && unfoldTextDe) {
                triggerText.textContent = lang === 'de' ? unfoldTextDe : unfoldTextEn;
            }
        }
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
 * Update header styling on scroll - optimized for performance
 */
(function() {
    const header = document.getElementById('header');
    let ticking = false;
    let lastScrollY = 0;
    
    function updateHeader() {
        const scrollY = window.pageYOffset;
        
        // Only update if scroll position changed significantly
        if (Math.abs(scrollY - lastScrollY) < 5) {
            ticking = false;
            return;
        }
        
        if (scrollY > 50) {
            header.style.padding = '0.7rem 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '1rem 0';
            header.style.boxShadow = 'none';
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    function requestHeaderUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
})();

/**
 * Fix navigation scroll issues - EXCLUDE nav-link to avoid conflict with gallery.js
 */
document.addEventListener('DOMContentLoaded', function() {
    // Override navigation links but EXCLUDE .nav-link elements (handled by gallery.js)
    const navLinks = document.querySelectorAll('a[href^="#"]:not(.nav-link)');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = 100; // Account for fixed header
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}); 