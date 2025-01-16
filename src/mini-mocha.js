const testItems = { itTests: [], describe: [], beforeEach: [] };
let currentDescribe = null;
let passedCount = 0;
let failedTests = [];

global.it = function (description, fn) {
    const test = { description, fn, only: false };
    currentDescribe ? currentDescribe.itTests.push(test) : testItems.itTests.push(test);
};

global.it.only = function (description, fn) {
    const test = { description, fn, only: true };
    currentDescribe ? currentDescribe.itTests.push(test) : testItems.push(test);
};

global.describe = function (suite, fn) {
    const newDescribe = {
        suite,
        fn,
        describe: [],
        itTests: [],
        beforeEach: [],
        only: false,
    };
    const previousDescribe = currentDescribe;

    currentDescribe = newDescribe;
    fn();
    const hasTestsWithOnly = currentDescribe.itTests.some(({ only }) => only);
    currentDescribe = { ...currentDescribe, only: hasTestsWithOnly };
    previousDescribe ? previousDescribe.describe.push(currentDescribe) : testItems.describe.push(currentDescribe);
    currentDescribe = previousDescribe;
};

global.beforeEach = function (fn) {
    currentDescribe ? currentDescribe.beforeEach.push(fn) : testItems.beforeEach.push(fn);
};

require(process.argv[2]);

const log = (text) => console.log(text);

const indent = (level = 0) => "  ".repeat(level + 1);

const runTests = (testItems) => {
    let level = 0;

    const runIt = (it) => {
        try {
            it.fn();
            it.pass = true;
        } catch (err) {
            it.pass = false;
            it.errorMessage = err.toString();
        }
        it.pass ? passedCount++ : failedTests.push({ description: it.description, errorMessage: it.errorMessage });
        log(`${indent(level)}${it.pass ? "✓" : `${failedTests.length})`} ${it.description}`);
    };

    const executeTests = (testBlock, parentBeforeEach = []) => {
        const allBeforeEach = [...parentBeforeEach, ...testBlock.beforeEach];

        testBlock.itTests.forEach((it) => {
            allBeforeEach.forEach((fn) => fn());
            runIt(it);
        });

        testBlock.describe.forEach((describe) => {
            log(`${indent(level)}${describe.suite}`);
            level++;
            executeTests(describe, allBeforeEach);
            level--;
        });
    };

    executeTests(testItems);
};

const printResults = (failedTests, passedCount) => {
    log(`\n${indent()}${passedCount} passing`);

    if (failedTests.length > 0) {
        log(`${indent()}${failedTests.length} failing\n`);
        failedTests.forEach((item, index) => {
            log(`${indent()}${`${index + 1})`} ${item.description}:\n`);
            log(`${indent(2)}${item.errorMessage}\n`);
        });
    }
};
// log(JSON.stringify(testItems, null, 2));
runTests(testItems);
printResults(failedTests, passedCount);
