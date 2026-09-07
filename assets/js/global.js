"use strict";

/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 01
                           CORE FOUNDATION
=============================================================================

Project     : Ammlan Rath Portfolio
File        : global.js
Version     : 1.0.0
Author      : Ammlan Rath

Description
-----------
This file acts as the global JavaScript engine for the entire portfolio.

Nothing page-specific should exist here.

Every page will use this file.

Current Phase
-------------
✔ Application Foundation
✔ Global Configuration
✔ Runtime State
✔ DOM Cache
✔ Utility Functions
✔ Logger
✔ Feature Detection
✔ Bootstrap

============================================================================= */

/* ==========================================================================
                                GLOBAL NAMESPACE
============================================================================= */

const Portfolio = {};

/* ==========================================================================
                                APPLICATION INFO
============================================================================= */

Portfolio.Info = {

    name: "Ammlan Rath Portfolio",

    version: "1.0.0",

    author: "Ammlan Rath",

    environment: "development",

    debug: true

};

/* ==========================================================================
                                GLOBAL CONFIGURATION
============================================================================= */

Portfolio.Config = {

    animation: {

        enabled: true,

        duration: 0.55,

        stagger: 0.05

    },

    scroll: {

        smooth: true,

        offset: 80

    },

    performance: {

        passiveEvents: true,

        lazyLoading: true

    },

    accessibility: {

        reducedMotion: true,

        focusVisible: true

    }

};

/* ==========================================================================
                                BREAKPOINTS
============================================================================= */

Portfolio.Breakpoints = {

    mobile: 576,

    tablet: 768,

    laptop: 992,

    desktop: 1200,

    wide: 1440

};

/* ==========================================================================
                                MOTION TOKENS
============================================================================= */

Portfolio.Motion = {

    fast: 150,

    normal: 280,

    slow: 500,

    verySlow: 900,

    easing: {

        standard: "power2.out",

        smooth: "power3.out",

        bounce: "back.out(1.7)"

    }

};

/* ==========================================================================
                                APPLICATION STATE
============================================================================= */

Portfolio.State = {

    pageLoaded: false,

    pageReady: false,

    menuOpen: false,

    scrolling: false,

    reducedMotion: false,

    touchDevice: false,

    currentBreakpoint: "",

    scrollY: 0,

    scrollDirection: "down",

    viewportWidth: window.innerWidth,

    viewportHeight: window.innerHeight

};

/* ==========================================================================
                                DOM CACHE
============================================================================= */

Portfolio.Cache = {

    html: null,

    body: null,

    header: null,

    navigation: null,

    main: null,

    footer: null,

    loader: null,

    backToTop: null

};

/* ==========================================================================
                                MODULE REGISTRY
============================================================================= */

Portfolio.Modules = {};

/* ==========================================================================
                                GLOBAL UTILITIES
============================================================================= */

Portfolio.Utils = {

    /* ------------------------------------------
       Query Selectors
    ------------------------------------------ */

    $(selector, scope = document) {

        return scope.querySelector(selector);

    },

    $$(selector, scope = document) {

        return [...scope.querySelectorAll(selector)];

    },

    /* ------------------------------------------
       Debounce
    ------------------------------------------ */

    debounce(callback, delay = 300) {

        let timeout;

        return (...args) => {

            clearTimeout(timeout);

            timeout = setTimeout(() => callback(...args), delay);

        };

    },

    /* ------------------------------------------
       Throttle
    ------------------------------------------ */

    throttle(callback, limit = 100) {

        let waiting = false;

        return (...args) => {

            if (waiting) return;

            callback(...args);

            waiting = true;

            setTimeout(() => {

                waiting = false;

            }, limit);

        };

    },

    /* ------------------------------------------
       Clamp
    ------------------------------------------ */

    clamp(value, min, max) {

        return Math.min(Math.max(value, min), max);

    },

    /* ------------------------------------------
       Linear Interpolation
    ------------------------------------------ */

    lerp(start, end, factor) {

        return start + (end - start) * factor;

    },

    /* ------------------------------------------
       Wait
    ------------------------------------------ */

    wait(milliseconds) {

        return new Promise(resolve => {

            setTimeout(resolve, milliseconds);

        });

    },

    /* ------------------------------------------
       Device Detection
    ------------------------------------------ */

    isTouchDevice() {

        return window.matchMedia("(pointer: coarse)").matches;

    }

};

/* ==========================================================================
                                LOGGER
============================================================================= */

Portfolio.Logger = {

    info(...message) {

        if (!Portfolio.Info.debug) return;

        console.log("[INFO]", ...message);

    },

    success(...message) {

        if (!Portfolio.Info.debug) return;

        console.log("[SUCCESS]", ...message);

    },

    warning(...message) {

        if (!Portfolio.Info.debug) return;

        console.warn("[WARNING]", ...message);

    },

    error(...message) {

        console.error("[ERROR]", ...message);

    }

};

/* ==========================================================================
                                FEATURE DETECTION
============================================================================= */

Portfolio.Features = {

    detect() {

        Portfolio.State.touchDevice =

            Portfolio.Utils.isTouchDevice();

        Portfolio.State.reducedMotion =

            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        Portfolio.State.currentBreakpoint =

            this.getCurrentBreakpoint();

    },

    getCurrentBreakpoint() {

        const width = window.innerWidth;

        if (width < Portfolio.Breakpoints.tablet) return "mobile";

        if (width < Portfolio.Breakpoints.laptop) return "tablet";

        if (width < Portfolio.Breakpoints.desktop) return "laptop";

        if (width < Portfolio.Breakpoints.wide) return "desktop";

        return "wide";

    }

};

/* ==========================================================================
                                DOM INITIALIZATION
============================================================================= */

Portfolio.DOM = {

    cache() {

        Portfolio.Cache.html = document.documentElement;

        Portfolio.Cache.body = document.body;

        Portfolio.Cache.header =

            Portfolio.Utils.$("header");

        Portfolio.Cache.navigation =

            Portfolio.Utils.$(".header__navigation");

        Portfolio.Cache.main =

            Portfolio.Utils.$("main");

        Portfolio.Cache.footer =

            Portfolio.Utils.$("footer");

        Portfolio.Cache.loader =

            Portfolio.Utils.$("#loader");

        Portfolio.Cache.backToTop =

            Portfolio.Utils.$("#back-to-top");

    }

};

/* ==========================================================================
                                INITIALIZATION
============================================================================= */

Portfolio.init = () => {

    Portfolio.Logger.info("Initializing Portfolio...");

    Portfolio.Features.detect();

    Portfolio.DOM.cache();

    Portfolio.State.pageLoaded = true;

    Portfolio.State.pageReady = true;

    Portfolio.Logger.success("Portfolio initialized successfully.");

};

/* ==========================================================================
                                APPLICATION START
============================================================================= */

document.addEventListener("DOMContentLoaded", () => {

    Portfolio.init();

});

/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 02
                        GLOBAL EVENT ENGINE
=============================================================================

Responsibilities
----------------
✔ Global Event Manager
✔ Lifecycle Manager
✔ Module Registry
✔ Window Events
✔ Document Events
✔ Event Cleanup
✔ Global State Updates

============================================================================= */

/* ==========================================================================
                                EVENT MANAGER
============================================================================= */

Portfolio.EventManager = {

    listeners: [],

    add(target, event, handler, options = {}) {

        if (!target || !event || !handler) return;

        target.addEventListener(

            event,

            handler,

            options

        );

        this.listeners.push({

            target,

            event,

            handler,

            options

        });

    },

    remove(target, event, handler, options = {}) {

        if (!target || !event || !handler) return;

        target.removeEventListener(

            event,

            handler,

            options

        );

    },

    removeAll() {

        this.listeners.forEach(listener => {

            listener.target.removeEventListener(

                listener.event,

                listener.handler,

                listener.options

            );

        });

        this.listeners = [];

    }

};

/* ==========================================================================
                            LIFECYCLE MANAGER
============================================================================= */

Portfolio.Lifecycle = {

    modules: [],

    register(module) {

        if (!module) return;

        this.modules.push(module);

    },

    init() {

        this.modules.forEach(module => {

            if (typeof module.init === "function") {

                module.init();

            }

        });

    },

    destroy() {

        this.modules.forEach(module => {

            if (typeof module.destroy === "function") {

                module.destroy();

            }

        });

    }

};

/* ==========================================================================
                            MODULE REGISTRY
============================================================================= */

Portfolio.Modules = {

    register(name, module) {

        if (!name || !module) return;

        this[name] = module;

        Portfolio.Lifecycle.register(module);

    }

};

/* ==========================================================================
                            GLOBAL EVENT HANDLERS
============================================================================= */

