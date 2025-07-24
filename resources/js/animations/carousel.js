document.addEventListener("DOMContentLoaded", async function () {
    const el = document.querySelector(".carousel-block .swiper");
    if (!el) return;

    const [{ default: Swiper }, _] = await Promise.all([
        import("swiper"),
        import("swiper/css"), // load styles only when needed
    ]);

    new Swiper(el, {
        grabCursor: true,
        slidesPerView: 1.5,
        centeredSlides: true,
        initialSlide: 0,
        speed: 900,
        parallax: true,
        spaceBetween: 40,
        allowTouchMove: true,
        simulateTouch: true,
        slideToClickedSlide: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

    // Countdown logic remains unchanged
    const countdowns = document.querySelectorAll(
        ".carousel-block .slide-countdown",
    );

    countdowns.forEach((container) => {
        const target = new Date(container.dataset.countdown);
        const display = container.querySelector(".countdown-timer");

        const update = () => {
            const now = new Date();
            const diff = target - now;

            if (diff <= 0) {
                display.textContent = "Event started!";
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const mins = Math.floor((diff / (1000 * 60)) % 60);
            const secs = Math.floor((diff / 1000) % 60);

            display.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
        };

        update();
        setInterval(update, 1000);
    });
});
