import { jest } from '@jest/globals';

import {
  getItemByIdFromSectionArray,
  shuffleArray,
  containsObject,
  getArrayIndexByItemId,
  findChangedIds,
} from './index';

// Start of the describe block
describe('getItemByIdFromSectionArray', function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // Test to check if the function correctly finds and returns the items from the array
  it('should return items from array matching the given Id', () => {
    // We are testing the function to ensure that it correctly finds items in the array
    // that match the given IDs and returns them in an array, or null if no items are found.
    const array = [
      {
        data: [
          { id: '1', value: 'Item 1' },
          { id: '2', value: 'Item 2' },
        ],
      },
      {
        data: [
          { id: '3', value: 'Item 3' },
          { id: '4', value: 'Item 4' },
        ],
      },
    ];
    const selectedItemId = ['1', '3'];
    const result = getItemByIdFromSectionArray(array, selectedItemId);
    // We expect the result to be an array with items having id '1' and '3'
    expect(result).toEqual([
      { id: '1', value: 'Item 1' },
      { id: '3', value: 'Item 3' },
    ]);
  });
  // Test to check if the function returns null when no items match the given Id
  it('should return null if no matching items are found', () => {
    const array = [
      {
        data: [
          { id: '1', value: 'Item 1' },
          { id: '2', value: 'Item 2' },
        ],
      },
      {
        data: [
          { id: '3', value: 'Item 3' },
          { id: '4', value: 'Item 4' },
        ],
      },
    ];
    const selectedItemId = ['5'];
    const result = getItemByIdFromSectionArray(array, selectedItemId);
    // We expect the result to be null since there are no items in the array with id '5'
    expect(result).toBeNull();
  });
});

describe('ArrayUtils', function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('shuffleArray', () => {
    it('should return a shuffled array', () => {
      // Random function mock
      const mathRandomSpy = jest
        .spyOn(global.Math, 'random')
        .mockReturnValue(0.5);
      const array = ['a', 'b', 'c', 'd', 'e'];
      const shuffledArray = shuffleArray(array);
      // We test that the shuffleArray function does not return the same array
      // Since this function is based on randomness, it's not possible to predict the exact output
      // But we can at least check that the output is different from the input
      // In a real scenario, we should run this test multiple times to increase the confidence
      expect(shuffledArray).not.toEqual(array);
      // We also check that the shuffled array contains all the elements from the original array
      // This is done by sorting both arrays and checking that they are equal
      expect(shuffledArray.sort()).toEqual(array.sort());
      // Finally, we check that the random function has been called the correct number of times
      // In this case, it should be called once for every element in the array except for the first one
      expect(mathRandomSpy).toHaveBeenCalledTimes(array.length - 1);
    });
  });
});

describe('ArrayUtils1', function () {
  // Resetting all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restoring all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('containsObject', () => {
    // We want to test if the function correctly identifies if an object is present within an array of objects
    // This is important to validate the functionality of the 'containsObject' helper function
    it('should return true if the object is present in the list', () => {
      const list = [{ key: 'object1' }, { key: 'object2' }, { key: 'object3' }];
      const objectToFind = 'object2';
      const keyName = 'key';
      const result = containsObject(objectToFind, list, keyName);
      // If 'containsObject' works as expected, it should return true
      expect(result).toBe(true);
    });
    // We want to test if the function correctly identifies if an object is not present within an array of objects
    it('should return false if the object is not present in the list', () => {
      const list = [{ key: 'object1' }, { key: 'object2' }, { key: 'object3' }];
      const objectToFind = 'object4';
      const keyName = 'key';
      const result = containsObject(objectToFind, list, keyName);
      // If 'containsObject' works as expected, it should return false
      expect(result).toBe(false);
    });
  });
});

// We are going to test the `getArrayIndexByItemId` function
describe('getArrayIndexByItemId', function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // Test if the function correctly finds an item in an array and returns its index
  it('should return the correct index of an item if it exists in the array', () => {
    // Create a mock array
    const list = [{ id: '1' }, { id: '2' }, { id: '3' }];
    // Call the function with 'id' as the keyName and '2' as the compareValue
    const index = getArrayIndexByItemId(list, 'id', '2');
    // We expect the function to return 1 as the item with id '2' is at index 1
    expect(index).toEqual(1);
  });
  // Test if the function returns -1 when the item is not in the array
  it('should return -1 if the item does not exist in the array', () => {
    // Create a mock array
    const list = [{ id: '1' }, { id: '2' }, { id: '3' }];
    // Call the function with 'id' as the keyName and '4' as the compareValue
    const index = getArrayIndexByItemId(list, 'id', '4');
    // We expect the function to return -1 as there is no item with id '4'
    expect(index).toEqual(-1);
  });
});

// Describing the test suite
describe('Testing findChangedIds function', function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // First test case: when there are both removed and added ids
  it('should correctly identify removed and added ids', () => {
    // We are testing findChangedIds function to make sure it correctly identifies the removed and added ids
    const oldIds = ['1', '2', '3'];
    const newIds = ['3', '4'];
    const { removedIds, addedIds } = findChangedIds(oldIds, newIds);
    expect(removedIds).toEqual(['1', '2']); // '1' and '2' should be removed as they are not present in newIds
    expect(addedIds).toEqual(['4']); // '4' should be added as it is not present in oldIds
  });
  // Second test case: when there are no removed or added ids
  it('should return empty arrays when there are no changes', () => {
    // We are testing findChangedIds function to make sure it correctly handles the case where there is no change
    const oldIds = ['1', '2', '3'];
    const newIds = ['1', '2', '3'];
    const { removedIds, addedIds } = findChangedIds(oldIds, newIds);
    expect(removedIds).toEqual([]); // No ids are removed, so should return an empty array
    expect(addedIds).toEqual([]); // No ids are added, so should return an empty array
  });
});
