# Mini Mocha

Hello! In this assignment we will try to implement a very basic test runner. Our test runner is going to support a subset of the [mocha](https://mochajs.org/) API. If you are not familiar with it, take some time to go over their documentation.

To get started run the following commands:

```
$ npm install
$ npm test
```

After running `npm test` you should see something similar to this:

```
  ✓ should have correct output for 00-single-passing-test (50ms)
  1) should have correct output for 01-single-failing-test
  2) should have correct output for 02-describe
  3) should have correct output for 03-nested-describe
  4) should have correct output for 04-tests-before-suites
  5) should have correct output for 05-test-and-suites-with-failures
  6) should have correct output for 06-before-each
  7) should have correct output for 07-multiple-before-each
  8) should have correct output for 08-nested-before-each

  1 passing (428ms)
  8 failing

  1) should have correct output for 01-single-failing-test:

      AssertionError [ERR_ASSERTION]: '' == '1) description\n\n  0 passing\n  1 failing\n\n  1) description:\n\n      AssertionError [ERR_ASSERTION]: 0 == 1'
  ...
  ...
  ...
```

The first test is passing thanks to a naive implementation which is already included in this assignment code. Your job is to make the rest of the tests pass. You are only allowed to change files in `src` folder, the `test` folder should remain as it is.

The test code spawns your implementation in a new node process for each different `.spec.js` file from `test/fixtures` directory. Then it compares the output of your implementation to the corresponding `*.expected.txt` file in `test/fixtures`. Also, it writes the output of your implementation to the `*.actual.txt` file in `test/fixtures` so you can easily compare between expected and actual output.

The output that is expected from your implementation is very similar to the example output shown above. Look inside `test/fixtures/*.expected.txt` to see the correct result. The main idea is:

1. Each test suite (`describe`) displays a title and is padded according to its nesting level;
2. Each passing test is listed with `✓`, followed by its description;
3. Each failing test is listed with `X)`, followed by its description, where `X` is actually a reference number to the detailed errors below;
4. Summary includes the number of passing tests. If there were any failures, summary also includes the number of failing tests and list of detailed errors which were referenced above.

Hint: the detailed error is simply `err.toString()` of the exception thrown by the test.

## What's expected of your implementation

1. Pass all of the tests
2. Refactor your code until you are proud of it
3. Installing additional node_modules is allowed (although usually not necessary)
4. It is good to implement any assumptions you have if they make sense, even if there is no appropriate test for it
5. Upload archive of projext folder to dropbox, google drive, or any other similar service
6. **Do not** send email attachments because it might get filtered out by our mail servers
7. **Do not** upload solution to github, bitbucket or any other public repository

## Bonus task

In case you've finished everything early, check out `test/bonus-fixtures` for a bonus task. Simply copy `09-exclusive.spec.js` and `09-exclusive.expected.txt` to `test/fixtures` folder, and run `npm test`. This should add an additional failing test to the output.

Your goal here is to add a capability to define exclusive tests by using `it.only` syntax. It's a tricky task as it also needs to support exclusive tests in various nested suites and of course display the output correctly.

### Good luck!!!
