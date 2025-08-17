/**
 * Anime.js Musical Animations
 * Classical Guitarist Portfolio Website
 * 
 * Animates elements with .animate-on-scroll class when they enter the viewport
 * Uses musical phrasing and dynamics like a classical guitar performance
 * - Gentle entries with flowing motion
 * - Staggered buildups like musical phrases
 * - Elegant releases with subtle pulse effects
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Initialize anime.js musical animations
    initMusicalAnimations();
});

/**
 * Initialize anime.js musical animations using IntersectionObserver
 */
function initMusicalAnimations() {
    // Check if anime.js is loaded
    if (typeof anime === 'undefined') {
        console.warn('Anime.js not loaded. Animations will be disabled.');
        return;
    }

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver not supported. Animations will be disabled.');
        return;
    }

    // Get all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length === 0) {
        return;
    }

    // Set initial state for all animated elements
    animatedElements.forEach(element => {
        // Set initial state (hidden) with musical positioning
        element.style.opacity = '0';
        element.style.transform = 'translateY(60px) scale(0.95)';
        element.style.transition = 'none';
    });

    // Create IntersectionObserver with musical timing
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate the element when it comes into view with musical phrasing
                animateElementMusically(entry.target);
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of element is visible for earlier musical entry
        rootMargin: '0px 0px -80px 0px' // Start animation before element is fully visible
    });

    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Animate a single element using musical phrasing and dynamics
 * @param {HTMLElement} element - The element to animate
 */
function animateElementMusically(element) {
    // Determine animation type based on element class or tag
    const elementType = getElementType(element);
    
    switch (elementType) {
        case 'title':
            animateTitleMusically(element);
            break;
        case 'text':
            animateTextMusically(element);
            break;
        case 'image':
            animateImageMusically(element);
            break;
        case 'button':
            animateButtonMusically(element);
            break;
        case 'gallery':
            animateGalleryItemMusically(element);
            break;
        case 'technique':
            animateTechniqueItemMusically(element);
            break;
        case 'quote':
            animateQuoteMusically(element);
            break;
        case 'hero':
            animateHeroMusically(element);
            break;
        default:
            animateDefaultMusically(element);
    }
}

/**
 * Determine the type of element for appropriate musical animation
 * @param {HTMLElement} element - The element to check
 * @returns {string} - The element type
 */
function getElementType(element) {
    const tagName = element.tagName.toLowerCase();
    const className = element.className;
    
    if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
        return 'title';
    }
    
    if (tagName === 'p' || className.includes('text') || className.includes('bio-text')) {
        return 'text';
    }
    
    if (tagName === 'img' || className.includes('image')) {
        return 'image';
    }
    
    if (tagName === 'a' && className.includes('btn')) {
        return 'button';
    }
    
    if (className.includes('gallery-item')) {
        return 'gallery';
    }
    
    if (className.includes('technique-item')) {
        return 'technique';
    }
    
    if (className.includes('quote') || tagName === 'blockquote') {
        return 'quote';
    }
    
    if (className.includes('hero')) {
        return 'hero';
    }
    
    return 'default';
}

/**
 * Animate title elements with musical grandeur
 * @param {HTMLElement} element - The title element
 */
function animateTitleMusically(element) {
    // Create a musical timeline for title animation
    const timeline = anime.timeline({
        easing: 'easeOutElastic(1, 0.6)',
        duration: 1400
    });

    timeline
        .add({
            targets: element,
            opacity: [0, 1],
            translateY: [80, 0],
            scale: [0.85, 1],
            duration: 1200
        })
        .add({
            targets: element,
            scale: [1, 1.02, 1],
            duration: 600,
            easing: 'easeInOutSine'
        }, '-=800'); // Overlap for musical phrasing
}

/**
 * Animate text elements with flowing motion
 * @param {HTMLElement} element - The text element
 */
function animateTextMusically(element) {
    anime({
        targets: element,
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.98, 1],
        duration: 1000,
        easing: 'easeInOutSine',
        delay: anime.stagger(200, { from: 'start' })
    });
}

/**
 * Animate image elements with graceful entrance
 * @param {HTMLElement} element - The image element
 */
function animateImageMusically(element) {
    const timeline = anime.timeline({
        easing: 'easeOutElastic(1, 0.5)',
        duration: 1200
    });

    timeline
        .add({
            targets: element,
            opacity: [0, 1],
            scale: [0.7, 1],
            translateY: [50, 0],
            duration: 1000
        })
        .add({
            targets: element,
            scale: [1, 1.03, 1],
            duration: 800,
            easing: 'easeInOutSine'
        }, '-=600');
}

