/** @type {import('tailwindcss').Config} */
// import theme from '/src/theme/default';
// const themeSwapper = require("tailwindcss-theme-swapper");

module.exports = {
  content: ["src/**/*.{ts,html}"],
  theme: {
    fontFamily: {
      sans: ["Source Sans Pro", "sans-serif"],
    },
    extend: {
      animation: {
        "spin-slow": "spin 1.25s linear infinite",
        "spin-medium": "spin 1s linear infinite",
        "spin-fast": "spin .5s linear infinite",
        "spin-up": "spin-up .25s linear",
        "spin-down": "spin-down .25s linear",
        "fade-in": "fade-in .5 ease",
      },
      keyframes: {
        "spin-up": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(-180deg)" },
        },
        "spin-down": {
          from: { transform: "rotate(-180deg)" },
          to: { transform: "rotate(0deg)" },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    // themeSwapper({
    //   themes: [
    //     // The only required theme is `base`. Every property used in
    //     // other themes must exist in here.
    //     {
    //       name: 'base',
    //       selectors: [':root'],
    //       theme: {
    //         colors: {
    //           accent: '#ff0000',
    //           info: '#0000ff',
    //         },
    //       },
    //     },
    //   ],
    // }),
  ],
};
