/* ============================================
   TREASURE HUNT FINALE - ROMANTIC SCRIPTS
   Elegant Particle System + GSAP + Mobile Touch
   ============================================ */

// ============================================
// ELEGANT FALLING HEARTS
// ============================================

class FallingHearts {
    constructor() {
        this.container = document.body;
        this.hearts = [];
        this.maxHearts = 8; // Keep it minimal and elegant
        this.spawnInterval = null;

        this.init();
    }

    init() {
        this.startSpawning(2500);

        // Create initial hearts with stagger
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.createHeart(), i * 800);
        }
    }

    startSpawning(interval) {
        if (this.spawnInterval) clearInterval(this.spawnInterval);
        this.spawnInterval = setInterval(() => {
            if (this.hearts.length < this.maxHearts) {
                this.createHeart();
            }
        }, interval);
    }

    makeIntense() {
        this.maxHearts = 100; // Real rain effect
        this.startSpawning(150); // Fast spawning for "rain" feel

        // Spawn a bunch immediately to start the effect
        for (let i = 0; i < 20; i++) {
            setTimeout(() => this.createHeart(), i * 150);
        }
    }

    createHeart() {
        const heart = document.createElement('span');
        heart.className = 'falling-heart';
        heart.textContent = '♡';

        // Random horizontal position
        const startX = 10 + Math.random() * 80; // 10% to 90% of screen width
        heart.style.left = startX + '%';
        heart.style.top = '-30px';

        // Random size (bigger and more noticeable)
        const size = 1.5 + Math.random() * 1.2;
        heart.style.fontSize = size + 'rem';

        // More visible opacity
        const opacity = 0.3 + Math.random() * 0.25;
        heart.style.opacity = opacity;

        this.container.appendChild(heart);
        this.hearts.push(heart);

        // Animate falling
        const duration = 8 + Math.random() * 6; // 8-14 seconds to fall
        const swayAmount = 30 + Math.random() * 40; // Gentle horizontal sway
        const rotationAmount = -20 + Math.random() * 40; // Slight rotation

        gsap.to(heart, {
            y: window.innerHeight + 50,
            x: `+=${(Math.random() - 0.5) * swayAmount}`,
            rotation: rotationAmount,
            duration: duration,
            ease: 'none',
            onUpdate: () => {
                // Add gentle swaying motion
                const progress = gsap.getProperty(heart, 'y') / window.innerHeight;
                const sway = Math.sin(progress * Math.PI * 2) * 15;
                gsap.set(heart, { x: sway });
            },
            onComplete: () => {
                heart.remove();
                this.hearts = this.hearts.filter(h => h !== heart);
            }
        });
    }

    destroy() {
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }
        this.hearts.forEach(heart => heart.remove());
        this.hearts = [];
    }
}

// ============================================
// ELEGANT FLOATING PARTICLES BACKGROUND
// ============================================