/**
 * Animate button elements with musical pulse
 * @param {HTMLElement} element - The button element
 */
function animateButtonMusically(element) {
    const timeline = anime.timeline({
        easing: 'easeOutElastic(1, 0.7)',
        duration: 800
    });

    timeline
        .add({
            targets: element,
            opacity: [0, 1],
            scale: [0.8, 1],
            translateY: [30, 0],
            duration: 600
        })
        .add({
            targets: element,
            scale: [1, 1.05, 1],
            duration: 400,
            easing: 'easeInOutSine'
        }, '-=400');
    }

/**
 * Animate gallery items with musical grid flow
 * @param {HTMLElement} element - The gallery item element
 */
function animateGalleryItemMusically(element) {
    anime({
        targets: element,
        opacity: [0, 1],
        scale: [0.8, 1],
        translateY: [70, 0],
        duration: 1100,
        easing: 'easeOutElastic(1, 0.4)',
        delay: anime.stagger(180, { grid: 'auto', from: 'center' })
    });
}

/**
 * Animate technique items with musical precision
 * @param {HTMLElement} element - The technique item element
 */
function animateTechniqueItemMusically(element) {
    const timeline = anime.timeline({
        easing: 'easeOutElastic(1, 0.6)',
        duration: 1000
    });

    // Animate the container
    timeline
        .add({
            targets: element,
            opacity: [0, 1],
            translateY: [50, 0],
            scale: [0.9, 1],
            duration: 800
        })
        .add({
            targets: element,
            scale: [1, 1.02, 1],
            duration: 500,
            easing: 'easeInOutSine'
        }, '-=400');
    
    // Animate the icon with musical flourish
    const icon = element.querySelector('.technique-icon i');
    if (icon) {
            anime({
            targets: icon,
            scale: [0, 1.2, 1],
            rotate: [-180, 10, 0],
                duration: 800,
            easing: 'easeOutElastic(1, 0.8)',
            delay: 300
            });
        }
    }

/**
 * Animate quote elements with dramatic musical timing
 * @param {HTMLElement} element - The quote element
 */
function animateQuoteMusically(element) {
    const timeline = anime.timeline({
        easing: 'easeInOutSine',
        duration: 1400
    });

    timeline
        .add({
            targets: element,
            opacity: [0, 1],
            translateY: [40, 0],
            scale: [0.95, 1],
            duration: 1200
        })
        .add({
            targets: element,
            scale: [1, 1.01, 1],
            duration: 600,
            easing: 'easeInOutSine'
        }, '-=800');
}

/**
 * Animate hero elements with grand musical entrance
 * @param {HTMLElement} element - The hero element
 */
function animateHeroMusically(element) {
    const timeline = anime.timeline({
        easing: 'easeOutElastic(1, 0.8)',
        duration: 1600
    });

    timeline
        .add({
            targets: element,
                        opacity: [0, 1],
            translateY: [100, 0],
            scale: [0.8, 1],
            duration: 1400
        })
        .add({
            targets: element,
            scale: [1, 1.03, 1],
                        duration: 800,
            easing: 'easeInOutSine'
        }, '-=1000');
}

/**
 * Default musical animation for other elements
 * @param {HTMLElement} element - The element to animate
 */
function animateDefaultMusically(element) {
                    anime({
        targets: element,
                        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.95, 1],
        duration: 900,
        easing: 'easeInOutSine',
        delay: anime.stagger(150)
    });
}

/**
 * Special musical animation for hero section elements
 * Creates a grand musical entrance like a concert opening
 */
