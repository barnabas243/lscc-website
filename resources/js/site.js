import Alpine from "alpinejs";
import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import morph from "@alpinejs/morph";
import persist from "@alpinejs/persist";
import precognition from "laravel-precognition-alpine";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Call Alpine.
window.Alpine = Alpine;
Alpine.plugin([collapse, focus, morph, persist, precognition]);
Alpine.start();

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    gsap.from(".js-hero-image", {
        scale: 1.05,
        opacity: 0,
        duration: 2,
        ease: "power2.out",
    });

    gsap.from(".js-hero-title", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".js-hero-title",
            start: "top 85%",
        },
    });

    gsap.from(".js-hero-description", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".js-hero-description",
            start: "top 85%",
        },
    });

    gsap.from(".js-hero-buttons", {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        delay: 0.4,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: ".js-hero-buttons",
            start: "top 85%",
        },
    });
});
