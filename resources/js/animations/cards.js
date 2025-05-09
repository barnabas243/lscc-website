import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".js-card");

    cards.forEach((card, index) => {
        gsap.set(card, {
            opacity: 0,
            y: 100,
            scale: 0.96,
        });

        gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none none", // one-time
            },
        });
    });
});
