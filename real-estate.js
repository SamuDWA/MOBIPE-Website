document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Intersection Observer for Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Contact Form Submission Mock
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;

            btn.disabled = true;
            btn.textContent = 'Sending...';

            // Simulate network delay
            setTimeout(() => {
                btn.textContent = 'Request Sent Successfully!';
                btn.style.backgroundColor = '#10b981'; // Success Green
                btn.style.color = 'white';

                contactForm.reset();

                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 3000);
            }, 1500);
        });
    }

    // 4. Simple Hotspot Interaction for Virtual Tour
    const hotspots = document.querySelectorAll('.hotspot');
    hotspots.forEach(spot => {
        spot.addEventListener('click', () => {
            alert('Loading immersive 360° view of this room...');
        });
    });
});
