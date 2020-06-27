module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:vue/recommended',
  ],
  globals: {
    cloudinary: 'readonly',
  },
  // required to lint *.vue files
  plugins: ['vue', 'vuetify'],
  // add your custom rules here
  rules: {
    semi: [2, 'always'],
    'no-console': 'off',
    'arrow-parens': ['error', 'as-needed'],
    camelcase: 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'no-return-await': 'warn',
    'no-template-curly-in-string': 'warn',
    'no-undef': 'error',
    'no-unreachable': 'error',
    'newline-after-var': ['error', 'always'],
    'import/newline-after-import': 'error',
    'space-infix-ops': 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'always',
        asyncArrow: 'always',
      },
    ],

    'vue/max-attributes-per-line': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-v-html': 'off',
    'vue/prop-name-casing': 'error',
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/attributes-order': ['error', {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        'UNIQUE',
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'OTHER_ATTR',
        'EVENTS',
        'CONTENT',
      ],
      alphabetical: true,
    }],
    'vue/padding-line-between-blocks': ['error', 'always'],

    'vuetify/no-deprecated-classes': 'error',
  },
}
;
