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
    curly: "error",

    "no-restricted-syntax": "off",

    "jsx-a11y/label-has-associated-control": [
      2,
      {
        // "labelComponents": ["CustomInputLabel"],
        // "labelAttributes": ["label"],
        controlComponents: [/* "CustomInput"*/ "input", "select", "textarea"],
        depth: 3,
      },
    ],

    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],

    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "interface",
        format: ["PascalCase"],
        custom: {
          regex: "^I[A-Z]",
          match: true,
        },
      },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
      },
    ],

    "default-case": "off",
    "consistent-return": "off",

    "@next/next/no-img-element": "off",

    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks: "(useMyStoreMemo|useMyOtherCustomHook)",
      },
    ],
  },
};
