module.exports = {
  extends: "airbnb-base",
  rules: {
    "no-underscore-dangle": "off",
    "no-console": "off",
    "linebreak-style": ["error", "unix"],
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
  },
};
