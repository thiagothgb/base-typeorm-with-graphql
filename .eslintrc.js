module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  extends: [
    "eslint:recommended",
    "semistandard",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
};