class FloatingParticles {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });

        this.particles = [];
        this.mouse = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 50;

        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    createParticles() {
        // Soft, warm colors
        const colors = [
            0xE8A5A5, // rose
            0xD4847C, // coral
            0xC5B5B5, // soft gray
            0xFBF0ED, // blush
        ];

        // Create different particle types for visual variety
        for (let i = 0; i < 60; i++) {
            const isCircle = Math.random() > 0.3;
            const size = isCircle ? 0.15 + Math.random() * 0.4 : 0.1 + Math.random() * 0.25;

            let geometry;
            if (isCircle) {
                geometry = new THREE.CircleGeometry(size, 16);
            } else {
                // Small diamond shape
                geometry = new THREE.CircleGeometry(size, 4);
            }

            const color = colors[Math.floor(Math.random() * colors.length)];
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.08 + Math.random() * 0.12,
                side: THREE.DoubleSide
            });

            const mesh = new THREE.Mesh(geometry, material);

            // Spread particles across the scene
            mesh.position.x = (Math.random() - 0.5) * 80;
            mesh.position.y = (Math.random() - 0.5) * 60;
            mesh.position.z = (Math.random() - 0.5) * 30 - 10;

            // Random rotation for diamonds
            if (!isCircle) {
                mesh.rotation.z = Math.PI / 4;
            }

            mesh.userData = {
                originalX: mesh.position.x,
                originalY: mesh.position.y,
                speedX: 0.1 + Math.random() * 0.2,
                speedY: 0.15 + Math.random() * 0.25,
                amplitudeX: 2 + Math.random() * 4,
                amplitudeY: 3 + Math.random() * 5,
                phaseX: Math.random() * Math.PI * 2,
                phaseY: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.002
            };

            this.scene.add(mesh);
            this.particles.push(mesh);
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true });
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    onTouchMove(e) {
        if (e.touches.length > 0) {
            this.mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        this.particles.forEach((particle) => {
            const data = particle.userData;

            // Gentle floating motion
            particle.position.x = data.originalX +
                Math.sin(time * data.speedX + data.phaseX) * data.amplitudeX;
            particle.position.y = data.originalY +
                Math.sin(time * data.speedY + data.phaseY) * data.amplitudeY;

            // Very subtle rotation
            particle.rotation.z += data.rotationSpeed;

            // Subtle mouse parallax
            particle.position.x += this.mouse.x * 0.3;
            particle.position.y += this.mouse.y * 0.3;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// ============================================
// MAIN APP
// ============================================

class RomanticApp {
    constructor() {
        this.currentScreen = 'screen0';
        this.giftsOpened = 0;
        this.currentReason = 0;
        this.reasonInterval = null;
        this.noButtonEscapeCount = 0;
        this.teaseMessages = [
            "Nice try",
            "Not that easy",
            "The answer is Yes",
            "Keep trying...",
            "You can't escape",
            "Just say Yes",
            "I'll keep running",
            "You know you want to",
            "Come on...",
            "Almost got it"
        ];

        this.init();
    }

    init() {
        // Initialize elegant particle background
        new FloatingParticles();

        // Initialize falling hearts
        this.fallingHearts = new FallingHearts();

        // Setup event listeners
        this.setupTreasureHunt();
        this.setupPassword();
        this.setupButtons();
        this.setupNoButtonEscape();

        // Animate in first screen
        this.animateScreenIn('screen0');
    }

    // Screen Navigation
    showScreen(screenId) {
        const currentScreenEl = document.querySelector('.screen.active');
        const targetScreen = document.getElementById(screenId);

        if (currentScreenEl) {
            currentScreenEl.classList.remove('active');
        }

        setTimeout(() => {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            this.animateScreenIn(screenId);
        }, 100);
    }

    animateScreenIn(screenId) {
        const screen = document.getElementById(screenId);
        const elements = screen.querySelectorAll('.eyebrow, .headline, .sub-headline, .btn, .gift-card, .letter-container, .reason-slider, .celebration-heart, .celebration-text, .soft-text, .final-accent, .final-headline, .final-subtext, .final-signature, .victory-icon, .celebration-headline, .password-card');

        gsap.fromTo(elements,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            }
        );
    }

    // Treasure Hunt Setup
    setupTreasureHunt() {
        const claimPrizeBtn = document.getElementById('claimPrizeBtn');
        const music1 = document.getElementById('music1');

        if (claimPrizeBtn) {
            claimPrizeBtn.addEventListener('click', () => {
                if (music1) {
                    music1.play().catch(e => console.log("Music 1 play blocked:", e));
                }
                this.createConfetti();
                setTimeout(() => {
                    this.showScreen('screenPassword');
                }, 300);
            });
        }
    }

    // Password Setup
    setupPassword() {
        const passwordInput = document.getElementById('passwordInput');
        const submitPasswordBtn = document.getElementById('submitPasswordBtn');
        const errorMessage = document.getElementById('errorMessage');

        const checkPassword = () => {
            const password = passwordInput.value.toLowerCase().trim();
            const correctPassword = 'i love you';

            if (password === correctPassword) {
                // Success!
                gsap.to('.password-card', {
                    scale: 0.95,
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        this.createConfetti();
                        this.showScreen('screen1');
                    }
                });
            } else {
                // Show error
                errorMessage.classList.add('show');
                gsap.fromTo(passwordInput,
                    { x: -10 },
                    { x: 10, duration: 0.1, repeat: 3, yoyo: true, ease: 'power2.inOut' }
                );

                // Hide error after 3 seconds
                setTimeout(() => {
                    errorMessage.classList.remove('show');
                }, 3000);
            }
        };

        if (submitPasswordBtn) {
            submitPasswordBtn.addEventListener('click', checkPassword);
        }

        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    checkPassword();
                }
            });
        }
    }

    // No Button Escape - Touch & Mouse
    setupNoButtonEscape() {
        const noBtn = document.getElementById('noBtn');
        const teaseText = document.getElementById('teaseText');

        if (!noBtn) return;

        const escapeButton = (e) => {
            e.preventDefault();

            const button = noBtn;
            const buttonRect = button.getBoundingClientRect();
            const buttonGroup = button.closest('.button-group');
            const containerRect = buttonGroup.getBoundingClientRect();

            // Get touch/mouse position
            let touchX, touchY;
            if (e.type.includes('touch')) {
                touchX = e.touches[0].clientX;
                touchY = e.touches[0].clientY;
            } else {
                touchX = e.clientX;
                touchY = e.clientY;
            }

            // Calculate escape direction (away from finger)
            const buttonCenterX = buttonRect.left + buttonRect.width / 2;
            const buttonCenterY = buttonRect.top + buttonRect.height / 2;

            const dirX = buttonCenterX - touchX;
            const dirY = buttonCenterY - touchY;

            // Normalize and scale
            const length = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
            const escapeDistance = 80 + Math.random() * 40;

            let newX = (dirX / length) * escapeDistance;
            let newY = (dirY / length) * escapeDistance;

            // Add some randomness
            newX += (Math.random() - 0.5) * 60;
            newY += (Math.random() - 0.5) * 40;

            // Keep within bounds
            const maxX = (containerRect.width / 2) - (buttonRect.width / 2) - 10;
            const maxY = 60;

            // Get current transform
            const currentTransform = new DOMMatrix(getComputedStyle(button).transform);
            let currentX = currentTransform.m41;
            let currentY = currentTransform.m42;

            // Calculate new position
            let targetX = currentX + newX;
            let targetY = currentY + newY;

            // Clamp to bounds
            targetX = Math.max(-maxX, Math.min(maxX, targetX));
            targetY = Math.max(-maxY, Math.min(maxY, targetY));

            // Animate escape
            button.classList.add('escaping');
            gsap.to(button, {
                x: targetX,
                y: targetY,
                duration: 0.15,
                ease: 'power2.out',
                onComplete: () => {
                    button.classList.remove('escaping');
                }
            });

            // Show tease message
            this.noButtonEscapeCount++;
            if (teaseText) {
                teaseText.textContent = this.teaseMessages[this.noButtonEscapeCount % this.teaseMessages.length];
                teaseText.classList.add('show');

                // Hide after a while
                setTimeout(() => {
                    teaseText.classList.remove('show');
                }, 2000);
            }
        };

        // Mouse events
        noBtn.addEventListener('mouseenter', escapeButton);
        noBtn.addEventListener('mousemove', escapeButton);

        // Touch events - escape when finger gets close
        document.addEventListener('touchmove', (e) => {
            if (this.currentScreen !== 'screen1') return;

            const touch = e.touches[0];
            const buttonRect = noBtn.getBoundingClientRect();

            // Check if finger is near the button (within 50px)
            const proximity = 50;
            const isNear = (
                touch.clientX > buttonRect.left - proximity &&
                touch.clientX < buttonRect.right + proximity &&
                touch.clientY > buttonRect.top - proximity &&
                touch.clientY < buttonRect.bottom + proximity
            );

            if (isNear) {
                escapeButton(e);
            }
        }, { passive: false });

        // Prevent actual click on No button
        noBtn.addEventListener('click', (e) => {
            e.preventDefault();
            escapeButton(e);
        });

        noBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            escapeButton(e);
        }, { passive: false });
    }

    // Button Setup
    setupButtons() {
        const yesBtn = document.getElementById('yesBtn');
        const tryAgainBtn = document.getElementById('tryAgainBtn');
        const noBtn = document.getElementById('noBtn');
        const music1 = document.getElementById('music1');
        const music2 = document.getElementById('music2');

        // Yes button
        if (yesBtn) {
            yesBtn.addEventListener('click', () => {
                if (music1) {
                    music1.pause();
                    music1.currentTime = 0;
                }
                if (music2) {
                    music2.play().catch(e => console.log("Music 2 play blocked:", e));
                }
                this.fallingHearts.makeIntense();
                this.showScreen('screen3');
                this.createConfetti();
            });
        }

        // Try again
        if (tryAgainBtn) {
            tryAgainBtn.addEventListener('click', () => {
                this.showScreen('screen1');
                if (noBtn) {
                    gsap.to(noBtn, { x: 0, y: 0, duration: 0.3 });
                }
                this.noButtonEscapeCount = 0;
            });
        }

        // Restart
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.resetApp();
                this.showScreen('screen0');
            });
        }
    }

    // Gift Cards
    setupGifts() {
        const gifts = document.querySelectorAll('.gift-card');

        gifts.forEach((gift) => {
            const handleGiftClick = () => {
                if (!gift.classList.contains('opened')) {
                    gift.classList.add('opened');
                    this.giftsOpened++;

                    // Add nice animation
                    gsap.fromTo(gift,
                        { scale: 0.95 },
                        { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' }
                    );

                    // Create mini burst
                    this.createMiniBurst(gift);

                    // If all opened, go to letter
                    if (this.giftsOpened >= 3) {
                        setTimeout(() => {
                            this.showScreen('screen4');
                        }, 800);
                    }
                }
            };

            gift.addEventListener('click', handleGiftClick);
            gift.addEventListener('touchend', (e) => {
                e.preventDefault();
                handleGiftClick();
            });
        });
    }

    createMiniBurst(element) {
        const rect = element.getBoundingClientRect();
        const symbols = ['♡', '✦', '✧', '·'];

        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('span');
            particle.className = 'confetti-particle';
            particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            particle.style.left = rect.left + rect.width / 2 + 'px';
            particle.style.top = rect.top + rect.height / 2 + 'px';
            particle.style.color = '#E8A5A5';

            document.body.appendChild(particle);

            const angle = (i / 6) * Math.PI * 2;
            const distance = 40 + Math.random() * 30;

            gsap.to(particle, {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance - 20,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                onComplete: () => particle.remove()
            });
        }
    }

    // Reason Slider
    setupReasonSlider() {
        const dots = document.querySelectorAll('.dot');

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToReason(index);
            });
            dot.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.goToReason(index);
            });
        });
    }

    startReasonSlider() {
        if (this.reasonInterval) clearInterval(this.reasonInterval);

        this.reasonInterval = setInterval(() => {
            const nextIndex = (this.currentReason + 1) % 5;
            this.goToReason(nextIndex);
        }, 3000);
    }

    goToReason(index) {
        const reasons = document.querySelectorAll('.reason');
        const dots = document.querySelectorAll('.dot');

        reasons[this.currentReason].classList.remove('active');
        dots[this.currentReason].classList.remove('active');

        this.currentReason = index;

        reasons[this.currentReason].classList.add('active');
        dots[this.currentReason].classList.add('active');
    }

    // Confetti
    createConfetti() {
        const symbols = ['♡', '✦', '✧', '·', '○'];
        const colors = ['#E8A5A5', '#D4847C', '#C26E6E', '#FDF8F5'];

        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const particle = document.createElement('span');
                particle.className = 'confetti-particle';
                particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = '-20px';
                particle.style.color = colors[Math.floor(Math.random() * colors.length)];
                particle.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';

                document.body.appendChild(particle);

                gsap.to(particle, {
                    y: window.innerHeight + 50,
                    x: (Math.random() - 0.5) * 100,
                    rotation: Math.random() * 360,
                    opacity: 0,
                    duration: 2 + Math.random(),
                    ease: 'power1.in',
                    onComplete: () => particle.remove()
                });
            }, i * 50);
        }
    }

    createFinalConfetti() {
        const symbols = ['♡', '✦', '✧'];

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('span');
                particle.className = 'confetti-particle';
                particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = '-20px';
                particle.style.color = '#E8A5A5';
                particle.style.fontSize = (1 + Math.random() * 0.5) + 'rem';
                particle.style.opacity = 0.6;

                document.body.appendChild(particle);

                gsap.to(particle, {
                    y: window.innerHeight + 50,
                    x: (Math.random() - 0.5) * 80,
                    opacity: 0,
                    duration: 3 + Math.random(),
                    ease: 'power1.in',
                    onComplete: () => particle.remove()
                });
            }, i * 100);
        }
    }

    // Reset
    resetApp() {
        // Reset gifts
        document.querySelectorAll('.gift-card').forEach(gift => {
            gift.classList.remove('opened');
        });
        this.giftsOpened = 0;

        // Reset reason slider
        if (this.reasonInterval) clearInterval(this.reasonInterval);
        this.currentReason = 0;

        const reasons = document.querySelectorAll('.reason');
        const dots = document.querySelectorAll('.dot');

        reasons.forEach((r, i) => {
            r.classList.toggle('active', i === 0);
        });
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === 0);
        });

        // Reset no button
        const noBtn = document.getElementById('noBtn');
        if (noBtn) {
            gsap.to(noBtn, { x: 0, y: 0, duration: 0.3 });
        }
        this.noButtonEscapeCount = 0;

        // Reset password input
        const passwordInput = document.getElementById('passwordInput');
        if (passwordInput) {
            passwordInput.value = '';
        }

        // Hide error message
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.classList.remove('show');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new RomanticApp();
});
