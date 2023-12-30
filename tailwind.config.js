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
      fontFamily: { sans: ["Pretendard", ...defaultTheme.fontFamily.sans] },
      colors: { primary: { ...colors.green, DEFAULT: colors.green[500] } },
    },
  },
  darkMode: "class",
  plugins: [nextui(), containerQueries],
};
