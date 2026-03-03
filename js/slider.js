const setupSliderDrag = () => {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;

    // A more accurate way to check if we actually NEED to scroll
    // We ignore the pseudo-elements width for this calculation
    const checkRealOverflow = () => {
        const cards = slider.querySelectorAll('.testimonial-card');
        if (cards.length === 0) return false;

        const gap = 32; // Defined in CSS
        const totalCardsWidth = Array.from(cards).reduce((acc, card) => acc + card.offsetWidth, 0);
        const totalGapsWidth = (cards.length - 1) * gap;
        const totalContentWidth = totalCardsWidth + totalGapsWidth;

        // Return true if the cards themselves are wider than the visible slider area
        return totalContentWidth > (slider.clientWidth - 40); // 40px buffer for safety
    };

    let isDown = false;
    let isHovered = false;
    let isResetting = false;
    let startX;
    let scrollLeft;
    let scrollSpeed = 0.5;

    const autoScroll = () => {
        if (!isDown && !isHovered && !isResetting && checkRealOverflow()) {
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            slider.scrollLeft += scrollSpeed;

            if (slider.scrollLeft >= maxScroll - 1) {
                isResetting = true;
                slider.scrollTo({ left: 0, behavior: 'smooth' });
                setTimeout(() => { isResetting = false; }, 800);
            }
        }
        requestAnimationFrame(autoScroll);
    };

    // Initial positioning and state check
    const initSlider = () => {
        const needsScroll = checkRealOverflow();

        if (!needsScroll) {
            // If it doesn't overflow, center the cards and disable scroll
            slider.style.justifyContent = 'center';
            slider.style.overflowX = 'hidden';
            slider.classList.add('no-scroll');
        } else {
            // If it overflows, ensure it's scrollable and start auto-scroll
            slider.style.justifyContent = 'flex-start';
            slider.style.overflowX = 'auto';
            autoScroll();
        }
    };

    // Give it a tiny moment to ensure card widths are rendered
    setTimeout(initSlider, 300);

    slider.addEventListener('mouseenter', () => isHovered = true);
    slider.addEventListener('mouseleave', () => {
        isHovered = false;
        isDown = false;
        slider.classList.remove('is-dragging');
    });

    slider.addEventListener('mousedown', (e) => {
        if (!checkRealOverflow() || e.target.classList.contains('see-more-btn')) return;

        isDown = true;
        slider.classList.add('is-dragging');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.scrollBehavior = 'auto';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('is-dragging');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
};

window.toggleReview = (btn) => {
    const card = btn.closest('.testimonial-card');
    card.classList.toggle('expanded');
    btn.textContent = card.classList.contains('expanded') ? 'See less' : 'See more';
};

document.addEventListener('DOMContentLoaded', setupSliderDrag);
