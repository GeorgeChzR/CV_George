/* ========================================
   Particles Background
======================================== */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (mouse.x !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                this.x -= dx * 0.01;
                this.y -= dy * 0.01;
            }
        }

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(59, 130, 246, ${0.08 * (1 - dist / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawConnections();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();
window.addEventListener('resize', initParticles);

/* ========================================
   Navigation
======================================== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

/* ========================================
   Hero Animations with anime.js
======================================== */
const heroTexts = [
    'cat perfil.txt',
    'echo "Desarrollador Web Full Stack"',
    'git commit -m "Bienvenido a mi portafolio"',
    'npm run build --passion',
    'dotnet run --project MiPortafolio'
];

let currentTextIndex = 0;
const typedElement = document.getElementById('heroTyped');

function typeText(text, element, callback) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50 + Math.random() * 50);
        } else {
            setTimeout(() => {
                eraseText(element, callback);
            }, 2500);
        }
    }
    type();
}

function eraseText(element, callback) {
    let text = element.textContent;
    function erase() {
        if (text.length > 0) {
            text = text.slice(0, -1);
            element.textContent = text;
            setTimeout(erase, 25);
        } else {
            if (callback) callback();
        }
    }
    erase();
}

function cycleText() {
    typeText(heroTexts[currentTextIndex], typedElement, () => {
        currentTextIndex = (currentTextIndex + 1) % heroTexts.length;
        cycleText();
    });
}

// Hero entrance animations
function initHeroAnimations() {
    const heroTerminal = document.getElementById('heroTerminal');
    const heroInfo = document.getElementById('heroInfo');
    const scrollIndicator = document.getElementById('scrollIndicator');

    // Terminal entrance
    anime({
        targets: heroTerminal,
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 300,
        complete: () => {
            cycleText();
        }
    });

    // Hero info entrance
    anime({
        targets: heroInfo,
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 700
    });

    // Scroll indicator
    anime({
        targets: scrollIndicator,
        opacity: [0, 0.7],
        translateY: [-20, 0],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 1500
    });

    // Hero name character animation
    anime({
        targets: '.hero-name',
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo',
        delay: 900
    });
}

/* ========================================
   Scroll Animations with anime.js
======================================== */
function createObserver(elements, animationCallback) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animationCallback(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
}

// About section animations
function initAboutAnimations() {
    const aboutText = document.getElementById('aboutText');
    const aboutStats = document.getElementById('aboutStats');

    createObserver([aboutText], (target) => {
        anime({
            targets: target,
            opacity: [0, 1],
            translateX: [-50, 0],
            duration: 800,
            easing: 'easeOutExpo'
        });
    });

    createObserver([aboutStats], (target) => {
        // Animate stat cards
        anime({
            targets: target.querySelectorAll('.stat-card'),
            opacity: [0, 1],
            translateY: [40, 0],
            scale: [0.9, 1],
            duration: 600,
            easing: 'easeOutExpo',
            delay: anime.stagger(150)
        });

        // Animate stat numbers
        target.querySelectorAll('.stat-number').forEach(num => {
            const target_val = parseInt(num.dataset.target);
            anime({
                targets: num,
                innerHTML: [0, target_val],
                round: 1,
                duration: 2000,
                easing: 'easeOutExpo',
                delay: 300
            });
        });
    });
}

// Timeline animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    createObserver(timelineItems, (target) => {
        anime({
            targets: target,
            opacity: [0, 1],
            translateX: [-40, 0],
            duration: 800,
            easing: 'easeOutExpo'
        });

        // Stagger the tech tags
        anime({
            targets: target.querySelectorAll('.tech-tag'),
            opacity: [0, 1],
            scale: [0.5, 1],
            duration: 400,
            easing: 'easeOutBack',
            delay: anime.stagger(50, { start: 400 })
        });
    });
}

// Skills animations
function initSkillsAnimations() {
    const skillCategories = document.querySelectorAll('.skill-category');

    createObserver(skillCategories, (target) => {
        anime({
            targets: target,
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 700,
            easing: 'easeOutExpo'
        });

        // Animate skill bars
        setTimeout(() => {
            target.querySelectorAll('.skill-fill').forEach(fill => {
                const width = fill.dataset.width;
                fill.style.width = width + '%';
            });
        }, 300);

        // Animate category icon
        anime({
            targets: target.querySelector('.category-icon'),
            scale: [0, 1],
            rotate: ['-180deg', '0deg'],
            duration: 800,
            easing: 'easeOutElastic(1, 0.5)',
            delay: 200
        });
    });
}