function initHeroMusicalAnimations() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    const heroElements = heroContent.querySelectorAll('.animate-on-scroll');
    
    if (heroElements.length > 0) {
        // Create a grand musical timeline for hero animations
        const heroTimeline = anime.timeline({
            easing: 'easeOutElastic(1, 0.8)',
            duration: 1800
        });

        // Title - grand entrance
        heroTimeline
            .add({
                targets: heroElements[0], // Title
                opacity: [0, 1],
                translateY: [80, 0],
                scale: [0.8, 1],
                duration: 1400
            })
            .add({
                targets: heroElements[0],
                scale: [1, 1.02, 1],
                duration: 600,
                easing: 'easeInOutSine'
            }, '-=800');

        // Tagline - flowing follow-up
        heroTimeline
            .add({
                targets: heroElements[1], // Tagline
                opacity: [0, 1],
                translateY: [50, 0],
                scale: [0.95, 1],
                duration: 1000
            }, '-=600')
            .add({
                targets: heroElements[1],
                scale: [1, 1.01, 1],
                duration: 400,
                easing: 'easeInOutSine'
            }, '-=600');

        // Button - musical accent
        heroTimeline
            .add({
                targets: heroElements[2], // Button
                opacity: [0, 1],
                scale: [0.8, 1],
                translateY: [30, 0],
                duration: 800
            }, '-=400')
            .add({
                targets: heroElements[2],
                scale: [1, 1.05, 1],
                duration: 500,
                easing: 'easeInOutSine'
            }, '-=400');
    }
}

/**
 * Initialize musical animations for specific sections
 */
function initMusicalSectionAnimations() {
    // Hero section animations
    initHeroMusicalAnimations();
    
    // Gallery grid animations with musical flow
    initGalleryMusicalAnimations();
    
    // Techniques grid animations with precision
    initTechniquesMusicalAnimations();
    
    // Quote section with dramatic timing
    initQuoteMusicalAnimations();
}

/**
 * Initialize gallery grid animations with musical flow
 */
function initGalleryMusicalAnimations() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    const galleryItems = galleryGrid.querySelectorAll('.gallery-item');
    
    if (galleryItems.length > 0) {
        // Set initial state for musical entrance
        galleryItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8) translateY(60px)';
        });
    }
}

/**
 * Initialize techniques grid animations with musical precision
 */
function initTechniquesMusicalAnimations() {
    const techniquesGrid = document.querySelector('.techniques-grid');
    if (!techniquesGrid) return;

    const techniqueItems = techniquesGrid.querySelectorAll('.technique-item');
    
    if (techniqueItems.length > 0) {
        // Set initial state for musical entrance
        techniqueItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9) translateY(50px)';
        });
    }
}

/**
 * Initialize quote section with dramatic musical timing
 */
function initQuoteMusicalAnimations() {
        const quoteSection = document.querySelector('.quote-section');
        if (!quoteSection) return;

    const quoteElements = quoteSection.querySelectorAll('.animate-on-scroll');
    
    if (quoteElements.length > 0) {
        // Set initial state for dramatic entrance
        quoteElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'scale(0.95) translateY(40px)';
        });
    }
}

/**
 * Add subtle musical pulse effects to interactive elements
 */
function initMusicalPulseEffects() {
    // Add pulse effect to buttons on hover
    const buttons = document.querySelectorAll('.btn, .btn-small');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: [1, 1.05],
                duration: 300,
                easing: 'easeInOutSine'
            });
        });
        
        button.addEventListener('mouseleave', function() {
                    anime({
                targets: this,
                scale: [1.05, 1],
                duration: 300,
                easing: 'easeInOutSine'
            });
                });
            });
            
    // Add subtle glow effect to quotes
    const quotes = document.querySelectorAll('blockquote, .quote-item');
    quotes.forEach(quote => {
        quote.addEventListener('mouseenter', function() {
                anime({
                targets: this,
                scale: [1, 1.02],
                duration: 400,
                easing: 'easeInOutSine'
            });
        });

        quote.addEventListener('mouseleave', function() {
                anime({
                targets: this,
                scale: [1.02, 1],
                duration: 400,
                easing: 'easeInOutSine'
            });
        });
    });
}

// Initialize musical animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are properly rendered
    setTimeout(() => {
        initMusicalSectionAnimations();
        initMusicalPulseEffects();
        initAchievementReveal();
    }, 100);
});

/**
 * Initialize achievement reveal animations with musical elegance
 */
