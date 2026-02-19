import typescriptEslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default [
    {
        ignores: ['out/**', 'dist/**', '*.config.*'],
    },
    {
        files: ['**/*.ts'],
    },
    {
        plugins: {
            '@typescript-eslint': typescriptEslint.plugin,
            prettier: eslintPluginPrettier,
        },

        languageOptions: {
            parser: typescriptEslint.parser,
            ecmaVersion: 2022,
            sourceType: 'module',
        },

        rules: {
            '@typescript-eslint/naming-convention': [
                'warn',
                {
                    selector: 'import',
                    format: ['camelCase', 'PascalCase'],
                },
            ],

            curly: 'warn',
            eqeqeq: 'warn',
            'no-throw-literal': 'warn',
            'prettier/prettier': 'error',
        },
    },
    eslintConfigPrettier,
]
