module.exports = {
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  rules: {
    "react/react-in-jsx-scope": "off",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  env: {
    browser: true,
    es2021: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
