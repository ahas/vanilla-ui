module.exports = {
    verbose: false,
    testEnvironment: "jest-environment-jsdom-fourteen",
    roots: ["<rootDir>/src"],
    setupFilesAfterEnv: ["<rootDir>/test/index.ts"],
    moduleFileExtensions: ["js"],
    moduleDirectories: ["node_modules"],
    transform: {
        "\\.(styl)$": "jest-css-modules",
        "\\.(sass|scss)$": "jest-css-modules",
        ".*\\.(j|t)s$": "babel-jest",
    },
    collectCoverageFrom: ["src/**/*.{js,ts,tsx}", "!**/*.d.ts"],
    testMatch: [
        // Default
        "**/test/**/*.js",
        "**/__tests__/**/*.spec.js",
        "**/__tests__/**/*.spec.ts",
    ],
};
