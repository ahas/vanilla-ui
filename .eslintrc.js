module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        commonjs: true,
    },
    extends: ["eslint:recommended", "plugin:vue/essential"],
    parserOptions: {
        parser: "babel-eslint",
        ecmaVersion: 2020,
        sourceType: "module",
    },
    plugins: ["vue"],
    rules: {
        "no-prototype-builtins": "off",
        "no-return-assign": "off",
    },
};
