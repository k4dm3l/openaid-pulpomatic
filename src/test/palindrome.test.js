import testing from '../utils/jestTestUtils';

describe.skip('Palindrome Tests', () => {
  test('Palindrome of camilo', () => {
    const result = testing.palindrome('camilo');
    expect(result).toBe('olimac');
  });
  test('Palindrome of empty string', () => {
    const result = testing.palindrome('');
    expect(result).toBe('');
  });
  test('Palindrome of undefined', () => {
    const result = testing.palindrome();
    expect(result).toBeUndefined();
  });
});
