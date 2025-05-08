import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".js-card");

    cards.forEach((card, index) => {
        // Set initial opacity and position
        gsap.set(card, { opacity: 0, y: 40 });

        // Timeline for fade-in and fade-out with scroll
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                end: "bottom -20%",
                scrub: true,
            },
        });

        tl.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
        }).to(card, {
            opacity: 1,
            y: -20,
            duration: 0.7,
            ease: "power2.out",
        });
    });
});
