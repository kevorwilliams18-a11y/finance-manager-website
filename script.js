// ============================================
// GRANT PREMIUM RENTAL - JAVASCRIPT
// ============================================

// Booking Modal Functions
function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'block';
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('pickupDate').min = today;
    document.getElementById('dropoffDate').min = today;
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Calculate rental price based on dates
function calculatePrice() {
    const pickupDate = new Date(document.getElementById('pickupDate').value);
    const dropoffDate = new Date(document.getElementById('dropoffDate').value);
    
    if (pickupDate && dropoffDate && dropoffDate >= pickupDate) {
        const days = Math.ceil((dropoffDate - pickupDate) / (1000 * 60 * 60 * 24)) + 1;
        let dailyRate = 7499; // JMD
        let totalPrice = days * dailyRate;
        
        // Apply weekly discount
        if (days >= 7) {
            const weeks = Math.floor(days / 7);
            const remainingDays = days % 7;
            totalPrice = (weeks * 41999) + (remainingDays * dailyRate);
        }
        
        // Apply monthly discount
        if (days >= 30) {
            const months = Math.floor(days / 30);
            const remainingDays = days % 30;
            totalPrice = (months * 149999) + (Math.ceil(remainingDays / 7) * 41999);
        }
        
        document.getElementById('totalPrice').value = 'J$' + totalPrice.toLocaleString();
    }
}

// Update price when dates change
document.addEventListener('DOMContentLoaded', function() {
    const pickupDateInput = document.getElementById('pickupDate');
    const dropoffDateInput = document.getElementById('dropoffDate');
    
    if (pickupDateInput && dropoffDateInput) {
        pickupDateInput.addEventListener('change', calculatePrice);
        dropoffDateInput.addEventListener('change', calculatePrice);
    }
    
    // Handle booking form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
});

// Handle booking form submission
function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        pickupDate: document.getElementById('pickupDate').value,
        dropoffDate: document.getElementById('dropoffDate').value,
        licenseNumber: document.getElementById('licenseNumber').value,
        totalPrice: document.getElementById('totalPrice').value
    };
    
    // Validate form data
    if (!validateBooking(formData)) {
        alert('Please fill in all required fields correctly.');
        return;
    }
    
    // Show success message
    const formattedData = `
        Booking Confirmation
        ====================
        Name: ${formData.firstName} ${formData.lastName}
        Email: ${formData.email}
        Phone: ${formData.phone}
        Pick-up Date: ${formData.pickupDate}
        Drop-off Date: ${formData.dropoffDate}
        Driver's License: ${formData.licenseNumber}
        Total Price: ${formData.totalPrice}
        
        Vehicle: Honda Fit 2024
        
        Thank you for booking with Grant Premium Rental!
        A confirmation email has been sent to ${formData.email}
    `;
    
    alert(formattedData);
    
    // Log the booking (in production, this would be sent to a server)
    console.log('Booking submitted:', formData);
    
    // Reset form and close modal
    document.getElementById('bookingForm').reset();
    closeBookingModal();
}

// Validate booking form
function validateBooking(data) {
    // Check if all fields are filled
    if (!data.firstName || !data.lastName || !data.email || !data.phone || 
        !data.pickupDate || !data.dropoffDate || !data.licenseNumber) {
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    // Validate phone format (basic check)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(data.phone) || data.phone.length < 10) {
        alert('Please enter a valid phone number.');
        return false;
    }
    
    // Validate dates
    const pickupDate = new Date(data.pickupDate);
    const dropoffDate = new Date(data.dropoffDate);
    
    if (dropoffDate < pickupDate) {
        alert('Drop-off date must be after pick-up date.');
        return false;
    }
    
    return true;
}

// Smooth scrolling for navigation links
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

// Add scroll animation for elements
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all pricing cards and benefit cards
    document.querySelectorAll('.pricing-card, .benefit-card, .vehicle-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', observeElements);

// Add active state to navigation links based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add simple analytics tracking (optional)
function trackEvent(eventName, eventData) {
    console.log(`Event: ${eventName}`, eventData);
    // In production, this could send to a tracking service
}

// Track button clicks
document.querySelectorAll('.book-btn, .cta-button').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('book_button_clicked', {
            timestamp: new Date(),
            buttonText: this.textContent
        });
    });
});

// Log when booking form is opened
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('book-btn') || e.target.classList.contains('cta-button')) {
        console.log('Booking modal opened at:', new Date().toLocaleTimeString());
    }
});

// Add responsive navbar toggle for mobile (optional enhancement)
function addMobileMenuToggle() {
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    
    // This would require additional HTML markup for a hamburger menu
    // Kept as a template for future mobile enhancement
    console.log('Mobile menu toggle ready for implementation');
}

// Initialize on page load
window.addEventListener('load', function() {
    console.log('Grant Premium Rental website loaded successfully');
    addMobileMenuToggle();
});
