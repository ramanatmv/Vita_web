const festivals2026 = [
    { date: '01-14', name: 'Happy Bhogi', icon: '🔥', message: 'May the flames of Bhogi burn away your worries!' },
    { date: '01-15', name: 'Happy Pongal', icon: '🌾', message: 'Harvesting joy and prosperity this Pongal!' },
    { date: '01-16', name: 'Happy Mattu Pongal', icon: '🐄', message: 'Celebrating our cattle and harvest!' },
    { date: '01-17', name: 'Happy Kaanum Pongal', icon: '🏖️', message: 'Cherishing family bonds this Kaanum Pongal!' },
    { date: '03-19', name: 'Happy Ugadi', icon: '🌿', message: 'New beginnings, new aspirations!' },
    { date: '04-14', name: 'Happy Vishu / Tamil New Year', icon: '🌼', message: 'Wishing you prosperity and new beginnings!' },
    { date: '08-25', name: 'Happy Onam', icon: '🌸', message: 'Celebrating abundance and togetherness!' },
    { date: '10-20', name: 'Happy Dussehra', icon: '🏹', message: 'Celebrating the triumph of good over evil.' },
    { date: '11-08', name: 'Happy Diwali', icon: '🪔', message: 'Lighting up lives with hope and innovation!' }
];

const impactMessages = [
    { icon: '🚀', heading: 'Our Mission', text: 'AI for Social Impact: Bridging gaps, building futures.' },
    { icon: '💡', heading: 'Innovation', text: 'Innovating for India\'s next billion users.' },
    { icon: '🤝', heading: 'Community', text: 'Technology + Empathy = Sustainable Change.' },
    { icon: '🌍', heading: 'Empowerment', text: 'Empowering rural communities through intelligent solutions.' },
    { icon: '🌱', heading: 'Growth', text: 'Cultivating talent, harvesting innovation.' }
];

function updateDynamicBanner() {
    const banner = document.getElementById('newYearBanner');
    if (!banner) return;

    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${month}-${day}`;

    // Find Festival
    const festival = festivals2026.find(f => f.date === todayStr);

    let content = {};
    if (festival) {
        content = {
            icon: festival.icon,
            heading: festival.name,
            text: festival.message,
            bgClass: 'banner-festival'
        };
    } else {
        // Random Impact Message if no festival
        const randIndex = Math.floor(Math.random() * impactMessages.length);
        const impact = impactMessages[randIndex];
        content = {
            icon: impact.icon,
            heading: impact.heading,
            text: impact.text,
            bgClass: 'banner-mission'
        };
    }

    // Update HTML
    banner.innerHTML = `
        <div class="banner-close" onclick="closeNewYearBanner()" title="Close">&times;</div>
        <div class="banner-content ${content.bgClass}">
            <div class="banner-greeting">
                <span class="greeting-emoji animate-bounce">${content.icon}</span>
                <span class="greeting-text">${content.heading}</span>
                <span class="greeting-emoji animate-bounce">${content.icon}</span>
            </div>
            <div class="banner-message">
                ${content.text}
            </div>
        </div>
    `;

    // Add custom styles for message
    const msgEl = banner.querySelector('.banner-message');
    if (msgEl) {
        msgEl.style.color = 'rgba(255,255,255,0.9)';
        msgEl.style.fontSize = '1.1rem';
        msgEl.style.marginTop = '0.5rem';
        msgEl.style.textAlign = 'center';
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', updateDynamicBanner);