Portfolio.Events = {

    init() {

        const debouncedResize = Portfolio.Utils.debounce(this.onResize.bind(this), 150);

        Portfolio.EventManager.add(

            window,

            "resize",

            debouncedResize,

            { passive: true }

        );

        Portfolio.EventManager.add(

            window,

            "scroll",

            this.onScroll.bind(this),

            { passive: true }

        );

        Portfolio.EventManager.add(

            window,

            "orientationchange",

            this.onOrientationChange.bind(this)

        );

        Portfolio.EventManager.add(

            document,

            "visibilitychange",

            this.onVisibilityChange.bind(this)

        );

        Portfolio.EventManager.add(

            window,

            "online",

            this.onOnline.bind(this)

        );

        Portfolio.EventManager.add(

            window,

            "offline",

            this.onOffline.bind(this)

        );

        Portfolio.EventManager.add(

            document,

            "keydown",

            this.onKeyDown.bind(this)

        );

    },

    onResize() {

        Portfolio.State.viewportWidth = window.innerWidth;

        Portfolio.State.viewportHeight = window.innerHeight;

        Portfolio.State.currentBreakpoint =

            Portfolio.Features.getCurrentBreakpoint();

    },

    onScroll() {

        const currentScroll = window.scrollY;

        Portfolio.State.scrollDirection =

            currentScroll > Portfolio.State.scrollY

                ? "down"

                : "up";

        Portfolio.State.scrollY = currentScroll;

        Portfolio.State.scrolling = true;

        if (Portfolio.ScrollManager && typeof Portfolio.ScrollManager.update === "function") {

            Portfolio.ScrollManager.update();

        }

        if (Portfolio.Header && typeof Portfolio.Header.update === "function") {

            Portfolio.Header.update();

        }

        if (Portfolio.BackToTop && typeof Portfolio.BackToTop.update === "function") {

            Portfolio.BackToTop.update();

        }

    },

    onOrientationChange() {

        Portfolio.Logger.info("Orientation changed.");

    },

    onVisibilityChange() {

        Portfolio.State.pageVisible =

            document.visibilityState === "visible";

        if (document.hidden) {

            if (Portfolio.MasterLoop) Portfolio.MasterLoop.pause();

            if (typeof gsap !== "undefined") gsap.ticker.sleep();

        } else {

            if (Portfolio.MasterLoop) Portfolio.MasterLoop.resume();

            if (typeof gsap !== "undefined") gsap.ticker.wake();

        }

    },

    onOnline() {

        Portfolio.Logger.success("Connection restored.");

    },

    onOffline() {

        Portfolio.Logger.warning("Internet connection lost.");

    },

    onKeyDown(event) {

        Portfolio.State.lastKey = event.key;

    }

};

/* ==========================================================================
                            APPLICATION CLEANUP
============================================================================= */

Portfolio.destroy = () => {

    Portfolio.Logger.info("Destroying Portfolio...");

    Portfolio.Lifecycle.destroy();

    Portfolio.EventManager.removeAll();

};

/* ==========================================================================
                        UPDATE INITIALIZATION
=============================================================================

Replace your existing Portfolio.init() function with the one below.

============================================================================= */

Portfolio.init = () => {

    Portfolio.Logger.info("Initializing Portfolio...");

    Portfolio.Features.detect();

    Portfolio.DOM.cache();

    Portfolio.Events.init();

    Portfolio.Lifecycle.init();

    Portfolio.State.pageLoaded = true;

    Portfolio.State.pageReady = true;

    Portfolio.Logger.success("Portfolio initialized successfully.");

};

/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 03
                             HEADER SYSTEM
=============================================================================

Responsibilities
----------------
✔ Sticky Header
✔ Header Scroll Detection
✔ Hide On Scroll
✔ Reveal On Scroll
✔ Compact Header
✔ Active Header State
✔ Lifecycle Ready

============================================================================= */

/* ==========================================================================
                                HEADER MODULE
============================================================================= */

Portfolio.Header = {

    /* ----------------------------------------------------------------------
       Configuration
    ---------------------------------------------------------------------- */

    config: {

        scrollOffset: 80,

        hideOffset: 10

    },

    /* ----------------------------------------------------------------------
       Runtime State
    ---------------------------------------------------------------------- */

    state: {

        initialized: false,

        hidden: false,

        compact: false

    },

    /* ----------------------------------------------------------------------
       Initialization
    ---------------------------------------------------------------------- */

    init() {

        if (!Portfolio.Cache.header) return;

        this.bindEvents();

        this.update();

        this.state.initialized = true;

        Portfolio.Logger.success("Header initialized.");

    },

    /* ----------------------------------------------------------------------
       Register Global Events
    ---------------------------------------------------------------------- */

    bindEvents() {

        // Scroll updates are centralized in Portfolio.Events.onScroll

    },

    /* ----------------------------------------------------------------------
       Update Header
    ---------------------------------------------------------------------- */

    update() {

        this.toggleCompact();

        this.toggleVisibility();

    },

    /* ----------------------------------------------------------------------
       Compact Header
    ---------------------------------------------------------------------- */

    toggleCompact() {

        const header = Portfolio.Cache.header;

        if (!header) return;

        if (Portfolio.State.scrollY >

            this.config.scrollOffset) {

            Portfolio.Classes.add(

                header,

                "scrolled"

            );

            this.state.compact = true;

        }

        else {

            Portfolio.Classes.remove(

                header,

                "scrolled"

            );

            this.state.compact = false;

        }

    },

    /* ----------------------------------------------------------------------
       Hide / Reveal Header
    ---------------------------------------------------------------------- */

    toggleVisibility() {

        const header = Portfolio.Cache.header;

        if (!header) return;

        if (

            Portfolio.State.scrollDirection === "down" &&

            Portfolio.State.scrollY >

            this.config.scrollOffset

        ) {

            Portfolio.Classes.add(

                header,

                "header--hidden"

            );

            this.state.hidden = true;

        }

        else {

            Portfolio.Classes.remove(

                header,

                "header--hidden"

            );

            this.state.hidden = false;

        }

    },

    /* ----------------------------------------------------------------------
       Refresh
    ---------------------------------------------------------------------- */

    refresh() {

        this.update();

    },

    /* ----------------------------------------------------------------------
       Destroy
    ---------------------------------------------------------------------- */

    destroy() {

        this.state.initialized = false;

    }

};

/* ==========================================================================
                        REGISTER HEADER MODULE
============================================================================= */

Portfolio.Modules.register(

    "Header",

    Portfolio.Header

);

/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 04
                          DOM UTILITY SYSTEM
=============================================================================

Responsibilities
----------------
✔ DOM Element Helpers
✔ Class Helpers
✔ Attribute Helpers
✔ Style Helpers
✔ Visibility Helpers
✔ DOM Creation
✔ Scroll Helpers

============================================================================= */

/* ==========================================================================
                            CLASS MANAGER
============================================================================= */

Portfolio.Classes = {

    add(element, ...classes) {

        if (!element) return;

        element.classList.add(...classes);

    },

    remove(element, ...classes) {

        if (!element) return;

        element.classList.remove(...classes);

    },

    toggle(element, className) {

        if (!element) return;

        element.classList.toggle(className);

    },

    contains(element, className) {

        if (!element) return false;

        return element.classList.contains(className);

    },

    replace(element, oldClass, newClass) {

        if (!element) return;

        element.classList.replace(oldClass, newClass);

    }

};

/* ==========================================================================
                            ATTRIBUTE MANAGER
============================================================================= */

Portfolio.Attributes = {

    get(element, attribute) {

        if (!element) return null;

        return element.getAttribute(attribute);

    },

    set(element, attribute, value) {

        if (!element) return;

        element.setAttribute(attribute, value);

    },

    remove(element, attribute) {

        if (!element) return;

        element.removeAttribute(attribute);

    },

    has(element, attribute) {

        if (!element) return false;

        return element.hasAttribute(attribute);

    }

};

/* ==========================================================================
                            STYLE MANAGER
============================================================================= */

Portfolio.Styles = {

    get(element, property) {

        if (!element) return null;

        return getComputedStyle(element).getPropertyValue(property);

    },

    set(element, property, value) {

        if (!element) return;

        element.style.setProperty(property, value);

    },

    remove(element, property) {

        if (!element) return;

        element.style.removeProperty(property);

    }

};

/* ==========================================================================
                            VISIBILITY MANAGER
============================================================================= */

Portfolio.Visibility = {

    show(element, display = "") {

        if (!element) return;

        element.style.display = display;

    },

    hide(element) {

        if (!element) return;

        element.style.display = "none";

    },

    toggle(element) {

        if (!element) return;

        if (getComputedStyle(element).display === "none") {

            element.style.display = "";

        } else {

            element.style.display = "none";

        }

    }

};

/* ==========================================================================
                            DOM HELPERS
============================================================================= */

Portfolio.DOMHelpers = {

    create(tag, className = "", text = "") {

        const element = document.createElement(tag);

        if (className) {

            element.className = className;

        }

        if (text) {

            element.textContent = text;

        }

        return element;

    },

    append(parent, child) {

        if (!parent || !child) return;

        parent.appendChild(child);

    },

    prepend(parent, child) {

        if (!parent || !child) return;

        parent.prepend(child);

    },

    remove(element) {

        if (!element) return;

        element.remove();

    },

    empty(element) {

        if (!element) return;

        element.innerHTML = "";

    }

};

/* ==========================================================================
                            SCROLL HELPERS
============================================================================= */

Portfolio.Scroll = {

    toTop(behavior = "smooth") {

        window.scrollTo({

            top: 0,

            behavior

        });

    },

    to(y, behavior = "smooth") {

        window.scrollTo({

            top: y,

            behavior

        });

    },

    toElement(element, behavior = "smooth") {

        if (!element) return;

        element.scrollIntoView({

            behavior,

            block: "start"

        });

    }

};

/* ==========================================================================
                            VIEWPORT HELPERS
============================================================================= */

Portfolio.Viewport = {

    width() {

        return window.innerWidth;

    },

    height() {

        return window.innerHeight;

    },

    centerX() {

        return window.innerWidth / 2;

    },

    centerY() {

        return window.innerHeight / 2;

    }

};

/* ==========================================================================
                            DEVICE HELPERS
============================================================================= */

Portfolio.Device = {

    isMobile() {

        return window.innerWidth < Portfolio.Breakpoints.tablet;

    },

    isTablet() {

        return window.innerWidth >= Portfolio.Breakpoints.tablet &&
               window.innerWidth < Portfolio.Breakpoints.laptop;

    },

    isDesktop() {

        return window.innerWidth >= Portfolio.Breakpoints.laptop;

    },

    prefersReducedMotion() {

        return window.matchMedia(

            "(prefers-reduced-motion: reduce)"

        ).matches;

    }

};

