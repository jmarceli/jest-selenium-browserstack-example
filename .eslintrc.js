module.exports = {
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
    // allow to use Promises https://github.com/eslint/eslint/issues/9812
    es6: true,
    'jest/globals': true,
  },
  extends: ['plugin:prettier/recommended', 'eslint:recommended'],
  plugins: ['prettier', 'jest'],
};
