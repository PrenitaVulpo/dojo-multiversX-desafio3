import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
	plugins: [
		vue(),
		eslintPlugin({
			cache: false, // Disable caching for more consistent linting (useful for debugging)
			include: ['src/**/*.{ts,js,vue}'], // Lint all TypeScript, JavaScript, and Vue files inside the src directory
			lintOnStart: true, // Optional: Lint on initial load
			overrideConfigFile: '.eslintrc.js', // Explicitly specify the ESLint config file if needed
		}),
	],
	resolve: {
		alias: {
			'@': '/src', // Path alias for src directory
		},
	},
});
