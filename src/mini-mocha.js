const testItems = [];
let currentDescribe = null;

const log = (text) => console.log(text);

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

runTests(testItems);

log(JSON.stringify(testItems, null, 2));
