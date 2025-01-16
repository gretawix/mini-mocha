const testItems = [];
let currentDescribe = null;
let passedCount = 0;
let failedTests = [];

global.it = function (description, fn) {
    currentDescribe ? currentDescribe.itTests.push({ description, fn }) : testItems.push({ description, fn });
};

global.describe = function (suite, fn) {
    const newDescribe = {
        suite,
        fn,
        describe: [],
        itTests: [],
        beforeEach: [],
    };
    const previousDescribe = currentDescribe;

    currentDescribe = newDescribe;
    fn();
    previousDescribe ? previousDescribe.describe.push(newDescribe) : testItems.push(newDescribe);
    currentDescribe = previousDescribe;
};

global.beforeEach = function (fn) {
    currentDescribe ? currentDescribe.beforeEach.push(fn) : testItems.push(fn);
};

require(process.argv[2]);

const log = (text) => console.log(text);

const indent = (level = 0) => "  ".repeat(level + 1);

const runTests = (testItems) => {
    const runIt = (it) => {
        try {
            it.fn();
            it.pass = true;
        } catch (err) {
            it.pass = false;
            it.errorMessage = err.toString();
        }
    };

    const executeTests = (describeBlock, parentBeforeEach = []) => {
        const allBeforeEach = [...parentBeforeEach, ...describeBlock.beforeEach];

        describeBlock.itTests.forEach((it) => {
            allBeforeEach.forEach((fn) => fn());
            runIt(it);
        });
        describeBlock.describe.forEach((describe) => executeTests(describe, allBeforeEach));
    };

    testItems.forEach((item) => {
        if (item.describe) {
            executeTests(item);
        } else if (item.description) {
            runIt(item);
        }
    });
};

const printLog = (testItems, level = 0) => {
    const logItDescription = (item, level) => {
        item.pass
            ? passedCount++
            : failedTests.push({ description: item.description, errorMessage: item.errorMessage });
        log(`${indent(level)}${item.pass ? "✓" : `${failedTests.length})`} ${item.description}`);
    };

    testItems.forEach((item) => {
        if (!item.describe) {
            logItDescription(item, level);
        }
    });

    testItems.forEach((item) => {
        if (item.describe) {
            log(`${indent(level)}${item.suite}`);
            level++;
            item.itTests.forEach((test) => logItDescription(test, level));
            printLog(item.describe, level);
            level--;
        }
    });
};

const printResults = (failedTests, passedCount) => {
    const logError = (item, index) => {
        log(`${indent()}${`${index + 1})`} ${item.description}:\n`);
        log(`${indent(2)}${item.errorMessage}\n`);
    };

    log(`\n${indent()}${passedCount} passing`);

    if (failedTests.length > 0) {
        log(`${indent()}${failedTests.length} failing\n`);
        failedTests.forEach((item, index) => {
            logError(item, index);
        });
    }
};

runTests(testItems);
printLog(testItems);
printResults(failedTests, passedCount);
