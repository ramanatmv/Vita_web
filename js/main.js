// VitaInspire - Main JavaScript File

// Global Image Error Handler for Blog Cards
window.handleBlogImageError = function (img, category) {
    if (img.getAttribute('data-failed')) return;
    img.setAttribute('data-failed', 'true');

    // Map Categories to Base Images
    const cat = (category || '').toLowerCase();
    let fallback = 'technology_community.png'; // Default

    if (cat.includes('health')) fallback = 'health.png';
    else if (cat.includes('edu') || cat.includes('learn')) fallback = 'education.png';
    else if (cat.includes('agri')) fallback = 'agriculture.png';
    else if (cat.includes('gov')) fallback = 'governance.png';
    else if (cat.includes('woman') || cat.includes('women') || cat.includes('empower') || cat.includes('gender')) fallback = 'woman_empowerment.png';
    else if (cat.includes('env') || cat.includes('climate')) fallback = 'environment.png';
    else if (cat.includes('social') || cat.includes('impact')) fallback = 'social_impact.png';

    img.src = `assets/images/blog_headers/${fallback}`;
};

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

    // Store all posts for the "View All" modal
    window.allBlogPosts = typeof blogPosts !== 'undefined' ? blogPosts : [];

    // Number of latest posts to show (each from a different category)
    const LATEST_POSTS_COUNT = 4;

    // Get the N latest posts from different categories (no duplicate categories)
    // Posts should be ordered newest first in blog-posts.js
    function getLatestUniqueByCategory(posts, count) {
        const selectedPosts = [];
        const usedCategories = new Set();
        const archivedPosts = [];

        for (const post of posts) {
            if (selectedPosts.length < count && !usedCategories.has(post.category)) {
                // This post is from a new category, add to display
                selectedPosts.push(post);
                usedCategories.add(post.category);
            } else {
                // Either we have enough posts or category already used, archive it
                archivedPosts.push(post);
            }
        }

        return { displayPosts: selectedPosts, archivedPosts: archivedPosts };
    }

    // Get latest posts and archived posts
    const { displayPosts, archivedPosts } = typeof blogPosts !== 'undefined'
        ? getLatestUniqueByCategory(blogPosts, LATEST_POSTS_COUNT)
        : { displayPosts: [], archivedPosts: [] };

    // Store archived posts globally for the archive modal
    window.archivedBlogPosts = archivedPosts;

    // Load blog assets manifest for infographics and audio
    let blogAssets = {};
    fetch(`assets/blog/manifest.json?v=${new Date().getTime()}`)
        .then(response => response.json())
        .then(data => {
            blogAssets = data;
            console.log('Blog assets loaded:', Object.keys(blogAssets).length, 'posts with media');
        })
        .catch(err => console.log('Blog assets manifest not found'));

    // Render Blog Posts - Only latest 4 posts (each from different category)
    if (blogGrid && typeof blogPosts !== 'undefined') {
        const latestPosts = displayPosts;

        latestPosts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'blog-card blog-card-visual';

            // Check if infographic and audio exist for this post
            const hasInfographic = blogAssets[post.id]?.infographic;
            const hasAudio = blogAssets[post.id]?.audio;
            const infographicPath = hasInfographic || `assets/blog/infographics/${post.id}.png`;
            const audioPath = hasAudio || `assets/blog/audio/${post.id}.mp3`;

            card.innerHTML = `
                <div class="blog-card-header-image">
                    <img src="${infographicPath}?v=${new Date().getTime() + '7'}" alt="${post.title}" 
                         onerror="handleBlogImageError(this, '${post.category}')">
                    <span class="blog-category-tag">${post.category}</span>
                </div>
                <div class="blog-card-body">
                    <div class="blog-meta-date">${post.date}</div>
                    <h3 class="blog-title">${post.title}</h3>
                    <div class="blog-card-footer">
                        <button class="blog-audio-btn-text" data-audio="${audioPath}">
                            🎧 Listen
                        </button>
                        <button class="blog-read-more">
                            Read More →
                        </button>
                    </div>
                </div>
            `;

            // Audio button click - play/pause audio
            const audioBtn = card.querySelector('.blog-audio-btn-text');
            let audio = new Audio(audioPath);
            let isPlaying = false;

            audio.onended = () => {
                audioBtn.innerHTML = '🎧 Listen';
                audioBtn.classList.remove('playing');
                isPlaying = false;
                audio.currentTime = 0;
            };

            function useTTS() {
                // Determine if we are pausing or playing TTS
                if (window.speechSynthesis.speaking && isPlaying) {
                    window.speechSynthesis.cancel();
                    audioBtn.innerHTML = '🎧 Listen';
                    audioBtn.classList.remove('playing');
                    isPlaying = false;
                    return;
                }

                // Stop any other media/TTS
                if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = post.content;
                const text = `${post.title}. ${tempDiv.innerText}`;
                const utterance = new SpeechSynthesisUtterance(text);

                utterance.onstart = () => {
                    audioBtn.innerHTML = '⏸️ Pause';
                    audioBtn.classList.add('playing');
                    isPlaying = true;
                };

                utterance.onend = () => {
                    audioBtn.innerHTML = '🎧 Listen';
                    audioBtn.classList.remove('playing');
                    isPlaying = false;
                };

                window.speechSynthesis.speak(utterance);
            }

            audio.onerror = () => {
                console.log('Audio file missing event');
                // We don't auto-play here on load, just note it. 
                // The click handler will fail play() and trigger fallback.
            };

            audioBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();

                // Stop any other visual/audio state
                if (window.currentBlogAudio && window.currentBlogAudio !== audio) {
                    window.currentBlogAudio.pause();
                    window.currentBlogAudio.currentTime = 0;
                }

                // Clear other buttons
                document.querySelectorAll('.blog-audio-btn-text.playing').forEach(btn => {
                    if (btn !== audioBtn) {
                        btn.innerHTML = '🎧 Listen';
                        btn.classList.remove('playing');
                    }
                });

                if (!isPlaying) {
                    // Try to play MP3
                    const playPromise = audio.play();

                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            audioBtn.innerHTML = '⏸️ Pause';
                            audioBtn.classList.add('playing');
                            isPlaying = true;
                            window.currentBlogAudio = audio;
                        }).catch(err => {
                            console.log('Audio play failed, switching to TTS:', err);
                            useTTS();
                        });
                    }
                } else {
                    // Pause/Stop
                    audio.pause();
                    window.speechSynthesis.cancel(); // Also stop TTS if active
                    audioBtn.innerHTML = '🎧 Listen';
                    audioBtn.classList.remove('playing');
                    isPlaying = false;
                }
            });

            // View button (Read More)
            const viewBtn = card.querySelector('.blog-read-more');
            viewBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                openBlogModal(post);
            });

            card.addEventListener('click', function (e) {
                if (!e.target.classList.contains('blog-audio-btn')) {
                    e.preventDefault();
                    openBlogModal(post);
                }
            });

            blogGrid.appendChild(card);
        });

        // Add "View Archives" card at the end
        const archivedCount = window.archivedBlogPosts.length;
        if (archivedCount > 0) {
            const viewAllCard = document.createElement('div');
            viewAllCard.className = 'blog-card view-all-card';
            viewAllCard.innerHTML = `
                <div class="view-all-content">
                    <span class="view-all-icon">📚</span>
                    <h3>Archives</h3>
                    <p>Browse ${archivedCount} more research articles in our archives.</p>
                    <span class="view-all-btn">Explore Archives →</span>
                </div>
            `;
            viewAllCard.addEventListener('click', function (e) {
                e.preventDefault();
                openArchivesModal();
            });
            blogGrid.appendChild(viewAllCard);
        }
    }

    // Text-to-Speech Functionality
    let speechSynth = window.speechSynthesis;
    let speaking = false;
    let currentUtterance = null;

    function stopSpeaking() {
        if (speechSynth.speaking) {
            speechSynth.cancel();
        }
        speaking = false;
        updateSpeakButtonState();
    }

    function updateSpeakButtonState() {
        const btn = document.getElementById('speakBtn');
        if (btn) {
            btn.innerHTML = speaking ? '⏹️ Stop Reading' : '🔊 Read Aloud';
            btn.classList.toggle('speaking', speaking);
        }
    }

    // Open Modal
    function openBlogModal(post) {
        if (!blogModal || !modalBody) return;

        // Stop any previous speech or audio
        stopSpeaking();
        if (window.currentBlogAudio) {
            window.currentBlogAudio.pause();
            window.currentBlogAudio.currentTime = 0;
            document.querySelectorAll('.blog-audio-btn.playing').forEach(btn => {
                btn.innerHTML = '🎧 Listen';
                btn.classList.remove('playing');
            });
        }

        modalBody.innerHTML = `
            <div class="modal-post-header">
                <span class="blog-category" style="color:var(--primary); margin-bottom:0.5rem;">${post.category}</span>
                <h2>${post.title}</h2>
                <div class="modal-metadata">
                    <span>📅 ${post.date}</span>
                    <span class="author-tag">👤 ${post.author}</span>
                </div>
                <button id="speakBtn" class="speak-button">🔊 Read Aloud</button>
            </div>
            <div class="modal-body">
                ${post.content}
            </div>
        `;

        blogModal.style.display = 'block';
        blogModal.scrollTop = 0; // Reset scroll position
        document.body.style.overflow = 'hidden';

        console.log('Modal opened. Content length:', post.content ? post.content.length : '0');

        // Attach Speech Event Listener
        const speakBtn = document.getElementById('speakBtn');
        if (speakBtn) {
            speakBtn.addEventListener('click', () => {
                if (speaking) {
                    stopSpeaking();
                } else {
                    // Create text from content (strip HTML)
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = post.content;
                    const textToRead = `${post.title}. ${tempDiv.innerText}`; // Read title first

                    currentUtterance = new SpeechSynthesisUtterance(textToRead);
                    currentUtterance.rate = 1.0;
                    currentUtterance.pitch = 1.0;

                    // Reset state when finished
                    currentUtterance.onend = () => {
                        speaking = false;
                        updateSpeakButtonState();
                    };

                    // Handle errors
                    currentUtterance.onerror = () => {
                        speaking = false;
                        updateSpeakButtonState();
                    };

                    speechSynth.speak(currentUtterance);
                    speaking = true;
                    updateSpeakButtonState();
                }
            });
        }
    }

    // Close Modal Logic
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            blogModal.style.display = 'none';
            document.body.style.overflow = '';
            stopSpeaking(); // Stop speech when closing
        });
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === blogModal) {
            blogModal.style.display = 'none';
            document.body.style.overflow = '';
            stopSpeaking(); // Stop speech when closing
        }
    });
});

