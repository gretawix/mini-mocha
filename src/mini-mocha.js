let testItems = { itTests: [], describe: [], beforeEach: [] };
let currentDescribe = null;
let passedCount = 0;
let failedTests = [];

// global functions
global.it = function (description, fn) {
    const test = { description, fn, only: false };
    currentDescribe ? currentDescribe.itTests.push(test) : testItems.itTests.push(test);
};

global.it.only = function (description, fn) {
    const test = { description, fn, only: true };
    currentDescribe ? currentDescribe.itTests.push(test) : testItems.itTests.push(test);
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
    previousDescribe ? previousDescribe.describe.push(currentDescribe) : testItems.describe.push(currentDescribe);
    currentDescribe = previousDescribe;
};

global.beforeEach = function (fn) {
    currentDescribe ? currentDescribe.beforeEach.push(fn) : testItems.beforeEach.push(fn);
};

require(process.argv[2]);

//local functions
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
        it.pass ? passedCount++ : failedTests.push(it);
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

const filterOnlyTests = (testBlock) => {
    const itTests = testBlock.itTests.filter(({ only }) => only);
    const describe = testBlock.describe
        .map((item) => filterOnlyTests(item))
        .filter((item) => item.itTests.length > 0 || item.describe.length > 0);

    return { ...testBlock, itTests, describe };
};

const printResults = (failedTests, passedCount) => {
    log(`\n${indent()}${passedCount} passing`);

    if (failedTests.length > 0) {
        log(`${indent()}${failedTests.length} failing\n`);
        failedTests.forEach(({ description, errorMessage }, index) => {
            log(`${indent()}${`${index + 1})`} ${description}:\n`);
            log(`${indent(2)}${errorMessage}\n`);
        });
    }
};

// test execution
const filteredOnlyTests = filterOnlyTests(testItems);
if (filteredOnlyTests.itTests.length || filteredOnlyTests.describe.length) {
    testItems = filteredOnlyTests;
}

runTests(testItems);
printResults(failedTests, passedCount);
