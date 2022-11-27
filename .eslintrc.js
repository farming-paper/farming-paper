module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    project: ["./tsconfig.eslint.json"],
  },
  root: true,
  rules: {
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "react/jsx-key": ["error", { checkFragmentShorthand: true }],
    "no-useless-rename": "error",
    "object-shorthand": "error",
    "no-console": "error",
  },
};
