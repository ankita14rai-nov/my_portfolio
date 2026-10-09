// ========================================
// COSMIC PORTFOLIO - JAVASCRIPT
// Interactive animations and functionality
// ========================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initStarField();
    initScrollAnimations();
    initInteractiveElements();
    initFormHandling();
    initParallaxEffect();
});

// ========================================
// UPGRADED MOVING STAR FIELD ANIMATION
// ========================================
function initStarField() {
    const canvas = document.getElementById('spaceCanvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let mouseX = 0;
    let mouseY = 0;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Add mouse tracking for parallax effect
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - width / 2) * 0.05;
        mouseY = (e.clientY - height / 2) * 0.05;
    });

    class Star {
        constructor(isNear) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Near stars are larger and move faster, far stars are smaller/slower
            this.z = isNear ? Math.random() * 2 + 1 : Math.random() * 1 + 0.1;
            this.size = this.z * 1.2;
            this.opacity = Math.random() * 0.5 + 0.3;
            // Base velocity moving diagonally across the screen
            this.baseVx = -this.z * 0.5;
            this.baseVy = this.z * 0.5;
        }

        update() {
            // Add mouse parallax to the base movement
            this.x += this.baseVx - mouseX * (this.z * 0.1);
            this.y += this.baseVy - mouseY * (this.z * 0.1);

            // Wrap stars around the screen to create an infinite moving effect
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // Twinkle
            this.opacity += (Math.random() - 0.5) * 0.05;
            this.opacity = Math.max(0.2, Math.min(0.9, this.opacity));
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // Glow for closer stars
            if (this.z > 2) {
                ctx.strokeStyle = `rgba(0, 217, 255, ${this.opacity * 0.4})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }

    // Create 150 background stars and 50 closer, faster stars
    const stars = [
        ...Array(150).fill(null).map(() => new Star(false)),
        ...Array(50).fill(null).map(() => new Star(true))
    ];

    function drawShootingStar() {
        const startX = Math.random() * width;
        const startY = Math.random() * height * 0.3;
        const length = Math.random() * 150 + 100;

        const gradient = ctx.createLinearGradient(startX, startY, startX - length, startY + length);
        gradient.addColorStop(0, 'rgba(0, 217, 255, 1)');
        gradient.addColorStop(1, 'rgba(0, 217, 255, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX - length, startY + length);
        ctx.stroke();
    }

    function animate() {
        // Clear canvas with a very faint trail effect
        ctx.fillStyle = 'rgba(10, 14, 39, 0.3)';
        ctx.fillRect(0, 0, width, height);

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        // 2% chance of a shooting star on every frame
        if (Math.random() > 0.98) {
            drawShootingStar();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all skill planets, project cards, and achievement stars
    document.querySelectorAll('.skill-planet, .project-card, .achievement-star').forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll with parallax
    const parallaxElements = document.querySelectorAll('.floating-planets');
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(el => {
            const scrolled = window.pageYOffset;
            el.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    });
}

// ========================================
// INTERACTIVE ELEMENTS
// ========================================

function initInteractiveElements() {
    // Skill planet hover effects
    const skillPlanets = document.querySelectorAll('.skill-planet');
    skillPlanets.forEach(planet => {
        planet.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            this.offsetHeight; // Trigger reflow
            this.style.animation = 'float-planet 6s ease-in-out infinite';
        });
    });

    // Project card interactions
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            showProjectModal(title);
        });
        
        card.style.cursor = 'pointer';
    });

    // Achievement star interactions
    const achievementStars = document.querySelectorAll('.achievement-star');
    achievementStars.forEach(star => {
        star.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.star-icon');
            icon.style.animation = 'none';
            icon.offsetHeight;
            icon.style.animation = 'pulse-star 0.6s ease-out';
        });
    });

    // Navigation link animations
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.style.color = 'var(--color-gray)');
            this.style.color = 'var(--color-neon-cyan)';
        });
    });

    // CTA Button enhanced interaction
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const gradient = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2), transparent)`;
            this.style.background = gradient;
        });

        ctaButton.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, var(--color-neon-cyan), var(--color-purple))';
        });
    }
}