/* ==========================================================================
                            STORAGE HELPERS
============================================================================= */

Portfolio.Storage = {

    set(key, value) {

        localStorage.setItem(

            key,

            JSON.stringify(value)

        );

    },

    get(key) {

        const value = localStorage.getItem(key);

        return value

            ? JSON.parse(value)

            : null;

    },

    remove(key) {

        localStorage.removeItem(key);

    },

    clear() {

        localStorage.clear();

    }

};

/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 05
                           NAVIGATION SYSTEM
=============================================================================

Responsibilities
----------------
✔ Desktop Navigation
✔ Mobile Navigation
✔ Navigation Overlay
✔ Toggle Button
✔ Active Navigation
✔ Smooth Anchor Navigation
✔ Keyboard Accessibility
✔ Focus Management

============================================================================= */

/* ==========================================================================
                            NAVIGATION MODULE
============================================================================= */

Portfolio.Navigation = {

    /* ----------------------------------------------------------------------
       Configuration
    ---------------------------------------------------------------------- */

    config: {

        activeClass: "navbar__link--active",

        openClass: "navigation--open",

        bodyLockClass: "body--locked"

    },

    /* ----------------------------------------------------------------------
       DOM ELEMENTS
    ---------------------------------------------------------------------- */

    elements: {

        navigation: null,

        toggle: null,

        overlay: null,

        links: []

    },

    /* ----------------------------------------------------------------------
       Runtime State
    ---------------------------------------------------------------------- */

    state: {

        initialized: false,

        open: false

    },

    /* ----------------------------------------------------------------------
       Initialization
    ---------------------------------------------------------------------- */

    init() {

        this.cacheDOM();

        this.bindEvents();

        this.highlightCurrentPage();

        this.state.initialized = true;

        Portfolio.Logger.success("Navigation initialized.");

    },

    /* ----------------------------------------------------------------------
       Cache DOM
    ---------------------------------------------------------------------- */

    cacheDOM() {

        this.elements.navigation =

            Portfolio.Utils.$(".mobile-navigation");

        this.elements.toggle =

            Portfolio.Utils.$(".menu-button");

        this.elements.overlay =

            Portfolio.Utils.$(".navigation-overlay");

        this.elements.links =

            Portfolio.Utils.$$(".navbar__link, .mobile-navigation__list a");

    },

    /* ----------------------------------------------------------------------
       Register Events
    ---------------------------------------------------------------------- */

    bindEvents() {

        if (this.elements.toggle) {

            Portfolio.EventManager.add(

                this.elements.toggle,

                "click",

                this.toggle.bind(this)

            );

        }

        this.elements.links.forEach(link => {

            Portfolio.EventManager.add(

                link,

                "click",

                this.handleNavigation.bind(this)

            );

        });

        Portfolio.EventManager.add(

            document,

            "keydown",

            this.handleKeyboard.bind(this)

        );

    },

    /* ----------------------------------------------------------------------
       Toggle Navigation
    ---------------------------------------------------------------------- */

    toggle() {

        this.state.open

            ? this.close()

            : this.open();

    },

    /* ----------------------------------------------------------------------
       Open Navigation
    ---------------------------------------------------------------------- */

    open() {

        this.state.open = true;

        Portfolio.State.menuOpen = true;

        Portfolio.Classes.add(

            this.elements.navigation,

            this.config.openClass

        );

        Portfolio.Classes.add(

            Portfolio.Cache.body,

            this.config.bodyLockClass

        );

        if (this.elements.toggle) {

            Portfolio.Attributes.set(

                this.elements.toggle,

                "aria-expanded",

                "true"

            );

        }

    },

    /* ----------------------------------------------------------------------
       Close Navigation
    ---------------------------------------------------------------------- */

    close() {

        this.state.open = false;

        Portfolio.State.menuOpen = false;

        Portfolio.Classes.remove(

            this.elements.navigation,

            this.config.openClass

        );

        Portfolio.Classes.remove(

            Portfolio.Cache.body,

            this.config.bodyLockClass

        );

        if (this.elements.toggle) {

            Portfolio.Attributes.set(

                this.elements.toggle,

                "aria-expanded",

                "false"

            );

        }

    },

    /* ----------------------------------------------------------------------
       Handle Navigation Click
    ---------------------------------------------------------------------- */

    handleNavigation(event) {

        const href =

            event.currentTarget.getAttribute("href");

        if (!href) return;

        if (href.startsWith("#")) {

            event.preventDefault();

            const section =

                Portfolio.Utils.$(href);

            if (section) {

                Portfolio.Scroll.toElement(section);

            }

        }

        this.close();

    },

    /* ----------------------------------------------------------------------
       Highlight Current Page
    ---------------------------------------------------------------------- */

    highlightCurrentPage() {

        const current =

            window.location.pathname.split("/").pop();

        this.elements.links.forEach(link => {

            const href =

                link.getAttribute("href");

            if (

                href === current ||

                (current === "" && href === "index.html")

            ) {

                Portfolio.Classes.add(

                    link,

                    this.config.activeClass

                );

            }

        });

    },

    /* ----------------------------------------------------------------------
       Keyboard Accessibility
    ---------------------------------------------------------------------- */

    handleKeyboard(event) {

        if (

            event.key === "Escape" &&

            this.state.open

        ) {

            this.close();

        }

    },

    /* ----------------------------------------------------------------------
       Refresh
    ---------------------------------------------------------------------- */

    refresh() {

        this.highlightCurrentPage();

    },

    /* ----------------------------------------------------------------------
       Destroy
    ---------------------------------------------------------------------- */

    destroy() {

        this.close();

        this.state.initialized = false;

    }

};

/* ==========================================================================
                        REGISTER NAVIGATION MODULE
============================================================================= */

Portfolio.Modules.register(

    "Navigation",

    Portfolio.Navigation

);

/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 06
                             SCROLL MANAGER
=============================================================================

Responsibilities
----------------
✔ Central Scroll State
✔ Scroll Direction
✔ Scroll Progress
✔ Scroll Velocity
✔ Viewport Detection
✔ Scroll Position
✔ Section Tracking
✔ Future GSAP Integration

============================================================================= */

/* ==========================================================================
                            SCROLL MANAGER
============================================================================= */

Portfolio.ScrollManager = {

    /* ----------------------------------------------------------------------
       Configuration
    ---------------------------------------------------------------------- */

    config: {

        tickRate: 16,

        topOffset: 100

    },

    /* ----------------------------------------------------------------------
       Runtime State
    ---------------------------------------------------------------------- */

    state: {

        current: 0,

        previous: 0,

        direction: "down",

        progress: 0,

        velocity: 0,

        percentage: 0,

        atTop: true,

        atBottom: false

    },

    /* ----------------------------------------------------------------------
       Initialization
    ---------------------------------------------------------------------- */

    init() {

        this.update();

        Portfolio.Logger.success("Scroll Manager initialized.");

    },

    /* ----------------------------------------------------------------------
       Update
    ---------------------------------------------------------------------- */

    update() {

        const current = window.scrollY;

        const maxScroll =

            document.documentElement.scrollHeight -

            window.innerHeight;

        this.state.previous = this.state.current;

        this.state.current = current;

        this.state.velocity =

            current - this.state.previous;

        this.state.direction =

            current > this.state.previous

                ? "down"

                : "up";

        this.state.progress =

            maxScroll > 0

                ? current / maxScroll

                : 0;

        this.state.percentage =

            Math.round(this.state.progress * 100);

        this.state.atTop =

            current <= this.config.topOffset;

        this.state.atBottom =

            current >= maxScroll;

        Portfolio.State.scrollY = current;

        Portfolio.State.scrollDirection =

            this.state.direction;

    },

    /* ----------------------------------------------------------------------
       Refresh
    ---------------------------------------------------------------------- */

    refresh() {

        this.update();

    },

    /* ----------------------------------------------------------------------
       Helpers
    ---------------------------------------------------------------------- */

    isScrollingDown() {

        return this.state.direction === "down";

    },

    isScrollingUp() {

        return this.state.direction === "up";

    },

    isAtTop() {

        return this.state.atTop;

    },

    isAtBottom() {

        return this.state.atBottom;

    },

    progress() {

        return this.state.progress;

    },

    percentage() {

        return this.state.percentage;

    },

    position() {

        return this.state.current;

    },

    velocity() {

        return this.state.velocity;

    },

    /* ----------------------------------------------------------------------
       Destroy
    ---------------------------------------------------------------------- */

    destroy() {

        this.state.current = 0;

        this.state.previous = 0;

    }

};

/* ==========================================================================
                        REGISTER SCROLL MANAGER
============================================================================= */

Portfolio.Modules.register(

    "ScrollManager",

    Portfolio.ScrollManager

);


/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 07
                            GLOBAL UI MANAGER
=============================================================================

Responsibilities
----------------
✔ Loading State
✔ Body Lock
✔ Element Visibility
✔ Global Notifications (Future)
✔ UI State Management
✔ Reusable UI Helpers

============================================================================= */

/* ==========================================================================
                                UI MANAGER
============================================================================= */

