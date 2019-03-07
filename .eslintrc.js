module.exports = {
  root: true,
  env: {
    node: true,
  },
  'extends': [
    'plugin:vue/recommended',
    '@vue/standard',
  ],
  rules: {
    // Allow async-await
    'generator-star-spacing': 'off',
    // No async function without await
    'require-await': 'error',
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    // Prefer const over let
    'prefer-const': ['error', {
      'destructuring': 'any',
      'ignoreReadBeforeAssign': false,
    }],
    // No single if in an 'else' block
    'no-lonely-if': 'error',
    // Force curly braces for control flow, including if blocks with a single statement
    curly: ['error', 'all'],
    // Force dot notation when possible
    'dot-notation': 'error',
    'no-var': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 2,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      {
        ignores: [],
      },
    ],
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        baseIndent: 0,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: [],
      },
    ],
    'vue/no-parsing-error': ['error', {
      'x-invalid-end-tag': false,
    }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
