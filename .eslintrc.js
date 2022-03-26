module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: 'airbnb-base',
  plugins: ['@typescript-eslint', 'simple-import-sort', 'import'],
  rules: {
    'max-len': ['error', { code: 120 }],
    'no-undef': 'off',
    'no-shadow': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'sort-imports': 'off',
    'import/order': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    '@typescript-eslint/no-shadow': 'error',
  },
};
