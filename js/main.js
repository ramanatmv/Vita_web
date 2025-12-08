// VitaInspire - Main JavaScript File

// ============================================
// SMOOTH SCROLL FUNCTIONALITY
// ============================================
document.addEventListener('DOMContentLoaded', function () {

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

    // ============================================
    // FORM SUCCESS MESSAGE FROM URL
    // ============================================
    // Check if redirected back after successful form submission
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        const formMessage = document.getElementById('formMessage');
        if (formMessage) {
            formMessage.className = 'success';
            formMessage.style.display = 'block';
            formMessage.textContent = '✓ Thank you! Your idea has been submitted successfully. We\'ll review it and get back to you soon.';

            // Scroll to the form
            document.getElementById('submit-idea').scrollIntoView({ behavior: 'smooth' });

            // Clear the URL parameter after showing the message
            const newUrl = window.location.pathname + window.location.hash.split('?')[0];
            window.history.replaceState({}, document.title, newUrl);

            // Hide message after 10 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 10000);
        }
    }

    // ============================================
    // UPDATE FORM REDIRECT URL DYNAMICALLY
    // ============================================
    // Update the _next field to use the current hostname (for deployment)
    const ideaForm = document.getElementById('ideaForm');
    if (ideaForm) {
        const nextField = ideaForm.querySelector('input[name="_next"]');
        if (nextField) {
            const currentUrl = window.location.origin + window.location.pathname + '#submit-idea?success=true';
            nextField.value = currentUrl;
        }
    }
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

function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const form = event.target;
    const formMessage = document.getElementById('formMessage');
    const submitButton = form.querySelector('.submit-button');

    // Show submitting state
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    // Show feedback message
    formMessage.style.display = 'block';
    formMessage.className = 'info';
    formMessage.textContent = '📧 Sending your idea submission...';

    // Create FormData and submit via fetch
    const formData = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            // Show success message
            formMessage.className = 'success';
            formMessage.textContent = '✓ Thank you! Your idea has been submitted successfully. We\'ll review it and get back to you soon.';

            // Reset the form
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Your Idea';

            // Scroll to the message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Hide message after 10 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 10000);
        })
        .catch(error => {
            // Show error message
            formMessage.className = 'error';
            formMessage.textContent = '❌ There was an error submitting your idea. Please try again or email us directly at ramana@vitainspire.com';

            submitButton.disabled = false;
            submitButton.textContent = 'Submit Your Idea';
        });

    return false;
}

// Alternative: Keep the old function for backwards compatibility
function submitIdea(event) {
    return handleFormSubmit(event);
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
    console.log = function () { };
    console.warn = function () { };
    console.error = function () { };
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

// ============================================
// BLOG FUNCTIONALITY
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    const blogGrid = document.getElementById('blogGrid');
    const blogModal = document.getElementById('blogModal');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.querySelector('.close-modal');

    // Render Blog Posts
    if (blogGrid && typeof blogPosts !== 'undefined') {
        blogPosts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'blog-card';
            card.innerHTML = `
                <div class="blog-card-header">
                    <span class="blog-category">${post.category}</span>
                </div>
                <div class="blog-card-content">
                    <h3>${post.title}</h3>
                    <span class="blog-date">${post.date}</span>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <a href="#" class="read-more" data-id="${post.id}">Read Full Article →</a>
                </div>
            `;

            // Add click event to open modal
            card.addEventListener('click', function (e) {
                e.preventDefault();
                openBlogModal(post);
            });

            blogGrid.appendChild(card);
        });
    }

    // Open Modal
    function openBlogModal(post) {
        if (!blogModal || !modalBody) return;

        modalBody.innerHTML = `
            <div class="modal-post-header">
                <span class="blog-category" style="color:var(--primary); margin-bottom:0.5rem;">${post.category}</span>
                <h2>${post.title}</h2>
                <div class="modal-metadata">
                    <span>📅 ${post.date}</span>
                    <span class="author-tag">👤 ${post.author}</span>
                </div>
            </div>
            <div class="modal-body">
                ${post.content}
            </div>
        `;

        blogModal.style.display = 'block';
        blogModal.scrollTop = 0; // Reset scroll position
        document.body.style.overflow = 'hidden';

        console.log('Modal opened. Content length:', post.content ? post.content.length : '0');
    }

    // Close Modal Logic
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            blogModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === blogModal) {
            blogModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
});
