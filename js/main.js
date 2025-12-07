// VitaInspire - Main JavaScript File

// ============================================
// SMOOTH SCROLL FUNCTIONALITY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const navLinks = document.getElementById('navLinks');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // ============================================
    // SCROLL TO TOP BUTTON
    // ============================================
    const scrollButton = document.querySelector('.scroll-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
        
        // Add shadow to nav on scroll
        const nav = document.querySelector('nav');
        if (window.pageYOffset > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    document.querySelectorAll('.mission-card, .product-card, .impact-box, .position-card').forEach(el => {
        observer.observe(el);
    });
    
    // ============================================
    // ANIMATED STATISTICS
    // ============================================
    const animateValue = (element, start, end, duration, suffix = '') => {
        let current = start;
        const range = end - start;
        const increment = range / (duration / 16);
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    };
    
    // Animate stat numbers when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const text = entry.target.textContent;
                const match = text.match(/(\d+)/);
                if (match) {
                    const value = parseInt(match[0]);
                    const suffix = text.replace(/\d+/, '').trim();
                    entry.target.textContent = '0';
                    setTimeout(() => {
                        animateValue(entry.target, 0, value, 2000, suffix ? ' ' + suffix : '');
                    }, 200);
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat-number').forEach(stat => {
        statsObserver.observe(stat);
    });
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// ============================================
// SCROLL TO TOP FUNCTION
// ============================================
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ============================================
// FORM SUBMISSION HANDLER
// ============================================
function submitIdea(event) {
    event.preventDefault();
    
    const form = event.target;
    const formMessage = document.getElementById('formMessage');
    const submitButton = form.querySelector('.submit-button');
    
    // Get form data
    const formData = {
        name: form.name.value,
        email: form.email.value,
        organization: form.organization.value,
        sector: form.sector.value,
        problem: form.problem.value,
        solution: form.solution.value,
        impact: form.impact.value,
        data: form.data.value
    };
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Success message
        formMessage.className = 'success';
        formMessage.textContent = '✓ Thank you! Your idea has been submitted successfully. We\'ll review it and get back to you soon.';
        
        // Log to console (in production, send to backend)
        console.log('Form submitted:', formData);
        
        // Reset form
        form.reset();
        
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Your Idea';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
        
    }, 1500);
    
    // TODO: Replace setTimeout with actual fetch/AJAX call
    /*
    fetch('/api/submit-idea', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        formMessage.className = 'success';
        formMessage.textContent = '✓ Thank you! Your idea has been submitted successfully.';
        form.reset();
    })
    .catch(error => {
        formMessage.className = 'error';
        formMessage.textContent = '✗ Something went wrong. Please try again later.';
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Your Idea';
    });
    */
}

// ============================================
// DYNAMIC YEAR FOR COPYRIGHT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// ============================================
// PERFORMANCE: LAZY LOADING IMAGES
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// KEYBOARD ACCESSIBILITY
// ============================================
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navLinks = document.getElementById('navLinks');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    }
});

// ============================================
// DISABLE CONSOLE LOGS IN PRODUCTION
// ============================================
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
}

// ============================================
// ANALYTICS (Placeholder - add your analytics code)
// ============================================
function trackEvent(category, action, label) {
    // Google Analytics example:
    // gtag('event', action, {
    //     'event_category': category,
    //     'event_label': label
    // });
    
    console.log('Event tracked:', { category, action, label });
}

// Track button clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cta-button') || 
        e.target.classList.contains('hero-button')) {
        trackEvent('Button', 'Click', e.target.textContent);
    }
});
