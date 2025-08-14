/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- Important for Vite + TS
     "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@shadcn/ui/components/**/*.{js,ts,jsx,tsx}", 
    "./node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