Portfolio.UI = {

    /* ----------------------------------------------------------------------
       Runtime State
    ---------------------------------------------------------------------- */

    state: {

        loading: false,

        locked: false

    },

    /* ----------------------------------------------------------------------
       Initialization
    ---------------------------------------------------------------------- */

    init() {

        Portfolio.Logger.success("UI Manager initialized.");

    },

    /* ----------------------------------------------------------------------
       Loading State
    ---------------------------------------------------------------------- */

    startLoading() {

        this.state.loading = true;

        if (Portfolio.Cache.loader) {

            Portfolio.Classes.add(

                Portfolio.Cache.loader,

                "is-active"

            );

        }

    },

    stopLoading() {

        this.state.loading = false;

        if (Portfolio.Cache.loader) {

            Portfolio.Classes.remove(

                Portfolio.Cache.loader,

                "is-active"

            );

        }

    },

    /* ----------------------------------------------------------------------
       Body Scroll Lock
    ---------------------------------------------------------------------- */

    lockBody() {

        if (this.state.locked) return;

        this.state.locked = true;

        Portfolio.Classes.add(

            Portfolio.Cache.body,

            "body--locked"

        );

    },

    unlockBody() {

        this.state.locked = false;

        Portfolio.Classes.remove(

            Portfolio.Cache.body,

            "body--locked"

        );

    },

    /* ----------------------------------------------------------------------
       Visibility Helpers
    ---------------------------------------------------------------------- */

    show(element) {

        if (!element) return;

        Portfolio.Classes.remove(

            element,

            "is-hidden"

        );

    },

    hide(element) {

        if (!element) return;

        Portfolio.Classes.add(

            element,

            "is-hidden"

        );

    },

    toggle(element) {

        if (!element) return;

        Portfolio.Classes.toggle(

            element,

            "is-hidden"

        );

    },

    /* ----------------------------------------------------------------------
       Enable / Disable
    ---------------------------------------------------------------------- */

    disable(element) {

        if (!element) return;

        element.disabled = true;

    },

    enable(element) {

        if (!element) return;

        element.disabled = false;

    },

    /* ----------------------------------------------------------------------
       Focus Helpers
    ---------------------------------------------------------------------- */

    focus(element) {

        if (!element) return;

        element.focus();

    },

    blur(element) {

        if (!element) return;

        element.blur();

    },

    /* ----------------------------------------------------------------------
       Refresh
    ---------------------------------------------------------------------- */

    refresh() {

        return true;

    },

    /* ----------------------------------------------------------------------
       Destroy
    ---------------------------------------------------------------------- */

    destroy() {

        this.unlockBody();

        this.stopLoading();

    }

};

/* ==========================================================================
                        REGISTER UI MANAGER
============================================================================= */

Portfolio.Modules.register(

    "UI",

    Portfolio.UI

);


/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 08
                           BACK TO TOP SYSTEM
=============================================================================

Responsibilities
----------------
✔ Show / Hide Button
✔ Smooth Scroll To Top
✔ Scroll Progress
✔ Accessibility
✔ Future Progress Ring Support

============================================================================= */

/* ==========================================================================
                            BACK TO TOP MODULE
============================================================================= */

Portfolio.BackToTop = {

    /* ----------------------------------------------------------------------
       Configuration
    ---------------------------------------------------------------------- */

    config: {

        visibilityOffset: 400,

        activeClass: "show"

    },

    /* ----------------------------------------------------------------------
       DOM ELEMENTS
    ---------------------------------------------------------------------- */

    elements: {

        button: null

    },

    /* ----------------------------------------------------------------------
       Runtime State
    ---------------------------------------------------------------------- */

    state: {

        initialized: false,

        visible: false

    },

    /* ----------------------------------------------------------------------
       Initialization
    ---------------------------------------------------------------------- */

    init() {

        this.cacheDOM();

        if (!this.elements.button) return;

        this.bindEvents();

        this.update();

        this.state.initialized = true;

        Portfolio.Logger.success("Back To Top initialized.");

    },

    /* ----------------------------------------------------------------------
       Cache DOM
    ---------------------------------------------------------------------- */

    cacheDOM() {

        this.elements.button =

            Portfolio.Cache.backToTop;

    },

    /* ----------------------------------------------------------------------
       Register Events
    ---------------------------------------------------------------------- */

    bindEvents() {

        Portfolio.EventManager.add(

            this.elements.button,

            "click",

            this.scrollToTop.bind(this)

        );

    },

    /* ----------------------------------------------------------------------
       Update State
    ---------------------------------------------------------------------- */

    update() {

        if (!this.elements.button) return;

        if (

            Portfolio.ScrollManager.position() >

            this.config.visibilityOffset

        ) {

            this.show();

        }

        else {

            this.hide();

        }

    },

    /* ----------------------------------------------------------------------
       Show Button
    ---------------------------------------------------------------------- */

    show() {

        if (this.state.visible) return;

        Portfolio.Classes.add(

            this.elements.button,

            this.config.activeClass

        );

        Portfolio.Attributes.set(

            this.elements.button,

            "aria-hidden",

            "false"

        );

        this.state.visible = true;

    },

    /* ----------------------------------------------------------------------
       Hide Button
    ---------------------------------------------------------------------- */

    hide() {

        if (!this.state.visible) return;

        Portfolio.Classes.remove(

            this.elements.button,

            this.config.activeClass

        );

        Portfolio.Attributes.set(

            this.elements.button,

            "aria-hidden",

            "true"

        );

        this.state.visible = false;

    },

    /* ----------------------------------------------------------------------
       Scroll To Top
    ---------------------------------------------------------------------- */

    scrollToTop() {

        Portfolio.Scroll.toTop();

    },

    /* ----------------------------------------------------------------------
       Refresh
    ---------------------------------------------------------------------- */

    refresh() {

        this.update();

    },

    /* ----------------------------------------------------------------------
       Destroy
    ---------------------------------------------------------------------- */

    destroy() {

        this.hide();

        this.state.initialized = false;

    }

};

/* ==========================================================================
                    REGISTER BACK TO TOP MODULE
============================================================================= */

Portfolio.Modules.register(

    "BackToTop",

    Portfolio.BackToTop

);

/* ==========================================================================
                            MASTER LOOP MODULE
============================================================================= */

Portfolio.MasterLoop = {

    callbacks: [],

    isActive: true,

    animationFrameId: null,

    init() {

        Portfolio.Logger.info("Initializing Master Loop...");

        this.tick = this.tick.bind(this);

        this.isActive = true;

        this.animationFrameId = requestAnimationFrame(this.tick);

        // Listen to visibility change to pause/resume
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.pause();
                if (typeof gsap !== "undefined") gsap.ticker.sleep();
            } else {
                this.resume();
                if (typeof gsap !== "undefined") gsap.ticker.wake();
            }
        });

        Portfolio.Logger.success("Master Loop initialized.");

    },

    register(name, callback, priority = 100) {

        // Avoid duplicate registration
        this.callbacks = this.callbacks.filter(c => c.name !== name);

        this.callbacks.push({ name, callback, priority });

        this.callbacks.sort((a, b) => a.priority - b.priority);

    },

    unregister(name) {

        this.callbacks = this.callbacks.filter(c => c.name !== name);

    },

    pause() {

        this.isActive = false;

        if (this.animationFrameId) {

            cancelAnimationFrame(this.animationFrameId);

            this.animationFrameId = null;

        }

    },

    resume() {

        if (!this.isActive) {

            this.isActive = true;

            this.animationFrameId = requestAnimationFrame(this.tick);

        }

    },

    tick(time) {

        if (!this.isActive) return;

        for (let i = 0; i < this.callbacks.length; i++) {

            try {

                this.callbacks[i].callback(time);

            } catch (e) {

                console.error(`Error in master loop callback ${this.callbacks[i].name}:`, e);

            }

        }

        this.animationFrameId = requestAnimationFrame(this.tick);

    },

    destroy() {

        this.pause();

        this.callbacks = [];

    }

};

/* ==========================================================================
                        REGISTER MASTER LOOP MODULE
============================================================================= */

Portfolio.Modules.register(

    "MasterLoop",

    Portfolio.MasterLoop

);

/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 09
                              MOTION SYSTEM
=============================================================================

Responsibilities
----------------
✔ GSAP Registration
✔ ScrollTrigger Registration
✔ Lenis Integration
✔ SplitType Support
✔ Global Timelines
✔ Shared Animation Presets
✔ Motion Preferences
✔ Animation Helpers

============================================================================= */

/* ==========================================================================
                                MOTION SYSTEM
============================================================================= */

