module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
		'airbnb-base',
		'plugin:vue/essential', 
		'plugin:vue/strongly-recommended',
		'plugin:vue/recommended',
		'eslint:recommended',
		'@vue/prettier'
	],
	plugins: ['prettier',],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		indent: 'off',
    'linebreak-style': 'off',
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
		'no-param-reassign': ['error', { 'props': false }]
  },
}
