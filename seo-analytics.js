/**
 * SEO Analytics and Tracking Script
 * Enhanced SEO monitoring and performance tracking for David Dyakov Website
 */

(function() {
    'use strict';

    // SEO Analytics Configuration
    const SEOAnalytics = {
        // Track page performance metrics
        trackPageMetrics: function() {
            if ('performance' in window) {
                window.addEventListener('load', function() {
                    setTimeout(function() {
                        const perfData = performance.getEntriesByType('navigation')[0];
                        
                        // Core Web Vitals tracking
                        const metrics = {
                            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
                            timeToInteractive: perfData.domInteractive - perfData.navigationStart
                        };

                        // Log metrics for SEO analysis (in production, send to analytics)
                        console.log('SEO Performance Metrics:', metrics);
                        
                        // Track if metrics meet Core Web Vitals thresholds
                        if (metrics.firstContentfulPaint < 1800) {
                            console.log('✅ Good First Contentful Paint');
                        }
                        
                        if (metrics.loadTime < 2500) {
                            console.log('✅ Good Page Load Time');
                        }
                    }, 0);
                });
            }
        },

        // Track scroll depth for engagement metrics
        trackScrollDepth: function() {
            let maxScroll = 0;
            const trackingPoints = [25, 50, 75, 100];
            const tracked = new Set();

            window.addEventListener('scroll', this.debounce(function() {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );
                
                if (scrollPercent > maxScroll) {
                    maxScroll = scrollPercent;
                    
                    trackingPoints.forEach(point => {
                        if (scrollPercent >= point && !tracked.has(point)) {
                            tracked.add(point);
                            console.log(`Scroll depth: ${point}%`);
                            // In production: gtag('event', 'scroll', { depth: point });
                        }
                    });
                }
            }, 250));
        },

        // Track video engagement
        trackVideoEngagement: function() {
            const videos = document.querySelectorAll('video');
            
            videos.forEach(video => {
                video.addEventListener('play', function() {
                    console.log('Video played:', this.src);
                    // In production: gtag('event', 'video_play', { video_title: this.title });
                });

                video.addEventListener('ended', function() {
                    console.log('Video completed:', this.src);
                    // In production: gtag('event', 'video_complete', { video_title: this.title });
                });

                // Track 25%, 50%, 75% video progress
                video.addEventListener('timeupdate', function() {
                    const percent = Math.round((this.currentTime / this.duration) * 100);
                    if ([25, 50, 75].includes(percent) && !this.dataset.tracked?.includes(percent)) {
                        console.log(`Video ${percent}% played:`, this.src);
                        this.dataset.tracked = (this.dataset.tracked || '') + percent + ',';
                    }
                });
            });
        },

        // Track gallery image views for engagement
        trackGalleryEngagement: function() {
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !entry.target.dataset.viewed) {
                            entry.target.dataset.viewed = 'true';
                            const caption = entry.target.dataset.caption || 'Gallery image';
                            console.log('Gallery image viewed:', caption);
                            // In production: gtag('event', 'image_view', { image_title: caption });
                        }
                    });
                }, { threshold: 0.5 });

                galleryItems.forEach(item => observer.observe(item));
            }
        },

        // Track contact form interactions
        trackFormEngagement: function() {
            const form = document.getElementById('combinedForm');
            if (form) {
                // Track form field focus
                const inputs = form.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.addEventListener('focus', function() {
                        console.log('Form field focused:', this.name);
                        // In production: gtag('event', 'form_start');
                    }, { once: true });
                });

                // Track form submission
                form.addEventListener('submit', function() {
                    console.log('Contact form submitted');
                    // In production: gtag('event', 'form_submit', { form_name: 'contact' });
                });
            }
        },

        // Track social media clicks
        trackSocialClicks: function() {
            const socialLinks = document.querySelectorAll('.social-card, .social-link');
            
            socialLinks.forEach(link => {
                link.addEventListener('click', function() {
                    const platform = this.href.includes('spotify') ? 'spotify' :
                                   this.href.includes('instagram') ? 'instagram' :
                                   this.href.includes('facebook') ? 'facebook' :
                                   this.href.includes('youtube') ? 'youtube' : 'other';
                    
                    console.log('Social link clicked:', platform);
                    // In production: gtag('event', 'social_click', { platform: platform });
                });
            });
        },

        // Track search engine bot visits
        trackBotVisits: function() {
            const userAgent = navigator.userAgent.toLowerCase();
            const bots = ['googlebot', 'bingbot', 'slurp', 'facebookexternalhit', 'twitterbot'];
            
            const isBot = bots.some(bot => userAgent.includes(bot));
            if (isBot) {
                console.log('Search engine bot detected:', userAgent);
                // Store bot visit data for SEO analysis
            }
        },

        // Utility function for debouncing
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Initialize all tracking
        init: function() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
                return;
            }

            this.trackPageMetrics();
            this.trackScrollDepth();
            this.trackVideoEngagement();
            this.trackGalleryEngagement();
            this.trackFormEngagement();
            this.trackSocialClicks();
            this.trackBotVisits();

            console.log('🎸 SEO Analytics initialized for David Dyakov website');
        }
    };

    // Initialize SEO analytics
    SEOAnalytics.init();

    // Expose for external use if needed
    window.SEOAnalytics = SEOAnalytics;

})();

// Enhanced structured data validation
(function validateStructuredData() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach((script, index) => {
        try {
            JSON.parse(script.textContent);
            console.log(`✅ Valid JSON-LD schema #${index + 1}`);
        } catch (e) {
            console.error(`❌ Invalid JSON-LD schema #${index + 1}:`, e);
        }
    });
})();

// SEO-friendly image lazy loading enhancement
(function enhanceImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add SEO-friendly loading state
                    img.addEventListener('load', function() {
                        this.style.opacity = '1';
                        this.classList.add('loaded');
                    });
                    
                    img.addEventListener('error', function() {
                        console.warn('Image failed to load:', this.src);
                        this.alt = 'Image unavailable - ' + this.alt;
                    });
                    
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        images.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            imageObserver.observe(img);
        });
    }
})();
