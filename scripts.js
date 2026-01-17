/**
 * Classical Guitarist Portfolio Website
 * Main JavaScript File
 * Spanish Classical Guitar Theme
 */

// ============================================================================
// CENTRAL VIDEO CONFIGURATION - Single Source of Truth
// ============================================================================
const VIDEOS = [
    {
        id: 'capriccio-diabolico',
        title: { en: 'Capriccio Diabolico - Slow Movement', de: 'Capriccio Diabolico - Langsamer Satz' },
        src: './Capricio Diabolico Slow Movement.Postojna Festival.mov',
        type: 'video/quicktime',
        poster: './Capricio Diabolico Slow Movement.Postojna Festival-poster.jpg',
        caption: { en: 'Capriccio Diabolico - Slow Movement (Postojna Festival)', de: 'Capriccio Diabolico - Langsamer Satz (Postojna Festival)' }
    },
    {
        id: 'homenaje',
        title: { en: 'Homenaje - Manuel de Falla', de: 'Homenaje - Manuel de Falla' },
        src: './Homenaje pour Le Tombeau de Claude Debussy by Manuel de Falla.Finale.Postojna Festival.mov',
        type: 'video/quicktime',
        poster: './Homenaje pour Le Tombeau de Claude Debussy by Manuel de Falla.Finale.Postojna Festival-poster.jpg',
        caption: { en: 'Homenaje - Manuel de Falla (Postojna Festival)', de: 'Homenaje - Manuel de Falla (Postojna Festival)' }
    },
    {
        id: 'rossiniana-finale',
        title: { en: 'Rossiniana Nr.1 op.119 - Finale', de: 'Rossiniana Nr.1 op.119 - Finale' },
        src: './Rossiniana Nr.1 op.119 .Finale . Postoja Guitar Festival 2025.mov',
        type: 'video/quicktime',
        poster: './Rossiniana Nr.1 op.119 .Finale . Postoja Guitar Festival 2025-poster.jpg',
        caption: { en: 'Rossiniana Nr.1 op.119 - Finale (Postojna Guitar Festival)', de: 'Rossiniana Nr.1 op.119 - Finale (Postojna Guitar Festival)' }
    },
    {
        id: 'hora',
        title: { en: 'Hora by Stephan Rak', de: 'Hora von Stephan Rak' },
        src: './Hora by Stephan Rak.Finale.Donnersbergiade 2025.mov',
        type: 'video/quicktime',
        poster: './Hora by Stephan Rak.Finale.Donnersbergiade 2025-poster.jpg',
        caption: { en: 'Hora by Stephan Rak (Donnersbergiade 2025)', de: 'Hora von Stephan Rak (Donnersbergiade 2025)' }
    }
];

// Helper function to get video by ID
function getVideoById(id) {
    return VIDEOS.find(v => v.id === id);
}

