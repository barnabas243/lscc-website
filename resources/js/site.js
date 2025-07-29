// Alpine.js setup for interactivity and state handling
import Alpine from "alpinejs";
import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import morph from "@alpinejs/morph";
import persist from "@alpinejs/persist";
import precognition from "laravel-precognition-alpine";

// Modular GSAP animation imports
// import "./animations/scrollSmootherConfig"; // ✅ MUST come before other GSAP triggers
import "./animations/hero";
import "./animations/cards";
import "./animations/buttons";
import "./animations/imageText";
import "./animations/timeline";

// Carousel swiper initialization
import "./animations/carousel";

// calendar initialization
import "./calendar";

// Initialize AlpineJS globally
window.Alpine = Alpine;
Alpine.plugin([collapse, focus, morph, persist, precognition]);
Alpine.start();

// Optional: Log Alpine & GSAP for dev debugging
if (import.meta.env.DEV) {
    console.log("Alpine.js loaded:", Alpine);
    console.log("GSAP animations loaded.");
}
// if ("scrollRestoration" in history) {
//     history.scrollRestoration = "manual";
//     window.scrollTo(0, 0); // Optional: always start at top
// }
