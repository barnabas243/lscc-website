export default {
    content: [
        "./resources/**/*.antlers.html",
        "./resources/**/*.blade.php",
        "./resources/**/*.vue",
        "./content/**/*.md",
    ],
    theme: {
        fontFamily: {
            sans: ["Proxima Nova", "BenchNine", "serif"],
            serif: ["Cormorant Garamond", "serif"],
        },
        extend: {},
    },
    plugins: [],
    important: true,

    safelist: [
        {
            // Background gradients (from-violet-500, via-blue-400, to-pink-300, etc.)
            pattern:
                /(from|via|to)-(neutral|stone|gray|zinc|slate|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(100|200|300|400|500|600|700|800|900)/,
            variants: ["hover", "focus"],
        },
        {
            // Background & text colors (bg-red-500, text-blue-700, etc.)
            pattern:
                /(bg|text|border|outline)-(neutral|stone|gray|zinc|slate|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(100|200|300|400|500|600|700|800|900)/,
            variants: ["hover", "focus", "active"],
        },
        {
            // Safe dynamic text alignment, spacing, sizing, etc. (optional)
            pattern: /(text|p|m|gap|space|h|w|aspect)-\w+/,
        },
        {
            // Safe dynamic font sizes (text-sm, text-lg, etc.)
            pattern: /text-(sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)/,
        },
        {
            // Safe dynamic font weights (font-light, font-bold, etc.)
            pattern:
                /font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)/,
        },
        "bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))]",
        "from-violet-400",
        "via-slate-900",
        "to-lime-500",
    ],
};
