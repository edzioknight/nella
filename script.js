// Revolutionary Interactive Love Experience
class LoveExperience {
    constructor() {
        this.particles = [];
        this.hearts = [];
        this.stars = [];
        this.touchPoints = [];
        this.isLoaded = false;
        this.currentSection = 0;
        this.magneticElements = [];
        this.audioContext = null;
        this.isAudioEnabled = false;
        this.backgroundMusicBuffer = null;
        this.backgroundMusicSource = null;
        this.backgroundMusicGain = null;
        this.audioUnlocked = false;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.setupMagneticCursor();
        this.setupIntersectionObserver();
        this.setupTouchInteractions();
        this.setupAudioSystem();
        this.loadBackgroundMusic();
        this.setupAutoplayOnInteraction();
        this.startLoadingSequence();
    }
    
    // Loading System
    startLoadingSequence() {
        const loadingScreen = document.getElementById('loadingScreen');
        const progress = document.querySelector('.loading-progress');
        
        let loadProgress = 0;
        const loadInterval = setInterval(() => {
            loadProgress += Math.random() * 15;
            if (loadProgress >= 100) {
                loadProgress = 100;
                clearInterval(loadInterval);
                
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    this.isLoaded = true;
                    this.startExperience();
                }, 1000);
            }
            progress.style.width = loadProgress + '%';
        }, 200);
    }
    
    startExperience() {
        this.animateParticles();
        this.createAmbientEffects();
    }
    
    // Canvas Setup
    setupCanvas() {
        this.particleCanvas = document.getElementById('particleCanvas');
        this.heartCanvas = document.getElementById('heartCanvas');
        this.starCanvas = document.getElementById('starCanvas');
        
        this.particleCtx = this.particleCanvas.getContext('2d');
        this.heartCtx = this.heartCanvas.getContext('2d');
        this.starCtx = this.starCanvas.getContext('2d');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const canvases = [this.particleCanvas, this.heartCanvas, this.starCanvas];
        canvases.forEach(canvas => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        
        this.initializeParticles();
    }
    
    // Particle Systems
    initializeParticles() {
        this.particles = [];
        this.hearts = [];
        this.stars = [];
        
        const particleCount = window.innerWidth < 768 ? 30 : 60;
        const heartCount = window.innerWidth < 768 ? 10 : 20;
        const starCount = window.innerWidth < 768 ? 15 : 30;
        
        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
        
        // Initialize hearts
        for (let i = 0; i < heartCount; i++) {
            this.hearts.push(this.createHeart());
        }
        
        // Initialize stars
        for (let i = 0; i < starCount; i++) {
            this.stars.push(this.createStar());
        }
    }
    
    createParticle() {
        return {
            x: Math.random() * this.particleCanvas.width,
            y: Math.random() * this.particleCanvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.6 + 0.2,
            hue: Math.random() * 60 + 300,
            life: Math.random() * 100 + 50,
            maxLife: 150,
            pulse: Math.random() * Math.PI * 2
        };
    }
    
    createHeart() {
        return {
            x: Math.random() * this.heartCanvas.width,
            y: Math.random() * this.heartCanvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 8 + 4,
            opacity: Math.random() * 0.4 + 0.3,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            pulse: Math.random() * Math.PI * 2,
            color: `hsl(${320 + Math.random() * 40}, 100%, 70%)`
        };
    }
    
    createStar() {
        return {
            x: Math.random() * this.starCanvas.width,
            y: Math.random() * this.starCanvas.height,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.8 + 0.2,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.03 + 0.01,
            brightness: Math.random() * 0.5 + 0.5
        };
    }
    
    // Animation Loop
    animateParticles() {
        if (!this.isLoaded) return;
        
        this.updateParticles();
        this.updateHearts();
        this.updateStars();
        
        this.drawParticles();
        this.drawHearts();
        this.drawStars();
        
        requestAnimationFrame(() => this.animateParticles());
    }
    
    updateParticles() {
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.pulse += 0.02;
            particle.life--;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.particleCanvas.width;
            if (particle.x > this.particleCanvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.particleCanvas.height;
            if (particle.y > this.particleCanvas.height) particle.y = 0;
            
            // Mouse interaction
            if (this.mouseX && this.mouseY) {
                const dx = this.mouseX - particle.x;
                const dy = this.mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    particle.vx += dx * force * 0.001;
                    particle.vy += dy * force * 0.001;
                }
            }
            
            // Regenerate particle
            if (particle.life <= 0) {
                this.particles[index] = this.createParticle();
            }
            
            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }
    
    updateHearts() {
        this.hearts.forEach(heart => {
            heart.x += heart.vx;
            heart.y += heart.vy;
            heart.rotation += heart.rotationSpeed;
            heart.pulse += 0.03;
            
            // Wrap around edges
            if (heart.x < -20) heart.x = this.heartCanvas.width + 20;
            if (heart.x > this.heartCanvas.width + 20) heart.x = -20;
            if (heart.y < -20) heart.y = this.heartCanvas.height + 20;
            if (heart.y > this.heartCanvas.height + 20) heart.y = -20;
        });
    }
    
    updateStars() {
        this.stars.forEach(star => {
            star.x += star.vx;
            star.y += star.vy;
            star.twinkle += star.twinkleSpeed;
            
            // Wrap around edges
            if (star.x < 0) star.x = this.starCanvas.width;
            if (star.x > this.starCanvas.width) star.x = 0;
            if (star.y < 0) star.y = this.starCanvas.height;
            if (star.y > this.starCanvas.height) star.y = 0;
        });
    }
    
    // Drawing Functions
    drawParticles() {
        this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
        
        this.particles.forEach(particle => {
            const pulseOpacity = particle.opacity * (0.5 + 0.5 * Math.sin(particle.pulse));
            const lifeRatio = particle.life / particle.maxLife;
            
            this.particleCtx.beginPath();
            this.particleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            
            const gradient = this.particleCtx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 80%, ${pulseOpacity * lifeRatio})`);
            gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 80%, 0)`);
            
            this.particleCtx.fillStyle = gradient;
            this.particleCtx.fill();
        });
    }
    
    drawHearts() {
        this.heartCtx.clearRect(0, 0, this.heartCanvas.width, this.heartCanvas.height);
        
        this.hearts.forEach(heart => {
            const pulseSize = heart.size * (0.8 + 0.2 * Math.sin(heart.pulse));
            const pulseOpacity = heart.opacity * (0.7 + 0.3 * Math.sin(heart.pulse));
            
            this.heartCtx.save();
            this.heartCtx.translate(heart.x, heart.y);
            this.heartCtx.rotate(heart.rotation);
            this.heartCtx.globalAlpha = pulseOpacity;
            
            // Draw heart shape
            this.heartCtx.beginPath();
            this.heartCtx.moveTo(0, pulseSize * 0.3);
            this.heartCtx.bezierCurveTo(-pulseSize * 0.5, -pulseSize * 0.2, -pulseSize, -pulseSize * 0.2, 0, pulseSize * 0.8);
            this.heartCtx.bezierCurveTo(pulseSize, -pulseSize * 0.2, pulseSize * 0.5, -pulseSize * 0.2, 0, pulseSize * 0.3);
            
            const gradient = this.heartCtx.createRadialGradient(0, 0, 0, 0, 0, pulseSize);
            gradient.addColorStop(0, heart.color);
            gradient.addColorStop(1, 'transparent');
            
            this.heartCtx.fillStyle = gradient;
            this.heartCtx.fill();
            
            this.heartCtx.restore();
        });
    }
    
    drawStars() {
        this.starCtx.clearRect(0, 0, this.starCanvas.width, this.starCanvas.height);
        
        this.stars.forEach(star => {
            const twinkleOpacity = star.opacity * (0.3 + 0.7 * Math.sin(star.twinkle)) * star.brightness;
            
            this.starCtx.beginPath();
            this.starCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            
            const gradient = this.starCtx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, star.size * 4
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${twinkleOpacity})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${twinkleOpacity * 0.5})`);
            gradient.addColorStop(1, 'transparent');
            
            this.starCtx.fillStyle = gradient;
            this.starCtx.fill();
            
            // Add sparkle effect
            if (Math.random() < 0.02) {
                this.starCtx.beginPath();
                this.starCtx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                this.starCtx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity * 0.8})`;
                this.starCtx.fill();
            }
        });
    }
    
    // Magnetic Cursor System
    setupMagneticCursor() {
        this.cursor = document.querySelector('.magnetic-cursor');
        this.cursorInner = document.querySelector('.cursor-inner');
        this.cursorOuter = document.querySelector('.cursor-outer');
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        
        this.updateCursor();
    }
    
    // Setup autoplay on first user interaction
    setupAutoplayOnInteraction() {
        const unlockAudio = () => {
            if (!this.audioUnlocked && this.audioContext) {
                // Resume audio context if suspended
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        this.audioUnlocked = true;
                        this.startBackgroundMusic();
                        console.log('Audio unlocked and background music started');
                    }).catch(e => {
                        console.log('Failed to resume audio context:', e);
                    });
                } else {
                    this.audioUnlocked = true;
                    this.startBackgroundMusic();
                    console.log('Audio unlocked and background music started');
                }
                
                // Update audio button to show music is playing
                const audioBtn = document.getElementById('audioBtn');
                const audioIcon = audioBtn.querySelector('.audio-icon');
                audioIcon.textContent = '🎵';
                audioBtn.style.opacity = '1';
                
                // Remove event listeners after first interaction
                document.removeEventListener('click', unlockAudio);
                document.removeEventListener('touchstart', unlockAudio);
                document.removeEventListener('keydown', unlockAudio);
            }
        };
        
        // Add event listeners for first user interaction
        document.addEventListener('click', unlockAudio);
        document.addEventListener('touchstart', unlockAudio);
        document.addEventListener('keydown', unlockAudio);
    }
    
    // Start background music (called after audio is unlocked)
    startBackgroundMusic() {
        if (this.audioUnlocked && this.backgroundMusicBuffer) {
            this.isAudioEnabled = true;
            this.playBackgroundMusic();
        }
    }
    
    updateCursor() {
        this.cursorX += (this.mouseX - this.cursorX) * 0.1;
        this.cursorY += (this.mouseY - this.cursorY) * 0.1;
        
        this.cursorInner.style.left = this.cursorX + 'px';
        this.cursorInner.style.top = this.cursorY + 'px';
        
        this.cursorOuter.style.left = this.cursorX + 'px';
        this.cursorOuter.style.top = this.cursorY + 'px';
        
        requestAnimationFrame(() => this.updateCursor());
    }
    
    // Setup magnetic interactions for elements
    setupMagneticInteractions() {
        const magneticElements = document.querySelectorAll('.portal-button, .element, .constellation-star, .garden-flower');
        
        magneticElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursorOuter.classList.add('active');
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursorOuter.classList.remove('active');
            });
        });
    }
    
    // Touch Interaction System
    setupTouchInteractions() {
        const rippleContainer = document.getElementById('rippleContainer');
        
        // Touch/Click ripple effect
        const createRipple = (x, y, intensity = 1) => {
            const ripple = document.createElement('div');
            ripple.className = 'touch-ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = (100 * intensity) + 'px';
            ripple.style.height = (100 * intensity) + 'px';
            
            rippleContainer.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 1500);
            
            this.createParticleBurst(x, y, intensity);
            this.triggerHapticFeedback();
        };
        
        // Touch events
        document.addEventListener('touchstart', (e) => {
            Array.from(e.touches).forEach(touch => {
                createRipple(touch.clientX, touch.clientY, 1.2);
            });
        });
        
        // Mouse events
        document.addEventListener('mousedown', (e) => {
            createRipple(e.clientX, e.clientY);
        });
        
        // Special interactions for message blocks
        this.setupMessageBlockInteractions();
    }
    
    setupMessageBlockInteractions() {
        const messageBlocks = document.querySelectorAll('.message-block');
        
        messageBlocks.forEach((block, index) => {
            let touchStartTime = 0;
            let touchStartPos = { x: 0, y: 0 };
            let isLongPress = false;
            
            // Touch start
            block.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                isLongPress = false;
                
                // Long press detection
                setTimeout(() => {
                    if (Date.now() - touchStartTime >= 800) {
                        isLongPress = true;
                        this.handleLongPress(block, index);
                    }
                }, 800);
            });
            
            // Touch end
            block.addEventListener('touchend', (e) => {
                const touchDuration = Date.now() - touchStartTime;
                const touchEndPos = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
                const distance = Math.sqrt(
                    Math.pow(touchEndPos.x - touchStartPos.x, 2) + 
                    Math.pow(touchEndPos.y - touchStartPos.y, 2)
                );
                
                if (!isLongPress) {
                    if (touchDuration < 300 && distance < 10) {
                        // Single tap
                        this.handleTap(block, index);
                    } else if (touchDuration < 300 && distance > 50) {
                        // Swipe
                        this.handleSwipe(block, index, touchStartPos, touchEndPos);
                    }
                }
            });
            
            // Double tap detection
            let lastTap = 0;
            block.addEventListener('touchend', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                
                if (tapLength < 500 && tapLength > 0) {
                    this.handleDoubleTap(block, index);
                }
                lastTap = currentTime;
            });
        });
    }
    
    handleTap(block, index) {
        this.animateBlockReveal(block);
        this.createLoveExplosion(block);
    }
    
    handleDoubleTap(block, index) {
        this.createHeartShower(block);
        this.playLoveSound();
    }
    
    handleLongPress(block, index) {
        this.revealSecretMessage(block, index);
        this.createMagicalAura(block);
    }
    
    handleSwipe(block, index, startPos, endPos) {
        const direction = this.getSwipeDirection(startPos, endPos);
        this.createSwipeTrail(startPos, endPos);
        this.animateSwipeEffect(block, direction);
    }
    
    getSwipeDirection(startPos, endPos) {
        const dx = endPos.x - startPos.x;
        const dy = endPos.y - startPos.y;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'right' : 'left';
        } else {
            return dy > 0 ? 'down' : 'up';
        }
    }
    
    createSwipeTrail(startPos, endPos) {
        const trail = document.createElement('div');
        trail.className = 'love-trail';
        trail.style.left = startPos.x + 'px';
        trail.style.top = startPos.y + 'px';
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.style.left = endPos.x + 'px';
            trail.style.top = endPos.y + 'px';
        }, 50);
        
        setTimeout(() => {
            trail.remove();
        }, 2000);
    }
    
    animateSwipeEffect(block, direction) {
        const originalTransform = block.style.transform;
        
        switch (direction) {
            case 'right':
                block.style.transform = 'translateX(20px) rotateY(10deg)';
                break;
            case 'left':
                block.style.transform = 'translateX(-20px) rotateY(-10deg)';
                break;
            case 'up':
                block.style.transform = 'translateY(-20px) rotateX(10deg)';
                break;
            case 'down':
                block.style.transform = 'translateY(20px) rotateX(-10deg)';
                break;
        }
        
        setTimeout(() => {
            block.style.transform = originalTransform;
        }, 300);
    }
    
    animateBlockReveal(block) {
        block.style.transform = 'scale(1.05)';
        block.style.boxShadow = '0 20px 40px rgba(255, 107, 157, 0.3)';
        
        setTimeout(() => {
            block.style.transform = '';
            block.style.boxShadow = '';
        }, 300);
    }
    
    revealSecretMessage(block, index) {
        const secretMessages = [
            "You bring light to my world, Nella 🌟",
            "Every conversation with you is a gift 💫",
            "You're my favorite person, my best friend 💕",
            "Pakistan to France means nothing when you mean everything 🌙",
            "You make everything feel lighter ✨",
            "I'm so grateful for you, especially during tough times 💖",
            "You're worth every mile between us, and more 🌈",
            "My heart smiles when I think of you, even when I'm tired 😊",
            "You're my safe place, my home 🏠"
        ];
        
        const message = secretMessages[index] || "You're absolutely amazing, Nella 💕";
        this.showModal(message);
    }
    
    // Special Effects
    createParticleBurst(x, y, intensity = 1) {
        const particleCount = Math.floor(8 * intensity);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle-burst';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const endX = x + Math.cos(angle) * velocity;
            const endY = y + Math.sin(angle) * velocity;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.style.transform = `translate(${endX - x}px, ${endY - y}px) scale(0)`;
                particle.style.opacity = '0';
            }, 50);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
    
    createLoveExplosion(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 12; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '💖';
            heart.style.position = 'fixed';
            heart.style.left = centerX + 'px';
            heart.style.top = centerY + 'px';
            heart.style.fontSize = '1.5rem';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '9999';
            heart.style.transition = 'all 2s ease-out';
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                const angle = (i / 12) * Math.PI * 2;
                const distance = 100 + Math.random() * 100;
                const endX = centerX + Math.cos(angle) * distance;
                const endY = centerY + Math.sin(angle) * distance;
                
                heart.style.transform = `translate(${endX - centerX}px, ${endY - centerY}px) scale(0) rotate(720deg)`;
                heart.style.opacity = '0';
            }, 100);
            
            setTimeout(() => {
                heart.remove();
            }, 2100);
        }
    }
    
    createHeartShower(element) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = ['💕', '💖', '💗', '💘'][Math.floor(Math.random() * 4)];
                heart.style.position = 'fixed';
                heart.style.left = (rect.left + Math.random() * rect.width) + 'px';
                heart.style.top = (rect.top - 20) + 'px';
                heart.style.fontSize = (1 + Math.random()) + 'rem';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '9999';
                heart.style.transition = 'all 3s ease-out';
                
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    heart.style.transform = `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`;
                    heart.style.opacity = '0';
                }, 100);
                
                setTimeout(() => {
                    heart.remove();
                }, 3100);
            }, i * 100);
        }
    }
    
    createMagicalAura(element) {
        element.style.boxShadow = '0 0 50px rgba(255, 107, 157, 0.8), 0 0 100px rgba(196, 113, 237, 0.6)';
        element.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            element.style.boxShadow = '';
            element.style.transform = '';
        }, 2000);
    }
    
    // Event Listeners
    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // Portal button
        const portalBtn = document.getElementById('portalBtn');
        portalBtn.addEventListener('click', () => {
            this.transitionToMessage();
        });
        
        // Floating elements
        const elements = document.querySelectorAll('.element');
        elements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.showElementMessage(element);
            });
        });
        
        // Constellation stars
        const stars = document.querySelectorAll('.constellation-star');
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                this.revealConstellationMessage(star);
            });
        });
        
        // Garden flowers
        const flowers = document.querySelectorAll('.garden-flower');
        flowers.forEach(flower => {
            flower.addEventListener('click', (e) => {
                this.bloomFlower(flower);
            });
        });
        
        // Modal close
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.querySelector('.modal-close');
        
        modalClose.addEventListener('click', () => {
            this.closeModal();
        });
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeModal();
            }
        });
        
        // Audio controls
        const audioBtn = document.getElementById('audioBtn');
        audioBtn.addEventListener('click', () => {
            this.toggleAudio();
        });
    }
    
    // Transition Effects
    transitionToMessage() {
        const messageSection = document.getElementById('messageSection');
        
        // Create transition effect
        this.createTransitionPortal();
        
        setTimeout(() => {
            messageSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            setTimeout(() => {
                messageSection.classList.add('visible');
                this.animateMessageBlocks();
            }, 800);
        }, 1000);
    }
    
    createTransitionPortal() {
        const portal = document.createElement('div');
        portal.style.position = 'fixed';
        portal.style.top = '50%';
        portal.style.left = '50%';
        portal.style.width = '0';
        portal.style.height = '0';
        portal.style.background = 'radial-gradient(circle, rgba(255, 107, 157, 0.9), rgba(196, 113, 237, 0.9))';
        portal.style.borderRadius = '50%';
        portal.style.transform = 'translate(-50%, -50%)';
        portal.style.zIndex = '9998';
        portal.style.transition = 'all 1.5s ease-out';
        
        document.body.appendChild(portal);
        
        setTimeout(() => {
            portal.style.width = '200vmax';
            portal.style.height = '200vmax';
        }, 100);
        
        setTimeout(() => {
            portal.remove();
        }, 2000);
    }
    
    animateMessageBlocks() {
        const blocks = document.querySelectorAll('.message-block');
        
        blocks.forEach((block, index) => {
            setTimeout(() => {
                block.classList.add('visible');
                this.createBlockEntryEffect(block);
            }, index * 300);
        });
    }
    
    createBlockEntryEffect(block) {
        const sparkles = [];
        const rect = block.getBoundingClientRect();
        
        for (let i = 0; i < 6; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'fixed';
            sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            sparkle.style.fontSize = '1rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '9999';
            sparkle.style.animation = 'sparkle 2s ease-out forwards';
            
            document.body.appendChild(sparkle);
            sparkles.push(sparkle);
        }
        
        setTimeout(() => {
            sparkles.forEach(sparkle => sparkle.remove());
        }, 2000);
    }
    
    // Modal System
    showModal(message) {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalMessage = document.getElementById('modalMessage');
        
        modalMessage.textContent = message;
        modalOverlay.classList.add('active');
    }
    
    closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.classList.remove('active');
    }
    
    showElementMessage(element) {
        const message = element.getAttribute('data-message');
        this.showModal(message);
        this.createLoveExplosion(element);
    }
    
    revealConstellationMessage(star) {
        const message = star.getAttribute('data-message');
        this.showModal(message);
        this.createStarBurst(star);
    }
    
    createStarBurst(star) {
        const rect = star.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '⭐';
            sparkle.style.position = 'fixed';
            sparkle.style.left = centerX + 'px';
            sparkle.style.top = centerY + 'px';
            sparkle.style.fontSize = '1rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '9999';
            sparkle.style.transition = 'all 1.5s ease-out';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                const angle = (i / 8) * Math.PI * 2;
                const distance = 80;
                const endX = centerX + Math.cos(angle) * distance;
                const endY = centerY + Math.sin(angle) * distance;
                
                sparkle.style.transform = `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`;
                sparkle.style.opacity = '0';
            }, 100);
            
            setTimeout(() => {
                sparkle.remove();
            }, 1600);
        }
    }
    
    bloomFlower(flower) {
        const memory = flower.getAttribute('data-memory');
        this.showModal(memory);
        
        flower.style.transform = 'scale(1.5) rotate(360deg)';
        flower.style.boxShadow = '0 0 40px rgba(255, 107, 157, 0.8)';
        
        setTimeout(() => {
            flower.style.transform = '';
            flower.style.boxShadow = '';
        }, 1000);
    }
    
    // Audio System
    setupAudioSystem() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.backgroundMusicGain = this.audioContext.createGain();
            this.backgroundMusicGain.connect(this.audioContext.destination);
            this.backgroundMusicGain.gain.setValueAtTime(0.3, this.audioContext.currentTime); // Set volume to 30%
        } catch (e) {
            console.log('Audio not supported');
        }
    }
    
    async loadBackgroundMusic() {
        if (!this.audioContext) return;
        
        try {
            // Replace 'background_music.mp3' with your actual music file name
            const response = await fetch('./audio/background_music.mp3');
            const arrayBuffer = await response.arrayBuffer();
            this.backgroundMusicBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            console.log('Background music loaded successfully');
        } catch (error) {
            console.log('Could not load background music:', error);
            // Fallback: you can still use the original sound effects even if background music fails to load
        }
    }
    
    playBackgroundMusic() {
        if (!this.audioContext || !this.backgroundMusicBuffer || !this.isAudioEnabled) return;
        
        // Stop any currently playing background music
        this.stopBackgroundMusic();
        
        // Create a new source node
        this.backgroundMusicSource = this.audioContext.createBufferSource();
        this.backgroundMusicSource.buffer = this.backgroundMusicBuffer;
        this.backgroundMusicSource.loop = true; // Loop the music
        this.backgroundMusicSource.connect(this.backgroundMusicGain);
        
        // Start playing
        this.backgroundMusicSource.start(0);
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusicSource) {
            try {
                this.backgroundMusicSource.stop();
            } catch (e) {
                // Source might already be stopped
            }
            this.backgroundMusicSource = null;
        }
    }
    
    playLoveSound() {
        if (!this.audioContext || !this.isAudioEnabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
    
    toggleAudio() {
        if (!this.audioUnlocked) {
            // If audio hasn't been unlocked yet, try to unlock it
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    this.audioUnlocked = true;
                    this.isAudioEnabled = true;
                    this.playBackgroundMusic();
                    this.updateAudioButton();
                });
            }
            return;
        }
        
        this.isAudioEnabled = !this.isAudioEnabled;
        this.updateAudioButton();
        
        // Control background music
        if (this.isAudioEnabled) {
            this.playBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
    }
    
    updateAudioButton() {
        const audioBtn = document.getElementById('audioBtn');
        const audioIcon = audioBtn.querySelector('.audio-icon');
        
        audioIcon.textContent = this.isAudioEnabled ? '🎵' : '🔇';
        audioBtn.style.opacity = this.isAudioEnabled ? '1' : '0.6';
    }
    
    // Haptic Feedback
    triggerHapticFeedback() {
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 30, 50]);
        }
        
        const indicator = document.getElementById('hapticIndicator');
        indicator.classList.add('active');
        
        setTimeout(() => {
            indicator.classList.remove('active');
        }, 600);
    }
    
    // Utility Functions
    // Intersection Observer
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    if (entry.target.classList.contains('message-block')) {
                        this.createBlockEntryEffect(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observe message blocks
        const messageBlocks = document.querySelectorAll('.message-block');
        messageBlocks.forEach(block => observer.observe(block));
    }
    
    // Ambient Effects
    createAmbientEffects() {
        // Floating petals
        setInterval(() => {
            if (Math.random() < 0.3) {
                this.createFloatingPetal();
            }
        }, 2000);
        
        // Random sparkles
        setInterval(() => {
            if (Math.random() < 0.1) {
                this.createRandomSparkle();
            }
        }, 3000);
    }
    
    createFloatingPetal() {
        const petal = document.createElement('div');
        petal.innerHTML = ['🌸', '🌺', '🌻', '🌷'][Math.floor(Math.random() * 4)];
        petal.style.position = 'fixed';
        petal.style.left = Math.random() * window.innerWidth + 'px';
        petal.style.top = '-20px';
        petal.style.fontSize = (0.8 + Math.random() * 0.4) + 'rem';
        petal.style.pointerEvents = 'none';
        petal.style.zIndex = '5';
        petal.style.transition = 'all 8s linear';
        petal.style.opacity = '0.7';
        
        document.body.appendChild(petal);
        
        setTimeout(() => {
            petal.style.top = window.innerHeight + 20 + 'px';
            petal.style.transform = `rotate(${Math.random() * 720}deg) translateX(${(Math.random() - 0.5) * 100}px)`;
            petal.style.opacity = '0';
        }, 100);
        
        setTimeout(() => {
            petal.remove();
        }, 8100);
    }
    
    createRandomSparkle() {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        sparkle.style.fontSize = '1rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '6';
        sparkle.style.animation = 'sparkle 2s ease-out forwards';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }
    
    // Performance optimization
    setupPerformanceOptimization() {
        // Reduce particles on mobile
        if (window.innerWidth < 768) {
            this.particles = this.particles.slice(0, 20);
            this.hearts = this.hearts.slice(0, 8);
            this.stars = this.stars.slice(0, 15);
        }
        
        // Pause animations when tab is not active
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isLoaded = false;
            } else {
                this.isLoaded = true;
            }
        });
    }
}

// Initialize the experience
document.addEventListener('DOMContentLoaded', () => {
    new LoveExperience();
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% { opacity: 0; transform: scale(0) rotate(0deg); }
        50% { opacity: 1; transform: scale(1) rotate(180deg); }
        100% { opacity: 0; transform: scale(0) rotate(360deg); }
    }
`;
document.head.appendChild(style);
