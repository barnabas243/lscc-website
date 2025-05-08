import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const heroImage = document.querySelector(".js-hero-image");
    const heroTitle = document.querySelector(".js-hero-title");
    const heroDescription = document.querySelector(".js-hero-description");
    const heroButtons = document.querySelector(".js-hero-buttons");

    if (!heroTitle) return;

    // 🖼️ Animate background image fade + float
    if (heroImage) {
        gsap.fromTo(
            heroImage,
            {
                scale: 1.08,
                opacity: 0,
                filter: "blur(8px)",
            },
            {
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
                duration: 2,
                ease: "power2.out",
            },
        );

        gsap.to(heroImage, {
            y: 0,
            repeat: -1,
            yoyo: true,
            duration: 10,
            ease: "sine.inOut",
        });
    }

    // 🔤 Split title into span.hero-word and highlight specific words
    const rawWords = heroTitle.textContent?.trim().split(" ") || [];
    const highlightWords = ["God", "Gospel", "Arise"]; // Add more if needed

    heroTitle.innerHTML = rawWords
        .map((word) => {
            const plain = word.replace(/[^\w]/g, "");
            const isHighlight = highlightWords.includes(plain);
            const spanClass = isHighlight
                ? "hero-word highlighted-word"
                : "hero-word";
            return `<span class="${spanClass}">${word}</span>`;
        })
        .join(" ");

    const heroWords = document.querySelectorAll(".hero-word");
    if (heroWords.length > 0) {
        gsap.set(heroWords, { opacity: 0, y: 50 });

        const loadTimeline = gsap.timeline({ delay: 0.2 });

        // 🪄 Animate words into view
        loadTimeline.to(heroWords, {
            y: 0,
            opacity: 1,
            ease: "back.out(1.7)",
            stagger: 0.1,
        });

        // 📝 Description fade-up animation
        if (heroDescription && heroDescription.textContent.trim() !== "") {
            gsap.set(heroDescription, { opacity: 0, y: 20 });

            loadTimeline.to(
                heroDescription,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                },
                "-=1.0",
            );
        }

        // 🔘 Buttons animation
        if (heroButtons) {
            loadTimeline.fromTo(
                heroButtons,
                { opacity: 0, scale: 0.95, y: 20 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "back.out(1.5)",
                },
                "-=0.8",
            );

            const buttons = heroButtons.querySelectorAll("a");
            buttons?.forEach((btn) => {
                btn.addEventListener("mouseenter", () =>
                    gsap.to(btn, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: "power2.out",
                    }),
                );
                btn.addEventListener("mouseleave", () =>
                    gsap.to(btn, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out",
                    }),
                );
            });
        }
    }
});
