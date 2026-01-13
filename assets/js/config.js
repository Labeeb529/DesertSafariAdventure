/**
 * Site Configuration
 * Central config for WhatsApp and contact information
 */
const SITE_CONFIG = {
    whatsapp: {
        number: '971553546168',
        displayNumber: '+971 55 354 6168',
        defaultMessage: 'Hello! I would like to inquire about your desert safari packages.'
    },
    packages: {
        vipRedDune: {
            name: 'VIP Red Dune Safari',
            price: '109 AED'
        },
        eveningDesert: {
            name: 'Evening Desert Safari',
            price: '89 AED'
        }
    }
};

/**
 * Generate WhatsApp link with pre-filled message
 */
function getWhatsAppLink(customMessage) {
    const message = customMessage || SITE_CONFIG.whatsapp.defaultMessage;
    return `https://wa.me/${SITE_CONFIG.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

/**
 * Initialize all WhatsApp links across the site
 */
function initWhatsAppLinks() {
    const whatsappLinks = document.querySelectorAll('.floating-whatsapp, .trip-sidebar-whatsapp, .footer-whatsapp, [data-whatsapp]');
    
    whatsappLinks.forEach(link => {
        if (link.classList.contains('floating-whatsapp')) {
            link.href = getWhatsAppLink();
        } else if (link.classList.contains('trip-sidebar-whatsapp')) {
            const sidebar = link.closest('.trip-sidebar-card');
            const priceEl = sidebar?.querySelector('.new-price');
            const price = priceEl ? priceEl.textContent.trim().split(' ')[0] : '';
            const pageTitle = document.querySelector('.trip-hero-title')?.textContent || 'desert safari';
            link.href = getWhatsAppLink(`Hi! I'm interested in the ${pageTitle}. Can you provide more details?`);
            link.textContent = `WhatsApp ${SITE_CONFIG.whatsapp.displayNumber}`;
        } else if (link.classList.contains('footer-whatsapp')) {
            link.href = getWhatsAppLink();
            link.textContent = SITE_CONFIG.whatsapp.displayNumber;
        }
    });

    const sidebarButtons = document.querySelectorAll('.trip-sidebar-button');
    sidebarButtons.forEach(btn => {
        const sidebar = btn.closest('.trip-sidebar-card');
        const priceEl = sidebar?.querySelector('.new-price');
        const price = priceEl ? priceEl.textContent.trim().split(' ')[0] : '';
        const pageTitle = document.querySelector('.trip-hero-title')?.textContent || 'Desert Safari';
        btn.href = getWhatsAppLink(`Hi! I'd like to book the ${pageTitle} (${price}). Please share available dates.`);
    });

    const dropTextBtns = document.querySelectorAll('.drop-text-btn');
    dropTextBtns.forEach(btn => {
        btn.dataset.number = SITE_CONFIG.whatsapp.displayNumber;
        const badge = btn.closest('.drop-text-wrap')?.querySelector('.copy-badge');
        if (badge) badge.textContent = SITE_CONFIG.whatsapp.displayNumber;
    });
}

/**
 * Generate booking message for WhatsApp
 */
function generateBookingMessage(formData) {
    const lines = [
        '*New Booking Request*',
        '',
        `*Name:* ${formData.name}`,
        `*Email:* ${formData.email}`,
        `*Phone:* ${formData.phone}`,
        `*Package:* ${formData.package}`,
        `*Date:* ${formData.date}`,
        `*Guests:* ${formData.guests}`
    ];
    
    if (formData.message) {
        lines.push('', `*Special Requests:*`, formData.message);
    }
    
    return lines.join('\n');
}

/**
 * Handle booking form submission via WhatsApp
 */
function submitBookingViaWhatsApp(formData) {
    const message = generateBookingMessage(formData);
    const whatsappUrl = getWhatsAppLink(message);
    window.open(whatsappUrl, '_blank');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SITE_CONFIG, getWhatsAppLink, generateBookingMessage, submitBookingViaWhatsApp };
}

