document.addEventListener("DOMContentLoaded", () => {
    // 1. Intersection Observer for Scroll Reveals
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Triggers when 15% of the element is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the 'active' class to start the CSS transition
                entry.target.classList.add('active');

                // Stop observing once revealed so it doesn't replay backwards
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply observer to all elements with the 'reveal' class
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
    // 2. Snapping Stability Fix for Chrome
    // Re-calculates snap targets on window resize to prevent landing half-way between sections
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // No direct API to "refresh" snap, but forcing a tiny scroll top-off often triggers browser re-calc
            const currentPosition = window.scrollY;
            window.scrollTo(0, currentPosition + 1);
            window.scrollTo(0, currentPosition);
        }, 300);
    });
});