// Education animations
function initEducationAnimations() {
    const eduCards = document.querySelectorAll('.edu-card');
    
    createObserver(document.querySelectorAll('#educationGrid'), (target) => {
        anime({
            targets: target.querySelectorAll('.edu-card'),
            opacity: [0, 1],
            translateY: [50, 0],
            scale: [0.9, 1],
            duration: 600,
            easing: 'easeOutExpo',
            delay: anime.stagger(200)
        });

        anime({
            targets: target.querySelectorAll('.edu-icon'),
            scale: [0, 1],
            duration: 800,
            easing: 'easeOutElastic(1, 0.5)',
            delay: anime.stagger(200, { start: 300 })
        });
    });

    // Languages section
    createObserver([document.getElementById('languagesSection')], (target) => {
        anime({
            targets: target.querySelectorAll('.lang-card'),
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 600,
            easing: 'easeOutExpo',
            delay: anime.stagger(200)
        });

        anime({
            targets: target.querySelectorAll('.level-dot.active'),
            scale: [0, 1],
            duration: 400,
            easing: 'easeOutBack',
            delay: anime.stagger(80, { start: 500 })
        });
    });
}

// Contact animations
function initContactAnimations() {
    const contactGrid = document.getElementById('contactGrid');

    createObserver([contactGrid], (target) => {
        anime({
            targets: target.querySelector('.contact-terminal'),
            opacity: [0, 1],
            translateX: [-50, 0],
            duration: 800,
            easing: 'easeOutExpo'
        });

        anime({
            targets: target.querySelectorAll('.contact-card'),
            opacity: [0, 1],
            translateX: [50, 0],
            duration: 600,
            easing: 'easeOutExpo',
            delay: anime.stagger(100, { start: 300 })
        });
    });
}

/* ========================================
   Hover effects with anime.js
======================================== */
document.querySelectorAll('.stat-card, .skill-category, .edu-card, .contact-card, .lang-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        anime({
            targets: card,
            scale: 1.02,
            duration: 300,
            easing: 'easeOutQuad'
        });
    });

    card.addEventListener('mouseleave', () => {
        anime({
            targets: card,
            scale: 1,
            duration: 300,
            easing: 'easeOutQuad'
        });
    });
});

/* ========================================
   Nav link click animation
======================================== */
allNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        anime({
            targets: this,
            scale: [1, 0.95, 1],
            duration: 300,
            easing: 'easeInOutQuad'
        });
    });
});

/* ========================================
   Floating code snippets
======================================== */
function createFloatingElements() {
    const codeSymbols = ['{ }', '< />', '( )', '[ ]', '= >', '&&', '||', '=>', '++', '--', '/**/', '//'];
    const hero = document.getElementById('hero');

    codeSymbols.forEach((symbol, i) => {
        const el = document.createElement('span');
        el.className = 'floating-code';
        el.textContent = symbol;
        el.style.cssText = `
            position: absolute;
            font-family: 'Fira Code', monospace;
            font-size: ${Math.random() * 14 + 10}px;
            color: rgba(59, 130, 246, ${Math.random() * 0.12 + 0.03});
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            z-index: 0;
        `;
        hero.appendChild(el);

        anime({
            targets: el,
            translateY: [
                { value: -30 + Math.random() * 60, duration: 3000 + Math.random() * 4000 },
                { value: 30 - Math.random() * 60, duration: 3000 + Math.random() * 4000 }
            ],
            translateX: [
                { value: -20 + Math.random() * 40, duration: 4000 + Math.random() * 3000 },
                { value: 20 - Math.random() * 40, duration: 4000 + Math.random() * 3000 }
            ],
            opacity: [
                { value: Math.random() * 0.15 + 0.03, duration: 2000 },
                { value: Math.random() * 0.08 + 0.02, duration: 2000 }
            ],
            rotate: {
                value: Math.random() * 20 - 10,
                duration: 6000
            },
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine',
            delay: i * 200
        });
    });
}

/* ========================================
   Initialize Everything
======================================== */
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initAboutAnimations();
    initTimelineAnimations();
    initSkillsAnimations();
    initEducationAnimations();
    initContactAnimations();
    createFloatingElements();
});
