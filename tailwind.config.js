/* eslint-disable @typescript-eslint/no-var-requires */
import { nextui } from "@nextui-org/react";
import containerQueries from "@tailwindcss/container-queries";
import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard Variable", ...defaultTheme.fontFamily.sans],
        mono: ["Ubuntu Mono", ...defaultTheme.fontFamily.mono],
      },
      colors: { primary: { ...colors.green, DEFAULT: colors.green[500] } },
      width: { 4.5: "1.125rem" },
      height: { 4.5: "1.125rem" },
    },
  },
  darkMode: "class",
  plugins: [nextui(), containerQueries],
};
