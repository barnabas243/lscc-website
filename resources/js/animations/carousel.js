document.addEventListener("DOMContentLoaded", () => {
    const swiperContainer = document.querySelector(".carousel-block .swiper");
    if (!(swiperContainer instanceof HTMLElement)) return;

    const swiper = new Swiper(swiperContainer, {
        centeredSlides: true,
        centeredSlidesBounds: true,
        slidesPerView: 1.3,
        spaceBetween: 18,
        speed: 500,
        watchOverflow: true,

        allowTouchMove: true,
        simulateTouch: true,

        touchStartPreventDefault: false,
        touchMoveStopPropagation: false,

        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            0: { slidesPerView: 1.15, spaceBetween: 12 },
            640: { slidesPerView: 1.25, spaceBetween: 16 },
            1024: { slidesPerView: 1.5, spaceBetween: 28 },
            1440: { slidesPerView: 1.6, spaceBetween: 36 },
        },
    });
});
