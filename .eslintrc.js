module.exports = {
    parser: '@typescript-eslint/parser', // TypeScript parser for ESLint
    extends: [
        'eslint:recommended', // General ESLint rules
        'plugin:react/recommended', // React-specific linting rules
        'plugin:react-hooks/recommended', // React hooks linting rules
        'plugin:@typescript-eslint/recommended', // TypeScript rules
        'plugin:react-native/all', // React Native-specific rules
    ],
    plugins: ['react', 'react-hooks', '@typescript-eslint', 'react-native'],
    parserOptions: {
        ecmaVersion: 2020, // Latest ECMAScript features
        sourceType: 'module', // Use ES6+ modules
        ecmaFeatures: {
            jsx: true, // Enable JSX parsing
        },
    },
    settings: {
        react: {
            version: 'detect', // Auto-detect the React version
        },
    },
    env: {
        browser: true, // Support browser global variables
        es2021: true,
        node: true, // Support Node.js global variables (useful for React Native)
        'react-native/react-native': true, // React Native environment
    },
    rules: {
        // ----- REACT BEST PRACTICES -----
        'react/jsx-uses-vars': 'error',
        'react/react-in-jsx-scope': 'off', // Not required in React 17+
        'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }], // Ensure JSX is in .tsx files
        'react/prop-types': 'off', // Disable prop-types for TypeScript
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',

        // ----- GENERAL BEST PRACTICES -----
        yoda: 'error',
        'no-var': 'error',
        'no-empty': 'error',
        'default-case': 'error',
        'prefer-const': 'error',
        'no-extra-semi': 'error',
        'require-await': 'error',
        'no-self-assign': 'error',
        'no-else-return': 'error',
        'no-unreachable': 'error',
        'no-self-compare': 'error',
        'no-empty-pattern': 'error',
        'block-scoped-var': 'error',
        'no-empty-function': 'error',
        'default-case-last': 'error',
        'no-unsafe-negation': 'error',
        'no-unreachable-loop': 'error',
        'no-use-before-define': 'error',
        'no-duplicate-imports': 'error',

        // ----- STYLING BEST PRACTICES -----
        eqeqeq: 'error',
        camelcase: 'error',
        semi: ['error', 'never'],
        quotes: ['error', 'single'],

        // ----- TYPESCRIPT BEST PRACTICES -----
        '@typescript-eslint/explicit-module-boundary-types': 'off', // Disable forcing explicit return types
        '@typescript-eslint/no-explicit-any': 'warn', // Warn about the use of 'any'

        // ----- REACT NATIVE BEST PRACTICES -----
        'react-native/no-unused-styles': 'error', // Detect unused styles in React Native components
        'react-native/split-platform-components': 'warn', // Use platform-specific files (e.g. Button.ios.js)
        'react-native/no-inline-styles': 'warn', // Discourage inline styles in React Native
        'react-native/no-color-literals': 'warn', // Discourage color literals in styles
        'react-native/no-raw-text': 'warn', // Warn if raw text is outside <Text> in React Native
    },
}
