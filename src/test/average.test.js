import testing from '../utils/jestTestUtils';

describe.skip('Average', () => {
  test('of one value is the value itself', () => {
    expect(testing.average([1])).toBe(1);
  });
  test('of many is calculated correctly', () => {
    expect(testing.average([1, 2, 3, 4, 5, 6])).toBe(3.5);
  });
  test('of empty array is zero', () => {
    expect(testing.average([])).toBe(0);
  });
  test('of undefined array is undefined', () => {
    expect(testing.average()).toBeUndefined();
  });
});
