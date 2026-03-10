/**
 * Once Human Landing Page - Script
 * Handles: scroll reveals, number counters, sticky header, sticky CTA, parallax
 */

(function () {
    'use strict';

    // ========================
    // HEADER SCROLL EFFECT
    // ========================
    const header = document.getElementById('header');
    let lastScrollY = 0;

    function handleHeaderScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScrollY = scrollY;
    }

    // ========================
    // STICKY CTA BAR
    // ========================
    const stickyCta = document.getElementById('sticky-cta');
    const heroSection = document.getElementById('hero');

    function handleStickyCta() {
        if (!heroSection || !stickyCta) return;
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        if (heroBottom < 0) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    }

    // ========================
    // SCROLL REVEAL
    // ========================
    const revealElements = document.querySelectorAll('.reveal');

    function handleReveal() {
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.88;

        revealElements.forEach(function (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top < triggerPoint) {
                const delay = parseInt(el.getAttribute('data-delay')) || 0;
                if (delay > 0) {
                    setTimeout(function () {
                        el.classList.add('active');
                    }, delay);
                } else {
                    el.classList.add('active');
                }
            }
        });
    }

    // ========================
    // NUMBER COUNTER ANIMATION
    // ========================
    const counters = document.querySelectorAll('[data-target]');
    const countedSet = new Set();

    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K+';
        }
        return num.toLocaleString();
    }

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            el.textContent = formatNumber(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = formatNumber(target);
            }
        }

        requestAnimationFrame(update);
    }

    function handleCounters() {
        const windowHeight = window.innerHeight;

        counters.forEach(function (el) {
            if (countedSet.has(el)) return;
            const rect = el.getBoundingClientRect();
            if (rect.top < windowHeight * 0.9) {
                countedSet.add(el);
                animateCounter(el);
            }
        });
    }

    // ========================
    // PARALLAX EFFECT
    // ========================
    const parallaxElements = document.querySelectorAll('.parallax');

    function handleParallax() {
        parallaxElements.forEach(function (el) {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0.3;
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight && rect.bottom > 0) {
                const yPos = (rect.top - windowHeight) * speed;
                var img = el.querySelector('img');
                if (img) {
                    img.style.transform = 'translateY(' + yPos + 'px) scale(1.1)';
                }
            }
        });
    }

    // ========================
    // SMOOTH SCROLL FOR NAV LINKS
    // ========================
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            var targetEl = document.querySelector(targetId);
            if (targetEl) {
                var offset = 80;
                var top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ========================
    // THROTTLED SCROLL HANDLER
    // ========================
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function () {
                handleHeaderScroll();
                handleStickyCta();
                handleReveal();
                handleCounters();
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ========================
    // INITIAL CALLS
    // ========================
    handleHeaderScroll();
    handleStickyCta();
    handleReveal();
    handleCounters();

    // ========================
    // CTA CLICK TRACKING (optional analytics hook)
    // ========================
    document.querySelectorAll('a[href*="wendiro.com"]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Analytics event hook - can be connected to GA4, etc.
            if (typeof gtag === 'function') {
                gtag('event', 'cta_click', {
                    event_category: 'download',
                    event_label: 'once_human_windows'
                });
            }
        });
    });

})();