// ========================================
// PROJECT MODAL
// ========================================

function showProjectModal(projectTitle) {
    // Create modal dynamically
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 14, 39, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        backdrop-filter: blur(10px);
        animation: fadeIn 0.3s ease-out;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: rgba(15, 23, 41, 0.9);
        border: 1px solid rgba(0, 217, 255, 0.3);
        border-radius: 20px;
        padding: 3rem;
        max-width: 600px;
        width: 90%;
        position: relative;
        box-shadow: 0 0 50px rgba(0, 217, 255, 0.3);
        animation: slideUp 0.3s ease-out;
    `;

    const projectData = {
        'Nebula Analytics Dashboard': {
            description: 'A comprehensive real-time data visualization platform that transforms complex data into intuitive, interactive charts and statistics.',
            features: ['Real-time updates', 'Interactive charts', 'Export functionality', 'Custom dashboards'],
            link: '#'
        },
        'Stellar E-Commerce Platform': {
            description: 'A full-stack e-commerce solution built with modern technologies, featuring seamless payment integration and robust inventory management.',
            features: ['Payment integration', 'Inventory system', 'User accounts', 'Order tracking'],
            link: '#'
        },
        'Cosmic Social Network': {
            description: 'A real-time messaging and community platform designed for seamless user interaction with advanced profiles and instant notifications.',
            features: ['Real-time messaging', 'User profiles', 'Community groups', 'Notifications'],
            link: '#'
        },
        'Aurora Design System': {
            description: 'A comprehensive design system and component library ensuring consistency and efficiency across all digital products and applications.',
            features: ['Component library', 'Design tokens', 'Documentation', 'Accessibility'],
            link: '#'
        }
    };

    const data = projectData[projectTitle] || {
        description: 'Innovative project showcasing modern web technologies.',
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
        link: '#'
    };

    modalContent.innerHTML = `
        <button class="modal-close" style="
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
            background: none;
            border: none;
            color: var(--color-neon-cyan);
            font-size: 2rem;
            cursor: pointer;
            transition: all 0.3s ease;
        ">×</button>
        
        <h2 style="
            color: var(--color-neon-cyan);
            font-size: 2rem;
            margin-bottom: 1rem;
            text-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
        ">${projectTitle}</h2>
        
        <p style="
            color: var(--color-gray);
            line-height: 1.8;
            margin-bottom: 1.5rem;
        ">${data.description}</p>
        
        <h4 style="
            color: var(--color-light-purple);
            margin-bottom: 0.5rem;
        ">Key Features</h4>
        
        <ul style="
            color: var(--color-gray);
            margin-bottom: 2rem;
            margin-left: 1rem;
        ">
            ${data.features.map(f => `<li style="margin-bottom: 0.5rem;">✓ ${f}</li>`).join('')}
        </ul>
        
        <div style="display: flex; gap: 1rem;">
            <a href="${data.link}" style="
                display: inline-block;
                padding: 0.8rem 1.5rem;
                background: linear-gradient(135deg, var(--color-neon-cyan), var(--color-purple));
                color: var(--color-black);
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 0 30px rgba(0, 217, 255, 0.6)'" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                View Project
            </a>
            <button class="modal-close" style="
                padding: 0.8rem 1.5rem;
                background: transparent;
                border: 1px solid rgba(0, 217, 255, 0.4);
                color: var(--color-neon-cyan);
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(0, 217, 255, 0.1)'; this.style.borderColor='rgba(0, 217, 255, 0.8)'" 
               onmouseout="this.style.background='transparent'; this.style.borderColor='rgba(0, 217, 255, 0.4)'">
                Close
            </button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close modal functionality
    const closeButtons = modal.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => modal.remove(), 300);
        });
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// ========================================
// FORM HANDLING
// ========================================

