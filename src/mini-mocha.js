let level = 0;
const itResults = [];

const indent = () => "  ".repeat(level + 1);

const log = (text) => console.log(text);

const logDescription = (symbol, description, { end } = {}) => {
    log(`${indent()}${symbol} ${description}${end ? end : ""}`);
};

const runIt = (test) => {
    test.level = level;

    try {
        test.fn();
        logDescription("✓", test.description);
        test.pass = true;
    } catch (err) {
        logDescription(`${level + 1})`, test.description);
        test.pass = false;
        test.errorMessage = err.toString();
    }
};

const runDescribe = (test) => {
    console.log(`${indent()}${test.suite}`);
    level++;
    test.fn();
    level--;
};

global.it = function (description, fn) {
    try {
        fn();
        logDescription("✓", description);
        itResults.push({ type: "it", description, fn, level, pass: true });
    } catch (err) {
        logDescription(`${level + 1})`, description);
        itResults.push({ type: "it", description, fn, level, pass: false, errorMessage: err.toString() });
    }
};

global.describe = function (suite, fn) {
    console.log(`${indent()}${suite}`);
    itResults.push({ type: "describe", suite, fn, level });
    level++;
    fn();
    level--;
};

require(process.argv[2]);

const sortByLevelAndType = (a, b) => {
    if (a.level !== b.level) return a.level - b.level; // Sort by level first
    if (a.type === "it" && b.type === "describe") return -1; // `it` before `describe`
    if (a.type === "describe" && b.type === "it") return 1; // `describe` after `it`
    return 0;
};

const sortedTests = itResults.sort(sortByLevelAndType);
const passed = sortedTests.filter((item) => item.type === "it" && item.pass);
const failed = sortedTests.filter((item) => item.type === "it" && !item.pass);

log(`\n${indent()}${passed.length} passing`);

if (failed.length > 0) {
    log(`${indent()}${failed.length} failing\n`);
    itResults.forEach((item, index) => {
        if (!item.pass) {
            logDescription(`${index + 1})`, item.description, { end: ":" });
            log(`\n${indent().repeat(3)}${item.errorMessage}`);
        }
    });
}
