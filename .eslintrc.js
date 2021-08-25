module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "indent": [
      "error",
      4
    ],
    "linebreak-style": [
        "error",
        "windows"
    ],
    "quotes": [
        "error",
        "double"
    ],
    "semi": [
        "error",
        "always"
    ],
    "no-console": [
        "off"
    ],
    "brace-style": [
      "error",
      "1tbs"
  ]
  }
}
