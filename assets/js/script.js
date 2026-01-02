/**
 * Desert Safari Adventure
 * Main JavaScript file
 */

(function() {
    'use strict';

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const mainNav = document.getElementById('mainNav');
    const bookingForm = document.getElementById('bookingForm');
    const navContainer = mainNav?.querySelector('.nav-container');
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    let isScrolled = false;

    /**
     * Navigation scroll effect with slide-to-right animation
     */
    function handleNavScroll() {
        const scrollY = window.scrollY;
        const wasScrolled = isScrolled;
        
        if (scrollY > 80) {
            if (!isScrolled) {
                mainNav.classList.add('scrolled');
                if (navContainer) navContainer.classList.add('nav-centered');
                isScrolled = true;
            }
        } else {
            if (isScrolled) {
                mainNav.classList.remove('scrolled');
                if (navContainer) navContainer.classList.remove('nav-centered');
                isScrolled = false;
            }
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }

    function requestNavUpdate() {
        if (!ticking) {
            requestAnimationFrame(handleNavScroll);
            ticking = true;
        }
    }

    /**
     * Mobile menu toggle
     */
    function toggleMobileMenu() {
        const isActive = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    function closeMobileMenu() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    /**
     * Smooth scrolling for anchor links
     */
    function handleSmoothScroll(e) {
        const href = this.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                closeMobileMenu();
                const navHeight = mainNav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    /**
     * Form submission handler - WhatsApp integration
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        if (!data.name || !data.email || !data.phone || !data.package || !data.date || !data.guests) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        if (typeof SITE_CONFIG !== 'undefined' && typeof submitBookingViaWhatsApp === 'function') {
            submitBookingViaWhatsApp(data);
            showNotification('Redirecting to WhatsApp...', 'success');
        } else {
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you! Your booking request has been received. We\'ll contact you within 24 hours.', 'success');
                e.target.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    }

    /**
     * Show notification toast
     */
    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) existingNotification.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <p>${message}</p>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            max-width: 400px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#1C1917' : '#B85C38'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(100%); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideOut {
                    from { opacity: 1; transform: translateX(0); }
                    to { opacity: 0; transform: translateX(100%); }
                }
                .notification p { margin: 0; font-size: 0.9375rem; line-height: 1.5; }
                .notification-close {
                    background: none; border: none; color: white;
                    font-size: 1.5rem; cursor: pointer; opacity: 0.7;
                    transition: opacity 0.2s; padding: 0; line-height: 1;
                }
                .notification-close:hover { opacity: 1; }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    /**
     * Intersection Observer for scroll animations
     */
    function initScrollAnimations() {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.05 };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animateElements = document.querySelectorAll(
            '.package-card, .testimonial-card, .gallery-item, .stat-card'
        );

        animateElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });

        if (!document.querySelector('#animate-styles')) {
            const style = document.createElement('style');
            style.id = 'animate-styles';
            style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
            document.head.appendChild(style);
        }
    }

    /**
     * About cards timed highlight animation
     */
    function initAboutCardsAnimation() {
        const aboutCards = document.querySelectorAll('.about-card');
        if (!aboutCards.length) return;
        
        let currentIndex = 0;
        const intervalTime = 3000;
        
        function highlightCard() {
            aboutCards.forEach(card => card.classList.remove('card-highlight'));
            aboutCards[currentIndex].classList.add('card-highlight');
            currentIndex = (currentIndex + 1) % aboutCards.length;
        }
        
        aboutCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.4s ease, box-shadow 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
        
        setTimeout(() => {
            highlightCard();
            setInterval(highlightCard, intervalTime);
        }, 1500);
    }

    /**
     * Floating video button
     */
    function initVideoButton() {
        const floatBtn = document.getElementById('floatingVideo');
        const modal = document.getElementById('videoModal');
        const preview = document.getElementById('previewVideo');

        if (!floatBtn || !modal || !preview) return;

        function setFloatPosition(x, y) {
            document.documentElement.style.setProperty('--float-x', x);
            document.documentElement.style.setProperty('--float-y', y);
        }

        function setMode(mode) {
            if (mode === 'expand') {
                floatBtn.classList.add('expand');
                floatBtn.classList.remove('compact');
            } else {
                floatBtn.classList.add('compact');
                floatBtn.classList.remove('expand');
            }
        }

        function openModal() {
            modal.setAttribute('aria-hidden', 'false');
            try { preview.currentTime = 0; preview.play(); } catch (e) {}
            const close = modal.querySelector('.modal-close');
            if (close) close.focus();
        }

        function closeModal() {
            modal.setAttribute('aria-hidden', 'true');
            try { preview.pause(); preview.currentTime = 0; } catch (e) {}
            floatBtn.focus();
        }

        floatBtn.addEventListener('click', openModal);
        floatBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                openModal();
            }
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
                closeModal();
            }
        });

        const floatConfig = [
            { id: 'home', x: '30%', y: '85%', mode: 'expand', img: 'assets/images/video-thumb.jpg' },
            { id: 'about', x: '5%', y: '25%', mode: 'corner' },
            { id: 'packages', x: '95%', y: '80%', mode: 'corner' },
            { id: 'gallery', x: '95%', y: '18%', mode: 'corner' },
            { id: 'booking', x: '12%', y: '88%', mode: 'corner' }
        ];

        const sectionConfigMap = new Map();
        floatConfig.forEach(cfg => {
            const el = document.getElementById(cfg.id);
            if (el) sectionConfigMap.set(el, cfg);
        });

        const fallbackSections = Array.from(document.querySelectorAll('[data-float-x]'));
        fallbackSections.forEach(el => {
            if (!sectionConfigMap.has(el)) {
                sectionConfigMap.set(el, {
                    id: el.id || null,
                    x: el.dataset.floatX || '88%',
                    y: el.dataset.floatY || '88%',
                    mode: el.dataset.floatMode || 'corner'
                });
            }
        });

        const observedSections = Array.from(sectionConfigMap.keys());
        if (!observedSections.length) return;

        let activeSection = null;
        const obsOptions = { root: null, rootMargin: '0px', threshold: [0.25, 0.45, 0.6] };
        const observer = new IntersectionObserver((entries) => {
            const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
            if (visible.length) {
                const top = visible[0].target;
                if (top !== activeSection) {
                    activeSection = top;
                    const cfg = sectionConfigMap.get(top) || {};
                    setFloatPosition(cfg.x || '88%', cfg.y || '88%');
                    setMode(cfg.mode || 'corner');
                    updateVisualForConfig(cfg);
                }
            }
        }, obsOptions);

        observedSections.forEach(s => observer.observe(s));

        const homeCfg = floatConfig.find(c => c.id === 'home');
        if (homeCfg) {
            setFloatPosition(homeCfg.x, homeCfg.y);
            setMode(homeCfg.mode || 'expand');
            updateVisualForConfig(homeCfg);
        }

        function updateVisualForConfig(cfg) {
            if (!cfg) return;
            const imgSrc = cfg.img;
            let imgEl = floatBtn.querySelector('.fv-preview');
            if (cfg.mode === 'expand' && imgSrc) {
                if (!imgEl) {
                    imgEl = document.createElement('img');
                    imgEl.className = 'fv-preview';
                    imgEl.alt = 'Preview';
                    const icon = floatBtn.querySelector('.fv-icon');
                    if (icon) floatBtn.insertBefore(imgEl, icon);
                    else floatBtn.appendChild(imgEl);
                }
                if (imgEl.src !== imgSrc) imgEl.src = imgSrc;
            } else {
                if (imgEl) imgEl.remove();
            }
        }
    }

    /**
     * Initialize Drop-a-text copy interactions
     */
    function initDropText() {
        const wraps = document.querySelectorAll('.drop-text-wrap');
        wraps.forEach(wrap => {
            const btn = wrap.querySelector('.drop-text-btn');
            const badge = wrap.querySelector('.copy-badge');
            const tip = wrap.querySelector('.copy-tooltip');
            if (!btn) return;
            const number = btn.dataset.number || badge?.textContent || '';

            let clearTimer;

            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(number);
                    } else {
                        const ta = document.createElement('textarea');
                        ta.value = number;
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        ta.remove();
                    }

                    badge.classList.add('copied');
                    tip.classList.add('copied');
                    tip.textContent = 'Copied!';

                    clearTimeout(clearTimer);
                    clearTimer = setTimeout(() => {
                        badge.classList.remove('copied');
                        tip.classList.remove('copied');
                        tip.textContent = 'click to copy';
                    }, 1400);
                } catch (err) {
                    showNotification('Unable to copy to clipboard.', 'error');
                }
            });

            btn.addEventListener('focus', () => wrap.classList.add('focus'));
            btn.addEventListener('blur', () => wrap.classList.remove('focus'));
        });
    }

    function handleOutsideClick(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    }

    function handleEscapeKey(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }

    function initDatePicker() {
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }

    /**
     * Initialize WhatsApp links from config
     */
    function initWhatsApp() {
        if (typeof initWhatsAppLinks === 'function') {
            initWhatsAppLinks();
        }
    }

    /**
     * Initialize all event listeners
     */
    function init() {
        window.addEventListener('scroll', requestNavUpdate, { passive: true });
        
        if (hamburger) {
            hamburger.addEventListener('click', toggleMobileMenu);
        }
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleSmoothScroll);
        });
        
        if (bookingForm) {
            bookingForm.addEventListener('submit', handleFormSubmit);
        }
        
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('keydown', handleEscapeKey);
        
        initScrollAnimations();
        initAboutCardsAnimation();
        initVideoButton();
        initDatePicker();
        initDropText();
        initWhatsApp();
        
        handleNavScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
