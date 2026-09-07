"use strict";

/* ==========================================================================
                            HOME PAGE JAVASCRIPT
=============================================================================
Project     : Ammlan Rath Portfolio
File        : home.js
Version     : 2.0.0
Author      : Ammlan Rath
Description : Home-page-specific interactive behaviors, custom cursor, canvas
              particles, and GSAP animations.
============================================================================= */

const Home = {

    /* ----------------------------------------------------------------------
       Configuration
    ---------------------------------------------------------------------- */
    config: {
        statsSelector: ".achievements__value",
        scrollThreshold: 0.2,
        motion: {
            revealDuration: 0.85,
            imageRevealDuration: 0.95,
            stagger: 0.1,
            ease: "power3.out",
            scrollEase: "none",
            heroParallax: 2.0,
            projectParallax: 12
        }
    },

    /* ----------------------------------------------------------------------
       Runtime State
    ---------------------------------------------------------------------- */
    state: {
        initialized: false,
        statsAnimated: false,
        dialSpeedMult: 1.0,
        dialIntensity: 1.0,
        particlesArray: [],
        portraitParticlesArray: [],
        
        // Performance & viewport tracking
        heroInView: true,
        
        // Mouse positions
        mouseX: 0,
        mouseY: 0,
        targetMouseX: 0,
        targetMouseY: 0,
        
        // Hover states
        portraitHovered: false,
        portraitRect: null,
        portraitRotX: 0,
        portraitRotY: 0,
        
        hoveredCard: null,
        hoveredCardRect: null,
        
        hoveredMagnetic: null,
        hoveredMagneticRect: null,
        magneticElX: 0,
        magneticElY: 0,

        aboutImageHovered: false,
        aboutImageRect: null,
        aboutImageRotX: 0,
        aboutImageRotY: 0,
        hoveredAboutCard: null,
        hoveredAboutCardRect: null,
        activeAboutCards: new Set(),
        
        // Custom Cursor lerp variables
        cursorDotX: 0,
        cursorDotY: 0,
        cursorRingX: 0,
        cursorRingY: 0,
        cursorGlowX: 0,
        cursorGlowY: 0,
        cursorWideX: 0,
        cursorWideY: 0,
        cursorRingScale: 1.0,
        
        // Mesh background shifts
        meshShiftX: 0,
        meshShiftY: 0,
        lightNeedsUpdate: true,
        skillsInView: false,
        skillsSpotX: 0,
        skillsSpotY: 0,
        hoveredProjectCard: null,
        projectImgX: 0,
        projectImgY: 0,
        sectionLightX: 50,
        sectionLightY: 50,
        sectionLightTargetX: 50,
        sectionLightTargetY: 50,
        lastAmbientUpdate: 0,
        lastPortraitUpdate: 0,
        interactionLoopActive: false,
        interactionStopTimer: null
    },

    /* ----------------------------------------------------------------------
       DOM Cache
    ---------------------------------------------------------------------- */
    elements: {
        stats: [],
        customCursor: null,
        cursorSpotlight: null,
        cursorOrbCore: null,
        cursorOrbWide: null,
        cursorDot: null,
        cursorRing: null,
        cursorLabel: null,
        bgCanvas: null,
        portraitCanvas: null,
        portraitWrapper: null,
        dialHandle: null,
        ambientBlobs: [],
        ambientGlows: [],
        skillsSpotlight: null,
        skillCards: [],
        projectCards: []
    },

    /* ----------------------------------------------------------------------
       Initialization
    ---------------------------------------------------------------------- */
    init() {
        if (this.state.initialized) return;

        this.cacheDOM();
        this.bindEvents();
        
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || typeof Portfolio === "undefined" || !Portfolio.MasterLoop) {
            console.warn("Home module: Dependencies not ready. Retrying in 100ms...");
            setTimeout(() => this.init(), 100);
            return;
        }
        
        // Respect reduced motion
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || (typeof Portfolio !== "undefined" && Portfolio.State?.reducedMotion);

        if (!prefersReducedMotion) {
            this.initHeroObserver();
            this.initMouseListener();
            this.initCustomCursor();
            this.initCanvasPortrait();
            this.initRoleLoop();
            this.initInteractiveDial();
            this.initSectionLighting();
            this.initCard3DTilt();
            this.initCanvasPortrait();
            this.initAmbientCanvas();
            this.registerCanvasLoops();
            
            this.initPageLoadAnimation();
            this.initScrollReveal();
            this.initAboutSection();
            this.initExperience();
            
            // Start interaction immediately
            this.startInteractionLoop();
        } else {
            this.handleReducedMotion();
        }

        this.state.initialized = true;
        if (typeof Portfolio !== "undefined" && Portfolio.Logger?.success) {
            Portfolio.Logger.success("Home module initialized with performance updates.");
        } else {
            console.log("Home module initialized.");
        }
    },

    /* ----------------------------------------------------------------------
       Cache DOM
    ---------------------------------------------------------------------- */
    cacheDOM() {
        this.elements.stats = Portfolio.Utils?.$$
            ? Portfolio.Utils.$$(this.config.statsSelector)
            : [...document.querySelectorAll(this.config.statsSelector)];
        
        this.elements.customCursor = document.getElementById("custom-cursor");
        this.elements.cursorSpotlight = document.getElementById("cursor-spotlight");
        this.elements.cursorOrbCore = document.getElementById("cursor-orb-core");
        this.elements.cursorOrbWide = document.getElementById("cursor-orb-wide");
        this.elements.cursorDot = document.querySelector(".custom-cursor__dot");
        this.elements.cursorRing = document.querySelector(".custom-cursor__ring");
        this.elements.cursorLabel = document.getElementById("custom-cursor-label");
        
        this.elements.portraitCanvas = document.getElementById("portrait-particles");
        this.elements.portraitWrapper = document.getElementById("portrait-wrapper");
        this.elements.dialHandle = document.getElementById("dial-handle");
        this.elements.aboutImageWrapper = document.getElementById("about-image-wrapper");
        this.elements.aboutHighlightCards = [...document.querySelectorAll(".about__highlight-card")];
        this.elements.ambientBlobs = [
            document.getElementById("ambient-blob-1"),
            document.getElementById("ambient-blob-2"),
            document.getElementById("ambient-blob-3")
        ].filter(Boolean);
        this.elements.ambientGlows = [
            document.getElementById("ambient-glow-1"),
            document.getElementById("ambient-glow-2"),
            document.getElementById("ambient-glow-3")
        ].filter(Boolean);
        this.elements.skillsSpotlight = document.getElementById("skills-spotlight");
        this.elements.skillCards = [...document.querySelectorAll("[data-skill-card]")];
        this.elements.projectCards = [...document.querySelectorAll("[data-project-card]")];

        // Performance DOM cache
        this.elements.stage = document.querySelector(".hero__portrait-stage");
        this.elements.cards = [...document.querySelectorAll(".hero__glass-card")];
        this.elements.meshGlow1 = document.querySelector(".mesh-glow--1");
        this.elements.meshGlow2 = document.querySelector(".mesh-glow--2");
        this.state.activeCards = new Set();
        this.state.cursorTargetScale = 1.0;
        
        // Initial snap position values
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        this.state.cursorDotX = centerX;
        this.state.cursorDotY = centerY;
        this.state.cursorRingX = centerX;
        this.state.cursorRingY = centerY;
        this.state.cursorGlowX = centerX;
        this.state.cursorGlowY = centerY;
        this.state.cursorWideX = centerX;
        this.state.cursorWideY = centerY;

        this.applyCursorLightTransform();
    },

    applyCursorLightTransform() {
        const coreTransform = `translate3d(${this.state.cursorGlowX}px, ${this.state.cursorGlowY}px, 0) translate(-50%, -50%)`;
        const wideTransform = `translate3d(${this.state.cursorWideX}px, ${this.state.cursorWideY}px, 0) translate(-50%, -50%)`;

        if (this.elements.cursorOrbCore) {
            this.elements.cursorOrbCore.style.transform = coreTransform;
        }
        if (this.elements.cursorOrbWide) {
            this.elements.cursorOrbWide.style.transform = wideTransform;
        }
    },

    /* ----------------------------------------------------------------------
       Register Events (Includes original stats counters logic)
    ---------------------------------------------------------------------- */
    bindEvents() {
        if (this.elements.stats.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.state.statsAnimated) {
                        this.animateStats();
                        this.state.statsAnimated = true;
                        observer.disconnect();
                    }
                });
            }, {
                threshold: this.config.scrollThreshold
            });

            const statsSection = document.querySelector(".achievements");
            if (statsSection) {
                observer.observe(statsSection);
            } else {
                this.elements.stats.forEach(stat => observer.observe(stat));
            }
        }
    },

    /* ----------------------------------------------------------------------
       Animate Statistics Counter (Original implementation preserved)
    ---------------------------------------------------------------------- */
    animateStats() {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || (typeof Portfolio !== "undefined" && Portfolio.State?.reducedMotion);
        
        this.elements.stats.forEach(el => {
            const rawText = el.textContent.trim();
            const numberMatch = rawText.match(/(\d+)/);
            if (!numberMatch) return;

            const targetVal = parseInt(numberMatch[0], 10);
            const suffix = rawText.replace(numberMatch[0], "");

            if (prefersReducedMotion) {
                el.textContent = `${targetVal}${suffix}`;
                return;
            }

            let startVal = 0;
            const duration = 1000;
            const startTime = performance.now();

            const updateCount = (timestamp) => {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutQuad = progress * (2 - progress);
                const currentVal = Math.floor(easeOutQuad * targetVal);

                el.textContent = `${currentVal}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    el.textContent = `${targetVal}${suffix}`;
                }
            };

            requestAnimationFrame(updateCount);
        });
    },

    /* ----------------------------------------------------------------------
       Hero View Observer
    ---------------------------------------------------------------------- */
    initHeroObserver() {
        const hero = document.getElementById("hero");
        if (!hero) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.state.heroInView = entry.isIntersecting;
            });
        }, { threshold: 0.01 });
        observer.observe(hero);
    },

    /* ----------------------------------------------------------------------
       Unified Mouse Move Tracker (Throttled & Idle detection)
    ---------------------------------------------------------------------- */
    initMouseListener() {
        const self = this;
        self.state.mouseIdle = true;
        let idleTimeout = null;

        const setMouseActive = () => {
            self.state.mouseIdle = false;
            self.state.lightNeedsUpdate = true;
            self.startInteractionLoop();
            clearTimeout(idleTimeout);
            idleTimeout = setTimeout(() => {
                self.state.mouseIdle = true;
            }, 1500); // 1.5s idle threshold

            clearTimeout(self.state.interactionStopTimer);
            self.state.interactionStopTimer = setTimeout(() => {
                self.stopInteractionLoop();
            }, 350);
        };

        window.addEventListener("mousemove", (e) => {
            self.state.targetMouseX = e.clientX;
            self.state.targetMouseY = e.clientY;
            setMouseActive();
            
            const cursor = self.elements.customCursor;
            if (cursor && cursor.classList.contains("custom-cursor--hidden")) {
                cursor.classList.remove("custom-cursor--hidden");
            }
            document.documentElement.classList.remove("custom-cursor-hidden-page");
        }, { passive: true });
        
        document.addEventListener("mouseleave", () => {
            const cursor = self.elements.customCursor;
            if (cursor) {
                cursor.classList.add("custom-cursor--hidden");
            }
            document.documentElement.classList.add("custom-cursor-hidden-page");
            self.state.mouseIdle = true;
            self.stopInteractionLoop();
        });
    },

    startInteractionLoop() {
        if (this.state.interactionLoopActive || typeof Portfolio === "undefined" || !Portfolio.MasterLoop) return;

        this.state.interactionLoopActive = true;
        Portfolio.MasterLoop.register("homeInteraction", (time) => this.update(time), 20);
    },

    stopInteractionLoop() {
        if (!this.state.interactionLoopActive || typeof Portfolio === "undefined" || !Portfolio.MasterLoop) return;

        this.state.interactionLoopActive = false;
        Portfolio.MasterLoop.unregister("homeInteraction");
    },

    /* ----------------------------------------------------------------------
       Interactive Custom Cursor Hover Triggers & Bounding Rect Cache
    ---------------------------------------------------------------------- */
    initCustomCursor() {
        const self = this;
        if (!self.elements.customCursor) return;

        // Hide native cursor only when MasterLoop is active and custom cursor is initialized
        if (typeof Portfolio !== "undefined" && Portfolio.MasterLoop) {
            document.documentElement.classList.add("custom-cursor-enabled");
        }

        const cursor = self.elements.customCursor;
        const label = self.elements.cursorLabel;

        const hoverSelectors = "a, button, [role='button'], .social-btn, #dial-handle, .about__highlight-card, #about-image-wrapper";
        document.addEventListener("mouseover", (e) => {
            if (!e.target || typeof e.target.closest !== "function") return;
            const target = e.target.closest(hoverSelectors);
            if (target) {
                cursor.classList.add("custom-cursor--hover");
                self.state.cursorTargetScale = 1.55;
            }
        });
        document.addEventListener("mouseout", (e) => {
            if (!e.target || typeof e.target.closest !== "function") return;
            const target = e.target.closest(hoverSelectors);
            if (target) {
                cursor.classList.remove("custom-cursor--hover");
                self.state.cursorTargetScale = 1.0;
            }
        });

        if (self.elements.portraitWrapper) {
            self.elements.portraitWrapper.addEventListener("mouseenter", () => {
                self.state.portraitHovered = true;
                self.state.portraitRect = self.elements.portraitWrapper.getBoundingClientRect();
            });
            self.elements.portraitWrapper.addEventListener("mouseleave", () => {
                self.state.portraitHovered = false;
            });
        }

        document.addEventListener("mouseenter", (e) => {
            if (!e.target || typeof e.target.closest !== "function") return;
            const target = e.target.closest(".projects__card, .blogs__card");
            if (target) {
                cursor.classList.add("custom-cursor--view");
                label.textContent = "VIEW";
                self.state.cursorTargetScale = 1.88;
            }
        }, true);
        document.addEventListener("mouseleave", (e) => {
            if (!e.target || typeof e.target.closest !== "function") return;
            const target = e.target.closest(".projects__card, .blogs__card");
            if (target) {
                cursor.classList.remove("custom-cursor--view");
                label.textContent = "";
                self.state.cursorTargetScale = 1.0;
            }
        }, true);

        // Optimize: use elements cached in cacheDOM, only tilt when hovered
        self.elements.cards.forEach(card => {
            card.addEventListener("mouseenter", () => {
                self.state.hoveredCard = card;
                self.state.hoveredCardRect = card.getBoundingClientRect();
                self.state.activeCards.add(card);
            });
            card.addEventListener("mouseleave", () => {
                if (self.state.hoveredCard === card) {
                    self.state.hoveredCard = null;
                }
            });
        });

        const magneticElements = document.querySelectorAll(".social-btn, .navbar__link, .button, .logo");
        magneticElements.forEach(el => {
            el.addEventListener("mouseenter", () => {
                self.state.hoveredMagnetic = el;
                self.state.hoveredMagneticRect = el.getBoundingClientRect();
            });
            el.addEventListener("mouseleave", () => {
                if (self.state.hoveredMagnetic === el) {
                    self.state.hoveredMagnetic = null;
                }
                self.state.magneticElX = 0;
                self.state.magneticElY = 0;
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.4,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    },

    /* ----------------------------------------------------------------------
       Portrait Canvas Particles (Fixed Object Pool - Optimized)
    ---------------------------------------------------------------------- */
    initCanvasPortrait() {
        const self = this;
        const canvas = self.elements.portraitCanvas;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        const dpr = Math.min(window.devicePixelRatio, 2);
        
        let cssSize = canvas.offsetWidth || 500;
        let size = canvas.width = canvas.height = cssSize * dpr;
        ctx.scale(dpr, dpr);

        const debouncedCanvasPortraitResize = Portfolio.Utils.debounce(() => {
            cssSize = canvas.offsetWidth || 500;
            size = canvas.width = canvas.height = cssSize * dpr;
            ctx.scale(dpr, dpr);
        }, 150);
        window.addEventListener("resize", debouncedCanvasPortraitResize);

        self.state.portraitParticlesArray = [];
        const maxParticles = 6;      // Optimized: Reduced by 50%
        const maxBurstParticles = 2; // Optimized: Reduced by 50%

        function initOrbitParticle(p) {
            p.angle = Math.random() * Math.PI * 2;
            p.radius = 100 + Math.random() * 50;
            p.angularSpeed = (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1);
            p.radialSpeed = (Math.random() - 0.5) * 0.1;
            p.size = Math.random() * 1.5 + 0.3;
            p.alpha = 0;
            p.targetAlpha = Math.random() * 0.15 + 0.05;
            p.life = Math.random() * (200 + Math.random() * 150);
            p.maxLife = 200 + Math.random() * 150;
            p.isBurst = false;
            p.active = true;
        }

        function initBurstParticle(p) {
            p.angle = Math.random() * Math.PI * 2;
            p.radius = 110;
            p.angularSpeed = (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : -1);
            p.radialSpeed = Math.random() * 1.0 + 0.3;
            p.size = Math.random() * 2.0 + 0.5;
            p.alpha = 0;
            p.targetAlpha = 0.5;
            p.life = 0;
            p.maxLife = 60 + Math.random() * 30;
            p.isBurst = true;
            p.active = false;
        }

        for (let i = 0; i < maxParticles; i++) {
            const p = {};
            initOrbitParticle(p);
            p.alpha = Math.random() * p.targetAlpha;
            self.state.portraitParticlesArray.push(p);
        }
        for (let i = 0; i < maxBurstParticles; i++) {
            const p = {};
            initBurstParticle(p);
            self.state.portraitParticlesArray.push(p);
        }

        self.state.portraitParticlesUpdate = () => {
            ctx.clearRect(0, 0, cssSize, cssSize);
            const centerX = cssSize / 2;
            const centerY = cssSize / 2;

            self.state.portraitParticlesArray.forEach((p) => {
                if (!p.active) return;

                p.life++;
                p.angle += p.angularSpeed * self.state.dialSpeedMult;
                p.radius += p.radialSpeed;

                if (p.isBurst) {
                    if (p.life < 20) {
                        p.alpha += (1.0 - p.alpha) * 0.1;
                    } else {
                        p.alpha -= p.alpha * 0.05;
                    }
                    if (p.life >= p.maxLife || p.alpha <= 0.01) {
                        p.active = false;
                    }
                } else {
                    if (p.life < 40) {
                        p.alpha += (p.targetAlpha - p.alpha) * 0.05;
                    } else if (p.life > p.maxLife - 40) {
                        p.alpha -= p.alpha * 0.05;
                    }
                    if (p.life >= p.maxLife || p.alpha <= 0.01) {
                        p.angle = Math.random() * Math.PI * 2;
                        p.radius = 100 + Math.random() * 50;
                        p.angularSpeed = (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1);
                        p.radialSpeed = (Math.random() - 0.5) * 0.1;
                        p.size = Math.random() * 1.8 + 0.4;
                        p.alpha = 0;
                        p.targetAlpha = Math.random() * 0.6 + 0.2;
                        p.life = 0;
                        p.maxLife = 200 + Math.random() * 150;
                    }
                }

                const px = centerX + Math.cos(p.angle) * p.radius;
                const py = centerY + Math.sin(p.angle) * p.radius;

                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(27, 255, 201, ${Math.max(0, p.alpha * self.state.dialIntensity)})`;
                ctx.fill();
            });
        };
    },

    triggerParticleBurst() {
        const self = this;
        let spawned = 0;
        const maxSpawns = 2; // Optimized
        
        for (let i = 0; i < self.state.portraitParticlesArray.length; i++) {
            const p = self.state.portraitParticlesArray[i];
            if (p.isBurst && !p.active) {
                p.angle = Math.random() * Math.PI * 2;
                p.radius = 110;
                p.angularSpeed = (Math.random() * 0.03 + 0.01) * (Math.random() > 0.5 ? 1 : -1);
                p.radialSpeed = Math.random() * 1.5 + 0.5;
                p.size = Math.random() * 2.5 + 0.8;
                p.alpha = 1.0;
                p.targetAlpha = 1.0;
                p.life = 0;
                p.maxLife = 60 + Math.random() * 30;
                p.active = true;
                
                spawned++;
                if (spawned >= maxSpawns) break;
            }
        }
    },

    /* ----------------------------------------------------------------------
       Role Text Looping & Sliding Underline
    ---------------------------------------------------------------------- */
    initRoleLoop() {
        const textEl = document.getElementById("role-text");
        const underlineEl = document.getElementById("role-underline");
        if (!textEl || !underlineEl || typeof gsap === "undefined") return;

        const roles = [
            "Frontend Developer",
            "UI Designer",
            "Creative Developer",
            "Problem Solver"
        ];
        let currentIdx = 0;

        gsap.to(underlineEl, { scaleX: 1, duration: 1, ease: "power2.inOut" });

        setInterval(() => {
            currentIdx = (currentIdx + 1) % roles.length;

            gsap.to(underlineEl, {
                scaleX: 0,
                transformOrigin: "right",
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    textEl.textContent = roles[currentIdx];

                    gsap.fromTo(textEl, 
                        { y: 25, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" }
                    );

                    gsap.to(underlineEl, {
                        scaleX: 1,
                        transformOrigin: "left",
                        duration: 0.5,
                        ease: "power3.out"
                    });
                }
            });
        }, 3500);
    },

    /* ----------------------------------------------------------------------
       Interactive Experience Dial (GSAP Draggable)
    ---------------------------------------------------------------------- */
    initInteractiveDial() {
        const self = this;
        if (!self.elements.dialHandle || typeof gsap === "undefined" || typeof Draggable === "undefined") return;

        Draggable.create(self.elements.dialHandle, {
            type: "rotation",
            inertia: false,
            onDrag: function() {
                const angle = this.rotation % 360;
                self.state.dialSpeedMult = 0.5 + (Math.abs(angle) / 360) * 4.0;
                self.state.dialIntensity = 0.4 + (Math.abs(angle) / 360) * 1.4;

                gsap.set(".hero__stage-glow", {
                    opacity: Math.min(1.4, self.state.dialIntensity * 0.8),
                    scale: 0.9 + (self.state.dialIntensity * 0.15)
                });

                if (Math.random() < 0.22) {
                    self.triggerParticleBurst();
                }
            },
            onDragEnd: function() {
                gsap.to(self.state, {
                    dialSpeedMult: 1.0,
                    dialIntensity: 1.0,
                    duration: 1.1,
                    ease: "power2.out"
                });

                gsap.to(".hero__stage-glow", {
                    opacity: 1.0,
                    scale: 1.0,
                    duration: 1.1,
                    ease: "power2.out"
                });
            }
        });
    },

    /* ----------------------------------------------------------------------
       GSAP Orchestrated Page Intro Sequence (Optimized)
    ---------------------------------------------------------------------- */
    initPageLoadAnimation() {
        if (typeof gsap === "undefined") return;

        const tl = gsap.timeline({
            paused: true,
            defaults: { ease: "power3.out", duration: 0.65 }
        });
        this.state.heroTimeline = tl;

        gsap.set(".hero__bg-mesh", { opacity: 0 });
        gsap.set(".hero__orbit-ring, .hero__orbit-path, .hero__stage-glow", { scale: 0.5, opacity: 0 });
        gsap.set("#portrait-wrapper", { y: 60, scale: 0.9, opacity: 0 });
        gsap.set(".hero__greeting", { y: 15, opacity: 0 });
        gsap.set(".hero__role-section", { y: 15, opacity: 0 });
        gsap.set(".hero__glass-card", { y: 30, opacity: 0 });
        gsap.set(".hero__buttons", { y: 20, opacity: 0 });
        gsap.set(".hero__status-card", { y: 20, opacity: 0 });
        gsap.set(".social-btn", { scale: 0.6, opacity: 0 });
        gsap.set("#scroll-indicator", { opacity: 0, y: 10 });
        gsap.set("#explore-dial-container", { opacity: 0, scale: 0.8 });

        tl.to(".hero__bg-mesh", { opacity: 1, duration: 0.8 })
          .to(".hero__orbit-ring, .hero__orbit-path, .hero__stage-glow", { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.75)", stagger: 0.05 }, "-=0.55")
          .to("#portrait-wrapper", { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: "power4.out" }, "-=0.75")
          .to(".hero__greeting", { y: 0, opacity: 1, duration: 0.45 }, "-=0.55")
          
          .from("#hero-title .title-word", {
              y: 35,
              opacity: 0,
              stagger: 0.1,
              duration: 0.45,
              ease: "back.out(1.3)"
          }, "-=0.35")

          .to(".hero__role-section", { y: 0, opacity: 1, duration: 0.45 }, "-=0.2")
          .to(".hero__glass-card", {
              y: 0,
              opacity: 1,
              stagger: 0.07,
              duration: 0.5,
              ease: "power2.out"
          }, "-=0.35")
          
          .to(".hero__buttons", { y: 0, opacity: 1, duration: 0.45 }, "-=0.4")
          .to(".hero__status-card", { y: 0, opacity: 1, duration: 0.45 }, "-=0.45")
          
          .to(".social-btn", {
              scale: 1,
              opacity: 1,
              stagger: 0.04,
              duration: 0.45,
              ease: "back.out(1.5)"
          }, "-=0.35")
          
          .to("#scroll-indicator", { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
          .to("#explore-dial-container", { opacity: 1, scale: 1, duration: 0.5 }, "-=0.5");
    },
    
    /* ----------------------------------------------------------------------
       Unified Section Reveal System (Viewport-based Intersection Observer)
       ---------------------------------------------------------------------- */
    initScrollReveal() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || !('IntersectionObserver' in window)) {
            document.documentElement.classList.remove("js-active");
            return;
        }

        // Add class to trigger initial CSS opacity 0 states
        document.documentElement.classList.add("js-active");

        const sections = ["about", "skills", "projects", "blogs", "achievements", "resume", "hire", "connect"];
        const selectors = [
            ".section-header__eyebrow, .about__eyebrow",
            ".section-header__title, .about__heading, .resume__title, .cta__title, .about__media, .about__float-badge",
            ".section-header__description, .about__description p, .resume__text, .cta__description",
            ".skills__card, .projects__card, .blogs__card, .achievements__card, .resume__card, .connect__card, .connect__detail, .about__highlight-card",
            ".button, .about__actions, .projects__actions, .blogs__actions, .resume__actions, .cta__buttons",
            ".cta__card"
        ];

        const sectionsMap = new Map();

        // Build sequential timelines for each section on the page
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (!section) return;

            const tl = gsap.timeline({ paused: true });
            const elements = [];

            // Query elements for each sequence group
            selectors.forEach((selector, order) => {
                const found = [...section.querySelectorAll(selector)];
                found.forEach(el => {
                    if (!elements.some(item => item.el === el)) {
                        elements.push({ el, order });
                    }
                });
            });

            // Sort elements by the specified flow order
            elements.sort((a, b) => a.order - b.order);

            // Set hidden initial states via GSAP
            elements.forEach(item => {
                gsap.set(item.el, { 
                    opacity: 0, 
                    y: item.order >= 3 ? 32 : 24,
                    scale: (item.el.classList.contains('about__media') || item.el.classList.contains('cta__card')) ? 0.97 : 1 
                });
            });

            const orderGroups = new Map();
            elements.forEach(item => {
                if (!orderGroups.has(item.order)) orderGroups.set(item.order, []);
                orderGroups.get(item.order).push(item.el);
            });

            const sortedOrders = [...orderGroups.keys()].sort((a, b) => a - b);
            sortedOrders.forEach((order, idx) => {
                const group = orderGroups.get(order);
                const isCardGroup = order === 3;
                const overlap = isCardGroup ? "-=0.36" : "-=0.42";

                tl.to(group, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: isCardGroup ? 0.58 : 0.62,
                    ease: "power3.out",
                    stagger: isCardGroup
                        ? { each: 0.075, from: "start" }
                        : (group.length > 1 ? 0.05 : 0)
                }, idx === 0 ? 0 : overlap);
            });

            sectionsMap.set(sectionId, { tl, elements, section });
        });

        // Observer instance with custom 0.28 threshold
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const sectionId = entry.target.id;
                const sectionData = sectionsMap.get(sectionId);
                if (!sectionData) return;

                if (entry.isIntersecting) {
                    sectionData.tl.play();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.22,
            rootMargin: "0px 0px -8% 0px"
        });

        // Start observing each content section
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) observer.observe(section);
        });

        // Set up separate observer for the Hero section timeline
        const heroSection = document.getElementById("hero");
        if (heroSection) {
            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (this.state.heroTimeline) {
                        if (entry.isIntersecting) {
                            this.state.heroTimeline.play();
                            heroObserver.unobserve(entry.target);
                        }
                    }
                });
            }, {
                threshold: 0.15
            });
            heroObserver.observe(heroSection);
        }
    },

    /* ----------------------------------------------------------------------
       About Section — image tilt and highlight card interactions
    ---------------------------------------------------------------------- */
    initAboutSection() {
        const self = this;
        const wrapper = self.elements.aboutImageWrapper;

        if (wrapper) {
            wrapper.addEventListener("mouseenter", () => {
                self.state.aboutImageHovered = true;
                self.state.aboutImageRect = wrapper.getBoundingClientRect();
            });
            wrapper.addEventListener("mouseleave", () => {
                self.state.aboutImageHovered = false;
            });
        }

        self.elements.aboutHighlightCards.forEach(card => {
            card.addEventListener("mouseenter", () => {
                self.state.hoveredAboutCard = card;
                self.state.hoveredAboutCardRect = card.getBoundingClientRect();
                self.state.activeAboutCards.add(card);
            });
            card.addEventListener("mouseleave", () => {
                if (self.state.hoveredAboutCard === card) {
                    self.state.hoveredAboutCard = null;
                }
            });
        });
    },

    /* ----------------------------------------------------------------------
       Premium experience layer — ambient, skills, projects, section pause
    ---------------------------------------------------------------------- */
    initExperience() {
        this.initSkillsExperience();
        this.initProjectParallax();
        this.initAboutParallax();
        this.initScrollMotion();
        this.initSectionLighting();
    },

    initScrollMotion() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

        const motion = this.config.motion;
        const motionContext = gsap.matchMedia();

        motionContext.add("(min-width: 769px)", () => {
            const hero = document.getElementById("hero");
            if (hero) {
                gsap.to(".hero__left", {
                    y: -44 * motion.heroParallax,
                    opacity: 0.78,
                    ease: motion.scrollEase,
                    scrollTrigger: {
                        trigger: hero,
                        start: "top top",
                        end: "bottom top",
                        scrub: 0.65
                    }
                });

                gsap.to(".hero__right", {
                    y: -24 * motion.heroParallax,
                    opacity: 0.84,
                    ease: motion.scrollEase,
                    scrollTrigger: {
                        trigger: hero,
                        start: "top top",
                        end: "bottom top",
                        scrub: 0.8
                    }
                });

                gsap.to(".hero__portrait-wrapper", {
                    yPercent: -8,
                    scale: 0.94,
                    ease: motion.scrollEase,
                    scrollTrigger: {
                        trigger: hero,
                        start: "top top",
                        end: "bottom top",
                        scrub: 0.75
                    }
                });

                gsap.to(".hero__bg-mesh", {
                    yPercent: 12,
                    scale: 1.08,
                    ease: motion.scrollEase,
                    scrollTrigger: {
                        trigger: hero,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1
                    }
                });
            }

            document.querySelectorAll("[data-project-card]").forEach(card => {
                const media = card.querySelector(".projects__media");
                const content = card.querySelector(".projects__content");
                if (!media) return;

                gsap.fromTo(media,
                    { clipPath: "inset(0 0 25% 0 round 16px)", opacity: 0.8, scale: 0.95 },
                    {
                        clipPath: "inset(0 0 0% 0 round 16px)",
                        opacity: 1,
                        scale: 1,
                        duration: motion.imageRevealDuration,
                        ease: motion.ease,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            once: true
                        }
                    }
                );

                gsap.to(media, {
                    yPercent: -motion.projectParallax,
                    ease: motion.scrollEase,
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 0.7
                    }
                });

                if (content) {
                    gsap.to(content, {
                        y: -12,
                        ease: motion.scrollEase,
                        scrollTrigger: {
                            trigger: card,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 0.9
                        }
                    });
                }
            });
        });

        document.querySelectorAll(".blogs__card").forEach(card => {
            const media = card.querySelector(".blogs__media");
            if (!media) return;

            gsap.fromTo(media,
                { clipPath: "inset(0 0 100% 0 round 16px)" },
                {
                    clipPath: "inset(0 0 0% 0 round 16px)",
                    duration: motion.imageRevealDuration,
                    ease: motion.ease,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 82%",
                        once: true
                    }
                }
            );
        });

        this.state.motionContext = motionContext;
    },

    initSectionPause() {
        const sections = document.querySelectorAll("main > section[id]");
        if (!sections.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle("section--paused", !entry.isIntersecting);
                entry.target.classList.toggle("in-view", entry.isIntersecting);
            });
        }, { threshold: 0.05 });

        sections.forEach(section => observer.observe(section));
    },

    initSkillsExperience() {
        const self = this;
        const skillsSection = document.getElementById("skills");
        if (!skillsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                self.state.skillsInView = entry.isIntersecting;
                if (entry.isIntersecting) {
                    const rect = skillsSection.getBoundingClientRect();
                    self.state.skillsSpotX = rect.width / 2;
                    self.state.skillsSpotY = rect.height / 2;
                }
            });
        }, { threshold: 0.15 });
        observer.observe(skillsSection);

        self.elements.skillCards.forEach(card => {
            card.addEventListener("mouseenter", () => {
                self.elements.skillCards.forEach(c => c.classList.remove("is-active"));
                card.classList.add("is-active");
            });
            card.addEventListener("mouseleave", () => {
                card.classList.remove("is-active");
            });
        });
    },

    initProjectParallax() {
        const self = this;

        self.elements.projectCards.forEach(card => {
            const img = card.querySelector(".projects__img");
            if (!img) return;

            card.addEventListener("mouseenter", () => {
                self.state.hoveredProjectCard = { card, img };
            });
            card.addEventListener("mouseleave", () => {
                if (self.state.hoveredProjectCard?.card === card) {
                    self.state.hoveredProjectCard = null;
                    self.state.projectImgX = 0;
                    self.state.projectImgY = 0;
                    img.style.transform = "";
                }
            });
            card.addEventListener("mousemove", (e) => {
                if (self.state.hoveredProjectCard?.card !== card) return;
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                // Removed direct transform that conflicts with GSAP scroll parallax
                // self.state.projectImgX = x * 14;
                // self.state.projectImgY = y * 10;
                // img.style.transform = `translate3d(${self.state.projectImgX}px, ${self.state.projectImgY}px, 0) scale(1.06)`;
            });
        });
    },

    initAboutParallax() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

        const about = document.getElementById("about");
        const text = document.getElementById("about-text");
        const media = document.getElementById("about-media");
        if (!about || !text || !media) return;

        const heading = about.querySelector(".about__heading");
        const highlightCards = about.querySelectorAll(".about__highlight-card");

        if (heading) {
            gsap.fromTo(heading, { y: 20 }, {
                y: -10,
                ease: "none",
                scrollTrigger: {
                    trigger: about,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.5
                }
            });
        }

        gsap.fromTo(text, { y: 40 }, {
            y: -20,
            ease: "none",
            scrollTrigger: {
                trigger: about,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.65
            }
        });

        gsap.fromTo(media, { y: 60 }, {
            y: -35,
            ease: "none",
            scrollTrigger: {
                trigger: about,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8
            }
        });

        if (highlightCards.length) {
            gsap.fromTo(highlightCards, { y: 80 }, {
                y: -50,
                ease: "none",
                stagger: 0.05,
                scrollTrigger: {
                    trigger: about,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.0
                }
            });
        }
    },

    initSectionLighting() {
        const sections = [...document.querySelectorAll("main > section[id]")];
        if (!sections.length) return;

        const accents = [
            { x: 52, y: 22 },
            { x: 38, y: 42 },
            { x: 55, y: 58 },
            { x: 48, y: 50 },
            { x: 62, y: 48 },
            { x: 50, y: 55 },
            { x: 45, y: 62 },
            { x: 50, y: 72 },
            { x: 50, y: 82 }
        ];

        const applyAccent = (sectionEl) => {
            const idx = sections.indexOf(sectionEl);
            const accent = accents[idx] || accents[0];
            this.state.sectionLightTargetX = accent.x;
            this.state.sectionLightTargetY = accent.y;
        };

        const observer = new IntersectionObserver((entries) => {
            let best = null;
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                if (!best || entry.intersectionRatio > best.intersectionRatio) {
                    best = entry;
                }
            });
            if (best) applyAccent(best.target);
        }, { threshold: [0.15, 0.35, 0.55, 0.75] });

        sections.forEach(section => observer.observe(section));
        applyAccent(sections[0]);
    },

    updateAmbientCanvas(time) {
        const scrollFactor = window.scrollY * 0.015;
        const t = time * 0.00025;

        this.state.sectionLightX += (this.state.sectionLightTargetX - this.state.sectionLightX) * 0.04;
        this.state.sectionLightY += (this.state.sectionLightTargetY - this.state.sectionLightY) * 0.04;
        const lightX = (this.state.sectionLightX - 50) * 0.35;
        const lightY = (this.state.sectionLightY - 50) * 0.35;

        this.elements.ambientBlobs.forEach((blob, i) => {
            const phase = i * 1.7;
            const x = Math.sin(t + phase) * (10 + i * 4) + lightX;
            const y = Math.cos(t * 0.8 + phase) * (8 + i * 3) + scrollFactor * (i + 1) * 0.3 + lightY;
            blob.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });

        this.elements.ambientGlows.forEach((glow, i) => {
            const phase = i * 2.1;
            const x = Math.sin(t * 0.6 + phase) * (6 + i * 2) + lightX * 0.6;
            const y = Math.cos(t * 0.5 + phase) * (5 + i * 2) + scrollFactor * 0.5 + lightY * 0.6;
            glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
    },

    updateSkillsSpotlight(targetX, targetY) {
        if (!this.state.skillsInView || !this.elements.skillsSpotlight) return;

        const skills = document.getElementById("skills");
        if (!skills) return;

        const rect = skills.getBoundingClientRect();
        const localX = targetX - rect.left;
        const localY = targetY - rect.top;

        this.state.skillsSpotX += (localX - this.state.skillsSpotX) * 0.14;
        this.state.skillsSpotY += (localY - this.state.skillsSpotY) * 0.14;

        this.elements.skillsSpotlight.style.transform =
            `translate3d(${this.state.skillsSpotX}px, ${this.state.skillsSpotY}px, 0) translate(-50%, -50%)`;
    },

    /* ----------------------------------------------------------------------
       Master Loop Update Callback (High Performance)
    ---------------------------------------------------------------------- */
    update(time) {
        const self = this;
        
        // Skip updates completely if document is hidden
        if (document.hidden || document.visibilityState === "hidden") return;
        
        const targetX = self.state.targetMouseX;
        const targetY = self.state.targetMouseY;
        
        // 1. CURSOR POSITION LERP (Only calculate & apply styles if not idle or not converged)
        const EPSILON = 0.05;
        const cursorDotDX = targetX - self.state.cursorDotX;
        const cursorDotDY = targetY - self.state.cursorDotY;
        const cursorRingDX = targetX - self.state.cursorRingX;
        const cursorRingDY = targetY - self.state.cursorRingY;
        const cursorScaleD = self.state.cursorTargetScale - self.state.cursorRingScale;

        const needsCursorUpdate = Math.abs(cursorDotDX) > EPSILON || Math.abs(cursorDotDY) > EPSILON || 
                                  Math.abs(cursorRingDX) > EPSILON || Math.abs(cursorRingDY) > EPSILON || 
                                  Math.abs(cursorScaleD) > 0.01;

        if (needsCursorUpdate) {
            self.state.cursorDotX += cursorDotDX * 0.35;
            self.state.cursorDotY += cursorDotDY * 0.35;
            
            if (self.state.hoveredMagnetic && self.state.hoveredMagneticRect) {
                const rect = self.state.hoveredMagneticRect;
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = targetX - centerX;
                const deltaY = targetY - centerY;
                
                const targetRingX = centerX + deltaX * 0.15;
                const targetRingY = centerY + deltaY * 0.15;
                
                self.state.cursorRingX = Portfolio.Utils.lerp(self.state.cursorRingX, targetRingX, 0.28);
                self.state.cursorRingY = Portfolio.Utils.lerp(self.state.cursorRingY, targetRingY, 0.28);
                
                const magX = deltaX * 0.35;
                const magY = deltaY * 0.35;
                self.state.magneticElX = Portfolio.Utils.lerp(self.state.magneticElX, magX, 0.28);
                self.state.magneticElY = Portfolio.Utils.lerp(self.state.magneticElY, magY, 0.28);
                
                self.state.hoveredMagnetic.style.transform = `translate3d(${self.state.magneticElX}px, ${self.state.magneticElY}px, 0)`;
            } else {
                self.state.cursorRingX += cursorRingDX * 0.14;
                self.state.cursorRingY += cursorRingDY * 0.14;
            }
            
            self.state.cursorRingScale += cursorScaleD * 0.22;

            if (self.elements.cursorDot) {
                self.elements.cursorDot.style.transform = `translate3d(${self.state.cursorDotX}px, ${self.state.cursorDotY}px, 0) translate(-50%, -50%)`;
            }
            if (self.elements.cursorRing) {
                self.elements.cursorRing.style.transform = `translate3d(${self.state.cursorRingX}px, ${self.state.cursorRingY}px, 0) translate(-50%, -50%) scale(${self.state.cursorRingScale})`;
            }
            if (self.elements.cursorLabel) {
                self.elements.cursorLabel.style.transform = `translate3d(${self.state.cursorRingX}px, ${self.state.cursorRingY}px, 0) translate(-50%, -50%)`;
            }
        }

        // Ambient light orbs — transform-only (GPU), skip when idle and converged
        if (!self.state.mouseIdle || self.state.lightNeedsUpdate) {
            const coreDX = targetX - self.state.cursorGlowX;
            const coreDY = targetY - self.state.cursorGlowY;
            const wideDX = targetX - self.state.cursorWideX;
            const wideDY = targetY - self.state.cursorWideY;

            const coreMoving = Math.abs(coreDX) > EPSILON || Math.abs(coreDY) > EPSILON;
            const wideMoving = Math.abs(wideDX) > EPSILON || Math.abs(wideDY) > EPSILON;

            if (coreMoving || wideMoving) {
                if (coreMoving) {
                    self.state.cursorGlowX += coreDX * 0.2;
                    self.state.cursorGlowY += coreDY * 0.2;
                }
                if (wideMoving) {
                    self.state.cursorWideX += wideDX * 0.12;
                    self.state.cursorWideY += wideDY * 0.12;
                }
                self.applyCursorLightTransform();
            }

            self.state.lightNeedsUpdate = coreMoving || wideMoving;
        }

        if (self.state.skillsInView && !self.state.mouseIdle) {
            self.updateSkillsSpotlight(targetX, targetY);
        }

        // 2. HERO ONLY RUNTIME (Skip if hero is not in view)
        if (self.state.heroInView) {
            
            // Mouse Parallax on the entire stage (Skip if mouse is idle and already converged)
            const stage = self.elements.stage;
            if (stage) {
                const ndx = (targetX - window.innerWidth / 2) / (window.innerWidth / 2);
                const ndy = (targetY - window.innerHeight / 2) / (window.innerHeight / 2);
                const parallaxTargetX = ndx * 4;
                const parallaxTargetY = ndy * 4;
                
                const parallaxDX = parallaxTargetX - (self.state.stageParallaxX || 0);
                const parallaxDY = parallaxTargetY - (self.state.stageParallaxY || 0);
                
                if (Math.abs(parallaxDX) > EPSILON || Math.abs(parallaxDY) > EPSILON) {
                    self.state.stageParallaxX = (self.state.stageParallaxX || 0) + parallaxDX * 0.12;
                    self.state.stageParallaxY = (self.state.stageParallaxY || 0) + parallaxDY * 0.12;
                    stage.style.transform = `translate3d(${self.state.stageParallaxX}px, ${self.state.stageParallaxY}px, 0)`;
                }
            }

            // Card Tilts (Only update active cards that are currently hovered or returning to center)
            if (self.state.activeCards.size > 0) {
                self.state.activeCards.forEach(card => {
                    let targetCardRotX = 0;
                    let targetCardRotY = 0;
                    
                    if (self.state.hoveredCard === card && self.state.hoveredCardRect) {
                        const rect = self.state.hoveredCardRect;
                        const x = targetX - rect.left;
                        const y = targetY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        
                        targetCardRotX = -(y - centerY) / (rect.height / 10);
                        targetCardRotY = (x - centerX) / (rect.width / 10);
                    }
                    
                    let currentRotX = parseFloat(card.getAttribute("data-rot-x") || "0");
                    let currentRotY = parseFloat(card.getAttribute("data-rot-y") || "0");
                    
                    const diffX = targetCardRotX - currentRotX;
                    const diffY = targetCardRotY - currentRotY;
                    
                    if (Math.abs(diffX) < EPSILON && Math.abs(diffY) < EPSILON) {
                        currentRotX = targetCardRotX;
                        currentRotY = targetCardRotY;
                        card.style.transform = (currentRotX === 0 && currentRotY === 0) ? "" : `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
                        card.setAttribute("data-rot-x", currentRotX);
                        card.setAttribute("data-rot-y", currentRotY);
                        if (self.state.hoveredCard !== card) {
                            self.state.activeCards.delete(card);
                        }
                    } else {
                        currentRotX += diffX * 0.22;
                        currentRotY += diffY * 0.22;
                        card.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
                        card.setAttribute("data-rot-x", currentRotX);
                        card.setAttribute("data-rot-y", currentRotY);
                    }
                });
            }
            
            // Mesh Background mouse shift (Skip if mouse is idle and already converged)
            const meshGlow1 = self.elements.meshGlow1;
            const meshGlow2 = self.elements.meshGlow2;
            if (meshGlow1 && meshGlow2) {
                const targetMeshX = (targetX - window.innerWidth / 2) * 0.03;
                const targetMeshY = (targetY - window.innerHeight / 2) * 0.03;
                
                const meshDX = targetMeshX - self.state.meshShiftX;
                const meshDY = targetMeshY - self.state.meshShiftY;
                
                if (Math.abs(meshDX) > EPSILON || Math.abs(meshDY) > EPSILON) {
                    self.state.meshShiftX += meshDX * 0.08;
                    self.state.meshShiftY += meshDY * 0.08;
                    
                    meshGlow1.style.transform = `translate3d(${self.state.meshShiftX}px, ${self.state.meshShiftY}px, 0) translate(-50%, -50%)`;
                    meshGlow2.style.transform = `translate3d(${-self.state.meshShiftX}px, ${-self.state.meshShiftY}px, 0)`;
                }
            }

        }
    },

    registerCanvasLoops() {
        if (typeof Portfolio !== "undefined" && Portfolio.MasterLoop) {
            Portfolio.MasterLoop.register("ambientCanvas", (time) => {
                if (this.state.heroInView && typeof this.updateAmbientCanvas === "function") {
                    this.updateAmbientCanvas(time);
                }
            }, 30);
            
            Portfolio.MasterLoop.register("portraitParticles", () => {
                if (this.state.heroInView && typeof this.state.portraitParticlesUpdate === "function") {
                    this.state.portraitParticlesUpdate();
                }
            }, 30);
        }

        // 3. ABOUT SECTION — image tilt and highlight cards
        const aboutWrapper = self.elements.aboutImageWrapper;
        if (aboutWrapper && self.state.aboutImageHovered && self.state.aboutImageRect) {
            const rect = self.state.aboutImageRect;
            const x = targetX - rect.left;
            const y = targetY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const targetRotX = -(y - centerY) / (rect.height / 12);
            const targetRotY = (x - centerX) / (rect.width / 12);

            self.state.aboutImageRotX += (targetRotX - self.state.aboutImageRotX) * 0.18;
            self.state.aboutImageRotY += (targetRotY - self.state.aboutImageRotY) * 0.18;

            aboutWrapper.style.transform = `perspective(900px) rotateX(${self.state.aboutImageRotX}deg) rotateY(${self.state.aboutImageRotY}deg)`;
        } else if (aboutWrapper) {
            const rotXDiff = 0 - self.state.aboutImageRotX;
            const rotYDiff = 0 - self.state.aboutImageRotY;

            if (Math.abs(rotXDiff) > EPSILON || Math.abs(rotYDiff) > EPSILON) {
                self.state.aboutImageRotX += rotXDiff * 0.16;
                self.state.aboutImageRotY += rotYDiff * 0.16;
                aboutWrapper.style.transform = `perspective(900px) rotateX(${self.state.aboutImageRotX}deg) rotateY(${self.state.aboutImageRotY}deg)`;
            } else {
                self.state.aboutImageRotX = 0;
                self.state.aboutImageRotY = 0;
                aboutWrapper.style.transform = "";
            }
        }

        if (self.state.activeAboutCards.size > 0) {
            self.state.activeAboutCards.forEach(card => {
                let targetCardRotX = 0;
                let targetCardRotY = 0;

                if (self.state.hoveredAboutCard === card && self.state.hoveredAboutCardRect) {
                    const rect = self.state.hoveredAboutCardRect;
                    const x = targetX - rect.left;
                    const y = targetY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    targetCardRotX = -(y - centerY) / (rect.height / 8);
                    targetCardRotY = (x - centerX) / (rect.width / 8);
                }

                let currentRotX = parseFloat(card.getAttribute("data-rot-x") || "0");
                let currentRotY = parseFloat(card.getAttribute("data-rot-y") || "0");
                const diffX = targetCardRotX - currentRotX;
                const diffY = targetCardRotY - currentRotY;

                if (Math.abs(diffX) < EPSILON && Math.abs(diffY) < EPSILON) {
                    currentRotX = targetCardRotX;
                    currentRotY = targetCardRotY;
                    card.style.transform = (currentRotX === 0 && currentRotY === 0)
                        ? ""
                        : `perspective(700px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
                    card.setAttribute("data-rot-x", currentRotX);
                    card.setAttribute("data-rot-y", currentRotY);
                    if (self.state.hoveredAboutCard !== card) {
                        self.state.activeAboutCards.delete(card);
                    }
                } else {
                    currentRotX += diffX * 0.22;
                    currentRotY += diffY * 0.22;
                    card.style.transform = `perspective(700px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
                    card.setAttribute("data-rot-x", currentRotX);
                    card.setAttribute("data-rot-y", currentRotY);
                }
            });
        }
    },

    /* ----------------------------------------------------------------------
       Reduced Motion fallback
    ---------------------------------------------------------------------- */
    handleReducedMotion() {
        // Restore native cursor and hide custom cursor elements
        document.documentElement.classList.remove("custom-cursor-enabled");
        document.documentElement.classList.remove("custom-cursor-hidden-page");
        document.documentElement.classList.remove("js-active");
        
        const cursor = this.elements.customCursor;
        if (cursor) cursor.style.display = "none";
        if (this.elements.cursorSpotlight) {
            this.elements.cursorSpotlight.style.display = "none";
        }
        document.documentElement.style.cursor = "auto";

        if (typeof gsap === "undefined") return;
        gsap.set([
            ".hero__bg-mesh", "#bg-particles", ".hero__orbit-ring", ".hero__orbit-path",
            ".hero__stage-glow", "#portrait-wrapper", ".hero__greeting", ".hero__title",
            ".hero__role-section", ".hero__glass-card", ".hero__buttons", ".hero__status-card",
            ".social-btn", "#scroll-indicator", "#explore-dial-container",
            ".about__eyebrow", ".about__heading", ".about__description p", ".about__highlight-card",
            ".about__actions", ".about__media", ".about__float-badge", "#about-text", "#about-media",
            ".section-header__eyebrow", ".section-header__title", ".section-header__description",
            ".skills__card", ".projects__card", ".blogs__card", ".achievements__card",
            ".resume__card", ".cta__card", ".connect__card", ".connect__detail"
        ], {
            opacity: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
            rotateY: 0
        });
    }
};

// Register module with global Portfolio engine
if (typeof Portfolio !== "undefined" && Portfolio.Modules && Portfolio.Modules.register) {
    Portfolio.Modules.register("Home", Home);
} else {
    // Fallback self-init if global.js is not loaded
    document.addEventListener("DOMContentLoaded", () => {
        Home.init();
    });
}
