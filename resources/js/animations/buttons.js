import gsap from "gsap";

// Tunables (fast but tasteful)
const DUR = {
    enter: 0.12,
    leave: 0.12,
    press: 0.08,
    release: 0.18,
    reset: 0.12,
};
const EASE = {
    out: "power2.out",
    inOut: "power2.inOut",
};

// Respect reduced motion
const PREFERS_REDUCED =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Animate a single button with fast, transform-only GSAP effects
 * @param {HTMLElement} btn
 */
function setupAnimatedButton(btn) {
    // Hint the browser (only while animating)
    const setWillChange = (on) =>
        btn.style.setProperty("will-change", on ? "transform, filter" : "auto");

    // If you’d rather keep box-shadow, flip this to true
    const USE_DROP_SHADOW = true;

    // Start from a clean baseline
    gsap.set(btn, { transformOrigin: "50% 50%" });
    if (USE_DROP_SHADOW)
        gsap.set(btn, { filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" });

    const kill = () => gsap.killTweensOf(btn);

    const animate = (vars, d = DUR.enter, ease = EASE.out) => {
        if (PREFERS_REDUCED) {
            // Just snap to the end state (no animation)
            gsap.set(btn, vars);
            return;
        }
        setWillChange(true);
        return gsap.to(btn, {
            ...vars,
            duration: d,
            ease,
            onComplete: () => setWillChange(false),
        });
    };

    const enter = () =>
        animate(
            USE_DROP_SHADOW
                ? {
                      scale: 1.05,
                      y: -2,
                      filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.12))",
                  }
                : { scale: 1.05, y: -2 },
            DUR.enter,
        );

    const leave = () =>
        animate(
            USE_DROP_SHADOW
                ? { scale: 1, y: 0, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" }
                : { scale: 1, y: 0 },
            DUR.leave,
        );

    const press = () => animate({ scale: 0.96, y: 0 }, DUR.press, EASE.inOut);

    const release = () =>
        animate(
            USE_DROP_SHADOW
                ? {
                      scale: 1.02,
                      y: -1,
                      filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.10))",
                  }
                : { scale: 1.02, y: -1 },
            DUR.release,
            EASE.out,
        );

    const reset = () =>
        animate(
            USE_DROP_SHADOW
                ? { scale: 1, y: 0, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" }
                : { scale: 1, y: 0 },
            DUR.reset,
        );

    // Mouse / pointer
    btn.addEventListener("mouseenter", () => {
        kill();
        enter();
    });
    btn.addEventListener("mouseleave", () => {
        kill();
        leave();
    });
    btn.addEventListener("pointerdown", (e) => {
        // ignore right-click / long-press context
        if (e.button && e.button !== 0) return;
        kill();
        press();
    });
    btn.addEventListener("pointerup", () => {
        kill();
        release();
    });
    btn.addEventListener("pointercancel", () => {
        kill();
        reset();
    });
    btn.addEventListener("pointerleave", () => {
        kill();
        reset();
    });

    // Focus/keyboard accessibility
    btn.addEventListener("focus", enter);
    btn.addEventListener("blur", reset);
    btn.addEventListener("keydown", (e) => {
        if (e.code === "Space" || e.code === "Enter") {
            kill();
            press();
        }
    });
    btn.addEventListener("keyup", (e) => {
        if (e.code === "Space" || e.code === "Enter") {
            kill();
            release();
        }
    });
}

function initAnimatedButtons() {
    const buttons = document.querySelectorAll(".js-animated-button");
    if (!buttons.length) return;
    buttons.forEach(
        (btn) => btn instanceof HTMLElement && setupAnimatedButton(btn),
    );
}

document.addEventListener("DOMContentLoaded", initAnimatedButtons);