// Function to open Archives modal (shows only archived posts, not the latest 4)
function openArchivesModal() {
    const blogModal = document.getElementById('blogModal');
    const modalBody = document.getElementById('modalBody');

    if (!blogModal || !modalBody) return;

    // Group archived posts by category
    const postsByCategory = {};
    window.archivedBlogPosts.forEach(post => {
        if (!postsByCategory[post.category]) {
            postsByCategory[post.category] = [];
        }
        postsByCategory[post.category].push(post);
    });

    let categoriesHtml = '';
    Object.keys(postsByCategory).forEach(category => {
        const posts = postsByCategory[category];
        categoriesHtml += `
            <div class="archive-category">
                <h3 class="archive-category-title">${category}</h3>
                <div class="archive-posts-list">
                    ${posts.map(post => `
                        <div class="archive-post-item" onclick="openBlogPostFromArchive('${post.id}')">
                            <span class="archive-post-date">${post.date}</span>
                            <span class="archive-post-title">${post.title}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    modalBody.innerHTML = `
        <div class="archive-modal-header">
            <span class="archive-icon">📚</span>
            <h2>Research Archives</h2>
            <p>Browse our collection of ${window.archivedBlogPosts.length} archived research articles</p>
        </div>
        <div class="archive-content">
            ${categoriesHtml}
        </div>
    `;

    blogModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Keep openAllArticlesModal for backwards compatibility (shows all articles)
function openAllArticlesModal() {
    const blogModal = document.getElementById('blogModal');
    const modalBody = document.getElementById('modalBody');

    if (!blogModal || !modalBody) return;

    // Group posts by category
    const postsByCategory = {};
    window.allBlogPosts.forEach(post => {
        if (!postsByCategory[post.category]) {
            postsByCategory[post.category] = [];
        }
        postsByCategory[post.category].push(post);
    });

    let categoriesHtml = '';
    Object.keys(postsByCategory).forEach(category => {
        const posts = postsByCategory[category];
        categoriesHtml += `
            <div class="archive-category">
                <h3 class="archive-category-title">${category}</h3>
                <div class="archive-posts-list">
                    ${posts.map(post => `
                        <div class="archive-post-item" onclick="openBlogPostFromArchive('${post.id}')">
                            <span class="archive-post-date">${post.date}</span>
                            <span class="archive-post-title">${post.title}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    modalBody.innerHTML = `
        <div class="archive-modal-header">
            <span class="archive-icon">📚</span>
            <h2>All Research Articles</h2>
            <p>Browse our complete collection of ${window.allBlogPosts.length} articles</p>
        </div>
        <div class="archive-content">
            ${categoriesHtml}
        </div>
    `;

    blogModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Function to open a specific blog post from the archive
function openBlogPostFromArchive(postId) {
    const post = window.allBlogPosts.find(p => p.id === postId);
    if (post) {
        openBlogModal(post);
    }
}

// Move openBlogModal to global scope
function openBlogModal(post) {
    const blogModal = document.getElementById('blogModal');
    const modalBody = document.getElementById('modalBody');

    if (!blogModal || !modalBody) return;

    // Stop any previous speech
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    modalBody.innerHTML = `
        <div class="modal-post-header">
            <span class="blog-category" style="color:var(--primary); margin-bottom:0.5rem;">${post.category}</span>
            <h2>${post.title}</h2>
            <div class="modal-metadata">
                <span>📅 ${post.date}</span>
                <span class="author-tag">👤 ${post.author}</span>
            </div>
            <button id="speakBtn" class="speak-button">🔊 Read Aloud</button>
        </div>
        <div class="modal-body">
            ${post.content}
        </div>
    `;

    blogModal.style.display = 'block';
    blogModal.scrollTop = 0;
    document.body.style.overflow = 'hidden';

    // Attach Speech Event Listener
    const speakBtn = document.getElementById('speakBtn');
    if (speakBtn && window.speechSynthesis) {
        let speaking = false;
        speakBtn.addEventListener('click', () => {
            if (speaking) {
                window.speechSynthesis.cancel();
                speaking = false;
                speakBtn.innerHTML = '🔊 Read Aloud';
                speakBtn.classList.remove('speaking');
            } else {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = post.content;
                const textToRead = `${post.title}. ${tempDiv.innerText}`;

                const utterance = new SpeechSynthesisUtterance(textToRead);
                utterance.rate = 1.0;
                utterance.pitch = 1.0;
                utterance.onend = () => {
                    speaking = false;
                    speakBtn.innerHTML = '🔊 Read Aloud';
                    speakBtn.classList.remove('speaking');
                };

                window.speechSynthesis.speak(utterance);
                speaking = true;
                speakBtn.innerHTML = '⏹️ Stop Reading';
                speakBtn.classList.add('speaking');
            }
        });
    }
}

// ============================================
// LANGUAGE MANAGER
// ============================================
let currentLanguage = localStorage.getItem('vita_language') || 'en';

document.addEventListener('DOMContentLoaded', () => {
    // Set initial selection
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.value = currentLanguage;
    }

    // Apply initial language
    applyLanguage(currentLanguage);
});

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('vita_language', lang);
    applyLanguage(lang);
}

function applyLanguage(lang) {
    if (!translations || !translations[lang]) return;

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            // Use innerHTML to allow basic HTML tags like <br> or <strong>
            element.innerHTML = translations[lang][key];
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Dispatch event for other components (like blog) to listen to
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

// ============================================
// JOB DESCRIPTIONS FOR FELLOWSHIP ROLES
// ============================================
const jobDescriptions = {
    lead: {
        title: "Lead Fellow (AI Product Lead – Fellowship Track)",
        icon: "💼",
        details: {
            duration: "6-Month Fellowship (convertible to full-time)",
            location: "Hyderabad, India (on-site)"
        },
        about: "Lead the technical direction of our AI fellowship projects, mentor fellows, and design impactful AI prototypes that serve real social needs.",
        responsibilities: [
            "Lead technical implementation & prototyping",
            "Mentor Senior & Junior Fellows",
            "Drive experimentation and feasibility testing",
            "Contribute to pilot design with NGOs/Social Enterprises",
            "Support architecture direction"
        ],
        requirements: [
            "3–5+ years of AI/ML development",
            "Portfolio of applied or working AI projects",
            "Strong prototyping ability",
            "Interest in mentoring and leadership",
            "Deep desire to contribute to social impact"
        ]
    },
    senior: {
        title: "Senior Fellow (AI Engineer – Fellowship Track)",
        icon: "💼",
        details: {
            duration: "6-Month Fellowship (convertible to full-time)",
            location: "Hyderabad, India (on-site)"
        },
        about: "You will work on applied AI prototypes, explore real-world problems, and help build proof-of-concept solutions for Social Enterprise use cases.",
        responsibilities: [
            "Build ML prototypes",
            "Experiment with LLMs, RAG, CV & agents",
            "Explore domain problems (health/education/agri)",
            "Participate in architecture discussions",
            "Demonstrate working proof-of-concepts"
        ],
        requirements: [
            "1–3 years practical AI/ML experience",
            "Personal AI projects / GitHub portfolio",
            "Curiosity and fast-learning ability",
            "Excited to build meaningful solutions"
        ]
    },
    junior: {
        title: "Junior Fellow (AI Trainee – Fellowship Track)",
        icon: "💼",
        details: {
            duration: "6-Month Fellowship (convertible to full-time)",
            location: "Hyderabad, India (on-site)",
            priority: "Underprivileged candidates strongly encouraged"
        },
        about: "A hands-on fellowship for early-career individuals who want to learn AI, build real prototypes, and contribute to social impact technology.",
        responsibilities: [
            "Learn AI tools and frameworks",
            "Build guided prototypes",
            "Assist with research & experimentation",
            "Explore real Social Enterprise problem areas",
            "Build your technical portfolio"
        ],
        requirements: [
            "Recent graduate or self-taught learner",
            "Strong interest in AI",
            "Some exposure to coding or ML",
            "Motivated, curious, willing to learn",
            "Underprivileged background preferred"
        ]
    }
};

// Open Job Modal
function openJobModal(role) {
    const job = jobDescriptions[role];
    if (!job) return;

    const modal = document.getElementById('jobModal');
    const modalBody = document.getElementById('jobModalBody');

    if (!modal || !modalBody) return;

    const priorityBadge = job.details.priority ?
        `<span class="priority-badge">🌟 ${job.details.priority}</span>` : '';

    modalBody.innerHTML = `
        <div class="job-header">
            <span class="job-icon">${job.icon}</span>
            <h2>${job.title}</h2>
            ${priorityBadge}
        </div>
        
        <div class="job-details">
            <span class="job-badge"><strong>⏱️ Duration:</strong> ${job.details.duration}</span>
            <span class="job-badge"><strong>📍 Location:</strong> ${job.details.location}</span>
        </div>

        <div class="job-section">
            <h3>About the Role</h3>
            <p>${job.about}</p>
        </div>

        <div class="job-section">
            <h3>What You'll Do</h3>
            <ul class="job-list">
                ${job.responsibilities.map(item => `<li>✔ ${item}</li>`).join('')}
            </ul>
        </div>

        <div class="job-section">
            <h3>Who You Are</h3>
            <ul class="job-list">
                ${job.requirements.map(item => `<li>✓ ${item}</li>`).join('')}
            </ul>
        </div>

        <div class="job-apply-section">
            <h3>📩 How to Apply</h3>
            <p>Please send the following to <a href="mailto:careers@vitainspire.com">careers@vitainspire.com</a>:</p>
            <ul class="job-list apply-list">
                <li>📄 Your resume</li>
                <li>🔗 Links to any GitHub / Kaggle / project portfolios</li>
                <li>💬 Brief note on why you want to be part of this mission</li>
                <li>💙 (Optional) Social impact involvement or personal story</li>
            </ul>
            <p class="subject-line"><strong>Subject line:</strong> "Application – ${job.title.split('(')[0].trim()} – VitaInspire AI Fellowship"</p>
            <a href="mailto:careers@vitainspire.com?subject=Application – ${encodeURIComponent(job.title.split('(')[0].trim())} – VitaInspire AI Fellowship" class="apply-button">
                Apply Now →
            </a>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close Job Modal
function closeJobModal() {
    const modal = document.getElementById('jobModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Close modal on outside click
document.addEventListener('click', function (e) {
    const jobModal = document.getElementById('jobModal');
    if (e.target === jobModal) {
        closeJobModal();
    }
});

// Close modal on ESC key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeJobModal();
    }
});

// ============================================
// NEW YEAR BANNER FUNCTIONALITY
// ============================================
let currentSlide = 0;
let bannerInterval = null;
const SLIDE_DURATION = 4000; // 4 seconds per slide

// Initialize banner on page load
document.addEventListener('DOMContentLoaded', function () {
    const banner = document.getElementById('newYearBanner');

    // Check if banner was previously closed in this session
    if (sessionStorage.getItem('newYearBannerClosed') === 'true') {
        if (banner) {
            banner.classList.add('hidden');
        }
        return;
    }

    // Start auto-rotation
    startBannerRotation();
});

// Start automatic slide rotation
function startBannerRotation() {
    bannerInterval = setInterval(() => {
        nextSlide();
    }, SLIDE_DURATION);
}

// Stop rotation (when user interacts)
function stopBannerRotation() {
    if (bannerInterval) {
        clearInterval(bannerInterval);
        bannerInterval = null;
    }
}

// Go to next slide
function nextSlide() {
    const slides = document.querySelectorAll('.banner-slide');
    const indicators = document.querySelectorAll('.indicator');

    if (slides.length === 0) return;

    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    // Move to next slide
    currentSlide = (currentSlide + 1) % slides.length;

    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

// Go to specific slide (called from indicator clicks)
function goToSlide(index) {
    const slides = document.querySelectorAll('.banner-slide');
    const indicators = document.querySelectorAll('.indicator');

    if (slides.length === 0 || index < 0 || index >= slides.length) return;

    // Stop auto-rotation temporarily
    stopBannerRotation();

    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    // Set new current slide
    currentSlide = index;

    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');

    // Restart auto-rotation after a delay
    setTimeout(() => {
        startBannerRotation();
    }, SLIDE_DURATION);
}

// Close the New Year banner
function closeNewYearBanner() {
    const banner = document.getElementById('newYearBanner');
    if (banner) {
        // Add fade-out animation
        banner.style.transition = 'all 0.3s ease';
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-100%)';

        // Remove from DOM after animation
        setTimeout(() => {
            banner.classList.add('hidden');
            banner.style.opacity = '';
            banner.style.transform = '';
        }, 300);

        // Stop rotation
        stopBannerRotation();

        // Remember that user closed the banner (for this session)
        sessionStorage.setItem('newYearBannerClosed', 'true');
    }
}

// Close banner with ESC key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const banner = document.getElementById('newYearBanner');
        if (banner && !banner.classList.contains('hidden')) {
            closeNewYearBanner();
        }
    }
});
