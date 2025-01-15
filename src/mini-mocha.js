let level = 0;
const tests = [];

const indent = (level) => "  ".repeat(level + 1);

const log = (text) => console.log(text);

const logDescription = ({ item, index, end } = { item }) => {
    if (item.type === "it") {
        log(`${indent(item.level)}${item.pass ? "✓" : `${index + 1})`} ${item.description}${end ? end : ""}`);
    } else if (item.type === "describe") {
        log(`${indent(item.level)}${item.suite}`);
    }
};

const logError = (item) => {
    log(`\n${indent(item.level).repeat(3)}${item.errorMessage}`);
};

const getTestsStats = (tests) => {
    const sortByLevelAndType = (a, b) => {
        if (a.level !== b.level) return a.level - b.level;
        if (a.type === "it" && b.type === "describe") return -1;
        if (a.type === "describe" && b.type === "it") return 1;
        return 0;
    };

    const sortedTests = tests.sort(sortByLevelAndType);
    const passedCount = tests.filter((item) => item.type === "it" && item.pass).length;
    const failedCount = tests.filter((item) => item.type === "it" && !item.pass).length;

    return { sortedTests, passedCount, failedCount };
};

global.it = function (description, fn) {
    try {
        fn();
        tests.push({ type: "it", description, fn, level, pass: true });
    } catch (err) {
        tests.push({ type: "it", description, fn, level, pass: false, errorMessage: err.toString() });
    }
};

global.describe = function (suite, fn) {
    tests.push({ type: "describe", suite, fn, level });
    level++;
    fn();
    level--;
};

require(process.argv[2]);

const { sortedTests, passedCount, failedCount } = getTestsStats(tests);

sortedTests.forEach((item, index) => {
    if (item.type === "it") {
        logDescription({ item, index });
    } else if (item.type === "describe") {
        logDescription({ item });
    }
});

log(`\n${indent(level)}${passedCount} passing`);

if (failedCount > 0) {
    log(`${indent(level)}${failedCount} failing\n`);
    tests.forEach((item, index) => {
        if (item.type === "it" && !item.pass) {
            logDescription({ item, index, end: ":" });
            logError(item);
        }
    });
}
