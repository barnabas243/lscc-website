/*
    Main JavaScript entry point for the site
*/

// Alpine.js setup
import Alpine from "alpinejs";
import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import morph from "@alpinejs/morph";
import persist from "@alpinejs/persist";
import precognition from "laravel-precognition-alpine";

import scrollingHeader from "./scrollingHeader";
import "./sentryConf";

// GSAP plugin registration
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Make the shared gsap available to modules
export { gsap, ScrollTrigger };

// Import all animation modules
import "./animations/hero";
import "./animations/cards";
import "./animations/buttons";
import "./animations/imageText";
import "./animations/timeline";
import "./animations/carousel";
import "./calendar";

// Alpine init
Alpine.data("scrollingHeader", scrollingHeader);

window.Alpine = Alpine;
Alpine.plugin([collapse, focus, morph, persist, precognition]);
Alpine.start();

if (import.meta.env.DEV) {
    console.log("Alpine.js loaded:", Alpine);
    console.log("GSAP + ScrollTrigger registered.");
}
