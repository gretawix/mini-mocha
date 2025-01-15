let level = 0;

const testItems = [];

const indent = (level = 0) => "  ".repeat(level + 1);

const log = (text) => console.log(text);

const logDescription = (item) => {
    if (item.type === "it") {
        log(`${indent(item.level)}${item.pass ? "✓" : `${item.failedCount})`} ${item.description}`);
    } else if (item.type === "describe") {
        log(`${indent(item.level)}${item.suite}`);
    }
};

const sortTests = () => {
    const sortByLevelAndType = (a, b) => {
        if (a.level !== b.level) return a.level - b.level;
        const order = ["beforeEach", "it", "describe"];

        return order.indexOf(a.type) - order.indexOf(b.type);
    };

    let failedCount = 0;
    testItems.sort(sortByLevelAndType);
    testItems.forEach((item) => {
        if (item.type === "it" && !item.pass) {
            failedCount++;
            item.failedCount = failedCount;
        }
    });
};

const getTestsStats = () => {
    const passedCount = testItems.filter(({ type, pass }) => type === "it" && pass).length;
    const failedCount = testItems.filter(({ type, pass }) => type === "it" && !pass).length;

    return { passedCount, failedCount };
};

const logError = (item) => {
    log(`${indent()}${`${item.failedCount})`} ${item.description}:\n`);
    log(`${indent(2)}${item.errorMessage}\n`);
};

const logStats = () => {
    const { passedCount, failedCount } = getTestsStats();
    log(`\n${indent(level)}${passedCount} passing`);

    if (failedCount > 0) {
        log(`${indent(level)}${failedCount} failing\n`);
        testItems.forEach((item) => {
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

const runBeforeEach = (currentItTest) => {
    testItems
        .filter(({ type }) => type === "beforeEach")
        .forEach(({ fn, level }) => {
            if (currentItTest.level >= level) {
                fn();
            }
        });
};

global.it = function (description, fn) {
    testItems.push({ type: "it", description, fn, level });
};

global.describe = function (suite, fn) {
    testItems.push({ type: "describe", suite, fn, level });
    level++;
    fn();
    level--;
};

global.beforeEach = function (fn) {
    testItems.push({ type: "beforeEach", fn, level });
};

require(process.argv[2]);

testItems.forEach((test) => {
    if (test.type === "it") {
        runBeforeEach(test);
        runIt(test);
    }
});

sortTests();
testItems.forEach((item) => logDescription(item));
logStats();
