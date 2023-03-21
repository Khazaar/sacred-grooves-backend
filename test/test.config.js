module.exports = {
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: "../",
    testEnvironment: "node",
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest",
    },
    testSequencer: "./test/custom-sequencer.js",
};