Portfolio.MotionSystem = {

    /* ----------------------------------------------------------------------
       Runtime State
    ---------------------------------------------------------------------- */

    state: {

        initialized: false,

        gsap: false,

        scrollTrigger: false,

        lenis: false,

        splitType: false

    },

    /* ----------------------------------------------------------------------
       Animation Defaults
    ---------------------------------------------------------------------- */

    defaults: {

        duration: 0.55,

        ease: "power3.out",

        stagger: 0.05,

        delay: 0

    },

    /* ----------------------------------------------------------------------
       Initialization
    ---------------------------------------------------------------------- */

    init() {

        this.detectLibraries();

        this.registerPlugins();

        this.initializeLenis();

        this.state.initialized = true;

        Portfolio.Logger.success("Motion System initialized.");

    },

    /* ----------------------------------------------------------------------
       Library Detection
    ---------------------------------------------------------------------- */

    detectLibraries() {

        this.state.gsap =
            typeof window.gsap !== "undefined";

        this.state.scrollTrigger =
            typeof window.ScrollTrigger !== "undefined";

        this.state.lenis =
            typeof window.Lenis !== "undefined";

        this.state.splitType =
            typeof window.SplitType !== "undefined";

    },

    /* ----------------------------------------------------------------------
       Register GSAP Plugins
    ---------------------------------------------------------------------- */

    registerPlugins() {

        if (

            !this.state.gsap ||

            !this.state.scrollTrigger

        ) return;

        gsap.registerPlugin(

            ScrollTrigger

        );

    },

    /* ----------------------------------------------------------------------
       Initialize Lenis
    ---------------------------------------------------------------------- */

    initializeLenis() {

        if (!this.state.lenis) return;

        this.lenis = new Lenis({

            duration: 0.9,

            smoothWheel: true,

            touchMultiplier: 2

        });

        Portfolio.MasterLoop.register("lenis", (time) => {

            this.lenis.raf(time);

        }, 0);

    },

    /* ----------------------------------------------------------------------
       Fade In
    ---------------------------------------------------------------------- */

    fadeIn(target, options = {}) {

        if (!this.state.gsap) return;

        gsap.from(target, {

            opacity: 0,

            duration:

                options.duration ??

                this.defaults.duration,

            delay:

                options.delay ??

                this.defaults.delay,

            ease:

                options.ease ??

                this.defaults.ease

        });

    },

    /* ----------------------------------------------------------------------
       Fade Up
    ---------------------------------------------------------------------- */

    fadeUp(target, options = {}) {

        if (!this.state.gsap) return;

        gsap.from(target, {

            opacity: 0,

            y: 60,

            duration:

                options.duration ??

                this.defaults.duration,

            delay:

                options.delay ??

                this.defaults.delay,

            ease:

                options.ease ??

                this.defaults.ease

        });

    },

    /* ----------------------------------------------------------------------
       Scale In
    ---------------------------------------------------------------------- */

    scaleIn(target, options = {}) {

        if (!this.state.gsap) return;

        gsap.from(target, {

            opacity: 0,

            scale: 0.9,

            duration:

                options.duration ??

                this.defaults.duration,

            ease:

                options.ease ??

                this.defaults.ease

        });

    },

    /* ----------------------------------------------------------------------
       Stagger
    ---------------------------------------------------------------------- */

    stagger(target, options = {}) {

        if (!this.state.gsap) return;

        gsap.from(target, {

            opacity: 0,

            y: 40,

            stagger:

                options.stagger ??

                this.defaults.stagger,

            duration:

                options.duration ??

                this.defaults.duration,

            ease:

                options.ease ??

                this.defaults.ease

        });

    },

    /* ----------------------------------------------------------------------
       Create Timeline
    ---------------------------------------------------------------------- */

    timeline(options = {}) {

        if (!this.state.gsap) return null;

        return gsap.timeline(options);

    },

    /* ----------------------------------------------------------------------
       Refresh ScrollTrigger
    ---------------------------------------------------------------------- */

    refresh() {

        if (!this.state.scrollTrigger) return;

        ScrollTrigger.refresh();

    },

    /* ----------------------------------------------------------------------
       Destroy
    ---------------------------------------------------------------------- */

    destroy() {

        if (this.lenis) {

            this.lenis.destroy();

        }

    }

};

/* ==========================================================================
                        REGISTER MOTION SYSTEM
============================================================================= */

Portfolio.Modules.register(

    "MotionSystem",

    Portfolio.MotionSystem

);


/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 10
                           EXPERIENCE SYSTEM
=============================================================================

Responsibilities
----------------
✔ Reduced Motion
✔ Theme Detection
✔ Color Scheme
✔ Focus Management
✔ Keyboard Navigation
✔ User Preferences
✔ Browser Preferences
✔ Future Theme Support

============================================================================= */

/* ==========================================================================
                            EXPERIENCE SYSTEM
============================================================================= */

Portfolio.Experience = {

    /* ----------------------------------------------------------------------
       Runtime State
    ---------------------------------------------------------------------- */

    state: {

        initialized: false,

        reducedMotion: false,

        darkMode: false,

        highContrast: false,

        keyboardNavigation: false,

        touchDevice: false

    },

    /* ----------------------------------------------------------------------
       Initialization
    ---------------------------------------------------------------------- */

    init() {

        this.detectPreferences();

        this.bindEvents();

        this.state.initialized = true;

        Portfolio.Logger.success("Experience System initialized.");

    },

    /* ----------------------------------------------------------------------
       Detect Browser Preferences
    ---------------------------------------------------------------------- */

    detectPreferences() {

        this.state.reducedMotion = window.matchMedia(

            "(prefers-reduced-motion: reduce)"

        ).matches;

        this.state.darkMode = window.matchMedia(

            "(prefers-color-scheme: dark)"

        ).matches;

        this.state.highContrast = window.matchMedia(

            "(prefers-contrast: more)"

        ).matches;

        this.state.touchDevice =

            Portfolio.Device.isMobile();

    },

    /* ----------------------------------------------------------------------
       Register Events
    ---------------------------------------------------------------------- */

    bindEvents() {

        Portfolio.EventManager.add(

            document,

            "keydown",

            this.handleKeyboard.bind(this)

        );

        Portfolio.EventManager.add(

            document,

            "mousedown",

            this.handleMouse.bind(this)

        );

    },

    /* ----------------------------------------------------------------------
       Keyboard Detection
    ---------------------------------------------------------------------- */

    handleKeyboard() {

        this.state.keyboardNavigation = true;

        Portfolio.Classes.add(

            Portfolio.Cache.body,

            "using-keyboard"

        );

    },

    /* ----------------------------------------------------------------------
       Mouse Detection
    ---------------------------------------------------------------------- */

    handleMouse() {

        this.state.keyboardNavigation = false;

        Portfolio.Classes.remove(

            Portfolio.Cache.body,

            "using-keyboard"

        );

    },

    /* ----------------------------------------------------------------------
       Motion Permission
    ---------------------------------------------------------------------- */

    allowMotion() {

        return !this.state.reducedMotion;

    },

    /* ----------------------------------------------------------------------
       Theme
    ---------------------------------------------------------------------- */

    isDarkMode() {

        return this.state.darkMode;

    },

    /* ----------------------------------------------------------------------
       Touch Device
    ---------------------------------------------------------------------- */

    isTouch() {

        return this.state.touchDevice;

    },

    /* ----------------------------------------------------------------------
       Refresh
    ---------------------------------------------------------------------- */

    refresh() {

        this.detectPreferences();

    },

    /* ----------------------------------------------------------------------
       Destroy
    ---------------------------------------------------------------------- */

    destroy() {

        this.state.initialized = false;

    }

};

/* ==========================================================================
                    REGISTER EXPERIENCE SYSTEM
============================================================================= */

Portfolio.Modules.register(

    "Experience",

    Portfolio.Experience

);

/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 11
                           PERFORMANCE SYSTEM
=============================================================================

Responsibilities
----------------
✔ Resize Observer
✔ Intersection Observer
✔ Mutation Observer
✔ Idle Tasks
✔ Visibility Tracking
✔ Performance Helpers
✔ Future Lazy Loading Support

============================================================================= */

/* ==========================================================================
                            PERFORMANCE SYSTEM
============================================================================= */

Portfolio.Performance = {

    /* ----------------------------------------------------------------------
       Runtime State
    ---------------------------------------------------------------------- */

    state: {

        initialized: false,

        pageVisible: true,

        resizeObserver: null,

        intersectionObserver: null,

        mutationObserver: null

    },

    /* ----------------------------------------------------------------------
       Configuration
    ---------------------------------------------------------------------- */

    config: {

        intersectionThreshold: 0.15,

        rootMargin: "0px 0px -10% 0px"

    },

    /* ----------------------------------------------------------------------
       Initialization
    ---------------------------------------------------------------------- */

    init() {

        this.createIntersectionObserver();

        this.createResizeObserver();

        this.createMutationObserver();

        this.state.initialized = true;

        Portfolio.Logger.success(

            "Performance System initialized."

        );

    },

    /* ----------------------------------------------------------------------
       Intersection Observer
    ---------------------------------------------------------------------- */

    createIntersectionObserver() {

        this.state.intersectionObserver =

            new IntersectionObserver(

                this.handleIntersection.bind(this),

                {

                    threshold:

                        this.config.intersectionThreshold,

                    rootMargin:

                        this.config.rootMargin

                }

            );

    },

    handleIntersection(entries) {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add(

                    "in-view"

                );

            }

        });

    },

    observe(element) {

        if (!element) return;

        this.state.intersectionObserver.observe(

            element

        );

    },

    unobserve(element) {

        if (!element) return;

        this.state.intersectionObserver.unobserve(

            element

        );

    },

    /* ----------------------------------------------------------------------
       Resize Observer
    ---------------------------------------------------------------------- */

    createResizeObserver() {

        this.state.resizeObserver =

            new ResizeObserver(entries => {

                entries.forEach(entry => {

                    Portfolio.Logger.info(

                        "Resize:",

                        entry.target

                    );

                });

            });

    },

    observeResize(element) {

        if (!element) return;

        this.state.resizeObserver.observe(

            element

        );

    },

    /* ----------------------------------------------------------------------
       Mutation Observer
    ---------------------------------------------------------------------- */

    createMutationObserver() {

        this.state.mutationObserver =

            new MutationObserver(() => {

                Portfolio.Logger.info(

                    "DOM Updated."

                );

            });

    },

    observeMutations(element) {

        if (!element) return;

        this.state.mutationObserver.observe(

            element,

            {

                childList: true,

                subtree: true

            }

        );

    },

    /* ----------------------------------------------------------------------
       Browser Idle Task
    ---------------------------------------------------------------------- */

    idle(callback) {

        if (

            "requestIdleCallback" in window

        ) {

            requestIdleCallback(callback);

        }

        else {

            setTimeout(callback, 1);

        }

    },

    /* ----------------------------------------------------------------------
       Page Visibility
    ---------------------------------------------------------------------- */

    isVisible() {

        return document.visibilityState ===

            "visible";

    },

    /* ----------------------------------------------------------------------
       Refresh
    ---------------------------------------------------------------------- */

    refresh() {

        ScrollTrigger?.refresh();

    },

    /* ----------------------------------------------------------------------
       Destroy
    ---------------------------------------------------------------------- */

    destroy() {

        this.state.resizeObserver?.disconnect();

        this.state.intersectionObserver?.disconnect();

        this.state.mutationObserver?.disconnect();

    }

};

