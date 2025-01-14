let passCount = 0;
let failCount = 0;
let level = 0;

const indent = () => "  ".repeat(level + 1);

global.it = function (description, fn) {
    let errorMessage = "";

    const logDescription = (symbol, { comma } = {}) => {
        console.log(`${indent()}${symbol} ${description}${comma ? ":" : ""}\n`);
    };

    try {
        fn();
        logDescription("✓");
        passCount++;
    } catch (err) {
        errorMessage = err.toString();
        failCount++;
        logDescription(`${failCount})`);
    } finally {
        console.log(`  ${passCount} passing`);
        if (failCount > 0) {
            console.log(`${indent()}${failCount} failing\n`);
            logDescription(`${failCount})`, { comma: true });
            console.log(`${indent().repeat(3)}${errorMessage}`);
        }
    }

    return { passCount, failCount };
};

global.describe = function (suite, fn) {
    console.log(`${indent()}${suite}`);
    level++;
    fn();
    level--;
};

require(process.argv[2]);