// Page Loader: Wait for critical hero asset to load (Desktop + Mobile)
(function initPageLoader() {
    'use strict';
    
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    
    const heroImage = document.getElementById('hero-critical');
    if (!heroImage) {
        // Fallback: if hero image not found, hide loader after timeout
        setTimeout(() => {
            hideLoader();
        }, 2000);
        return;
    }
    
    let loaderShown = false;
    let ready = false;
    let loaderHidden = false;
    const MAX_WAIT_TIME = 6000; // 6 seconds timeout
    
    // Check connection speed
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isProbablySlow = !!conn && (
        conn.saveData || 
        ["slow-2g", "2g", "3g"].includes(conn.effectiveType) || 
        (typeof conn.downlink === "number" && conn.downlink < 1.5)
    );
    
    function showLoader() {
        if (loaderShown) return;
        loaderShown = true;
        document.body.classList.add('is-loading');
    }
    
    function hideLoader() {
        if (loaderHidden) return;
        loaderHidden = true;
        ready = true;
        
        // Remove is-loading and add is-loaded class to body
        document.body.classList.remove('is-loading');
        document.body.classList.add('is-loaded');
        
        // Remove loader from DOM after fade-out completes (250ms transition + 50ms buffer)
        setTimeout(() => {
            loader.remove();
        }, 300);
    }
    
    // Loader activation strategy
    if (isProbablySlow) {
        // Slow connection: show loader immediately
        showLoader();
    } else {
        // Fast connection: show loader after 200ms if not ready (to avoid flicker)
        setTimeout(() => {
            if (!ready) {
                showLoader();
            }
        }, 200);
    }
    
    // Check if image is already loaded
    function checkImageReady() {
        if (heroImage.complete && heroImage.naturalWidth > 0) {
            // Image is loaded, wait for fonts if available
            waitForFontsAndHide();
        } else {
            // Wait for image to load
            heroImage.addEventListener('load', waitForFontsAndHide, { once: true });
            heroImage.addEventListener('error', hideLoader, { once: true });
        }
    }
    
    // Wait for fonts to be ready (if available), then hide loader
    function waitForFontsAndHide() {
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                // Small delay to ensure smooth transition
                setTimeout(hideLoader, 100);
            }).catch(() => {
                // If fonts.ready fails, hide anyway
                setTimeout(hideLoader, 100);
            });
        } else {
            // Fonts API not available, hide after small delay
            setTimeout(hideLoader, 100);
        }
    }
    
    // Timeout fallback: hide loader after max wait time
    setTimeout(() => {
        if (!loaderHidden) {
            hideLoader();
        }
    }, MAX_WAIT_TIME);
    
    // Start checking when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkImageReady);
    } else {
        checkImageReady();
    }
})();

// Set header height CSS variable for hero padding
(function setHeaderHeight() {
    'use strict';
    
    function updateHeaderHeight() {
        const header = document.getElementById('header');
        if (header) {
            const height = header.offsetHeight;
            document.documentElement.style.setProperty('--header-height', height + 'px');
        }
    }
    
    // Update on load and resize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateHeaderHeight);
    } else {
        updateHeaderHeight();
    }
    
    window.addEventListener('resize', updateHeaderHeight);
})();

// CTA Button: Scroll to Rossiniana video and open in lightbox
(function initRossinianaCTA() {
    'use strict';
    
    function handleCTAClick(e) {
        e.preventDefault();
        
        // Find the gallery item
        const target = document.getElementById('rossiniana-finale');
        if (!target) {
            // Fallback: scroll to videos section
            const videosSection = document.getElementById('gallery');
            if (videosSection) {
                videosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }
        
        // Smooth scroll to video first
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // After scroll, open the video in lightbox using ID
        setTimeout(() => {
            if (typeof window.openVideoById === 'function') {
                window.openVideoById('rossiniana-finale');
            } else {
                // Fallback: trigger click on the gallery item
                target.click();
            }
        }, 600); // Wait for scroll to complete
    }
    
    // Attach click handler when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            const ctaButton = document.querySelector('.btn-cta-video');
            if (ctaButton) {
                ctaButton.addEventListener('click', handleCTAClick);
            }
        });
    } else {
        const ctaButton = document.querySelector('.btn-cta-video');
        if (ctaButton) {
            ctaButton.addEventListener('click', handleCTAClick);
        }
    }
})();

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
    
    // Handle URL parameter for auto-playing videos (e.g., ?play=rossiniana-finale)
    (function handleVideoPlayParam() {
        const urlParams = new URLSearchParams(window.location.search);
        const playVideoId = urlParams.get('play');
        
        if (playVideoId) {
            // Wait a bit for lightbox to initialize
            setTimeout(() => {
                if (typeof window.openVideoById === 'function') {
                    // Find the gallery item
                    const galleryItem = document.querySelector(`[data-video-id="${playVideoId}"]`);
                    if (galleryItem) {
                        // Scroll to video section first
                        const gallerySection = document.getElementById('gallery');
                        if (gallerySection) {
                            gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                        
                        // Wait for scroll, then open video
                        setTimeout(() => {
                            window.openVideoById(playVideoId);
                        }, 800);
                    }
                }
            }, 500);
        }
    })();

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
    
    // Initialize video thumbnails
    initVideoThumbnails();

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
 * Optimized: Uses requestAnimationFrame and only updates when in viewport
 */
function initGuitarPatternAnimation() {
    // Add subtle movement to quote section on scroll
    const quoteSection = document.querySelector('.quote-section');
    if (!quoteSection) return;
    
    // Cache computed styles to avoid layout thrashing
    let lastOffsetY = 0;
    let isInViewport = false;
    
    // Throttle scroll event for better performance
    let ticking = false;
    const updateAnimation = function() {
        if (isInViewport) {
            const scrollPosition = window.scrollY;
            const offsetY = (scrollPosition * 0.05) % 50;
            // Only update if changed (reduce repaints)
            if (Math.abs(offsetY - lastOffsetY) > 1) {
                quoteSection.style.backgroundPosition = `${offsetY}px ${offsetY}px`;
                lastOffsetY = offsetY;
            }
        }
        ticking = false;
    };
    
    // Use IntersectionObserver to only animate when visible
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isInViewport = entry.isIntersecting;
            });
        }, { threshold: 0 });
        observer.observe(quoteSection);
    } else {
        // Fallback
        isInViewport = true;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateAnimation);
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
 * Optimized: Only loads images when section is expanded AND in viewport
 */