function initAchievementReveal() {
    const revealTriggers = document.querySelectorAll('.reveal-trigger');
    
    revealTriggers.forEach(trigger => {
        const content = trigger.nextElementSibling;
        let isRevealed = false;
        
        // Set initial state
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        content.style.transform = 'translateY(-20px)';
        
        trigger.addEventListener('click', function() {
            const currentLang = document.querySelector('.lang-btn.active').textContent.toLowerCase();
            const triggerText = trigger.querySelector('.trigger-text');
            
            if (!isRevealed) {
                // Reveal animation with musical timing
                const timeline = anime.timeline({
                    easing: 'easeOutElastic(1, 0.6)',
                    duration: 800
                });
                
                // Add revealed class first
                content.classList.add('revealed');
                
                timeline
                    .add({
                        targets: trigger,
                        scale: [1, 1.05, 1],
                        duration: 300,
                        easing: 'easeInOutSine'
                    })
                    .add({
                        targets: content,
                        maxHeight: [0, '2000px'],
                        opacity: [0, 1],
                        translateY: [-20, 0],
                        duration: 600,
                        easing: 'easeOutElastic(1, 0.7)'
                    }, '-=200')
                    .add({
                        targets: content.querySelectorAll('p'),
                        opacity: [0, 1],
                        translateX: [-20, 0],
                        duration: 500,
                        easing: 'easeInOutSine',
                        delay: anime.stagger(100)
                    }, '-=400');
                
                // Update button state
                trigger.classList.add('active');
                const buttonData = trigger.getAttribute('data-en');
                if (buttonData === 'Unfold Teaching') {
                    triggerText.textContent = currentLang === 'de' ? 'Unterricht falten' : 'Fold Teaching';
                } else if (buttonData === 'Unfold On Stage') {
                    triggerText.textContent = currentLang === 'de' ? 'Auf der Bühne falten' : 'Fold On Stage';
                } else if (buttonData === 'Unfold Off Stage') {
                    triggerText.textContent = currentLang === 'de' ? 'Hinter den Kulissen falten' : 'Fold Off Stage';
                } else {
                    triggerText.textContent = currentLang === 'de' ? 'Geschichte falten' : 'Fold Story';
                }
                isRevealed = true;
                
            } else {
                // Hide animation with musical elegance
                const timeline = anime.timeline({
                    easing: 'easeInOutQuad',
                    duration: 600
                });
                
                timeline
                    .add({
                        targets: content.querySelectorAll('p'),
                        opacity: [1, 0],
                        translateX: [0, -30],
                        scale: [1, 0.95],
                        duration: 400,
                        easing: 'easeInOutSine',
                        delay: anime.stagger(80, { direction: 'reverse' })
                    })
                    .add({
                        targets: content,
                        maxHeight: ['2000px', 0],
                        opacity: [1, 0],
                        translateY: [0, -30],
                        scale: [1, 0.98],
                        duration: 500,
                        easing: 'easeInOutQuad'
                    }, '-=300')
                    .add({
                        targets: trigger,
                        scale: [1, 0.92, 1],
                        translateY: [0, -5, 0],
                        duration: 400,
                        easing: 'easeOutElastic(1, 0.8)'
                    }, '-=200')
                    .add({
                        complete: function() {
                            // Remove revealed class after animation completes
                            content.classList.remove('revealed');
                        }
                    });
                
                // Update button state
                trigger.classList.remove('active');
                const buttonData = trigger.getAttribute('data-en');
                if (buttonData === 'Unfold Teaching') {
                    triggerText.textContent = currentLang === 'de' ? 'Unterricht entfalten' : 'Unfold Teaching';
                } else if (buttonData === 'Unfold On Stage') {
                    triggerText.textContent = currentLang === 'de' ? 'Auf der Bühne entfalten' : 'Unfold On Stage';
                } else if (buttonData === 'Unfold Off Stage') {
                    triggerText.textContent = currentLang === 'de' ? 'Hinter den Kulissen entfalten' : 'Unfold Off Stage';
                } else {
                    triggerText.textContent = currentLang === 'de' ? 'Geschichte entfalten' : 'Unfold Story';
                }
                isRevealed = false;
            }
        });
        
        // Add hover effects
        trigger.addEventListener('mouseenter', function() {
            if (!isRevealed) {
                anime({
                    targets: trigger,
                    scale: [1, 1.02],
                    duration: 300,
                    easing: 'easeInOutSine'
                });
            }
        });
        
        trigger.addEventListener('mouseleave', function() {
            if (!isRevealed) {
                    anime({
                    targets: trigger,
                    scale: [1.02, 1],
                    duration: 300,
                    easing: 'easeInOutSine'
                    });
                }
            });
        });
    }

/**
 * Utility function to check if element is in viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element is in viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Utility function to get distance from viewport center
 * @param {HTMLElement} element - The element to check
 * @returns {number} - Distance from viewport center
 */
function getDistanceFromCenter(element) {
    const rect = element.getBoundingClientRect();
    const centerY = window.innerHeight / 2;
    const elementCenterY = rect.top + rect.height / 2;
    return Math.abs(elementCenterY - centerY);
} 