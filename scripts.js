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
        src: './Capricio Diabolico Slow Movement.Postojna Festival.mp4',
        type: 'video/mp4',
        poster: './Capricio Diabolico Slow Movement.Postojna Festival-poster.jpg',
        caption: { en: 'Capriccio Diabolico - Slow Movement (Postojna Festival)', de: 'Capriccio Diabolico - Langsamer Satz (Postojna Festival)' }
    },
    {
        id: 'homenaje',
        title: { en: 'Homenaje - Manuel de Falla', de: 'Homenaje - Manuel de Falla' },
        src: './Homenaje pour Le Tombeau de Claude Debussy by Manuel de Falla.Finale.Postojna Festival.mp4',
        type: 'video/mp4',
        poster: './Homenaje pour Le Tombeau de Claude Debussy by Manuel de Falla.Finale.Postojna Festival-poster.jpg',
        caption: { en: 'Homenaje - Manuel de Falla (Postojna Festival)', de: 'Homenaje - Manuel de Falla (Postojna Festival)' }
    },
    {
        id: 'rossiniana-finale',
        title: { en: 'Rossiniana Nr.1 op.119 - Finale', de: 'Rossiniana Nr.1 op.119 - Finale' },
        src: './Rossiniana Nr.1 op.119 .Finale . Postoja Guitar Festival 2025.mp4',
        type: 'video/mp4',
        poster: './Rossiniana Nr.1 op.119 .Finale . Postoja Guitar Festival 2025-poster.jpg',
        caption: { en: 'Rossiniana Nr.1 op.119 - Finale (Postojna Guitar Festival)', de: 'Rossiniana Nr.1 op.119 - Finale (Postojna Guitar Festival)' }
    },
    {
        id: 'hora',
        title: { en: 'Hora by Stephan Rak', de: 'Hora von Stephan Rak' },
        src: './Hora by Stephan Rak.Finale.Donnersbergiade 2025.mp4',
        type: 'video/mp4',
        poster: './Hora by Stephan Rak.Finale.Donnersbergiade 2025-poster.jpg',
        caption: { en: 'Hora by Stephan Rak (Donnersbergiade 2025)', de: 'Hora von Stephan Rak (Donnersbergiade 2025)' }
    }
];

// Helper function to get video by ID
function getVideoById(id) {
    return VIDEOS.find(v => v.id === id);
}

