import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

export default [
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        ignores: ["dist/**", "node_modules/**"],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs["flat/recommended"],
    {
        files: ["*.vue", "**/*.vue"],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
    },
    {
        rules: {
            semi: ["error", "always"],
        },
    },
    eslintPluginPrettier, // must be LAST
];
