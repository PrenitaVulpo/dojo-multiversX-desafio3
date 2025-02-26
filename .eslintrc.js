module.exports = {
	env: {
		browser: true,
		node: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/vue3-recommended', // For Vue 3 linting rules
		'plugin:prettier/recommended', // Integrate Prettier with ESLint
		'plugin:@typescript-eslint/recommended', // TypeScript linting rules
	],
	parser: '@typescript-eslint/parser', // Parse TypeScript
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	plugins: ['vue', 'prettier', '@typescript-eslint'],
	rules: {
		'prettier/prettier': ['error'], // Enforce Prettier formatting
		'@typescript-eslint/explicit-module-boundary-types': 'off', // Optional: Remove explicit return types rule for TS functions
		'vue/multi-word-component-names': 'off', // You can disable this rule for single-word component names
	},
};
