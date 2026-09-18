module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "media",
  theme: {
    extend: {
      // All article typography lives here so components never need to
      // override the plugin with scoped styles or !important.
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "--tw-prose-links": theme("colors.blue.700"),
            "--tw-prose-invert-links": theme("colors.blue.400"),
            a: {
              fontWeight: "500",
              textDecorationThickness: "1px",
              textUnderlineOffset: "3px",
            },
            "a:hover": {
              textDecorationThickness: "2px",
            },
            h2: {
              fontWeight: "700",
              letterSpacing: theme("letterSpacing.tight"),
            },
            h3: {
              fontWeight: "600",
            },
            // No literal backticks around inline code.
            "code::before": { content: "none" },
            "code::after": { content: "none" },
            code: {
              fontWeight: "500",
              fontSize: "0.9em",
              backgroundColor: theme("colors.gray.100"),
              borderRadius: theme("borderRadius.md"),
              paddingTop: "0.1em",
              paddingBottom: "0.1em",
              paddingLeft: "0.35em",
              paddingRight: "0.35em",
            },
            "pre code": {
              backgroundColor: "transparent",
              padding: "0",
              fontSize: "inherit",
            },
          },
        },
        invert: {
          css: {
            code: {
              backgroundColor: theme("colors.gray.800"),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
  ],
};
