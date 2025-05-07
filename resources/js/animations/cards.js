import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".js-card");

    // ✅ Animate each card individually
    cards.forEach((card, index) => {
        // const image = card.querySelector(".js-card-image");

        // Set initial opacity and position
        gsap.set(card, { opacity: 0, y: 40 });

        // Timeline for fade-in and fade-out with scroll
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
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

        // // ✅ Parallax image effect inside card
        // if (image) {
        //     gsap.fromTo(
        //         image,
        //         { y: 0 },
        //         {
        //             y: 20,
        //             ease: "none",
        //             scrollTrigger: {
        //                 trigger: card,
        //                 start: "top bottom",
        //                 end: "bottom top",
        //                 scrub: true,
        //             },
        //         },
        //     );
        // }

        // ✅ Hover lift effect — only on desktop
        if (window.innerWidth >= 768) {
            card.addEventListener("mouseenter", () => {
                gsap.to(card, {
                    y: -8,
                    boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
                    duration: 0.3,
                    ease: "power2.out",
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(card, {
                    y: 0,
                    boxShadow: "none",
                    duration: 0.3,
                    ease: "power2.out",
                });
            });
        }
    });

    // ✅ Optional: slight stagger if multiple cards visible at once
    ScrollTrigger.batch(".js-card", {
        onEnter: (batch) => {
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.6,
                ease: "power2.out",
            });
        },
        start: "top 85%",
    });
});