// Page Loader: Wait for ALL images to load (prioritizing hero background image)
(function initPageLoader() {
    'use strict';
    
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    
    let loaderShown = false;
    let loaderHidden = false;
    const MAX_WAIT_TIME = 12000; // 12 seconds timeout (increased for all images)
    
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
        
        // Remove is-loading and add is-loaded class to body
        document.body.classList.remove('is-loading');
        document.body.classList.add('is-loaded');
        
        // Remove loader from DOM after fade-out completes (250ms transition + 50ms buffer)
        setTimeout(() => {
            loader.remove();
        }, 300);
    }
    
    // Loader activation strategy - show immediately to ensure page is hidden
        showLoader();
    
    // Convert relative URL to absolute
    function toAbsoluteUrl(url) {
        if (url.startsWith('./')) {
            return new URL(url.substring(2), window.location.href).href;
        } else if (!url.startsWith('http') && !url.startsWith('//') && !url.startsWith('data:')) {
            return new URL(url, window.location.href).href;
        }
        return url;
    }
    
    // Get hero background image sources (PRIORITY)
    function getHeroBackgroundImages() {
        const heroImages = new Set();
        
        // 1. Check hero-critical img tag
        const heroCritical = document.getElementById('hero-critical');
        if (heroCritical) {
            if (heroCritical.src) heroImages.add(toAbsoluteUrl(heroCritical.src));
            // Check if it has error fallback
            if (heroCritical.onerror) {
                // Try to get the fallback JPG
                heroImages.add(toAbsoluteUrl('./hero-guitarist.JPG'));
            }
        }
        
        // 2. Check hero section computed background-image
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const computedStyle = window.getComputedStyle(heroSection);
            const bgImage = computedStyle.backgroundImage;
            if (bgImage && bgImage !== 'none') {
                // Extract all URLs from background-image (can have multiple)
                const urlMatches = bgImage.match(/url\(['"]?([^'")]+)['"]?\)/g);
                if (urlMatches) {
                    urlMatches.forEach(match => {
                        const urlMatch = match.match(/url\(['"]?([^'")]+)['"]?\)/);
                        if (urlMatch && urlMatch[1] && !urlMatch[1].includes('gradient')) {
                            heroImages.add(toAbsoluteUrl(urlMatch[1]));
                        }
                    });
                }
            }
        }
        
        // 3. Explicitly add known hero images (fallback)
        heroImages.add(toAbsoluteUrl('./hero-guitarist.webp'));
        heroImages.add(toAbsoluteUrl('./hero-guitarist.JPG'));
        heroImages.add(toAbsoluteUrl('./hero-guitarist-mobile.png'));
        
        // 4. Check hero img tag in picture element
        const heroImg = document.querySelector('.hero img, .hero-image img');
        if (heroImg) {
            if (heroImg.src) heroImages.add(toAbsoluteUrl(heroImg.src));
            if (heroImg.srcset) {
                const srcsetUrls = heroImg.srcset.split(',').map(s => s.trim().split(' ')[0]);
                srcsetUrls.forEach(url => heroImages.add(toAbsoluteUrl(url)));
            }
        }
        
        return Array.from(heroImages);
    }
    
    // Collect all other image sources from the page (non-hero)
    function collectAllImageSources() {
        const imageSources = new Set();
        const heroImages = getHeroBackgroundImages();
        const heroImageSet = new Set(heroImages);
        
        // 1. Collect all img tags (excluding hero images)
        const imgTags = document.querySelectorAll('img');
        imgTags.forEach(img => {
            if (img.id === 'hero-critical') return; // Skip hero-critical, already handled
            if (img.closest('.hero')) {
                // Hero images are already handled
                return;
            }
            if (img.src && !heroImageSet.has(toAbsoluteUrl(img.src))) {
                imageSources.add(toAbsoluteUrl(img.src));
            }
            // Also check srcset
            if (img.srcset) {
                const srcsetUrls = img.srcset.split(',').map(s => s.trim().split(' ')[0]);
                srcsetUrls.forEach(url => {
                    const absUrl = toAbsoluteUrl(url);
                    if (!heroImageSet.has(absUrl)) {
                        imageSources.add(absUrl);
                    }
                });
            }
        });
        
        // 2. Collect all background-image URLs from style attributes (excluding hero)
        const elementsWithBg = document.querySelectorAll('[style*="background-image"]');
        elementsWithBg.forEach(el => {
            // Skip hero section
            if (el.closest('.hero')) return;
            
            const style = el.getAttribute('style');
            if (style) {
                const matches = style.match(/url\(['"]?([^'")]+)['"]?\)/g);
                if (matches) {
                    matches.forEach(match => {
                        const urlMatch = match.match(/url\(['"]?([^'")]+)['"]?\)/);
                        if (urlMatch && urlMatch[1] && !urlMatch[1].includes('gradient')) {
                            const absUrl = toAbsoluteUrl(urlMatch[1]);
                            if (!heroImageSet.has(absUrl)) {
                                imageSources.add(absUrl);
                            }
                        }
                    });
                }
            }
        });
        
        // 3. Check gallery-image elements
        const galleryImages = document.querySelectorAll('.gallery-image');
        galleryImages.forEach(el => {
            const style = el.getAttribute('style');
            if (style) {
                const match = style.match(/url\(['"]?([^'")]+)['"]?\)/);
                if (match && match[1]) {
                    const absUrl = toAbsoluteUrl(match[1]);
                    if (!heroImageSet.has(absUrl)) {
                        imageSources.add(absUrl);
                    }
                }
            }
        });
        
        return Array.from(imageSources);
    }
    
    // Preload an image and return a promise
    function preloadImage(src, priority = false) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            if (priority) {
                // For priority images, set fetchpriority
                img.fetchPriority = 'high';
            }
            img.onload = () => resolve(src);
            img.onerror = () => {
                // For hero images, don't resolve on error - wait for fallback
                // For other images, resolve to not block
                if (priority) {
                    // Hero image error - try to continue anyway after a delay
                    setTimeout(() => resolve(src), 500);
    } else {
                    resolve(src);
                }
            };
            img.src = src;
            
            // If image is already cached, resolve immediately
            if (img.complete && img.naturalWidth > 0) {
                resolve(src);
            }
        });
    }
    
    // Wait for hero images FIRST, then all other images
    function waitForAllImages() {
        const heroImages = getHeroBackgroundImages();
        const otherImages = collectAllImageSources();
        
        console.log('Hero images to load:', heroImages.length);
        console.log('Other images to load:', otherImages.length);
        
        // Step 1: Load hero images FIRST (CRITICAL)
        const heroPromises = heroImages.map(src => preloadImage(src, true));
        
        Promise.all(heroPromises)
            .then(() => {
                // Step 2: After hero is loaded, load all other images
                if (otherImages.length === 0) {
                    waitForFontsAndHide();
                    return;
                }
                
                const otherPromises = otherImages.map(src => preloadImage(src, false));
                Promise.all(otherPromises)
                    .then(() => {
                        waitForFontsAndHide();
                    })
                    .catch(() => {
                        waitForFontsAndHide();
                    });
            })
            .catch(() => {
                // Even if hero fails, try to load other images
                if (otherImages.length === 0) {
            waitForFontsAndHide();
        } else {
                    const otherPromises = otherImages.map(src => preloadImage(src, false));
                    Promise.all(otherPromises)
                        .then(() => waitForFontsAndHide())
                        .catch(() => waitForFontsAndHide());
                }
            });
    }
    
    // Wait for fonts to be ready (if available), then hide loader
    function waitForFontsAndHide() {
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                // Small delay to ensure smooth transition
                setTimeout(hideLoader, 150);
            }).catch(() => {
                // If fonts.ready fails, hide anyway
                setTimeout(hideLoader, 150);
            });
        } else {
            // Fonts API not available, hide after small delay
            setTimeout(hideLoader, 150);
        }
    }
    
    // Timeout fallback: hide loader after max wait time
    setTimeout(() => {
        if (!loaderHidden) {
            hideLoader();
        }
    }, MAX_WAIT_TIME);
    
    // Start checking when DOM is ready
    function startLoadingCheck() {
        // Small delay to ensure all elements are in the DOM and styles are computed
        setTimeout(() => {
            waitForAllImages();
        }, 150);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startLoadingCheck);
    } else {
        startLoadingCheck();
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

// Move lightbox to document.body IMMEDIATELY to avoid stacking context issues
// This must happen before DOMContentLoaded to ensure it's not constrained by ancestors
(function moveLightboxToBodyImmediate() {
    'use strict';
    function moveLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.parentElement !== document.body) {
            // Preserve all attributes and children when moving
            document.body.appendChild(lightbox);
            console.log('Lightbox moved to document.body');
        }
    }
    
    // Try immediately if DOM is ready
    if (document.readyState === 'loading') {
        // If still loading, try on DOMContentLoaded
        document.addEventListener('DOMContentLoaded', moveLightbox);
    } else {
        // DOM already ready, move immediately
        moveLightbox();
    }
    
    // Also try after a short delay as fallback
    setTimeout(moveLightbox, 0);
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
    
    // Initialize Mobile Title Sheen Effect (scroll-triggered golden reflection)
    initMobileTitleSheen();
    
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
 * Initialize Title Sheen Effects
 * 1. Auto-animate sheen when titles first enter viewport (with delay after page load)
 * 2. On mobile: sheen follows scroll position continuously
 */
function initMobileTitleSheen() {
    console.log('=== SHEEN INIT STARTED ===');
    
    // Select all golden titles that should have the sheen effect
    const goldenTitles = document.querySelectorAll(
        '.hero h1, ' +
        '.hero-title, ' +
        '.hero-subtitle, ' +
        '.section-title, ' +
        'h2.section-title, ' +
        '.masterclass-info h3, ' +
        '.contact-info h3, ' +
        '.bio-text h3, ' +
        '.social-info h3, ' +
        '.main-quote h3, ' +
        '.video-title, ' +
        '.footer-logo, ' +
        '.logo a'
    );
    
    if (goldenTitles.length === 0) {
        console.log('SHEEN: No golden titles found!');
        return;
    }
    
    console.log('SHEEN: Found', goldenTitles.length, 'titles:', 
        Array.from(goldenTitles).map(t => t.textContent.substring(0, 20)));
    
    // Track which titles have had their entrance animation
    const animatedTitles = new Set();
    
    // Function to animate a single title with visible sheen
    function animateTitle(title, delay = 0) {
        if (animatedTitles.has(title)) return;
        animatedTitles.add(title);
        
        setTimeout(() => {
            // Force starting position with !important
            title.style.setProperty('background-position', '-100% 0', 'important');
            title.style.setProperty('transition', 'none', 'important');
            
            // Force reflow
            void title.offsetWidth;
            
            // Small delay to ensure starting position is rendered
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    // Now animate
                    title.style.setProperty('transition', 'background-position 1.5s ease-out', 'important');
                    title.style.setProperty('background-position', '100% 0', 'important');
                    
                    console.log('SHEEN ANIMATING:', title.textContent.substring(0, 25));
                    
                    // After animation, clear for scroll effect
                    setTimeout(() => {
                        title.style.removeProperty('transition');
                    }, 1600);
                });
            });
        }, delay);
    }
    
    // ========== PART 1: Auto-animate on first appearance ==========
    // Simple scroll-based check (more reliable than IntersectionObserver)
    function checkAndAnimateVisibleTitles() {
        const viewportHeight = window.innerHeight;
        
        goldenTitles.forEach((title) => {
            if (animatedTitles.has(title)) return;
            
            const rect = title.getBoundingClientRect();
            // Trigger when element is 80% into viewport from bottom
            const triggerPoint = viewportHeight * 0.9;
            
            if (rect.top < triggerPoint && rect.bottom > 0) {
                console.log('SHEEN: Animating on scroll:', title.textContent.substring(0, 25));
                animateTitle(title, 0);
            }
        });
    }
    
    const startEntranceAnimations = () => {
        console.log('SHEEN: Starting entrance animations...');
        
        // First check: animate titles already in viewport
        checkAndAnimateVisibleTitles();
        
        // Set up scroll listener for remaining titles
        let scrollTimeout;
        const onScroll = () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(checkAndAnimateVisibleTitles, 50);
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('touchmove', onScroll, { passive: true });
        
        console.log('SHEEN: Scroll listener active');
    };
    
    // Wait for page to be fully loaded and loader to be hidden
    const waitAndStart = () => {
        // Check if page loader is still visible
        const loader = document.getElementById('page-loader');
        if (loader && loader.offsetParent !== null) {
            // Loader still visible, wait more
            setTimeout(waitAndStart, 200);
            return;
        }
        
        // Start animations after a delay
        setTimeout(startEntranceAnimations, 500);
    };
    
    if (document.readyState === 'complete') {
        waitAndStart();
    } else {
        window.addEventListener('load', waitAndStart);
    }
    
    // ========== PART 2: Scroll-responsive sheen (mobile only) ==========
    const isTouchDevice = window.matchMedia('(hover: none)').matches || 
                          window.matchMedia('(pointer: coarse)').matches ||
                          'ontouchstart' in window ||
                          navigator.maxTouchPoints > 0;
    
    const isMobileWidth = window.innerWidth <= 768;
    
    if (!isTouchDevice && !isMobileWidth) {
        console.log('Desktop detected - scroll sheen disabled, using hover');
        return;
    }
    
    console.log('Mobile/Touch device detected - enabling scroll sheen');
    
    let ticking = false;
    
    function updateSheenPositions() {
        const viewportHeight = window.innerHeight;
        
        goldenTitles.forEach(title => {
            // Skip if entrance animation hasn't completed yet
            if (!animatedTitles.has(title)) return;
            
            const rect = title.getBoundingClientRect();
            
            // Check if element is in viewport
            if (rect.top < viewportHeight && rect.bottom > 0) {
                // Calculate position in viewport (0 = top, 1 = bottom)
                const visibleCenter = rect.top + rect.height / 2;
                const viewportProgress = visibleCenter / viewportHeight;
                
                // Map to background-position (-100% to 100%)
                const sheenPosition = Math.round(100 - (viewportProgress * 200));
                
                // Apply the sheen position
                title.style.backgroundPosition = `${sheenPosition}% 0`;
            }
        });
        
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateSheenPositions);
            ticking = true;
        }
    }
    
    // Delay scroll listener to let entrance animations complete first
    setTimeout(() => {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('touchmove', onScroll, { passive: true });
        console.log('Mobile scroll sheen activated');
    }, 1000);
}

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
 * Loads thumbnails when section is expanded
 */
