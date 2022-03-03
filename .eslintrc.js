module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: ["airbnb-base", "eslint:recommended", "plugin:import/errors", "plugin:import/warnings", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  rules: {
    indent: [2, 2],
    "object-curly-spacing": "off",
    "object-curly-newline": "off",
    "comma-dangle": "off",
    "no-underscore-dangle": "off",
    "max-len": ["error", {code: 120}],
    "import/named": "off",
    "brace-style": "off",
    "newline-per-chained-call": "off"
  },
  settings: {
    "import/resolver": {
      "babel-module": {}
    }
  }
};