/* ==========================================================================
                    REGISTER PERFORMANCE SYSTEM
============================================================================= */

Portfolio.Modules.register(

    "Performance",

    Portfolio.Performance

);


/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 12
                             LOADING SYSTEM
=============================================================================

Responsibilities
----------------
✔ Initial Website Loader
✔ Asset Tracking
✔ Font Ready Detection
✔ Image Ready Detection
✔ Loader Progress
✔ Loader Exit Animation
✔ Future Page Preloading

============================================================================= */

/* ==========================================================================
                            LOADING SYSTEM
============================================================================= */

Portfolio.Loading = {

    /* ----------------------------------------------------------------------
       Runtime State
    ---------------------------------------------------------------------- */

    state: {

        initialized: false,

        completed: false,

        assetsLoaded: false,

        fontsLoaded: false,

        imagesLoaded: false,

        progress: 0

    },

    /* ----------------------------------------------------------------------
       DOM Elements
    ---------------------------------------------------------------------- */

    elements: {

        loader: null

    },

    /* ----------------------------------------------------------------------
       Initialization
    ---------------------------------------------------------------------- */

    async init() {

        this.cacheDOM();

        this.show();

        await this.waitForFonts();

        await this.waitForImages();

        this.complete();

        this.state.initialized = true;

        Portfolio.Logger.success(

            "Loading System initialized."

        );

    },

    /* ----------------------------------------------------------------------
       Cache DOM
    ---------------------------------------------------------------------- */

    cacheDOM() {

        this.elements.loader =

            Portfolio.Cache.loader;

    },

    /* ----------------------------------------------------------------------
       Show Loader
    ---------------------------------------------------------------------- */

    show() {

        if (!this.elements.loader) return;

        Portfolio.Classes.add(

            this.elements.loader,

            "is-active"

        );

    },

    /* ----------------------------------------------------------------------
       Hide Loader
    ---------------------------------------------------------------------- */

    hide() {

        if (!this.elements.loader) return;

        Portfolio.Classes.remove(

            this.elements.loader,

            "is-active"

        );

    },

    /* ----------------------------------------------------------------------
       Wait For Fonts
    ---------------------------------------------------------------------- */

    async waitForFonts() {

        if (!document.fonts) {

            this.state.fontsLoaded = true;

            return;

        }

        await document.fonts.ready;

        this.state.fontsLoaded = true;

    },

    /* ----------------------------------------------------------------------
       Wait For Images
    ---------------------------------------------------------------------- */

    async waitForImages() {

        const images =

            [...document.images];

        if (!images.length) {

            this.state.imagesLoaded = true;

            return;

        }

        await Promise.all(

            images.map(image => {

                if (image.complete) {

                    return Promise.resolve();

                }

                return new Promise(resolve => {

                    image.onload = resolve;

                    image.onerror = resolve;

                });

            })

        );

        this.state.imagesLoaded = true;

    },

    /* ----------------------------------------------------------------------
       Complete Loading
    ---------------------------------------------------------------------- */

    complete() {

        this.state.completed = true;

        this.state.assetsLoaded = true;

        this.progress = 100;

        this.hide();

    },

    /* ----------------------------------------------------------------------
       Progress
    ---------------------------------------------------------------------- */

    setProgress(value) {

        this.state.progress =

            Portfolio.Utils.clamp(

                value,

                0,

                100

            );

    },

    /* ----------------------------------------------------------------------
       Refresh
    ---------------------------------------------------------------------- */

    refresh() {

        return true;

    },

    /* ----------------------------------------------------------------------
       Destroy
    ---------------------------------------------------------------------- */

    destroy() {

        this.hide();

    }

};

/* ==========================================================================
                    REGISTER LOADING SYSTEM
============================================================================= */

Portfolio.Modules.register(

    "Loading",

    Portfolio.Loading

);

/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 13
                         APPLICATION FLOW SYSTEM
=============================================================================

Responsibilities
----------------
✔ Startup Flow
✔ Loader Completion
✔ Motion Initialization
✔ Navigation Unlock
✔ Hero Launch Trigger
✔ Application Ready State
✔ Future Page Transition Hooks

============================================================================= */

/* ==========================================================================
                            APPLICATION FLOW
============================================================================= */

Portfolio.Flow = {

    state: {

        initialized: false,

        ready: false

    },

    init() {

        this.state.initialized = true;

        Portfolio.Logger.success(

            "Application Flow initialized."

        );

    },

    async start() {

        Portfolio.Logger.info(

            "Starting application..."

        );

        /* Wait until loading finishes */

        while (

            !Portfolio.Loading.state.completed

        ) {

            await Portfolio.Utils.wait(50);

        }

        /* Remove Loader */

        Portfolio.Loading.hide();

        /* Refresh Motion */

        if (

            Portfolio.MotionSystem.state.initialized

        ) {

            Portfolio.MotionSystem.refresh();

        }

        /* Refresh Scroll */

        Portfolio.ScrollManager.refresh();

        /* Refresh Header */

        Portfolio.Header.refresh();

        /* Refresh Navigation */

        Portfolio.Navigation.refresh();

        /* Refresh Back To Top */

        Portfolio.BackToTop.refresh();

        /* Application Ready */

        Portfolio.State.pageReady = true;

        this.state.ready = true;

        Portfolio.Logger.success(

            "Application ready."

        );

    },

    destroy() {

        this.state.ready = false;

    }

};

/* ==========================================================================
                    REGISTER APPLICATION FLOW
============================================================================= */

Portfolio.Modules.register(

    "Flow",

    Portfolio.Flow

);


/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 14
                      GLOBAL COMPONENT BEHAVIORS
=============================================================================

Responsibilities
----------------
✔ Button Behaviors
✔ Card Behaviors
✔ Magnetic Effect
✔ Ripple Effect
✔ Hover Interactions
✔ External Link Handling
✔ Global Component Initialization

============================================================================= */

/* ==========================================================================
                            COMPONENT BEHAVIORS
============================================================================= */

Portfolio.Components = {

    /* ----------------------------------------------------------------------
       DOM Elements
    ---------------------------------------------------------------------- */

    elements: {

        buttons: [],

        cards: [],

        externalLinks: []

    },

    /* ----------------------------------------------------------------------
       Initialization
    ---------------------------------------------------------------------- */

    init() {

        this.cacheDOM();

        this.initializeButtons();

        this.initializeCards();

        this.initializeExternalLinks();

        Portfolio.Logger.success(

            "Component Behaviors initialized."

        );

    },

    /* ----------------------------------------------------------------------
       Cache DOM
    ---------------------------------------------------------------------- */

    cacheDOM() {

        this.elements.buttons =

            Portfolio.Utils.$$(".button");

        this.elements.cards =

            Portfolio.Utils.$$(".card");

        this.elements.externalLinks =

            Portfolio.Utils.$$(
                "a[target='_blank']"
            );

    },

    /* ----------------------------------------------------------------------
       Buttons
    ---------------------------------------------------------------------- */

    initializeButtons() {

        this.elements.buttons.forEach(button => {

            Portfolio.EventManager.add(

                button,

                "mouseenter",

                () => {

                    Portfolio.Classes.add(

                        button,

                        "is-hovered"

                    );

                }

            );

            Portfolio.EventManager.add(

                button,

                "mouseleave",

                () => {

                    Portfolio.Classes.remove(

                        button,

                        "is-hovered"

                    );

                }

            );

            Portfolio.EventManager.add(

                button,

                "focus",

                () => {

                    Portfolio.Classes.add(

                        button,

                        "is-focused"

                    );

                }

            );

            Portfolio.EventManager.add(

                button,

                "blur",

                () => {

                    Portfolio.Classes.remove(

                        button,

                        "is-focused"

                    );

                }

            );

        });

    },

    /* ----------------------------------------------------------------------
       Cards
    ---------------------------------------------------------------------- */

    initializeCards() {

        this.elements.cards.forEach(card => {

            Portfolio.EventManager.add(

                card,

                "mouseenter",

                () => {

                    Portfolio.Classes.add(

                        card,

                        "is-active"

                    );

                }

            );

            Portfolio.EventManager.add(

                card,

                "mouseleave",

                () => {

                    Portfolio.Classes.remove(

                        card,

                        "is-active"

                    );

                }

            );

        });

    },

    /* ----------------------------------------------------------------------
       External Links
    ---------------------------------------------------------------------- */

    initializeExternalLinks() {

        this.elements.externalLinks.forEach(link => {

            Portfolio.Attributes.set(

                link,

                "rel",

                "noopener noreferrer"

            );

        });

    },

    /* ----------------------------------------------------------------------
       Magnetic Effect
       (Placeholder for Home.js)
    ---------------------------------------------------------------------- */

    magnetic(element) {

        if (!element) return;

        Portfolio.Classes.add(

            element,

            "is-magnetic"

        );

    },

    /* ----------------------------------------------------------------------
       Ripple Effect
       (Placeholder for Home.js)
    ---------------------------------------------------------------------- */

    ripple(element) {

        if (!element) return;

    },

    /* ----------------------------------------------------------------------
       Refresh
    ---------------------------------------------------------------------- */

    refresh() {

        this.cacheDOM();

    },

    /* ----------------------------------------------------------------------
       Destroy
    ---------------------------------------------------------------------- */

    destroy() {

        this.elements.buttons = [];

        this.elements.cards = [];

        this.elements.externalLinks = [];

    }

};

/* ==========================================================================
                    REGISTER COMPONENT BEHAVIORS
============================================================================= */

