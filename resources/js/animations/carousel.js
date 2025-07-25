document.addEventListener("DOMContentLoaded", async function () {
    const el = document.querySelector(".carousel-block .swiper");
    if (!el) return;

    new Swiper(el, {
        grabCursor: true,
        slidesPerView: 1.5,
        centeredSlides: true,
        spaceBetween: 40,
        speed: 900,
        parallax: true,
        allowTouchMove: true,
        simulateTouch: true,
        slideToClickedSlide: true,
        zoom: {
            maxRatio: 5,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1.2,
                spaceBetween: 16,
            },
            640: {
                slidesPerView: 1.3,
            },
            1024: {
                slidesPerView: 1.5,
            },
        },
    });
});
