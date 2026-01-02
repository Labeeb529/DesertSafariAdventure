/**
 * Site Configuration
 * Central config for WhatsApp and contact information
 */
const SITE_CONFIG = {
    whatsapp: {
        number: '923556668428',
        displayNumber: '+92 355 6668428',
        defaultMessage: 'Hello! I would like to inquire about your desert safari packages.'
    },
    packages: {
        vipRedDune: {
            name: 'VIP Red Dune Safari',
            price: '150 AED'
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
    const whatsappLinks = document.querySelectorAll('.floating-whatsapp, .trip-sidebar-whatsapp, [data-whatsapp]');
    
    whatsappLinks.forEach(link => {
        if (link.classList.contains('floating-whatsapp')) {
            link.href = getWhatsAppLink();
        } else if (link.classList.contains('trip-sidebar-whatsapp')) {
            const packageName = link.closest('.trip-sidebar')?.dataset.package || 'desert safari';
            link.href = getWhatsAppLink(`Hi! I'm interested in booking the ${packageName}. Can you provide more details?`);
            link.textContent = `WhatsApp ${SITE_CONFIG.whatsapp.displayNumber}`;
        }
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