function initLazyLoadGalleryImages() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    if (galleryImages.length === 0) return;
    
    // Check if parent section is expanded
    const checkSectionExpanded = (image) => {
        const gallerySection = image.closest('.achievement-content');
        return gallerySection && gallerySection.classList.contains('revealed');
    };
    
    if (!('IntersectionObserver' in window)) {
        // Fallback: load all images immediately when section is expanded
        galleryImages.forEach(img => {
            if (checkSectionExpanded(img)) {
                const bgImage = img.getAttribute('style');
                if (bgImage && bgImage.includes('background-image')) {
                    const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                    if (match && match[1]) {
                        const link = document.createElement('link');
                        link.rel = 'prefetch';
                        link.as = 'image';
                        link.href = match[1];
                        document.head.appendChild(link);
                    }
                }
            }
        });
        return;
    }
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && checkSectionExpanded(entry.target)) {
                const galleryImage = entry.target;
                const bgImage = galleryImage.getAttribute('style');
                
                // If image hasn't been loaded yet, load it
                if (bgImage && bgImage.includes('background-image') && !galleryImage.dataset.loaded) {
                    const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                    if (match && match[1]) {
                        // Try WebP first, fallback to original
                        const originalSrc = match[1];
                        const webpSrc = originalSrc.replace(/\.(jpg|jpeg|JPG|JPEG)$/i, '.webp');
                        
                        // Preload WebP version if available, fallback to original
                        const link = document.createElement('link');
                        link.rel = 'prefetch';
                        link.as = 'image';
                        link.href = webpSrc;
                        link.onerror = function() {
                            // If WebP fails, load original
                            const fallbackLink = document.createElement('link');
                            fallbackLink.rel = 'prefetch';
                            fallbackLink.as = 'image';
                            fallbackLink.href = originalSrc;
                            document.head.appendChild(fallbackLink);
                        };
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
        rootMargin: '100px' // Start loading 100px before image enters viewport
    });
    
    galleryImages.forEach(img => {
        // Only observe if section might be expanded
        imageObserver.observe(img);
    });
    
    // Watch for section expansion to trigger loading
    const sections = document.querySelectorAll('.achievement-reveal');
    sections.forEach(section => {
        const content = section.querySelector('.achievement-content');
        if (content) {
            const sectionObserver = new MutationObserver(() => {
                if (content.classList.contains('revealed')) {
                    // Check which images are now in viewport
                    galleryImages.forEach(img => {
                        if (img.closest('.achievement-content') === content) {
                            const rect = img.getBoundingClientRect();
                            const isInViewport = rect.top < window.innerHeight + 100 && rect.bottom > -100;
                            if (isInViewport && !img.dataset.loaded) {
                                // Trigger intersection check
                                imageObserver.unobserve(img);
                                imageObserver.observe(img);
                            }
                        }
                    });
                }
            });
            sectionObserver.observe(content, { attributes: true, attributeFilter: ['class'] });
        }
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
 * Initialize video thumbnails - use poster images instead of canvas generation
 * This is much faster and doesn't require loading video metadata
 */
function initVideoThumbnails() {
    const videoItems = document.querySelectorAll('.gallery-video');
    
    videoItems.forEach(videoContainer => {
        const galleryItem = videoContainer.closest('.gallery-item');
        const videoId = galleryItem ? galleryItem.getAttribute('data-video-id') : null;
        const videoConfig = videoId ? getVideoById(videoId) : null;
        const thumbnail = videoContainer.querySelector('.video-thumbnail');
        const canvas = videoContainer.querySelector('.video-thumbnail-canvas');
        
        if (!thumbnail) return;
        
        // Remove any existing broken images FIRST to prevent broken icons
        const existingImgs = thumbnail.querySelectorAll('img');
        existingImgs.forEach(img => img.remove());
        
        // Always use gradient background - poster images don't exist
        // This prevents broken image icons
        if (canvas) {
            canvas.style.background = 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,20,40,0.8))';
            canvas.style.display = 'block';
        }
        
        // Optional: Try to load poster if it exists (but don't show broken icon if it fails)
        const posterSrc = videoConfig ? videoConfig.poster : null;
        if (posterSrc && canvas) {
            // Try to load poster image silently (hidden until loaded)
            const posterImg = document.createElement('img');
            posterImg.className = 'video-poster-img';
            posterImg.src = posterSrc;
            posterImg.alt = videoConfig ? (videoConfig.title.en || '') : '';
            posterImg.loading = 'lazy';
            posterImg.decoding = 'async';
            posterImg.style.width = '100%';
            posterImg.style.height = '100%';
            posterImg.style.objectFit = 'cover';
            posterImg.style.display = 'none'; // Hidden by default
            
            // Show image on load, keep hidden on error (no broken icon)
            posterImg.addEventListener('load', function() {
                this.style.display = 'block';
                if (canvas) canvas.style.display = 'none';
            }, { once: true });
            
            // On error, keep hidden (no broken icon visible)
            posterImg.addEventListener('error', function() {
                // Keep hidden, gradient background remains visible
                this.style.display = 'none';
            }, { once: true });
            
            thumbnail.insertBefore(posterImg, canvas);
        }
    });
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
    
    // Function to get video sources from gallery item
    // PRIMARY: Use data-video-id to get from central VIDEOS config
    function getVideoSources(item) {
        // First priority: use data-video-id to get from central config
        const videoId = item.getAttribute('data-video-id');
        if (videoId) {
            const videoConfig = getVideoById(videoId);
            if (videoConfig && videoConfig.src) {
                console.log('getVideoSources: Found video from config', { videoId, src: videoConfig.src });
                return [{
                    src: videoConfig.src,
                    type: videoConfig.type || 'video/quicktime'
                }];
            } else {
                console.error('getVideoSources: Video config not found for ID', videoId);
            }
        }
        
        // Fallback: check for <video> element with sources (legacy support)
        const video = item.querySelector('.gallery-video video');
        if (video) {
            // Check if video has <source> elements (already loaded)
            const sources = video.querySelectorAll('source');
            if (sources.length > 0) {
                const sourceData = [];
                sources.forEach(source => {
                    const src = source.getAttribute('src');
                    if (src) {
                        sourceData.push({
                            src: src,
                            type: source.getAttribute('type') || 'video/mp4'
                        });
                    }
                });
                if (sourceData.length > 0) return sourceData;
            }
            
            // Fallback: use data-src attribute (lazy-loaded videos)
            const dataSrc = video.getAttribute('data-src');
            if (dataSrc) {
                // Determine type from file extension
                let type = 'video/mp4';
                if (dataSrc.toLowerCase().endsWith('.mov')) {
                    type = 'video/quicktime';
                } else if (dataSrc.toLowerCase().endsWith('.webm')) {
                    type = 'video/webm';
                }
                
                return [{
                    src: dataSrc,
                    type: type
                }];
            }
        }
        
        console.error('getVideoSources: No video sources found for item', item);
        return null;
    }
    
    // Robust function to set video in lightbox (called after modal is visible)
    function setLightboxVideo(videoSources) {
        const lightboxVideoError = document.getElementById('lightbox-video-error');
        
        if (!lightboxVideo || !videoSources || videoSources.length === 0) {
            console.error('setLightboxVideo: Invalid parameters', { lightboxVideo, videoSources });
            if (lightboxVideoError) {
                lightboxVideoError.textContent = 'Video-Quelle nicht gefunden.';
                lightboxVideoError.classList.remove('hidden');
            }
            return;
        }
        
        // Hide error message initially
        if (lightboxVideoError) {
            lightboxVideoError.classList.add('hidden');
        }
        
        // Reset video completely
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
        lightboxVideo.removeAttribute('src');
        
        // Clear all existing sources
        const existingSources = lightboxVideo.querySelectorAll('source');
        existingSources.forEach(source => source.remove());
        
        // Validate and add sources
        let hasValidSource = false;
        videoSources.forEach(sourceData => {
            if (!sourceData.src || sourceData.src.trim() === '') {
                console.warn('setLightboxVideo: Empty source URL skipped', sourceData);
                return;
            }
            
            const source = document.createElement('source');
            // Ensure URLs with spaces are properly handled (browser will encode automatically)
            // Use the src as-is since relative paths work fine
            source.setAttribute('src', sourceData.src);
            source.setAttribute('type', sourceData.type || 'video/quicktime');
            lightboxVideo.appendChild(source);
            
            console.log('setLightboxVideo: Added source element', { 
                src: sourceData.src, 
                type: sourceData.type,
                element: source
            });
            hasValidSource = true;
            
            console.log('setLightboxVideo: Added source', { src: sourceData.src, type: sourceData.type });
        });
        
        if (!hasValidSource) {
            console.error('setLightboxVideo: No valid sources found', videoSources);
            if (lightboxVideoError) {
                lightboxVideoError.textContent = 'Keine gültige Video-Quelle gefunden.';
                lightboxVideoError.classList.remove('hidden');
            }
            return;
        }
        
        // iOS/Safari robustness
        lightboxVideo.setAttribute('playsinline', '');
        lightboxVideo.setAttribute('controls', '');
        lightboxVideo.preload = 'metadata';
        
        // Error handling - set up BEFORE load()
        const handleError = () => {
            const error = lightboxVideo.error;
            if (error) {
                let errorMsg = 'Video kann im Browser nicht abgespielt werden.';
                switch (error.code) {
                    case error.MEDIA_ERR_ABORTED:
                        errorMsg = 'Video-Laden wurde abgebrochen.';
                        break;
                    case error.MEDIA_ERR_NETWORK:
                        errorMsg = 'Netzwerkfehler beim Laden des Videos.';
                        break;
                    case error.MEDIA_ERR_DECODE:
                        errorMsg = 'Video-Dekodierungsfehler.';
                        break;
                    case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        errorMsg = 'Video-Format wird nicht unterstützt oder Datei nicht gefunden.';
                        break;
                }
                console.error('Video error:', errorMsg, error, {
                    networkState: lightboxVideo.networkState,
                    readyState: lightboxVideo.readyState,
                    src: Array.from(lightboxVideo.querySelectorAll('source')).map(s => s.src)
                });
                
                // Show visible error message
                if (lightboxVideoError) {
                    lightboxVideoError.textContent = errorMsg;
                    lightboxVideoError.classList.remove('hidden');
                }
            }
        };
        lightboxVideo.addEventListener('error', handleError, { once: true });
        
        // Load the video
        lightboxVideo.load();
        
        // CRITICAL: Call play() directly from click handler (user gesture allows it)
        // This is the key fix - play immediately after load() when called from user click
        lightboxVideo.play().catch(err => {
            // If immediate play fails, try when enough data is loaded
            console.log('Immediate play failed, will retry on canplay:', err.name, err.message);
            
            const playLightboxVideo = () => {
                if (lightboxVideo.paused && lightboxVideo.readyState >= 2) {
                    lightboxVideo.play().catch(playErr => {
                        // Auto-play might be blocked by browser policy, that's okay
                        // User can click play manually
                        console.log('Video autoplay prevented (user interaction required):', playErr.name, playErr.message);
                    });
                }
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
        });
    }
    
    // Legacy function for compatibility - redirects to setLightboxVideo
    function openVideoById(videoId) {
        const video = getVideoById(videoId);
        if (!video) {
            console.error('openVideoById: Video not found', videoId);
            return;
        }
        
        const lightbox = document.getElementById('lightbox');
        const lightboxVideoContainer = document.getElementById('lightbox-video-container');
        const lightboxVideo = document.getElementById('lightbox-video');
        const lightboxVideoError = document.getElementById('lightbox-video-error');
        const lightboxCaption = document.getElementById('lightbox-caption');
        
        if (!lightbox || !lightboxVideo) {
            console.error('openVideoById: Lightbox elements not found');
            return;
        }
        
        // Get caption based on current language
        const currentLang = localStorage.getItem('language') || 'en';
        const videoCaption = currentLang === 'de' 
            ? (video.caption.de || video.caption.en || '')
            : (video.caption.en || '');
        if (lightboxCaption) {
            lightboxCaption.textContent = videoCaption;
        }
        
        // Show modal FIRST (important for play timing)
        lightbox.style.display = 'block';
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Hide image, show video container
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightboxImg) {
            lightboxImg.style.display = 'none';
        }
        if (lightboxVideoContainer) {
            lightboxVideoContainer.style.display = 'block';
        }
        
        // Hide error message
        if (lightboxVideoError) {
            lightboxVideoError.classList.add('hidden');
        }
        
        // Hide back-to-top button when lightbox opens
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            backToTop.classList.remove('visible');
        }
        
        // Reset video completely
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
        lightboxVideo.removeAttribute('src');
        lightboxVideo.innerHTML = '';
        
        // Validate source
        if (!video.src || video.src.trim() === '') {
            console.error('openVideoById: Empty source URL', video);
            if (lightboxVideoError) {
                lightboxVideoError.textContent = 'Video-Quelle nicht gefunden.';
                lightboxVideoError.classList.remove('hidden');
            }
            return;
        }
        
        // Use source directly (relative paths work fine from root)
        // Create and add source element
        const source = document.createElement('source');
        source.setAttribute('src', video.src);
        source.setAttribute('type', video.type || 'video/quicktime');
        lightboxVideo.appendChild(source);
        
        console.log('openVideoById: Added source', { 
            id: videoId,
            src: video.src, 
            type: video.type
        });
        
        // iOS/Safari robustness
        lightboxVideo.setAttribute('playsinline', '');
        lightboxVideo.setAttribute('controls', '');
        lightboxVideo.preload = 'metadata';
        
        // Load the video
        lightboxVideo.load();
        
        // Error handling with visible error message
        const handleError = () => {
            const error = lightboxVideo.error;
            if (error) {
                let errorMsg = 'Video kann im Browser nicht abgespielt werden (Format/Codec).';
                switch (error.code) {
                    case error.MEDIA_ERR_ABORTED:
                        errorMsg = 'Video-Laden wurde abgebrochen.';
                        break;
                    case error.MEDIA_ERR_NETWORK:
                        errorMsg = 'Netzwerkfehler beim Laden des Videos.';
                        break;
                    case error.MEDIA_ERR_DECODE:
                        errorMsg = 'Video-Dekodierungsfehler.';
                        break;
                    case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        errorMsg = 'Video-Format wird nicht unterstützt oder Datei nicht gefunden.';
                        break;
                }
                console.error('Video error:', errorMsg, error, {
                    networkState: lightboxVideo.networkState,
                    readyState: lightboxVideo.readyState,
                    src: video.src,
                    videoId: videoId
                });
                
                // Show error message to user
                if (lightboxVideoError) {
                    lightboxVideoError.textContent = errorMsg;
                    lightboxVideoError.classList.remove('hidden');
                }
            }
        };
        lightboxVideo.addEventListener('error', handleError, { once: true });
        
        // Auto-play the video (user gesture allows it - called from click handler)
        lightboxVideo.play().catch(err => {
            // Auto-play might be blocked by browser policy, that's okay
            // User can click play manually
            console.log('Video autoplay prevented (user interaction required):', err.name, err.message);
            if (lightboxVideoError && err.name !== 'NotAllowedError') {
                lightboxVideoError.textContent = 'Video kann nicht abgespielt werden. Bitte manuell starten.';
                lightboxVideoError.classList.remove('hidden');
            }
        });
    }
    
    
    // Make functions available globally
    window.openVideoById = openVideoById;
    
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
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        
        // Stop and reset lightbox video
        const lightboxVideo = document.getElementById('lightbox-video');
        const lightboxVideoError = document.getElementById('lightbox-video-error');
        if (lightboxVideo) {
            lightboxVideo.pause();
            lightboxVideo.currentTime = 0;
            // Clear sources to free memory
            lightboxVideo.innerHTML = '';
            lightboxVideo.removeAttribute('src');
        }
        if (lightboxVideoError) {
            lightboxVideoError.classList.add('hidden');
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
        // Make openLightbox available globally for CTA button
        window.openLightbox = openLightbox;
        
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
            // Handle video - robust pattern: modal first, then set video
            const videoSources = getVideoSources(item);
            if (videoSources && videoSources.length > 0 && lightboxVideo) {
                // Pause ALL gallery videos (including the one being opened)
                pauseAllGalleryVideos();
                
                // Set caption first
                lightboxCaption.textContent = caption;
                
                // Show lightbox FIRST (important for play timing)
                lightbox.style.display = 'block';
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                
                // Hide image, show video container
                const lightboxVideoContainer = document.getElementById('lightbox-video-container');
                lightboxImg.style.display = 'none';
                if (lightboxVideoContainer) {
                    lightboxVideoContainer.style.display = 'block';
                } else {
                    lightboxVideo.style.display = 'block';
                }
                
                // Hide back-to-top button when lightbox opens
                const backToTop = document.getElementById('back-to-top');
                if (backToTop) {
                    backToTop.classList.remove('visible');
                }
                
                // Now set up the video (after modal is visible)
                setLightboxVideo(videoSources);
            } else {
                console.error('Video sources not found for item:', item, 'videoSources:', videoSources);
            }
        } else {
            // Handle image
            const imgSrc = getImageSrc(item);
            if (imgSrc) {
                // Hide video container, show image
                const lightboxVideoContainer = document.getElementById('lightbox-video-container');
                const lightboxVideo = document.getElementById('lightbox-video');
                if (lightboxVideoContainer) {
                    lightboxVideoContainer.style.display = 'none';
                }
                if (lightboxVideo) {
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
