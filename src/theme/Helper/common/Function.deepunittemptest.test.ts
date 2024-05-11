/* eslint-disable quotes */
// Importing necessary libraries and modules
import { jest } from '@jest/globals';

import * as FunctionModule from './Function';

// Setting up mock resets before and after each test
beforeEach(() => {
  jest.resetAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

// Test suite
describe('Function Module', () => {
  it('should create', () => {
    expect(FunctionModule).toBeDefined();
  });
  test("The input array contains three objects, each with a 'name' property. The function is asked to filter these objects based on the 'name' key. Since the first and the third objects have their 'name' property set to an empty string, these two objects are included in the output array, while the second object is excluded because its 'name' value is not an empty string. -- written by DeepUnit.Ai", () => {
    const inputArray = [
      { name: '', age: 22 },
      { name: 'John', age: 30 },
      { name: '', age: 28 },
    ];
    const key = 'name';
    const expectedResult = [
      { name: '', age: 22 },
      { name: '', age: 28 },
    ];
    const result = FunctionModule.filterObjectsWithBlankValue(inputArray, key);
    expect(result).toEqual(expectedResult);
  });
  test("Here, the input array contains objects with different properties, and the function is asked to filter based on the 'status' key. Since only the second object has the 'status' property set to an empty string, only this object is returned in the output array. The first object is excluded because its 'status' value is 'active', and the third object is excluded because it does not have a 'status' property. -- written by DeepUnit.Ai", () => {
    const inputArray = [
      { name: 'Alice', status: 'active' },
      { name: 'Bob', status: '' },
      { name: 'Charlie' },
    ];
    const expectedOutput = [{ name: 'Bob', status: '' }];
    const result = FunctionModule.filterObjectsWithBlankValue(
      inputArray,
      'status',
    );
    expect(result).toEqual(expectedOutput);
  });
  test('filterObjectsWithBlankValue should return an empty array when no objects have the specified key with an empty string value -- written by DeepUnit.Ai', () => {
    const inputArray = [
      { name: 'Diana', email: 'diana@example.com' },
      { name: 'Emily' },
    ];
    const result = FunctionModule.filterObjectsWithBlankValue(
      inputArray,
      'email',
    );
    expect(result).toEqual([]);
  });
  test('The input is an empty array, so there are no objects to filter, meaning the output should also be an empty array. -- written by DeepUnit.Ai', () => {
    const result = FunctionModule.filterObjectsWithBlankValue([], 'name');
    expect(result).toEqual([]);
  });
  test('The input array contains objects where the specified key is present in all objects but none have an empty string value for that key, thus no objects are filtered into the output array. -- written by DeepUnit.Ai', () => {
    const inputArray = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
    ];
    const key = 'name';
    const expectedOutput = [];
    const actualOutput = FunctionModule.filterObjectsWithBlankValue(
      inputArray,
      key,
    );
    expect(actualOutput).toEqual(expectedOutput);
  });
  test("The input array contains objects with varying keys, and the function is asked to filter based on a key ('missingKey') that does not exist in any of the objects. This results in an output array that is empty, as none of the objects have the 'missingKey' property. -- written by DeepUnit.Ai", () => {
    const inputArray = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
    ];
    const result = FunctionModule.filterObjectsWithBlankValue(
      inputArray,
      'missingKey',
    );
    expect(result).toEqual([]);
  });
  test('The input array has multiple objects with the same key set to an empty string, demonstrating that the function can handle multiple matches and return all matching objects. -- written by DeepUnit.Ai', () => {
    const inputArray = [
      { status: '', department: 'HR' },
      { status: '', department: 'IT' },
      { status: 'active', department: 'Finance' },
    ];
    const expectedResult = [
      { status: '', department: 'HR' },
      { status: '', department: 'IT' },
    ];
    const result = FunctionModule.filterObjectsWithBlankValue(
      inputArray,
      'status',
    );
    expect(result).toEqual(expectedResult);
  });
  test('The input string "567" does not contain any commas and represents the numeric value 567 as is. Direct parsing as a float returns the numeric value 567. -- written by DeepUnit.Ai', () => {
    const output = FunctionModule.parseTokenBalance('567');
    expect(output).toBe(567);
  });
  test('The input string "1,234" represents the numeric value 1234 with a comma as a thousand separator. Removing the comma and parsing the resulting string as a float returns the numeric value 1234. -- written by DeepUnit.Ai', () => {
    const result = FunctionModule.parseTokenBalance('1,234');
    expect(result).toBe(1234);
  });
  test('The input string "89,012,345" includes multiple commas, indicating thousand separators in a large number. Removing all commas and parsing the string as a float returns the numeric value 89012345. -- written by DeepUnit.Ai', () => {
    const result = FunctionModule.parseTokenBalance('89,012,345');
    expect(result).toEqual(89012345);
  });
  test('The input string "1,234.56" represents a numeric value with both a thousand separator and a decimal point. After removing the comma, parsing the string as a float retains the decimal part, returning the numeric value 1234.56. -- written by DeepUnit.Ai', () => {
    const result = FunctionModule.parseTokenBalance('1,234.56');
    expect(result).toBe(1234.56);
  });
  test('The input string "" (an empty string) represents the absence of a balance. Parsing it as a float returns NaN because an empty string cannot be converted to a numeric value. -- written by DeepUnit.Ai', () => {
    const result = FunctionModule.parseTokenBalance('');
    expect(result).toBeNaN();
  });
  test('The input string "0" represents the numeric value 0. Direct parsing as a float returns the numeric value 0. -- written by DeepUnit.Ai', () => {
    const result = FunctionModule.parseTokenBalance('0');
    expect(result).toBe(0);
  });
  test('The input string "-1,234" represents a negative numeric value with a comma as a thousand separator. Removing the comma and parsing the resulting string as a float returns the numeric value -1234. -- written by DeepUnit.Ai', () => {
    const result = FunctionModule.parseTokenBalance('-1,234');
    expect(result).toBe(-1234);
  });
  test('The input string "2,000.55" represents a numeric value with both a thousand separator and a decimal point. Removing the comma and parsing the resulting string as a float returns the numeric value 2000.55. -- written by DeepUnit.Ai', () => {
    const result = FunctionModule.parseTokenBalance('2,000.55');
    expect(result).toBe(2000.55);
  });
  test('The input string "007" represents the numeric value 7 with leading zeros. Direct parsing as a float removes the leading zeros, returning the numeric value 7. -- written by DeepUnit.Ai', () => {
    const result = FunctionModule.parseTokenBalance('007');
    expect(result).toBe(7);
  });
  test('The input string "1,234,567.89" represents a large numeric value with commas as thousand separators and a decimal point. Removing the commas and parsing the resulting string as a float returns the numeric value 1234567.89. -- written by DeepUnit.Ai', () => {
    const result = FunctionModule.parseTokenBalance('1,234,567.89');
    expect(result).toBe(1234567.89);
  });
  test('The input is undefined, and no decimal precision is specified, so the default of 5 is used. Since the input is undefined, it is treated as 0. The function then proceeds with the calculation as normal, but since the value is 0, the output remains 0 at 5 decimal places. -- written by DeepUnit.Ai', () => {
    expect(FunctionModule.getRoundDecimalValue()).toEqual(0);
  });
  test('The input is a positive floating-point number and the default decimal precision is used (5). The function converts the input to a floating-point number, calculates the power of 10 to the 5th (100000), multiplies the input value by this number, adds Number.EPSILON to address floating-point precision, rounds the result to the nearest integer, and then divides by 100000 to get the rounded value at 5 decimal places. -- written by DeepUnit.Ai', () => {
    const result = FunctionModule.getRoundDecimalValue(3.141592653589793);
    expect(result).toBe(3.141593);
  });
  test('The input is a negative floating-point number with a specified decimal precision of 2. The function converts the input to a floating-point number, calculates the power of 10 to the 2nd (100), multiplies the input value by this number, adds Number.EPSILON to address floating-point precision, rounds the result to the nearest integer, and then divides by 100 to get the rounded value at 2 decimal places. -- written by DeepUnit.Ai', () => {
    const result = FunctionModule.getRoundDecimalValue(-2.718285, 2);
    expect(result).toBe(-2.72);
  });
  test('The input is a string representation of a number, and a decimal precision of 3 is specified. The function first converts the string to a floating-point number, then follows the same steps as before to round the value to 3 decimal places. -- written by DeepUnit.Ai', () => {
    const result = FunctionModule.getRoundDecimalValue('123.456789', 3);
    expect(result).toBe(123.457);
  });
  test('The input is a non-numeric string, with a decimal precision of 2 specified. When attempting to convert the non-numeric string to a floating-point number, parseFloat returns NaN. However, since NaN is falsy, the coalescing operation (??) assigns 0 to tempValue. The function then rounds 0 to the specified precision, resulting in 0. -- written by DeepUnit.Ai', () => {
    const result = FunctionModule.getRoundDecimalValue('notANumber', 2);
    expect(result).toBe(NaN);
  });
});