function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;

            // Validate
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Show success message (in real scenario, send to server)
            showNotification('Message sent! Thank you for reaching out 🚀', 'success');

            // Reset form
            this.reset();

            // Optional: Send to server (example)
            // sendFormData({ name, email, message });
        });
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'rgba(0, 217, 255, 0.2)' : 'rgba(220, 38, 38, 0.2)'};
        border: 1px solid ${type === 'success' ? 'rgba(0, 217, 255, 0.5)' : 'rgba(220, 38, 38, 0.5)'};
        color: ${type === 'success' ? 'var(--color-neon-cyan)' : '#ff6b6b'};
        border-radius: 10px;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================================
// PARALLAX EFFECT
// ========================================

function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-planets');

        parallaxElements.forEach(el => {
            el.style.transform = `translateY(${scrolled * 0.3}px)`;
        });

        // Fade in nav on scroll
        const nav = document.querySelector('.navigation');
        if (scrolled > 50) {
            nav.style.background = 'rgba(15, 23, 41, 0.95)';
            nav.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.1)';
        } else {
            nav.style.background = 'rgba(15, 23, 41, 0.7)';
            nav.style.boxShadow = 'none';
        }
    });
}

// ========================================
// UTILITY ANIMATIONS (CSS-in-JS)
// ========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Throttle scroll events for better performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Reduce animations on low-power devices
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[style*="position: fixed"]');
        modals.forEach(modal => {
            if (modal.style.zIndex > 1000) {
                modal.remove();
            }
        });
    }

    // Tab through navigation
    if (e.key === 'Tab') {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentFocus = document.activeElement;
        
        if (navLinks.length > 0) {
            const index = Array.from(navLinks).indexOf(currentFocus);
            if (e.shiftKey) {
                navLinks[(index - 1 + navLinks.length) % navLinks.length].focus();
            }
        }
    }
});

// Add focus styles for keyboard navigation
const style2 = document.createElement('style');
style2.textContent = `
    .nav-link:focus,
    .cta-button:focus,
    .skill-planet:focus,
    .project-card:focus,
    .achievement-star:focus {
        outline: 2px solid var(--color-neon-cyan);
        outline-offset: 2px;
    }
`;
document.head.appendChild(style2);

// ========================================
// ADVANCED INTERACTIONS
// ========================================

// Enhanced skill planet click reveal
document.querySelectorAll('.skill-planet').forEach(planet => {
    planet.addEventListener('click', function() {
        const skillName = this.querySelector('h4').textContent;
        const skillLevel = Math.floor(Math.random() * 30) + 70; // 70-100%
        
        // Show skill level indicator
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(15, 23, 41, 0.95);
            border: 2px solid var(--color-neon-cyan);
            border-radius: 10px;
            padding: 2rem;
            z-index: 2000;
            text-align: center;
            animation: slideUp 0.3s ease-out;
        `;

        indicator.innerHTML = `
            <h3 style="color: var(--color-neon-cyan); margin-bottom: 1rem;">${skillName}</h3>
            <div style="
            ">
                <div style="
                    width: ${skillLevel}%;
                    height: 100%;
                    background: linear-gradient(90deg, var(--color-neon-cyan), var(--color-purple));
                    transition: width 0.5s ease-out;
                    box-shadow: 0 0 10px rgba(0, 217, 255, 0.6);
                "></div>
            </div>
            <p style="color: var(--color-gray); margin-top: 1rem;">${skillLevel}% Proficiency</p>
        `;

        document.body.appendChild(indicator);

        // Remove after 2 seconds
        setTimeout(() => {
            indicator.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => indicator.remove(), 300);
        }, 2000);
    });
});

// ========================================
// READY STATE INDICATOR
// ========================================

console.log('🚀 Cosmic Portfolio loaded successfully!');
console.log('✨ Enjoy exploring the digital cosmos!');



// ========================================
// SCROLL PROGRESS BAR
// ========================================
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scroll = `${totalScroll / windowHeight * 100}%`;
    scrollProgress.style.width = scroll;
});