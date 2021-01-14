module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    // "plugin:vue/vue3-recommended",  // if use this rule set, turn "vetur.format.defaultFormatter.html" to "none" in settings.json
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/comment-directive':'off',  //get rid of the linting error at the very last line of index.html
    // "vue/no-unused-components": "off"
  }
}
