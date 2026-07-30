/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bloom: {
          violet: "#A78BFA",
          blue: "#60A5FA",
          mint: "#34D399",
          amber: "#FFB86C",
          pink: "#F472B6",
          lavender: "#E8E0F0",
          cream: "#FFFBF5",
          navy: "#111848",
          gray: "#6B7280",
        },
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "28px",
        button: "999px",
        input: "24px",
      },
      boxShadow: {
        glass: "0px 10px 30px rgba(167, 139, 250, 0.12)",
        glow: "0px 4px 20px rgba(167, 139, 250, 0.3)",
      },
    },
  },
  plugins: [],
};