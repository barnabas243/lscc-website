export default {
    content: [
        "./resources/**/*.antlers.html",
        "./resources/**/*.blade.php",
        "./resources/**/*.vue",
        "./content/**/*.md",
    ],
    theme: {
        fontFamily: {
            sans: ["BenchNine", "serif"],
            serif: ["Cormorant Garamond", "serif"],
        },
        extend: {},
    },
    plugins: [],
    important: true,

    safelist: [
        {
            pattern:
                /(from|via|to)-(black|white|gray-\d{1,3}|red-\d{1,3}|blue-\d{1,3})/,
            variants: ["hover", "focus"],
        },
    ],
};
