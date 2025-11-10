// Animation Script for Dove Ministries Africa
class PageAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupHoverEffects();

        // Trigger hero animations immediately
        setTimeout(() => {
            this.triggerHeroAnimations();
        }, 100);
    }

    triggerHeroAnimations() {
        // Trigger hero section animations immediately with better timing
        const heroElements = document.querySelectorAll('.animate-fade-in-up, .animate-bounce-in');
        console.log('Triggering hero animations for', heroElements.length, 'elements');

        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate');
                console.log('Hero animation triggered for element', index, el.className);
            }, index * 300); // Increased stagger time for better visibility
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animate')) {
                    // Add animate class to trigger CSS transitions
                    entry.target.classList.add('animate');

                    // Trigger animations for child elements with staggered timing
                    const animatedChildren = entry.target.querySelectorAll('.animate-fade-in-up, .animate-bounce-in, .animate-slide-in-up, .animate-fade-in-left, .animate-fade-in-right, .animate-count-up');

                    animatedChildren.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate');
                        }, index * 150); // Stagger child animations
                    });

                    // Special handling for counter animations
                    if (entry.target.querySelector('.counter')) {
                        setTimeout(() => {
                            this.animateCounters();
                        }, 500);
                    }

                    console.log('Animating section:', entry.target.className);
                }
            });
        }, observerOptions);

        // Observe all scroll-animate elements
        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
            console.log('Observing element:', el.className);
        });

        // Also observe individual animated elements that aren't in scroll-animate sections
        document.querySelectorAll('.animate-fade-in-up, .animate-bounce-in, .animate-slide-in-up, .animate-fade-in-left, .animate-fade-in-right, .animate-count-up').forEach(el => {
            if (!el.closest('.scroll-animate')) {
                observer.observe(el);
                console.log('Observing individual element:', el.className);
            }
        });
    }

    setupCounterAnimations() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const impactSection = document.querySelector('.scroll-animate');
        if (impactSection) {
            counterObserver.observe(impactSection);
        }
    }

    animateCounters() {
        const counters = document.querySelectorAll('.counter');
        console.log('Animating', counters.length, 'counters');

        counters.forEach((counter, index) => {
            const target = parseInt(counter.getAttribute('data-target'));
            console.log('Counter', index, 'target:', target);

            const duration = 2000; // 2 seconds
            const start = 0;
            const increment = target / (duration / 16); // 60fps
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target.toLocaleString() + (target >= 1000 ? '+' : '');
                    clearInterval(timer);
                    console.log('Counter', index, 'completed');
                } else {
                    counter.textContent = Math.floor(current).toLocaleString() + (target >= 1000 ? '+' : '');
                }
            }, 16);
        });
    }

    setupHoverEffects() {
        // Add hover effects to cards
        document.querySelectorAll('.hover-lift').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PageAnimations();
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});