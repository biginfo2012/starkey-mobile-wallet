// This function searches for items in a section array based on their IDs and returns the matched items.
// It takes an array of sections and an array of selected item IDs as input.
export const getItemByIdFromSectionArray = (
  array: any[],
  selectedItemId: string[],
) => {
  const matchedItems = []; // Array to store the matched items

  // Iterate through the array of sections
  for (let i = 0; i < array.length; i++) {
    const subArray = array[i].data; // Get the sub-array of items for each section
    const foundItems = subArray.filter(
      (item: { id: string }) => selectedItemId.includes(item.id), // Filter the items based on whether their IDs are included in the selected item IDs
    );

    // If any matching items are found, add them to the matchedItems array
    if (foundItems.length > 0) {
      matchedItems.push(...foundItems);
    }
  }

  // Return the matched items if any are found, otherwise return null
  return matchedItems.length > 0 ? matchedItems : null;
};

/*
shuffleArray Function
This function shuffles the elements of the input array 'list' randomly using the Fisher-Yates (Knuth) algorithm.
The function creates a new array 'shuffledData' to hold the shuffled elements, ensuring that the original 'list'
*/
export const shuffleArray = (list: string[]) => {
  const shuffledData = [...list];
  for (let i = shuffledData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
  }
  return shuffledData;
};

/*
Checks if the given object 'obj' is present as a 'value' property within the 'list' array of objects.
*/
export function containsObject(
  obj: any,
  list: string | any[],
  keyName: string,
) {
  for (let i = 0; i < list.length; i++) {
    if (list[i][keyName] === obj) {
      return true;
    }
  }
  return false;
}

export function getArrayIndexByItemId(
  list: string | any[],
  keyName: string,
  compareValue: string,
) {
  for (let i = 0; i < list.length; i++) {
    if (list[i][keyName] === compareValue) {
      return i;
    }
  }
  return -1;
}

export function findChangedIds(oldIds, newIds) {
  const removedIds = oldIds.filter(id => !newIds.includes(id));
  const addedIds = newIds.filter(id => !oldIds.includes(id));
  return { removedIds, addedIds };
}
