/** @type {import('tailwindcss').Config} */
export default {
  content: ["./**/*.{html,js}"],
  theme: {
    colors: {
      blue: "#1e557c",
      light_blue: "#e6f2ff",
      medium_gray: "#D1D3D3",
      light_gray: "#efefee",
      lavender: "#d3cade",
    },
    screens:{
      lg: "1200px",
      md: "992px",
      lsm: "768px",
      sm: "430px",
    },
    extend: {},
  },
  plugins: [],
}

