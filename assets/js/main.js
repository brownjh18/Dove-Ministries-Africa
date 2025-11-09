// Mobile menu toggle with popup animation
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeBtn = mobileMenu ? mobileMenu.querySelector('.close-btn') : null;
    const ministriesToggle = mobileMenu ? mobileMenu.querySelector('.ministries-toggle') : null;
    const ministriesSubmenu = mobileMenu ? mobileMenu.querySelector('.ministries-submenu') : null;

    if (mobileMenuButton && mobileMenu && mobileMenuOverlay) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('show');
            mobileMenuOverlay.classList.toggle('show');
        });

        // Close menu when clicking overlay or outside
        mobileMenuOverlay.addEventListener('click', function() {
            mobileMenu.classList.remove('show');
            mobileMenuOverlay.classList.remove('show');
        });

        // Close menu when clicking close button
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                mobileMenu.classList.remove('show');
                mobileMenuOverlay.classList.remove('show');
            });
        }

        // Ministries submenu toggle
        if (ministriesToggle && ministriesSubmenu) {
            ministriesToggle.addEventListener('click', function(e) {
                e.preventDefault();
                ministriesSubmenu.classList.toggle('hidden');
                const chevron = this.querySelector('.fa-chevron-down');
                if (chevron) {
                    chevron.classList.toggle('rotate-180');
                }
            });
        }

        // Close menu when clicking a menu item (except ministries toggle)
        mobileMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && !e.target.classList.contains('ministries-toggle')) {
                mobileMenu.classList.remove('show');
                mobileMenuOverlay.classList.remove('show');
            }
        });
    }
});

// Prayer request form submission
document.getElementById('prayer-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Here you would typically send the data to your server
    console.log('Prayer request submitted:', data);

    // Show success message
    alert('Thank you for your prayer request. Our prayer team will be in touch with you soon.');

    // Reset form
    this.reset();
});

// Newsletter form submission
document.getElementById('newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = this.querySelector('input[type="email"]').value;

    // Here you would typically send the email to your server
    console.log('Newsletter subscription:', email);

    // Show success message
    alert('Thank you for subscribing! You will receive our latest updates and prayer points.');

    // Reset form
    this.reset();
});

// Smooth scrolling for anchor links
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

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements with animation classes
document.querySelectorAll('[style*="opacity:0"]').forEach(el => {
    observer.observe(el);
});

// Hero Slider Functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.slider-indicator');

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Show current slide
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Auto slide
let slideInterval = setInterval(nextSlide, 5000);

// Event listeners for navigation
document.getElementById('next-slide')?.addEventListener('click', () => {
    clearInterval(slideInterval);
    nextSlide();
    slideInterval = setInterval(nextSlide, 5000);
});

document.getElementById('prev-slide')?.addEventListener('click', () => {
    clearInterval(slideInterval);
    prevSlide();
    slideInterval = setInterval(nextSlide, 5000);
});

// Indicator click handlers
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(index);
        slideInterval = setInterval(nextSlide, 5000);
    });
});

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        if (!section.style.opacity) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
        }
    });

    // Trigger animations
    setTimeout(() => {
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
    }, 100);
// Ministries dropdown toggle for mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const ministriesToggles = document.querySelectorAll('.ministries-toggle');

    ministriesToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const submenu = this.parentElement.querySelector('.ministries-submenu');
            const chevron = this.querySelector('.fa-chevron-down');

            if (submenu) {
                submenu.classList.toggle('hidden');
            }

            if (chevron) {
                chevron.classList.toggle('rotate-180');
            }
        });
    });
});
});