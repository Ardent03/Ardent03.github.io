// Initialize EmailJS
(function() {
    emailjs.init("your_emailjs_user_id"); // Replace with your EmailJS User ID
})();

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or default to dark theme
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    body.classList.add('light-theme');
    themeIcon.className = 'fas fa-moon';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    
    if (body.classList.contains('light-theme')) {
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = body.classList.contains('light-theme') ? 
            'rgba(248, 250, 252, 0.98)' : 'rgba(10, 10, 10, 0.98)';
        header.style.borderBottomColor = body.classList.contains('light-theme') ? 
            'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)';
    } else {
        header.style.background = body.classList.contains('light-theme') ? 
            'rgba(248, 250, 252, 0.95)' : 'rgba(10, 10, 10, 0.95)';
        header.style.borderBottomColor = body.classList.contains('light-theme') ? 
            'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationContent = notification.querySelector('.notification-content');
    const icon = notificationContent.querySelector('i');
    const text = notificationContent.querySelector('p');
    
    // Set icon and message based on type
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
        notification.classList.remove('error');
        notification.classList.add('success');
    } else {
        icon.className = 'fas fa-exclamation-circle';
        notification.classList.remove('success');
        notification.classList.add('error');
    }
    
    text.textContent = message;
    notification.classList.remove('hidden');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}

// Form handling with EmailJS
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Simple form validation
        if (!formObject.from_name || !formObject.from_email || !formObject.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formObject.from_email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Send email using EmailJS
        emailjs.sendForm('your_service_id', 'your_template_id', this)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                
                // Reset form labels
                contactForm.querySelectorAll('.form-group').forEach(group => {
                    const input = group.querySelector('input, textarea');
                    const label = group.querySelector('label');
                    if (input && label) {
                        input.classList.remove('has-value');
                        label.style.transform = '';
                        label.style.color = '';
                    }
                });
            })
            .catch(function(error) {
                console.log('FAILED...', error);
                showNotification('Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });

    // Handle form input states for better UX
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.about-card, .skill-category, .project-card, .contact-method'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing effect for hero subtitle
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        setTimeout(() => {
            typeWriter(heroSubtitle, originalText, 100);
        }, 1000);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('#hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translate3d(0, ${rate}px, 0)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Skills animation on scroll
const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillCategories = entry.target.querySelectorAll('.skill-category');
                skillCategories.forEach((category, index) => {
                    setTimeout(() => {
                        category.style.transform = 'translateY(0) scale(1)';
                        category.style.opacity = '1';
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.2 });

    skillsObserver.observe(skillsSection);
}

// Close notification when clicked
document.addEventListener('click', (e) => {
    const notification = document.getElementById('notification');
    if (notification && !notification.classList.contains('hidden') && 
        (e.target === notification || notification.contains(e.target))) {
        notification.classList.add('hidden');
    }
});
