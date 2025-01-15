let passCount = 0;
let failCount = 0;
let level = 0;

const itResults = [];

const indent = () => "  ".repeat(level + 1);

const log = (text) => console.log(text);

const logDescription = (symbol, description, { end } = {}) => {
    log(`${indent()}${symbol} ${description}${end ? end : ""}`);
};

global.it = function (description, fn) {
    try {
        fn();
        logDescription("✓", description);
        passCount++;
        itResults.push({ description, pass: true });
    } catch (err) {
        failCount++;
        logDescription(`${failCount})`, description);
        itResults.push({ description, pass: false, errorMessage: err.toString() });
    }
};

global.describe = function (suite, fn) {
    console.log(`${indent()}${suite}`);
    level++;
    fn();
    level--;
};

require(process.argv[2]);

log(`\n${indent()}${passCount} passing`);
if (failCount > 0) {
    log(`${indent()}${failCount} failing\n`);
    itResults.forEach((item, index) => {
        if (!item.pass) {
            logDescription(`${index + 1})`, item.description, { end: ":" });
            log(`\n${indent().repeat(3)}${item.errorMessage}`);
        }
    });
}
