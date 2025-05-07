import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".js-image-text-block");

    sections.forEach((section) => {
        const figure = section.querySelector("figure");
        const image = figure?.querySelector("img");
        const textWrap = section.querySelector("article > div");

        if (!image || !textWrap) return;

        const imageIsLeft = figure.classList.contains("order-first");

        // 🔹 Set initial x-offset and opacity
        gsap.set(image, {
            opacity: 0,
            x: imageIsLeft ? -50 : 50,
        });
        gsap.set(textWrap, {
            opacity: 0,
            x: imageIsLeft ? 50 : -50,
        });

        // ✅ Slide in both image and text
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none reverse",
            },
        });

        tl.to(image, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
        }).to(
            textWrap,
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
            },
            "-=0.7",
        );

        // ✅ Parallax on image
        gsap.fromTo(
            image,
            { y: 0 },
            {
                y: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            },
        );

        // ✅ Hover zoom (desktop only)
        if (window.innerWidth >= 768) {
            figure.addEventListener("mouseenter", () => {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out",
                });
            });
            figure.addEventListener("mouseleave", () => {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out",
                });
            });
        }
    });
});