Portfolio.Modules.register(

    "Components",

    Portfolio.Components

);

/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 15
                        CORE APPLICATION MANAGER
=============================================================================

Responsibilities
----------------
✔ Application Bootstrap
✔ Module Initialization
✔ Dependency Verification
✔ Startup Pipeline
✔ Shutdown Pipeline
✔ Debug Summary
✔ Future Scalability

============================================================================= */

/* ==========================================================================
                            APPLICATION MANAGER
============================================================================= */

Portfolio.Application = {

    /* ----------------------------------------------------------------------
       Runtime State
    ---------------------------------------------------------------------- */

    state: {

        initialized: false,

        started: false,

        modulesLoaded: 0,

        startupTime: 0

    },

    /* ----------------------------------------------------------------------
       Required Modules
    ---------------------------------------------------------------------- */

    requiredModules: [

        "Header",

        "Navigation",

        "ScrollManager",

        "UI",

        "BackToTop",

        "MasterLoop",

        "MotionSystem",

        "Experience",

        "Performance",

        "Loading",

        "Flow",

        "Components"

    ],

    /* ----------------------------------------------------------------------
       Verify Required Modules
    ---------------------------------------------------------------------- */

    verifyModules() {

        const missingModules = [];

        this.requiredModules.forEach(module => {

            if (!Portfolio.Modules[module]) {

                missingModules.push(module);

            }

        });

        if (missingModules.length) {

            Portfolio.Logger.error(

                "Missing Modules:",

                missingModules.join(", ")

            );

            return false;

        }

        return true;

    },

    /* ----------------------------------------------------------------------
       Verify DOM
    ---------------------------------------------------------------------- */

    verifyDOM() {

        if (!Portfolio.Cache.body) {

            Portfolio.Logger.error(

                "Body element not found."

            );

            return false;

        }

        if (!Portfolio.Cache.main) {

            Portfolio.Logger.warning(

                "Main element not found."

            );

        }

        return true;

    },

    /* ----------------------------------------------------------------------
       Initialize Modules
    ---------------------------------------------------------------------- */

    initializeModules() {

        Portfolio.Lifecycle.init();

        this.state.modulesLoaded =

            this.requiredModules.length;

    },

    /* ----------------------------------------------------------------------
       Start Application
    ---------------------------------------------------------------------- */

    async start() {

        const startTime = performance.now();

        Portfolio.Logger.info(

            "Starting Portfolio..."

        );

        if (!this.verifyModules()) {

            return;

        }

        if (!this.verifyDOM()) {

            return;

        }

        this.initializeModules();

        await Portfolio.Flow.start();

        this.state.started = true;

        this.state.initialized = true;

        this.state.startupTime =

            Math.round(

                performance.now() - startTime

            );

        this.summary();

    },

    /* ----------------------------------------------------------------------
       Development Summary
    ---------------------------------------------------------------------- */

    summary() {

        if (!Portfolio.Info.debug) return;

        console.group(

            "Portfolio Application"

        );

        console.log(

            "Version:",

            Portfolio.Info.version

        );

        console.log(

            "Environment:",

            Portfolio.Info.environment

        );

        console.log(

            "Modules:",

            this.state.modulesLoaded

        );

        console.log(

            "Startup Time:",

            `${this.state.startupTime} ms`

        );

        console.groupEnd();

    },

    /* ----------------------------------------------------------------------
       Restart
    ---------------------------------------------------------------------- */

    async restart() {

        this.shutdown();

        await this.start();

    },

    /* ----------------------------------------------------------------------
       Shutdown
    ---------------------------------------------------------------------- */

    shutdown() {

        Portfolio.Logger.info(

            "Shutting down Portfolio..."

        );

        Portfolio.Lifecycle.destroy();

        Portfolio.EventManager.removeAll();

        this.state.started = false;

    }

};

/* ==========================================================================
                        UPDATE APPLICATION START
=============================================================================

Replace your current DOMContentLoaded listener with this:

document.addEventListener("DOMContentLoaded", async () => {

    Portfolio.init();

    await Portfolio.Application.start();

});

============================================================================= */


/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 16
                 PRODUCTION HARDENING & OPTIMIZATION
=============================================================================

Responsibilities
----------------
✔ Configuration Locking
✔ Runtime Validation
✔ Browser Validation
✔ Performance Summary
✔ Module Validation
✔ Production Readiness
✔ Final Optimization

============================================================================= */

/* ==========================================================================
                        PRODUCTION HARDENING
============================================================================= */

Portfolio.Production = {

    /* ----------------------------------------------------------------------
       Runtime State
    ---------------------------------------------------------------------- */

    state: {

        validated: false,

        optimized: false

    },

    /* ----------------------------------------------------------------------
       Initialization
    ---------------------------------------------------------------------- */

    init() {

        this.freezeConfiguration();

        this.validateEnvironment();

        this.validateModules();

        this.validateBrowser();

        this.optimize();

        this.state.validated = true;

        Portfolio.Logger.success(

            "Production validation completed."

        );

    },

    /* ----------------------------------------------------------------------
       Freeze Configuration
    ---------------------------------------------------------------------- */

    freezeConfiguration() {

        Object.freeze(Portfolio.Info);

        Object.freeze(Portfolio.Config);

        Object.freeze(Portfolio.Breakpoints);

        Object.freeze(Portfolio.Motion);

    },

    /* ----------------------------------------------------------------------
       Environment Validation
    ---------------------------------------------------------------------- */

    validateEnvironment() {

        if (!window.Promise) {

            Portfolio.Logger.error(

                "Promise API is not supported."

            );

        }

        if (!window.requestAnimationFrame) {

            Portfolio.Logger.warning(

                "requestAnimationFrame is unavailable."

            );

        }

    },

    /* ----------------------------------------------------------------------
       Browser Validation
    ---------------------------------------------------------------------- */

    validateBrowser() {

        const requiredFeatures = {

            querySelector: "querySelector",

            localStorage: "localStorage",

            matchMedia: "matchMedia",

            requestAnimationFrame: "requestAnimationFrame"

        };

        Object.entries(requiredFeatures).forEach(

            ([name, feature]) => {

                if (!(feature in window || feature in document)) {

                    Portfolio.Logger.warning(

                        `${name} is not supported.`

                    );

                }

            }

        );

    },

    /* ----------------------------------------------------------------------
       Module Validation
    ---------------------------------------------------------------------- */

    validateModules() {

        Object.keys(Portfolio.Modules).forEach(

            module => {

                const instance = Portfolio.Modules[module];

                if (

                    typeof instance.init !== "function"

                ) {

                    Portfolio.Logger.warning(

                        `${module} has no init() method.`

                    );

                }

            }

        );

    },

    /* ----------------------------------------------------------------------
       Performance Optimization
    ---------------------------------------------------------------------- */

    optimize() {

        this.state.optimized = true;

    },

    /* ----------------------------------------------------------------------
       Development Summary
    ---------------------------------------------------------------------- */

    report() {

        if (!Portfolio.Info.debug) return;

        console.groupCollapsed(

            "%cPortfolio Production Report",

            "color:#7c5cff;font-weight:bold;"

        );

        console.table({

            Version: Portfolio.Info.version,

            Environment: Portfolio.Info.environment,

            Modules: Object.keys(Portfolio.Modules).length,

            Motion: Portfolio.MotionSystem?.state?.initialized,

            Experience: Portfolio.Experience?.state?.initialized,

            Performance: Portfolio.Performance?.state?.initialized,

            Loading: Portfolio.Loading?.state?.initialized,

            Ready: Portfolio.Application?.state?.started

        });

        console.groupEnd();

    },

    /* ----------------------------------------------------------------------
       Destroy
    ---------------------------------------------------------------------- */

    destroy() {

        this.state.optimized = false;

    }

};

/* ==========================================================================
                        REGISTER PRODUCTION MODULE
============================================================================= */

Portfolio.Modules.register(

    "Production",

    Portfolio.Production

);

/* ==========================================================================
                            FINAL APPLICATION START
============================================================================= */

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        Portfolio.init();

        await Portfolio.Application.start();

        Portfolio.Production.init();

        Portfolio.Production.report();

    }

);


/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 17
                          ERROR & DEBUG SYSTEM
=============================================================================

Responsibilities
----------------
✔ Global Error Handling
✔ Promise Rejection Handling
✔ Debug Logging
✔ Runtime Warnings
✔ Module Error Reporting
✔ Future Crash Reporting

============================================================================= */

/* ==========================================================================
                            ERROR & DEBUG SYSTEM
============================================================================= */

