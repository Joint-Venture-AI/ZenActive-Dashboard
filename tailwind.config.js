/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ffebff",
        playground: "#052255",
        black: "#333333",
        red: "#F70300",
        lightGray: '#B0B0B0',
        lightBlueBg: '#F2F5F7',
        lightBlue: '#37B5FF',
        darkBlue: '#174C6B',
        gray: '#4B4B4B'
      },
    },
  },
  plugins: [],
};
