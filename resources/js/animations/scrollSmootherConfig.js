// resources/js/animations/scrollSmootherConfig.js

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Initialize ScrollSmoother
ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.5, // smoothing factor (1.2–1.6 feels nice)
    // normalizeScroll: true, //
    ignoreMobileResize: true,
    effects: true,
    preventDefault: true,
});

if (import.meta.env.DEV) {
    ScrollTrigger.defaults({ markers: false }); // set to true to debug
}
