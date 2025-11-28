/**
 * Classical Guitarist Portfolio Website
 * Main JavaScript File
 * Spanish Classical Guitar Theme
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Update current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

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
    
    // Initialize lazy loading for gallery background images
    initLazyLoadGalleryImages();
    
    // Fix overflow for video gallery items to prevent clipping
    fixVideoGalleryOverflow();

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
    
    // Throttle scroll event for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrollPosition = window.scrollY;
                if (isElementInViewport(quoteSection)) {
                    const offsetY = (scrollPosition * 0.05) % 50;
                    quoteSection.style.backgroundPosition = `${offsetY}px ${offsetY}px`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
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
 * Initialize lazy loading for gallery background images
 * Uses IntersectionObserver for better performance
 */
function initLazyLoadGalleryImages() {
    if (!('IntersectionObserver' in window)) {
        // Fallback: load all images immediately
        document.querySelectorAll('.gallery-image').forEach(img => {
            const bgImage = img.getAttribute('style');
            if (bgImage && bgImage.includes('background-image')) {
                // Image already has style, ensure it's loaded
                const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (match && match[1]) {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.as = 'image';
                    link.href = match[1];
                    document.head.appendChild(link);
                }
            }
        });
        return;
    }
    
    const galleryImages = document.querySelectorAll('.gallery-image');
    if (galleryImages.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const galleryImage = entry.target;
                const bgImage = galleryImage.getAttribute('style');
                
                // If image hasn't been loaded yet, preload it
                if (bgImage && bgImage.includes('background-image') && !galleryImage.dataset.loaded) {
                    const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                    if (match && match[1]) {
                        // Preload the image
                        const link = document.createElement('link');
                        link.rel = 'prefetch';
                        link.as = 'image';
                        link.href = match[1];
                        document.head.appendChild(link);
                        
                        // Mark as loaded
                        galleryImage.dataset.loaded = 'true';
                    }
                }
                
                // Stop observing once loaded
                imageObserver.unobserve(galleryImage);
            }
        });
    }, {
        rootMargin: '50px' // Start loading 50px before image enters viewport
    });
    
    galleryImages.forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Fix overflow for video gallery items to prevent video clipping
 */
function fixVideoGalleryOverflow() {
    const videoGalleryItems = document.querySelectorAll('.gallery-item:has(.gallery-video)');
    
    // If :has() is not supported, use alternative method
    if (videoGalleryItems.length === 0) {
        const allGalleryItems = document.querySelectorAll('.gallery-item');
        allGalleryItems.forEach(item => {
            if (item.querySelector('.gallery-video')) {
                item.style.overflow = 'visible';
            } else {
                item.style.overflow = 'hidden';
            }
        });
    } else {
        // :has() is supported, set overflow via CSS class
        videoGalleryItems.forEach(item => {
            item.style.overflow = 'visible';
        });
    }
}

/**
 * Language Switching Functionality
 */