function initVideoThumbnails() {
    const videoItems = document.querySelectorAll('.gallery-video');
    
    if (videoItems.length === 0) {
        console.log('initVideoThumbnails: No video items found');
        return;
    }
    
    // Function to load thumbnail for a video container
    const loadThumbnail = (videoContainer) => {
        const galleryItem = videoContainer.closest('.gallery-item');
        const videoId = galleryItem ? galleryItem.getAttribute('data-video-id') : null;
        const videoConfig = videoId ? getVideoById(videoId) : null;
        const thumbnail = videoContainer.querySelector('.video-thumbnail');
        const canvas = videoContainer.querySelector('.video-thumbnail-canvas');
        
        if (!thumbnail) {
            console.warn('loadThumbnail: No thumbnail element found', videoContainer);
            return;
        }
        
        // Check if poster image already exists and is loaded
        const existingPoster = thumbnail.querySelector('.video-poster-img');
        if (existingPoster && existingPoster.complete && existingPoster.naturalWidth > 0) {
            // Already loaded and working
            return;
        }
        
        // Remove any existing broken images FIRST to prevent broken icons
        if (existingPoster) {
            existingPoster.remove();
        }
        
        // Always use gradient background as fallback (will be replaced by poster or video frame)
        if (canvas) {
            canvas.style.background = 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,20,40,0.8))';
            canvas.style.display = 'block';
            // Ensure canvas is properly sized
            if (!canvas.width || !canvas.height) {
                canvas.width = canvas.offsetWidth || 400;
                canvas.height = canvas.offsetHeight || 250;
            }
        }
        
        // Try to load poster image first, if it exists
        const posterSrc = videoConfig ? videoConfig.poster : null;
        const videoSrc = videoConfig ? videoConfig.src : null;
        
        if (posterSrc) {
            console.log('loadThumbnail: Loading poster image for', videoId, posterSrc);
            
            // Create and load poster image
            const posterImg = document.createElement('img');
                posterImg.className = 'video-poster-img';
                posterImg.src = posterSrc;
            posterImg.alt = videoConfig ? (videoConfig.title.en || '') : '';
            posterImg.loading = 'eager';
                posterImg.decoding = 'async';
            posterImg.style.width = '100%';
            posterImg.style.height = '100%';
            posterImg.style.objectFit = 'cover';
            posterImg.style.position = 'absolute';
            posterImg.style.top = '0';
            posterImg.style.left = '0';
            posterImg.style.display = 'block';
            posterImg.style.zIndex = '1';
            
            // Show image on load
            posterImg.addEventListener('load', function() {
                console.log('loadThumbnail: Poster loaded successfully', videoId);
                this.style.display = 'block';
                if (canvas) canvas.style.display = 'none';
            }, { once: true });
            
            // On error, fall back to generating thumbnail from video
            posterImg.addEventListener('error', function() {
                console.warn('loadThumbnail: Poster failed to load, generating from video', videoId, posterSrc);
                this.remove();
                generateThumbnailFromVideo(videoSrc, canvas, videoId);
            }, { once: true });
            
                thumbnail.insertBefore(posterImg, canvas);
        } else if (videoSrc) {
            // No poster image, generate thumbnail from video
            console.log('loadThumbnail: No poster, generating thumbnail from video', videoId);
            generateThumbnailFromVideo(videoSrc, canvas, videoId);
        } else {
            console.warn('loadThumbnail: No poster or video source for', videoId);
        }
    };
    
    // Function to generate thumbnail from video by capturing a frame
    function generateThumbnailFromVideo(videoSrc, canvas, videoId) {
        if (!videoSrc || !canvas) return;
        
        const video = document.createElement('video');
        video.src = videoSrc;
        video.crossOrigin = 'anonymous';
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        
        // Create canvas context for drawing
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.warn('generateThumbnailFromVideo: Canvas context not available');
            return;
        }
        
        // Set canvas dimensions based on container size
        const containerWidth = canvas.offsetWidth || 400;
        const containerHeight = canvas.offsetHeight || 250;
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        
        // When video metadata is loaded, seek to a good frame (e.g., 1 second in)
        video.addEventListener('loadedmetadata', function() {
            video.currentTime = 1; // Seek to 1 second
            }, { once: true });
        
        // When video frame is ready, draw it to canvas maintaining aspect ratio
        video.addEventListener('seeked', function() {
            try {
                // Remove gradient background
                canvas.style.background = '';
                
                // Calculate aspect ratios
                const videoAspect = video.videoWidth / video.videoHeight;
                const canvasAspect = canvas.width / canvas.height;
                
                let drawWidth, drawHeight, drawX, drawY;
                
                // Maintain aspect ratio - use "contain" behavior (like CSS object-fit: contain)
                if (videoAspect > canvasAspect) {
                    // Video is wider - fit to width
                    drawWidth = canvas.width;
                    drawHeight = canvas.width / videoAspect;
                    drawX = 0;
                    drawY = (canvas.height - drawHeight) / 2;
                } else {
                    // Video is taller - fit to height
                    drawHeight = canvas.height;
                    drawWidth = canvas.height * videoAspect;
                    drawX = (canvas.width - drawWidth) / 2;
                    drawY = 0;
                }
                
                // Fill background with black (for letterboxing/pillarboxing)
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw video frame maintaining aspect ratio (no distortion)
                ctx.drawImage(video, drawX, drawY, drawWidth, drawHeight);
                
            canvas.style.display = 'block';
                console.log('generateThumbnailFromVideo: Thumbnail generated for', videoId);
            } catch (e) {
                console.warn('generateThumbnailFromVideo: Error drawing to canvas', e);
                // Keep gradient background if drawing fails
                canvas.style.background = 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,20,40,0.8))';
            }
            // Clean up video element
            video.src = '';
            video.load();
        }, { once: true });
        
        // On error, keep gradient background
        video.addEventListener('error', function() {
            console.warn('generateThumbnailFromVideo: Video failed to load', videoId, videoSrc);
            video.src = '';
            video.load();
        }, { once: true });
        
        // Start loading video
        video.load();
    };
    
    // Find all video sections (there might be multiple achievement-reveal sections)
    const allSections = document.querySelectorAll('#gallery .achievement-reveal');
    const videoSections = Array.from(allSections).filter(section => {
        // Check if this section contains video items
        return section.querySelector('.gallery-video') !== null;
    });
    
    // Watch for section expansion for each video section
    videoSections.forEach(videosSection => {
        const videosContent = videosSection.querySelector('.achievement-content');
        
        if (videosContent) {
            // Load thumbnails when section expands
            const sectionObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (videosContent.classList.contains('revealed')) {
                            console.log('initVideoThumbnails: Section expanded, loading thumbnails');
                            // Get video items within this section
                            const sectionVideoItems = videosContent.querySelectorAll('.gallery-video');
                            sectionVideoItems.forEach(loadThumbnail);
                        }
                    }
                });
            });
            
            sectionObserver.observe(videosContent, { 
                attributes: true, 
                attributeFilter: ['class'] 
            });
            
            // Also check if already expanded and load immediately
            if (videosContent.classList.contains('revealed')) {
                console.log('initVideoThumbnails: Section already expanded, loading thumbnails');
                const sectionVideoItems = videosContent.querySelectorAll('.gallery-video');
                sectionVideoItems.forEach(loadThumbnail);
            }
        }
    });
    
    // Also try to load all thumbnails initially (in case section is already visible)
    videoItems.forEach(loadThumbnail);
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
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Special handling for Videos link - expand videos section
            // Check if this is the Videos nav link (points to #gallery and has data-en="Videos")
            const isVideosLink = href === '#gallery' && (
                this.getAttribute('data-en') === 'Videos' || 
                this.textContent.trim().toLowerCase() === 'videos'
            );
            
            if (isVideosLink) {
                e.preventDefault();
                
                // Close mobile menu
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
                
                // Scroll to gallery section
                const gallerySection = document.getElementById('gallery');
                if (gallerySection) {
                    gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    // After scrolling, find and trigger the videos reveal button
                    setTimeout(() => {
                        // Find all achievement-reveal sections in gallery
                        const allReveals = document.querySelectorAll('#gallery .achievement-reveal');
                        
                        // Find the one that contains videos (has .gallery-video elements)
                        let videosReveal = null;
                        let videosContent = null;
                        allReveals.forEach(reveal => {
                            if (reveal.querySelector('.gallery-video')) {
                                videosReveal = reveal.querySelector('.reveal-trigger');
                                videosContent = videosReveal ? videosReveal.nextElementSibling : null;
                            }
                        });
                        
                        if (videosReveal && videosContent) {
                            // Check if already revealed
                            const wasAlreadyRevealed = videosContent.classList.contains('revealed');
                            
                            if (!wasAlreadyRevealed) {
                                // Trigger the reveal button click
                                videosReveal.click();
                            }
                            
                            // After expansion animation, scroll to the end of the video grid
                            setTimeout(() => {
                                // Find the video grid within the videos content
                                const videoGrid = videosContent.querySelector('.gallery-grid');
                                if (videoGrid) {
                                    // Scroll to the end of the video grid
                                    videoGrid.scrollIntoView({ behavior: 'smooth', block: 'end' });
                                } else {
                                    // Fallback: scroll to the videos content end
                                    videosContent.scrollIntoView({ behavior: 'smooth', block: 'end' });
                                }
                            }, wasAlreadyRevealed ? 100 : 900); // Wait for expansion animation if needed
                        }
                    }, 600); // Wait for initial scroll to complete
                }
            } else {
                // Normal behavior for other links
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
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
            if (videoConfig) {
                // Use sources array if available (for multiple format support)
                if (videoConfig.sources && videoConfig.sources.length > 0) {
                    console.log('getVideoSources: Found video sources from config', { videoId, sources: videoConfig.sources });
                    return videoConfig.sources;
                }
                // Fallback to single src
                if (videoConfig.src) {
                    console.log('getVideoSources: Found video from config', { videoId, src: videoConfig.src, type: videoConfig.type });
                    return [{
                        src: videoConfig.src,
                        type: videoConfig.type || 'video/mp4'
                    }];
                } else {
                    console.error('getVideoSources: Video config found but no src property', { videoId, videoConfig });
                }
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
        
        // Log video sources for debugging
        console.log('setLightboxVideo: Loading video with sources:', videoSources);
        
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
            
            // Determine proper MIME type based on file extension or provided type
            let mimeType = sourceData.type;
            const srcLower = sourceData.src.toLowerCase();
            
            // Auto-detect MIME type from file extension if not provided
            if (!mimeType) {
                if (srcLower.endsWith('.mp4')) {
                    mimeType = 'video/mp4';
                } else if (srcLower.endsWith('.mov')) {
                    mimeType = 'video/quicktime';
                } else if (srcLower.endsWith('.webm')) {
                    mimeType = 'video/webm';
                } else {
                    mimeType = 'video/mp4'; // Default to MP4 for best compatibility
                }
            }
            
            source.setAttribute('type', mimeType);
            lightboxVideo.appendChild(source);
            
            console.log('setLightboxVideo: Added source element', { 
                src: sourceData.src, 
                type: mimeType,
                element: source
            });
            hasValidSource = true;
        });
        
        if (!hasValidSource) {
            console.error('setLightboxVideo: No valid sources found', videoSources);
            if (lightboxVideoError) {
                lightboxVideoError.textContent = 'Keine gültige Video-Quelle gefunden.';
                lightboxVideoError.classList.remove('hidden');
            }
            return;
        }
        
        // iOS/Safari robustness and video support
        lightboxVideo.setAttribute('playsinline', '');
        lightboxVideo.setAttribute('controls', '');
        lightboxVideo.setAttribute('webkit-playsinline', ''); // iOS support
        lightboxVideo.setAttribute('x5-playsinline', ''); // Android support
        lightboxVideo.preload = 'auto'; // Preload for better playback
        
        // Ensure video is visible and has proper styling
        lightboxVideo.style.display = 'block';
        lightboxVideo.style.width = '100%';
        lightboxVideo.style.height = 'auto';
        lightboxVideo.style.maxWidth = '100%';
        lightboxVideo.style.maxHeight = '80vh';
        lightboxVideo.style.backgroundColor = '#000';
        
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
        
        // Add event listeners for debugging and better playback
        lightboxVideo.addEventListener('loadstart', () => {
            console.log('Video loadstart event');
        });
        
        lightboxVideo.addEventListener('loadedmetadata', () => {
            console.log('Video loadedmetadata - readyState:', lightboxVideo.readyState);
        });
        
        lightboxVideo.addEventListener('loadeddata', () => {
            console.log('Video loadeddata - readyState:', lightboxVideo.readyState);
        });
        
        lightboxVideo.addEventListener('canplay', () => {
            console.log('Video canplay - readyState:', lightboxVideo.readyState);
        });
        
        lightboxVideo.addEventListener('canplaythrough', () => {
            console.log('Video canplaythrough - readyState:', lightboxVideo.readyState);
        });
        
        // Load the video
        lightboxVideo.load();
        
        // Function to attempt playback
        const attemptPlayback = () => {
            if (lightboxVideo.readyState >= 2) { // HAVE_CURRENT_DATA or higher
                lightboxVideo.play().catch(playErr => {
                    console.log('Video play error:', playErr.name, playErr.message);
                    // Auto-play might be blocked by browser policy, that's okay
                    // User can click play manually - video should be visible now
                });
            }
        };
        
        // Try to play when video can start playing
        lightboxVideo.addEventListener('canplay', () => {
            console.log('Video canplay - attempting playback');
            attemptPlayback();
        }, { once: true });
        
        // Also try when enough metadata is loaded (faster fallback)
        lightboxVideo.addEventListener('loadedmetadata', () => {
            console.log('Video loadedmetadata - readyState:', lightboxVideo.readyState);
            if (lightboxVideo.readyState >= 2) {
                attemptPlayback();
            }
        }, { once: true });
        
        // Fallback: try after a short delay (in case events don't fire)
        setTimeout(() => {
            if (lightboxVideo.readyState >= 1) { // HAVE_METADATA or higher
                attemptPlayback();
            }
        }, 500);
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
        // Lock body scroll and prevent touch scrolling
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        
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
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        
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
                // Lock body scroll and prevent touch scrolling
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
                document.body.style.height = '100%';
                
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
                // Lock body scroll and prevent touch scrolling
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
                document.body.style.height = '100%';
                
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