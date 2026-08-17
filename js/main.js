'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // =======================================================================
    // 1. Navigation
    // =======================================================================
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navbar
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('navbar--scrolled');
        } else {
            navbar?.classList.remove('navbar--scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // Mobile menu toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('nav-menu--active');
            menuToggle.classList.toggle('active'); // Optional toggle styling
        });
    }

    // Active nav link highlighting based on current URL
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Handle root/index and exact matches
        if (href && (currentPath.endsWith(href) || (currentPath.endsWith('/') && href === 'index.html'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }

        // Close mobile menu when a link is clicked
        link.addEventListener('click', () => {
            navMenu?.classList.remove('nav-menu--active');
            menuToggle?.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu?.classList.contains('nav-menu--active') && !e.target.closest('.navbar')) {
            navMenu.classList.remove('nav-menu--active');
            menuToggle?.classList.remove('active');
        }
    });


    // =======================================================================
    // 2. Scroll Animations (Intersection Observer)
    // =======================================================================
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    el.classList.add('animate-in');
                }, delay);
                
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.15 });

    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .animate-slide-up, .animate-fade-in, .slide-in-bottom');
    animatedElements.forEach(el => animationObserver.observe(el));


    // =======================================================================
    // 3. Counter Animation
    // =======================================================================
    const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const easeOutQuad = t => t * (2 - t);

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Apply easing
            const easedProgress = easeOutQuad(progress);
            const currentCount = Math.floor(easedProgress * target);

            el.textContent = formatNumber(currentCount) + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = formatNumber(target) + suffix;
            }
        };

        requestAnimationFrame(updateCounter);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));


    // =======================================================================
    // 4. Dynamic Dates
    // =======================================================================
    const now = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Copyright year
    const copyYear = document.getElementById('copyright-year');
    if (copyYear) copyYear.textContent = now.getFullYear();
    // Also handle class-based copyright year (used on some pages)
    document.querySelectorAll('.copyright-year').forEach(el => {
        el.textContent = now.getFullYear();
    });

    // Current Date (e.g., August 17, 2026)
    const formattedDate = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    document.querySelectorAll('.current-date').forEach(el => {
        el.textContent = formattedDate;
    });

    // Current Month and Year (e.g., August 2026)
    const formattedMonthYear = `${months[now.getMonth()]} ${now.getFullYear()}`;
    document.querySelectorAll('.current-month-year').forEach(el => {
        el.textContent = formattedMonthYear;
    });

    // Days since
    document.querySelectorAll('.days-since').forEach(el => {
        const startDateStr = el.getAttribute('data-start-date');
        if (startDateStr) {
            const startDate = new Date(startDateStr);
            const diffTime = Math.abs(now - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            el.textContent = diffDays;
        }
    });


    // =======================================================================
    // 5. Smooth Scrolling
    // =======================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // =======================================================================
    // 6. Contact Form Handling
    // =======================================================================
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (isValid) {
                // Show success state
                const btn = contactForm.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                
                btn.disabled = true;
                btn.textContent = 'Sending...';

                // Simulate network request
                setTimeout(() => {
                    contactForm.reset();
                    btn.textContent = 'Message Sent!';
                    btn.classList.add('success');

                    // Create success message element
                    const successMsg = document.createElement('div');
                    successMsg.className = 'form-success-msg fade-in animate-in';
                    successMsg.textContent = 'Thank you for reaching out. We will get back to you shortly.';
                    successMsg.style.color = 'var(--success-color, #28a745)';
                    successMsg.style.marginTop = '1rem';
                    
                    contactForm.appendChild(successMsg);

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.textContent = originalText;
                        btn.classList.remove('success');
                        successMsg.remove();
                    }, 3000);
                }, 1000);
            }
        });
    }


    // =======================================================================
    // 7. Portfolio Filtering
    // =======================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterBtns.length > 0 && portfolioCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                // Filter cards
                portfolioCards.forEach(card => {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    
                    setTimeout(() => {
                        const category = card.getAttribute('data-category');
                        if (filterValue === 'all' || filterValue === category) {
                            card.style.display = 'block';
                            // Trigger reflow
                            void card.offsetWidth;
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        } else {
                            card.style.display = 'none';
                        }
                    }, 300); // Wait for fade out
                });
            });
        });
    }


    // =======================================================================
    // 8. Typing Effect
    // =======================================================================
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const words = ['Web Applications', 'Mobile Solutions', 'Cloud Infrastructure', 'Digital Experiences'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeEffect = () => {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentWord.length) {
                // Pause at end of word
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before typing next word
            }

            setTimeout(typeEffect, typeSpeed);
        };

        // Start typing effect
        setTimeout(typeEffect, 1000);
    }


    // =======================================================================
    // 9. Page Load
    // =======================================================================
    // Add loaded class to body
    document.body.classList.add('loaded');
});
