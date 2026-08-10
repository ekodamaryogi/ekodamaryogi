import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0a0f',
          blue: '#00f0ff',
          purple: '#b026ff',
          accent: '#1f2937'
        }
      },
      boxShadow: {
        'cyber': '0 0 10px rgba(0, 240, 255, 0.5)',
        'cyber-hover': '0 0 20px rgba(0, 240, 255, 0.8), 0 0 40px rgba(0, 240, 255, 0.2)',
      }
    },
  },
  plugins: [],
};
export default config;
