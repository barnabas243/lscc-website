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
    normalizeScroll: true, // fixes weird edge cases (iOS, hash links)
    // ignoreMobileResize: true, // disables scroll-jank when resizing
    effects: true, // allow [data-speed] parallax or fade
    preventDefault: true, // ensures smoother wheel/touch scroll
});

if (import.meta.env.DEV) {
    ScrollTrigger.defaults({ markers: false }); // set to true to debug
}
