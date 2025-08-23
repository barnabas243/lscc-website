document.addEventListener("DOMContentLoaded", () => {
    const blocks = document.querySelectorAll(".carousel-block");
    const prefersReduced =
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
        false;

    blocks.forEach((block) => {
        const outerEl = block.querySelector(".horizontal-swiper");
        if (!outerEl) return;

        // Scope nav/pagination to this block so multiple carousels won’t clash
        const nextEl = outerEl.querySelector(".swiper-button-next");
        const prevEl = outerEl.querySelector(".swiper-button-prev");
        const paginationEl = outerEl.querySelector(".swiper-pagination");

        // Init INNER vertical swipers first (one per slide)
        const innerEls = block.querySelectorAll(".vertical-swiper");
        innerEls.forEach((inner) => {
            new Swiper(inner, {
                direction: "vertical",
                nested: true, // IMPORTANT for nested swipers
                slidesPerView: 1,
                spaceBetween: 8,
                speed: prefersReduced ? 0 : 400,
                allowTouchMove: true,
                simulateTouch: true,

                // Let native pinch-zoom work:
                touchStartPreventDefault: false,
                touchMoveStopPropagation: false,

                // If you want click-to-advance posters:
                slideToClickedSlide: true,
                watchOverflow: true,
            });
        });

        // Init OUTER horizontal swiper
        new Swiper(outerEl, {
            centeredSlides: true,
            centeredSlidesBounds: true,
            slidesPerView: 1.3,
            spaceBetween: 18,
            speed: prefersReduced ? 0 : 500,
            grabCursor: true,
            allowTouchMove: true,
            simulateTouch: true,
            slideToClickedSlide: true,
            resistanceRatio: 0.6,
            longSwipesRatio: 0.2,
            shortSwipes: true,
            threshold: 6,
            watchOverflow: true,

            // Respect reduced motion for parallax/animations
            parallax: !prefersReduced,

            // Crucial: don’t block native gestures (pinch)
            touchStartPreventDefault: false,
            touchMoveStopPropagation: false,

            navigation: { nextEl, prevEl },
            pagination: { el: paginationEl, clickable: true },

            breakpoints: {
                0: { slidesPerView: 1.15, spaceBetween: 12 },
                640: { slidesPerView: 1.25, spaceBetween: 16 },
                1024: { slidesPerView: 1.5, spaceBetween: 28 },
                1440: { slidesPerView: 1.6, spaceBetween: 36 },
            },
        });
    });
});
