import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const blocks = document.querySelectorAll(".js-image-text-block");

    blocks.forEach((block) => {
        const imageFigure = block.querySelector("figure");
        const image = imageFigure?.querySelector("img");
        const text = block.querySelector("article");
        const lead = text?.querySelector("p.font-mono");
        const heading = text?.querySelector("h2");
        const prose = text?.querySelector(".prose");
        const button = text?.querySelector("a");

        const isImageLeft = imageFigure?.classList.contains("order-first");

        // Set initial states (only if elements exist)
        if (image) {
            gsap.set(image, {
                opacity: 0,
                scale: 1.1,
                x: isImageLeft ? -100 : 100,
            });
        }

        gsap.set([lead, heading, prose, button].filter(Boolean), {
            opacity: 0,
            y: 50,
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: block,
                start: "top 80%",
                toggleActions: "play none none none",
            },
        });

        if (image) {
            tl.to(image, {
                opacity: 1,
                scale: 1,
                x: 0,
                duration: 1.4,
                ease: "power3.out",
            });
        }

        if (lead) {
            tl.to(
                lead,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                },
                "-=1",
            );
        }

        if (heading) {
            tl.to(
                heading,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out",
                },
                "-=0.4",
            );
        }

        if (prose) {
            tl.to(
                prose,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out",
                },
                "-=0.4",
            );
        }

        if (button) {
            tl.to(
                button,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.2,
                    ease: "back.out(1.7)",
                },
                "-=0.3",
            );
        }

        // Image parallax scroll (safe)
        if (image) {
            gsap.to(image, {
                y: -40,
                ease: "none",
                scrollTrigger: {
                    trigger: block,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }
    });
});