Portfolio.Debug = {

    /* ----------------------------------------------------------------------
       Runtime State
    ---------------------------------------------------------------------- */

    state: {

        initialized: false,

        errors: [],

        warnings: []

    },

    /* ----------------------------------------------------------------------
       Initialization
    ---------------------------------------------------------------------- */

    init() {

        this.registerGlobalHandlers();

        this.state.initialized = true;

        Portfolio.Logger.success(

            "Debug System initialized."

        );

    },

    /* ----------------------------------------------------------------------
       Global Handlers
    ---------------------------------------------------------------------- */

    registerGlobalHandlers() {

        window.addEventListener(

            "error",

            this.handleError.bind(this)

        );

        window.addEventListener(

            "unhandledrejection",

            this.handlePromise.bind(this)

        );

    },

    /* ----------------------------------------------------------------------
       Error Handler
    ---------------------------------------------------------------------- */

    handleError(event) {

        const error = {

            message: event.message,

            file: event.filename,

            line: event.lineno,

            column: event.colno,

            time: new Date().toISOString()

        };

        this.state.errors.push(error);

        Portfolio.Logger.error(

            "Runtime Error:",

            error

        );

    },

    /* ----------------------------------------------------------------------
       Promise Handler
    ---------------------------------------------------------------------- */

    handlePromise(event) {

        this.state.errors.push({

            message: event.reason,

            type: "Promise",

            time: new Date().toISOString()

        });

        Portfolio.Logger.error(

            "Unhandled Promise:",

            event.reason

        );

    },

    /* ----------------------------------------------------------------------
       Warning
    ---------------------------------------------------------------------- */

    warn(message) {

        this.state.warnings.push({

            message,

            time: new Date().toISOString()

        });

        Portfolio.Logger.warning(message);

    },

    /* ----------------------------------------------------------------------
       Module Error
    ---------------------------------------------------------------------- */

    module(moduleName, error) {

        Portfolio.Logger.error(

            `[${moduleName}]`,

            error

        );

    },

    /* ----------------------------------------------------------------------
       Development Report
    ---------------------------------------------------------------------- */

    report() {

        if (!Portfolio.Info.debug) return;

        console.groupCollapsed(

            "%cDebug Report",

            "color:#ff9800;font-weight:bold;"

        );

        console.table({

            Errors: this.state.errors.length,

            Warnings: this.state.warnings.length

        });

        console.groupEnd();

    },

    /* ----------------------------------------------------------------------
       Destroy
    ---------------------------------------------------------------------- */

    destroy() {

        this.state.errors = [];

        this.state.warnings = [];

    }

};

/* ==========================================================================
                        REGISTER DEBUG SYSTEM
============================================================================= */

Portfolio.Modules.register(

    "Debug",

    Portfolio.Debug

);


/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 18
                           DEVELOPER TOOLKIT
=============================================================================

Responsibilities
----------------
✔ DOM Inspector
✔ Module Inspector
✔ Performance Snapshot
✔ Grid Overlay
✔ State Export
✔ Console Utilities
✔ Development Helpers

============================================================================= */

/* ==========================================================================
                            DEVELOPER TOOLKIT
============================================================================= */

Portfolio.Dev = {

    /* ----------------------------------------------------------------------
       Runtime State
    ---------------------------------------------------------------------- */

    state: {

        gridVisible: false

    },

    /* ----------------------------------------------------------------------
       Initialization
    ---------------------------------------------------------------------- */

    init() {

        if (!Portfolio.Info.debug) return;

        Portfolio.Logger.success(

            "Developer Toolkit initialized."

        );

    },

    /* ----------------------------------------------------------------------
       Inspect Element
    ---------------------------------------------------------------------- */

    inspect(selector) {

        const element =

            Portfolio.Utils.$(selector);

        if (!element) {

            Portfolio.Logger.warning(

                `Element not found: ${selector}`

            );

            return;

        }

        console.dir(element);

        return element;

    },

    /* ----------------------------------------------------------------------
       Show Current State
    ---------------------------------------------------------------------- */

    stateReport() {

        console.group(

            "Portfolio State"

        );

        console.table(

            Portfolio.State

        );

        console.groupEnd();

    },

    /* ----------------------------------------------------------------------
       Show Registered Modules
    ---------------------------------------------------------------------- */

    modules() {

        console.group(

            "Registered Modules"

        );

        console.table(

            Object.keys(

                Portfolio.Modules

            )

        );

        console.groupEnd();

    },

    /* ----------------------------------------------------------------------
       Performance Snapshot
    ---------------------------------------------------------------------- */

    performance() {

        console.group(

            "Performance"

        );

        console.table({

            Width:

                window.innerWidth,

            Height:

                window.innerHeight,

            Scroll:

                window.scrollY,

            Memory:

                performance.memory
                    ? performance.memory.usedJSHeapSize
                    : "Unavailable"

        });

        console.groupEnd();

    },

    /* ----------------------------------------------------------------------
       Toggle Development Grid
    ---------------------------------------------------------------------- */

    grid(show = true) {

        const body =

            Portfolio.Cache.body;

        if (!body) return;

        if (show) {

            Portfolio.Classes.add(

                body,

                "dev-grid"

            );

        }

        else {

            Portfolio.Classes.remove(

                body,

                "dev-grid"

            );

        }

        this.state.gridVisible = show;

    },

    /* ----------------------------------------------------------------------
       Export Current State
    ---------------------------------------------------------------------- */

    export() {

        return {

            info: Portfolio.Info,

            state: Portfolio.State,

            modules:

                Object.keys(

                    Portfolio.Modules

                )

        };

    },

    /* ----------------------------------------------------------------------
       Clear Console
    ---------------------------------------------------------------------- */

    clear() {

        console.clear();

    },

    /* ----------------------------------------------------------------------
       Show Application Summary
    ---------------------------------------------------------------------- */

    summary() {

        console.groupCollapsed(

            "%cPortfolio Developer Summary",

            "color:#6C63FF;font-weight:bold;"

        );

        console.log(

            "Version:",

            Portfolio.Info.version

        );

        console.log(

            "Environment:",

            Portfolio.Info.environment

        );

        console.log(

            "Breakpoint:",

            Portfolio.State.currentBreakpoint

        );

        console.log(

            "Modules:",

            Object.keys(

                Portfolio.Modules

            ).length

        );

        console.groupEnd();

    },

    /* ----------------------------------------------------------------------
       Destroy
    ---------------------------------------------------------------------- */

    destroy() {

        this.grid(false);

    }

};

/* ==========================================================================
                    REGISTER DEVELOPER TOOLKIT
============================================================================= */

Portfolio.Modules.register(

    "Dev",

    Portfolio.Dev

);


/* ==========================================================================
                            GLOBAL JAVASCRIPT
                              PHASE 19
                         SYSTEM INTEGRATION
=============================================================================

Responsibilities
----------------
✔ Verify Global Dependencies
✔ Verify External Libraries
✔ Validate Cached Elements
✔ Validate Registered Modules
✔ Start Integrated Systems
✔ Final Runtime Summary

============================================================================= */

/* ==========================================================================
                            SYSTEM INTEGRATION
============================================================================= */

Portfolio.System = {

    /* ----------------------------------------------------------------------
       Runtime State
    ---------------------------------------------------------------------- */

    state: {

        initialized: false,

        verified: false,

        librariesReady: false,

        domReady: false

    },

    /* ----------------------------------------------------------------------
       Initialization
    ---------------------------------------------------------------------- */

    init() {

        this.verifyLibraries();

        this.verifyDOM();

        this.verifyModules();

        this.verifyState();

        this.state.initialized = true;

        Portfolio.Logger.success(

            "System Integration completed."

        );

    },

    /* ----------------------------------------------------------------------
       Verify External Libraries
    ---------------------------------------------------------------------- */

    verifyLibraries() {

        const libraries = {

            GSAP:

                typeof window.gsap !== "undefined",

            ScrollTrigger:

                typeof window.ScrollTrigger !== "undefined",

            Lenis:

                typeof window.Lenis !== "undefined",

            SplitType:

                typeof window.SplitType !== "undefined"

        };

        console.groupCollapsed(

            "Library Status"

        );

        console.table(libraries);

        console.groupEnd();

        this.state.librariesReady = true;

    },

    /* ----------------------------------------------------------------------
       Verify DOM Cache
    ---------------------------------------------------------------------- */

    verifyDOM() {

        console.groupCollapsed(

            "DOM Cache"

        );

        console.table({

            html:

                !!Portfolio.Cache.html,

            body:

                !!Portfolio.Cache.body,

            header:

                !!Portfolio.Cache.header,

            main:

                !!Portfolio.Cache.main,

            footer:

                !!Portfolio.Cache.footer,

            loader:

                !!Portfolio.Cache.loader,

            backToTop:

                !!Portfolio.Cache.backToTop

        });

        console.groupEnd();

        this.state.domReady = true;

    },

    /* ----------------------------------------------------------------------
       Verify Registered Modules
    ---------------------------------------------------------------------- */

    verifyModules() {

        console.groupCollapsed(

            "Registered Modules"

        );

        console.table(

            Object.keys(

                Portfolio.Modules

            )

        );

        console.groupEnd();

    },

    /* ----------------------------------------------------------------------
       Verify Global Runtime
    ---------------------------------------------------------------------- */

    verifyState() {

        console.groupCollapsed(

            "Application State"

        );

        console.table(

            Portfolio.State

        );

        console.groupEnd();

        this.state.verified = true;

    },

    /* ----------------------------------------------------------------------
       Refresh All Systems
    ---------------------------------------------------------------------- */

    refresh() {

        Portfolio.Header?.refresh();

        Portfolio.Navigation?.refresh();

        Portfolio.BackToTop?.refresh();

        Portfolio.MotionSystem?.refresh();

        Portfolio.Performance?.refresh();

    },

    /* ----------------------------------------------------------------------
       Final Summary
    ---------------------------------------------------------------------- */

    summary() {

        console.groupCollapsed(

            "%cPortfolio Runtime",

            "color:#8A5CF6;font-weight:bold;"

        );

        console.log(

            "Modules:",

            Object.keys(

                Portfolio.Modules

            ).length

        );

        console.log(

            "Breakpoint:",

            Portfolio.State.currentBreakpoint

        );

        console.log(

            "Viewport:",

            `${window.innerWidth} × ${window.innerHeight}`

        );

        console.log(

            "Scroll:",

            Portfolio.State.scrollY

        );

        console.groupEnd();

    },

    /* ----------------------------------------------------------------------
       Destroy
    ---------------------------------------------------------------------- */

    destroy() {

        this.state.initialized = false;

    }

};

/* ==========================================================================
                        REGISTER SYSTEM
============================================================================= */

Portfolio.Modules.register(

    "System",

    Portfolio.System

);


