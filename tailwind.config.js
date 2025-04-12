/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      primary: "Roboto",
    },

    extend: {
      screens: { sm: "480px", md: "768px", lg: "976px", xl: "1440pd", xs: "320px" },
      colors: {
        "light-gold": "#f5bc51",
        "dark-gold": "#533519",
        "gradient-1": {
          50: "rgb(43, 0, 88)",
          100: "rgb(42, 37, 201)",
          200: "rgb(48, 173, 255)",
          300: "rgb(48, 173, 255)",
          400: "rgb(48, 173, 255)",
          500: "rgb(48, 173, 255)",
          600: "rgb(48, 173, 255)",
          700: "rgb(48, 173, 255)",
          800: "rgb(48, 173, 255)",
          900: "rgb(48, 173, 255)",
        },
        // Cyber tech theme colors
        'cyber-black': '#0D0D0D',
        'cyber-dark': '#121212',
        'cyber-gray': '#1E1E1E',
        'cyber-light': '#262626',
        'cyber-blue': '#00A6ED',
        'cyber-blue-dark': '#0077CC',
        'cyber-purple': '#9D4EDD',
        'cyber-purple-light': '#C77DFF',
        'cyber-green': '#00F5A0',
        'cyber-pink': '#FF00E4',
        'cyber-yellow': '#FFD60A',
        'cyber-red': '#FF3D5A',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)',
        'cyber-glow': 'radial-gradient(circle, rgba(0,166,237,0.2) 0%, rgba(0,0,0,0) 70%)',
        'cyber-grid': 'linear-gradient(rgba(18, 18, 18, 0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(18, 18, 18, 0.9) 1px, transparent 1px)',
      },
      boxShadow: {
        'cyber': '0 0 15px rgba(0, 166, 237, 0.5)',
        'cyber-text': '0 0 10px rgba(0, 166, 237, 0.7)',
        'cyber-hover': '0 0 20px rgba(0, 245, 160, 0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'cyber-pulse': 'cyberPulse 1.5s infinite alternate',
        'cyber-glow': 'cyberGlow 2s infinite alternate',
        'cyber-type': 'cyberType 0.1s infinite',
      },
      keyframes: {
        cyberPulse: {
          '0%': { boxShadow: '0 0 5px rgba(0, 166, 237, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 166, 237, 0.8)' },
        },
        cyberGlow: {
          '0%': { textShadow: '0 0 5px rgba(0, 245, 160, 0.5)' },
          '100%': { textShadow: '0 0 15px rgba(0, 245, 160, 0.8)' },
        },
        cyberType: {
          '0%': { borderRightColor: 'rgba(0, 166, 237, 0)' },
          '100%': { borderRightColor: 'rgba(0, 166, 237, 1)' },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
