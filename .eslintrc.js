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
    project: ["./tsconfig.json"],
  },
  root: true,
  rules: {
    "@typescript-eslint/switch-exhaustiveness-check": "error",
  },
};
