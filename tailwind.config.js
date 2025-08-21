export default {
    content: [
        "./resources/**/*.antlers.html",
        "./resources/**/*.blade.php",
        "./resources/**/*.{vue,js,ts}",
        "./resources/**/*.md",
        "./resources/**/*.yaml",
        "./content/**/*.{md,yaml}",
        "./resources/blueprints/**/*.yaml",
        "./resources/fieldsets/**/*.yaml",
        "./resources/forms/**/*.yaml",
    ],
    theme: {
        fontFamily: {
            sans: ["Proxima Nova", "BenchNine", "serif"],
            serif: ["Cormorant Garamond", "serif"],
        },
        extend: {
            backdropBlur: {
                xs: "2px",
                sm: "4px",
                md: "8px",
                lg: "12px",
                xl: "16px",
            },
            backdropSaturate: { 115: "115%", 120: "120%", 150: "150%" },
        },
    },
    plugins: [],
    important: true,
    safelist: [], // no more mega-safelist
};
