// ===== Snowfall Effect =====
const snowCanvas = document.getElementById('snowCanvas');
const snowCtx = snowCanvas.getContext('2d');

let snowflakes = [];
const maxSnowflakes = 150;

function resizeSnowCanvas() {
    snowCanvas.width = window.innerWidth;
    snowCanvas.height = window.innerHeight;
}

function createSnowflake() {
    return {
        x: Math.random() * snowCanvas.width,
        y: Math.random() * snowCanvas.height - snowCanvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        wind: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.6 + 0.4
    };
}

function initSnowflakes() {
    snowflakes = [];
    for (let i = 0; i < maxSnowflakes; i++) {
        const flake = createSnowflake();
        flake.y = Math.random() * snowCanvas.height;
        snowflakes.push(flake);
    }
}

function drawSnowflakes() {
    snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

    snowflakes.forEach(flake => {
        snowCtx.beginPath();
        snowCtx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        snowCtx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        snowCtx.fill();

        // Add glow effect for larger snowflakes
        if (flake.radius > 2) {
            snowCtx.beginPath();
            snowCtx.arc(flake.x, flake.y, flake.radius * 2, 0, Math.PI * 2);
            const gradient = snowCtx.createRadialGradient(
                flake.x, flake.y, 0,
                flake.x, flake.y, flake.radius * 2
            );
            gradient.addColorStop(0, `rgba(0, 212, 255, ${flake.opacity * 0.3})`);
            gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
            snowCtx.fillStyle = gradient;
            snowCtx.fill();
        }
    });
}

function updateSnowflakes() {
    snowflakes.forEach(flake => {
        flake.y += flake.speed;
        flake.x += flake.wind + Math.sin(flake.y * 0.01) * 0.5;

        // Reset snowflake when it goes off screen
        if (flake.y > snowCanvas.height) {
            flake.y = -10;
            flake.x = Math.random() * snowCanvas.width;
        }
        if (flake.x > snowCanvas.width) flake.x = 0;
        if (flake.x < 0) flake.x = snowCanvas.width;
    });
}

function animateSnow() {
    updateSnowflakes();
    drawSnowflakes();
    requestAnimationFrame(animateSnow);
}

// Initialize snowfall
resizeSnowCanvas();
initSnowflakes();
animateSnow();

window.addEventListener('resize', () => {
    resizeSnowCanvas();
    initSnowflakes();
});


// ===== Ice Cursor Trail Effect =====
const cursorTrail = document.getElementById('cursorTrail');
let particles = [];
let mouseX = 0;
let mouseY = 0;
let lastMouseX = 0;
let lastMouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Only create particle if mouse moved enough
    const dx = mouseX - lastMouseX;
    const dy = mouseY - lastMouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
        createParticle(mouseX, mouseY);
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';

    // Randomize size and color
    const size = Math.random() * 8 + 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    // Random ice colors
    const colors = ['#00d4ff', '#7dd3fc', '#bae6fd', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = color;
    particle.style.boxShadow = `0 0 ${size}px ${color}, 0 0 ${size * 2}px rgba(0, 212, 255, 0.5)`;

    cursorTrail.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 800);
}


// ===== Smooth Scroll for Navigation =====
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


// ===== Parallax Effect on Hero Image =====
const heroImage = document.querySelector('.image-container');
const hero = document.querySelector('.hero');

if (heroImage && hero) {
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        heroImage.style.transform = `
            translateY(${Math.sin(Date.now() * 0.001) * 20}px)
            rotateY(${x * 10}deg)
            rotateX(${-y * 10}deg)
        `;
    });

    hero.addEventListener('mouseleave', () => {
        heroImage.style.transform = '';
    });
}


// ===== Intersection Observer for Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation to cards
document.querySelectorAll('.about-card, .social-card, .info-row').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add the animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);


// ===== Hover Sound Effect (Optional - Visual Feedback) =====
document.querySelectorAll('.btn, .nav-btn, .social-card').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
});


// ===== Typing Effect for Hero Title (Subtle) =====
const icyText = document.querySelector('.title-icy');
if (icyText) {
    // Add shimmer effect on load
    setTimeout(() => {
        icyText.style.animation = 'shimmer 3s ease-in-out infinite, textGlow 2s ease-in-out infinite alternate';
    }, 500);
}

// Add text glow animation
const glowStyle = document.createElement('style');
glowStyle.textContent = `
    @keyframes textGlow {
        from {
            text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
        }
        to {
            text-shadow: 0 0 40px rgba(0, 212, 255, 0.8), 0 0 80px rgba(0, 212, 255, 0.4);
        }
    }
`;
document.head.appendChild(glowStyle);


// ===== Ice Crystal Effect on Click =====
document.addEventListener('click', (e) => {
    createIceBurst(e.clientX, e.clientY);
});

function createIceBurst(x, y) {
    const burst = document.createElement('div');
    burst.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 9998;
    `;

    // Create multiple ice crystals
    for (let i = 0; i < 8; i++) {
        const crystal = document.createElement('div');
        const angle = (i / 8) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        const size = 4 + Math.random() * 4;

        crystal.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(135deg, #00d4ff, #ffffff);
            transform: rotate(45deg);
            opacity: 1;
            transition: all 0.5s ease-out;
        `;

        burst.appendChild(crystal);

        // Animate outward
        setTimeout(() => {
            crystal.style.transform = `
                translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)
                rotate(45deg)
                scale(0)
            `;
            crystal.style.opacity = '0';
        }, 10);
    }

    document.body.appendChild(burst);

    // Remove after animation
    setTimeout(() => {
        burst.remove();
    }, 600);
}


// ===== Navigation Background on Scroll =====
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        nav.style.background = 'rgba(10, 14, 23, 0.9)';
        nav.style.backdropFilter = 'blur(20px)';
        nav.style.padding = '16px 0';
        nav.style.borderBottom = '1px solid rgba(0, 212, 255, 0.2)';
    } else {
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'none';
        nav.style.padding = '24px 0';
        nav.style.borderBottom = 'none';
    }

    lastScroll = currentScroll;
});


// ===== Floating Emojis Random Movement =====
const floatEmojis = document.querySelectorAll('.float-emoji');
floatEmojis.forEach((emoji, index) => {
    // Add random delay and duration
    const delay = Math.random() * 2;
    const duration = 3 + Math.random() * 3;
    emoji.style.animationDelay = delay + 's';
    emoji.style.animationDuration = duration + 's';
});


// ===== Console Easter Egg =====
console.log('%c🧊 FEELIN\' ICY 🧊', 'font-size: 40px; font-weight: bold; color: #00d4ff; text-shadow: 0 0 10px #00d4ff;');
console.log('%cStay frosty, diamond hands only! 💎', 'font-size: 16px; color: #7dd3fc;');


// ===== Preloader Animation (Optional) =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
