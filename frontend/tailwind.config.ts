import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-page)",
        foreground: "var(--text-100)",
        'cb-bg': '#0a0a0f',
        'cb-surface': '#111118',
        'cb-card': '#1a1a26',
        'cb-primary': '#6B3FDC',
        'cb-primary-hover': '#8B63F0',
      },
    },
  },
  plugins: [],
};
export default config;
