let beforeEachCallbacks = [];
let level = 0;
const tests = [];

const indent = (level = 0) => "  ".repeat(level + 1);

const log = (text) => console.log(text);

const logDescription = ({ item }) => {
    if (item.type === "it") {
        log(`${indent(item.level)}${item.pass ? "✓" : `${item.failedCount})`} ${item.description}`);
    } else if (item.type === "describe") {
        log(`${indent(item.level)}${item.suite}`);
    }
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

    sortedTests.forEach((item) => {
        if (item.type === "it" && !item.pass) {
            failedCount++;
            item.failedCount = failedCount;
        }
    });

    return { sortedTests, passedCount, failedCount };
};

const logError = (item) => {
    log(`${indent()}${`${item.failedCount})`} ${item.description}:\n`);
    log(`${indent(2)}${item.errorMessage}\n`);
};

const logStats = () => {
    const { sortedTests, passedCount, failedCount } = getTestsStats(tests);
    log(`\n${indent(level)}${passedCount} passing`);

    if (failedCount > 0) {
        log(`${indent(level)}${failedCount} failing\n`);
        sortedTests.forEach((item) => {
            if (item.type === "it" && !item.pass) {
                logError(item);
            }
        });
    }
};

const runIt = (test) => {
    try {
        test.fn();
        test.pass = true;
    } catch (err) {
        test.pass = false;
        test.errorMessage = err.toString();
    }
};

global.it = function (description, fn) {
    tests.push({ type: "it", description, fn, level });
};

global.describe = function (suite, fn) {
    tests.push({ type: "describe", suite, fn, level });
    level++;
    fn();
    level--;
};

global.beforeEach = function (fn) {
    beforeEachCallbacks.push(fn);
};

require(process.argv[2]);

tests.forEach((test) => {
    if (test.type === "it") {
        beforeEachCallbacks.forEach((fn) => fn());
        runIt(test);
    }
});

getTestsStats(tests).sortedTests.forEach((item) => logDescription({ item }));
logStats();
