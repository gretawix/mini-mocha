const assert = require('assert');

describe('suite', () => {
  let counter = 0;
  beforeEach(() => counter++);
  it('a', () => assert.equal(counter, 2));
  it('b', () => assert.equal(counter, 4));
  it('c', () => assert.equal(counter, 6));
  describe('sub-suite', () => {
    beforeEach(() => {
      counter++;
    });
    it('a', () => assert.equal(counter, 9));
    it('b', () => assert.equal(counter, 12));
    it('c', () => assert.equal(counter, 15));
  });
  describe('sub-suite 2', () => {
    let counter2;
    beforeEach(() => {
      counter2 = counter;
    });
    it('a', () => assert.equal(counter2, 17));
    it('b', () => assert.equal(counter2, 19));
    it('c', () => assert.equal(counter2, 21));
  });
  beforeEach(() => counter++);
});
