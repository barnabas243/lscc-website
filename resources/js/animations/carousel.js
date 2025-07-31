document.addEventListener("DOMContentLoaded", () => {
    const swiperContainer = document.querySelector(".carousel-block .swiper");

    if (!(swiperContainer instanceof HTMLElement)) {
        console.warn("Swiper container not found: .carousel-block .swiper");
        return;
    }

    try {
        const swiper = new Swiper(swiperContainer, {
            grabCursor: true,
            centeredSlides: true,
            parallax: true,
            allowTouchMove: true,
            simulateTouch: true,
            slideToClickedSlide: true,
            speed: 900,
            slidesPerView: 1.5,
            spaceBetween: 40,
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
    } catch (err) {
        console.error("Failed to initialize Swiper:", err);
    }
});