function initLanguage() {
    const langEn = document.getElementById('lang-en');
    const langDe = document.getElementById('lang-de');
    
    if (!langEn || !langDe) return;
    
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
    
    // Add event listeners to language buttons - check if elements exist
    if (langEn) {
        langEn.addEventListener('click', function() {
            setLanguage('en');
            langEn.classList.add('active');
            langDe.classList.remove('active');
        });
    }
    
    if (langDe) {
        langDe.addEventListener('click', function() {
            setLanguage('de');
            langDe.classList.add('active');
            langEn.classList.remove('active');
        });
    }
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
    
    // Update lightbox caption if lightbox is open
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.style.display === 'block') {
        const lightboxCaption = document.getElementById('lightbox-caption');
        const galleryItems = document.querySelectorAll('.gallery-item');
        const imageItems = Array.from(galleryItems).filter(item => !item.querySelector('.gallery-video'));
        if (lightboxCaption && imageItems.length > 0) {
            // Find current item - this is a simplified approach
            const currentImgSrc = document.getElementById('lightbox-img')?.getAttribute('src');
            if (currentImgSrc) {
                imageItems.forEach(item => {
                    const itemSrc = item.querySelector('.gallery-image')?.getAttribute('style')?.match(/url\(['"]?([^'"]+)['"]?\)/)?.[1];
                    if (itemSrc && itemSrc.includes(currentImgSrc.split('/').pop())) {
                        const caption = lang === 'de' 
                            ? (item.getAttribute('data-caption-de') || item.getAttribute('data-caption') || '')
                            : (item.getAttribute('data-caption') || '');
                        lightboxCaption.textContent = caption;
                    }
                });
            }
        }
    }
    
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
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a nav link - cache selector
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
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
    if (!backToTop) return;
    
    // Throttle scroll event for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
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
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightboxBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    
    // Separate image and video items
    const imageItems = Array.from(galleryItems).filter(item => {
        return !item.querySelector('.gallery-video');
    });
    
    const videoItems = Array.from(galleryItems).filter(item => {
        return item.querySelector('.gallery-video');
    });
    
    // Combine all items for navigation (images first, then videos)
    const allItems = [...imageItems, ...videoItems];
    
    if (allItems.length === 0) return;
    
    let currentIndex = 0;
    
    // Function to get image source from gallery item
    function getImageSrc(item) {
        const galleryImage = item.querySelector('.gallery-image');
        if (galleryImage) {
            // First try inline style attribute
            const inlineStyle = galleryImage.getAttribute('style');
            if (inlineStyle) {
                const match = inlineStyle.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/);
                if (match && match[1]) {
                    return match[1];
                }
            }
            // Fallback: Get background-image URL from computed style
            const bgImage = window.getComputedStyle(galleryImage).backgroundImage;
            if (bgImage && bgImage !== 'none') {
                // Extract URL from background-image: url("path") or url('path') or url(path)
                const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (match && match[1]) {
                    return match[1];
                }
            }
        }
        // Fallback: check for img tag
        const img = item.querySelector('img');
        if (img) {
            return img.getAttribute('src');
        }
        return null;
    }
    
    // Function to get all video sources from gallery item
    function getVideoSources(item) {
        const video = item.querySelector('.gallery-video video');
        if (video) {
            const sources = video.querySelectorAll('source');
            const sourceData = [];
            sources.forEach(source => {
                sourceData.push({
                    src: source.getAttribute('src'),
                    type: source.getAttribute('type')
                });
            });
            return sourceData;
        }
        return null;
    }
    
    // Helper function to pause all gallery videos
    function pauseAllGalleryVideos() {
        const allGalleryVideos = document.querySelectorAll('.gallery-video video');
        allGalleryVideos.forEach(video => {
            if (!video.paused) {
                video.pause();
            }
        });
    }
    
    // Helper function to close lightbox and restore back-to-top button
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Stop and reset lightbox video
        if (lightboxVideo) {
            lightboxVideo.pause();
            lightboxVideo.currentTime = 0;
            // Clear sources to free memory
            const sources = lightboxVideo.querySelectorAll('source');
            sources.forEach(source => source.remove());
            // Add empty sources back
            const quicktimeSource = document.createElement('source');
            quicktimeSource.setAttribute('src', '');
            quicktimeSource.setAttribute('type', 'video/quicktime');
            const mp4Source = document.createElement('source');
            mp4Source.setAttribute('src', '');
            mp4Source.setAttribute('type', 'video/mp4');
            lightboxVideo.appendChild(quicktimeSource);
            lightboxVideo.appendChild(mp4Source);
            lightboxVideo.load();
        }
        
        // Show back-to-top button when lightbox closes
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            // Check if we should show it based on scroll position
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            }
        }
    }
    
    // Function to open lightbox with specific index
    function openLightbox(index) {
        if (index < 0 || index >= allItems.length) return;
        
        currentIndex = index;
        const item = allItems[currentIndex];
        const isVideo = item.querySelector('.gallery-video');
        
        // Get caption based on current language
        const currentLang = localStorage.getItem('language') || 'en';
        const caption = currentLang === 'de' 
            ? (item.getAttribute('data-caption-de') || item.getAttribute('data-caption') || '')
            : (item.getAttribute('data-caption') || '');
        
        if (isVideo) {
            // Handle video
            const videoSources = getVideoSources(item);
            if (videoSources && videoSources.length > 0 && lightboxVideo) {
                // Pause ALL gallery videos (including the one being opened)
                pauseAllGalleryVideos();
                
                // Hide image, show video
                lightboxImg.style.display = 'none';
                lightboxVideo.style.display = 'block';
                
                // Stop and reset lightbox video first
                lightboxVideo.pause();
                lightboxVideo.currentTime = 0;
                
                // Clear existing sources
                const existingSources = lightboxVideo.querySelectorAll('source');
                existingSources.forEach(source => source.remove());
                
                // Add all source elements from the original video
                videoSources.forEach(sourceData => {
                    const source = document.createElement('source');
                    source.setAttribute('src', sourceData.src);
                    source.setAttribute('type', sourceData.type || 'video/mp4');
                    lightboxVideo.appendChild(source);
                });
                
                // Set preload to auto so video loads and can play
                lightboxVideo.preload = 'auto';
                
                // Load the video
                lightboxVideo.load();
                
                // Auto-play the video once it can play
                const playLightboxVideo = () => {
                    lightboxVideo.play().catch(err => {
                        // Auto-play might be blocked by browser policy, that's okay
                        // User can click play manually
                        console.log('Video autoplay prevented (user interaction required):', err);
                    });
                };
                
                // Try to play when enough data is loaded
                lightboxVideo.addEventListener('canplay', playLightboxVideo, { once: true });
                
                // Fallback: try when metadata loads (might work faster)
                lightboxVideo.addEventListener('loadedmetadata', function tryPlay() {
                    if (lightboxVideo.readyState >= 2) {
                        playLightboxVideo();
                    }
                    lightboxVideo.removeEventListener('loadedmetadata', tryPlay);
                }, { once: true });
                
                lightboxCaption.textContent = caption;
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                // Hide back-to-top button when lightbox opens
                const backToTop = document.getElementById('back-to-top');
                if (backToTop) {
                    backToTop.classList.remove('visible');
                }
            }
        } else {
            // Handle image
            const imgSrc = getImageSrc(item);
            if (imgSrc) {
                // Hide video, show image
                if (lightboxVideo) {
                    lightboxVideo.style.display = 'none';
                    lightboxVideo.pause();
                }
                lightboxImg.style.display = 'block';
                
                lightboxImg.setAttribute('src', imgSrc);
                lightboxCaption.textContent = caption;
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                // Hide back-to-top button when lightbox opens
                const backToTop = document.getElementById('back-to-top');
                if (backToTop) {
                    backToTop.classList.remove('visible');
                }
            }
        }
    }
    
    // Add click handlers to all gallery items (images and videos)
    allItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            // Don't open lightbox if clicking directly on video controls
            if (e.target.closest('video') && e.target.tagName !== 'VIDEO') {
                return;
            }
            openLightbox(index);
        });
    });
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const newIndex = currentIndex > 0 ? currentIndex - 1 : allItems.length - 1;
            openLightbox(newIndex);
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const newIndex = currentIndex < allItems.length - 1 ? currentIndex + 1 : 0;
            openLightbox(newIndex);
        });
    }
    
    // Keyboard navigation - only active when lightbox is open
    function handleKeydown(e) {
        if (lightbox.style.display !== 'block') return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            const newIndex = currentIndex > 0 ? currentIndex - 1 : allItems.length - 1;
            openLightbox(newIndex);
        } else if (e.key === 'ArrowRight') {
            const newIndex = currentIndex < allItems.length - 1 ? currentIndex + 1 : 0;
            openLightbox(newIndex);
        }
    }
    
    document.addEventListener('keydown', handleKeydown);
    
    // Close lightbox when clicking the close button
    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the outside click handler
            closeLightbox();
        });
    }
    
    // Close lightbox when clicking outside the content
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target === lightboxImg || (e.target === lightboxVideo && !e.target.controls)) {
            closeLightbox();
        }
    });
}

/**
 * Initialize form submissions
 */
function initFormSubmissions() {
    // Contact form submission - removed as it's not used (combinedForm is used instead)
    // This function is kept for potential future use but currently does nothing
}

/**
 * Update header styling on scroll
 */
(function() {
    const header = document.getElementById('header');
    if (!header) return;
    
    // Cache initial styles to avoid layout thrashing
    const defaultPadding = '1rem 0';
    const scrolledPadding = '0.7rem 0';
    const defaultShadow = 'none';
    const scrolledShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    
    // Throttle scroll event for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (window.pageYOffset > 50) {
                    header.style.padding = scrolledPadding;
                    header.style.boxShadow = scrolledShadow;
                } else {
                    header.style.padding = defaultPadding;
                    header.style.boxShadow = defaultShadow;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

/**
 * Fix navigation scroll issues - EXCLUDE nav-link to avoid conflict with gallery.js
 */
document.addEventListener('DOMContentLoaded', function() {
    // Override navigation links but EXCLUDE .nav-link elements (handled by gallery.js)
    const navLinks = document.querySelectorAll('a[href^="#"]:not(.nav-link)');
    
    // Cache header height to avoid recalculation
    const headerHeight = 100;
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}); 