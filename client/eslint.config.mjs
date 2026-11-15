import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next-dev/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "no-restricted-syntax": [
        "warn",
        {
          "selector": "Literal[value=/^#(?:ff0000|0000ff|00ff00|123456)$/i]",
          "message": "Enforce Living Materials Design System: Do not use unapproved raw hex colors. Use design tokens from cambium.tokens.json or globals.css."
        }
      ],
    },
  },
];

export default eslintConfig;
