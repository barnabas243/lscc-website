import gsap from "gsap";

document.querySelectorAll(".js-animated-button").forEach((btn) => {
    // Clear any active animations before new ones
    const clearAnimations = () => gsap.killTweensOf(btn);

    // Hover in: scale up + slight float
    btn.addEventListener("mouseenter", () => {
        clearAnimations();
        gsap.to(btn, {
            scale: 1.06,
            y: -2,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
            duration: 0.2,
            ease: "power3.out",
        });
    });

    // Hover out: reset scale + position
    btn.addEventListener("mouseleave", () => {
        clearAnimations();
        gsap.to(btn, {
            scale: 1,
            y: 0,
            boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
            duration: 0.15,
            ease: "power2.out",
        });
    });

    // Pointer down (click/tap): slightly shrink
    btn.addEventListener("pointerdown", () => {
        clearAnimations();
        gsap.to(btn, {
            scale: 0.95,
            y: 0,
            duration: 0.1,
            ease: "power2.inOut",
        });
    });

    // Pointer up (release): subtle elastic bounce
    btn.addEventListener("pointerup", () => {
        clearAnimations();
        gsap.to(btn, {
            scale: 1,
            y: -2,
            duration: 0.3,
            ease: "elastic.out(1, 0.5)",
        });
    });

    // Just in case: if pointer leaves before release
    btn.addEventListener("pointerleave", () => {
        clearAnimations();
        gsap.to(btn, {
            scale: 1,
            y: 0,
            boxShadow: "none",
            duration: 0.15,
            ease: "power2.out",
        });
    });
});
