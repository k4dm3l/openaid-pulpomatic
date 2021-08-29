module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'import/no-named-as-default': 0,
    'import/no-named-as-default-member': 0,
    'class-methods-use-this': 0,
    'func-names': 0,
    'no-await-in-loop': 0,
  },
};
