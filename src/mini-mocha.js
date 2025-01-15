let level = 0;
const tests = [];

const indent = (level = 0) => "  ".repeat(level + 1);

const log = (text) => console.log(text);

const logDescription = ({ item, end } = { item }) => {
    if (item.type === "it") {
        log(`${indent(item.level)}${item.pass ? "✓" : `${item.failedCount})`} ${item.description}${end ? end : ""}`);
    } else if (item.type === "describe") {
        log(`${indent(item.level)}${item.suite}`);
    }
};

const logError = (item) => {
    log(`${indent()}${`${item.failedCount})`} ${item.description}:\n`);
    log(`${indent(2)}${item.errorMessage}\n`);
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

    let failedCount = 0;
    sortedTests.forEach((item, index) => {
        if (item.type === "it" && !item.pass) {
            failedCount++;
            item.failedCount = failedCount;
        }
    });

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
        logDescription({ item });
    } else if (item.type === "describe") {
        logDescription({ item });
    }
});

log(`\n${indent(level)}${passedCount} passing`);

if (failedCount > 0) {
    log(`${indent(level)}${failedCount} failing\n`);
    tests.forEach((item) => {
        if (item.type === "it" && !item.pass) {
            logError(item);
        }
    });
}
