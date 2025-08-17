// Enhanced Gallery Lightbox with Swipe Functionality
class EnhancedGallery {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.isOpen = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        
        this.init();
    }
    
    init() {
        this.collectImages();
        this.bindEvents();
        this.setupLazyLoading();
        this.preloadFirstImages();
    }
    
    collectImages() {
        // Collect all gallery images from both On Stage and Off Stage sections
        const gallerySections = document.querySelectorAll('#gallery .achievement-content .gallery-grid');
        gallerySections.forEach((section) => {
            const galleryItems = section.querySelectorAll('.gallery-item');
            galleryItems.forEach((item, index) => {
                const caption = item.getAttribute('data-caption');
                const imageElement = item.querySelector('.gallery-image');
                if (imageElement) {
                    let imageUrl;
                    // Handle both img tags and div with background-image
                    if (imageElement.tagName === 'IMG') {
                        imageUrl = imageElement.src;
                    } else {
                        const backgroundImage = imageElement.style.backgroundImage;
                        imageUrl = backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
                    }
                    this.images.push({
                        url: imageUrl,
                        caption: caption
                    });
                }
            });
        });
    }
    
    setupLazyLoading() {
        // Enhanced lazy loading for gallery images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Add performance optimizations
                        img.style.willChange = 'transform';
                        img.decode().then(() => {
                            img.style.opacity = '1';
                            img.style.willChange = 'auto';
                        }).catch(() => {
                            // Fallback if decode fails
                            img.style.opacity = '1';
                            img.style.willChange = 'auto';
                        });
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                root: null,
                rootMargin: '50px',
                threshold: 0.1
            });
            
            // Observe all gallery images
            document.querySelectorAll('.gallery-image').forEach(img => {
                if (img.tagName === 'IMG') {
                    // Initial setup for smooth loading
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    // Only observe if image isn't already loaded
                    if (!img.complete) {
                        imageObserver.observe(img);
                    } else {
                        img.style.opacity = '1';
                    }
                }
            });
            
            // Preload next few images when user scrolls to gallery
            const gallerySection = document.getElementById('gallery');
            if (gallerySection) {
                const galleryObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Preload first few gallery images immediately
                            const galleryImages = document.querySelectorAll('.gallery-image');
                            galleryImages.forEach((img, index) => {
                                if (index < 6 && img.tagName === 'IMG') { // Preload first 6 images
                                    const tempImage = new Image();
                                    tempImage.src = img.src;
                                }
                            });
                            galleryObserver.unobserve(gallerySection);
                        }
                    });
                }, { rootMargin: '100px' });
                
                galleryObserver.observe(gallerySection);
            }
        } else {
            // Fallback for browsers without IntersectionObserver
            document.querySelectorAll('.gallery-image').forEach(img => {
                if (img.tagName === 'IMG') {
                    img.style.opacity = '1';
                }
            });
        }
    }
    
    preloadFirstImages() {
        // Immediately show and preload the first 4 gallery images for faster loading
        const galleryImages = document.querySelectorAll('.gallery-image');
        galleryImages.forEach((img, index) => {
            if (img.tagName === 'IMG' && index < 4) {
                // Make first 4 images visible immediately
                img.style.opacity = '1';
                img.removeAttribute('loading'); // Remove lazy loading from first 4
                
                // Preload them
                if (!img.complete) {
                    const preloadImg = new Image();
                    preloadImg.onload = () => {
                        img.src = preloadImg.src;
                        img.style.opacity = '1';
                    };
                    preloadImg.src = img.src;
                }
            }
        });
    }
    
    bindEvents() {
        // Bind click events to gallery items
        const galleryItems = document.querySelectorAll('#gallery .gallery-item');
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => this.openLightbox(index));
        });
        
        // Bind lightbox events
        const lightbox = document.getElementById('lightbox');
        const closeBtn = document.querySelector('.close-lightbox');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeLightbox());
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousImage());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextImage());
        
        // Handle navigation links - close lightbox if open, then navigate
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (this.isOpen) {
                    // Prevent the default navigation briefly to close lightbox first
                    e.preventDefault();
                    this.closeLightbox();
                    
                    // Allow navigation to proceed after lightbox animation completes
                    setTimeout(() => {
                        // Trigger the navigation manually
                        if (href && href.startsWith('#')) {
                            const target = document.querySelector(href);
                            if (target) {
                                const headerHeight = 100; // Account for fixed header
                                const targetPosition = target.offsetTop - headerHeight;
                                
                                window.scrollTo({
                                    top: targetPosition,
                                    behavior: 'smooth'
                                });
                            }
                        }
                    }, 350); // Wait for lightbox close animation (300ms) + small buffer
                } else if (href && href.startsWith('#')) {
                    // Lightbox is not open, handle navigation normally with proper header offset
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerHeight = 100; // Account for fixed header
                        const targetPosition = target.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Close lightbox when language buttons are clicked  
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isOpen) {
                    this.closeLightbox();
                }
            });
        });
        
        // Close lightbox when mobile menu toggle is clicked
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                if (this.isOpen) {
                    this.closeLightbox();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });
        
        // Touch/swipe events
        if (lightbox) {
            lightbox.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            lightbox.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        }
        
        // Click outside to close
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    this.closeLightbox();
                }
            });
        }
    }
    

    
    openLightbox(index) {
        this.currentIndex = index;
        this.isOpen = true;
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        
        if (lightbox && lightboxImg && lightboxCaption) {
            lightbox.style.display = 'block';
            this.updateImage();
            
            // Animate in
            anime({
                targets: lightbox,
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuad'
            });
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeLightbox() {
        this.isOpen = false;
        const lightbox = document.getElementById('lightbox');
        
        if (lightbox) {
            anime({
                targets: lightbox,
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInQuad',
                complete: () => {
                    lightbox.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }
    }
    
    updateImage() {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        
        if (this.images[this.currentIndex]) {
            const image = this.images[this.currentIndex];
            
            if (lightboxImg) {
                lightboxImg.src = image.url;
                lightboxImg.alt = image.caption;
            }
            
            if (lightboxCaption) {
                lightboxCaption.textContent = image.caption;
            }
            
            // Animate image change
            anime({
                targets: lightboxImg,
                opacity: [0, 1],
                scale: [0.95, 1],
                duration: 400,
                easing: 'easeOutQuad'
            });
        }
    }
    
    previousImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImage();
    }
    
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
    }
    
    goToImage(index) {
        this.currentIndex = index;
        this.updateImage();
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.touchEndY = e.changedTouches[0].screenY;
        this.handleSwipe();
    }
    
    handleSwipe() {
        const diffX = this.touchStartX - this.touchEndX;
        const diffY = this.touchStartY - this.touchEndY;
        
        // Minimum swipe distance
        const minSwipeDistance = 50;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                // Swipe left - next image
                this.nextImage();
            } else {
                // Swipe right - previous image
                this.previousImage();
            }
        }
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedGallery();
}); 