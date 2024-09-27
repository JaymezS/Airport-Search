"use strict";
/** Time complexity: O(1) + A(n), Ω(1) + A(n)
 *
 * @param index the index of the category to search by as the order they appear in in ALL_AIRPORTS
 * where 0 is ID, 1 is Name, 2 is type etc.
 * @param key the key that identifies the airport(s) it searches for in the given category
 */
function UserSearchInterface(index, key) {
    const SEARCH_START_TIME = performance.now();
    // get the section of the presorted array for that category that is the same identifer as the given key
    // Set as variable A(n) in time complexity
    const Indices = binarySearch(index, key);
    // the case where elements are found
    if (Indices[0] != -1) {
        // display the section of the data that is desired
        displayData = PRESORTED_ARRAYS[index];
        displayStartIndex = Indices[0];
        displayIndex = displayStartIndex;
        totalNumberDisplayed = Indices[1] - Indices[0] + 1;
    }
    else { // when no elements are found
        displayData = [];
        displayStartIndex = 0;
        displayIndex = 0;
        totalNumberDisplayed = 0;
    }
    const SEARCH_END_TIME = performance.now();
    SEARCH_TIME_DISPlAY.innerText = String(SEARCH_END_TIME - SEARCH_START_TIME);
}
/** Time complexity: O(log n), Ω(log n)
 *
 * @param index the index of the category to search in, where 0 = id, 1 = name etc.
 * @param key the key that identifies the airport(s) to search for.
 * @returns the index ranges of elements equal to key within the respective presorted array
 * (inclusive on both ends), returns -1 if it does not exist (ie. [1265, 1265] means the search result exists in the presorted array for that search category at index 1265 to 1265)
 */
function binarySearch(index, key) {
    // get the presorted array (sorted in ascending order) for that category, search in this array
    const ARRAY = PRESORTED_ARRAYS[index];
    let l = 0;
    let r = ARRAY.length - 1;
    // keep track of the leftmost index where key is found, default to not found (-1)
    let leftIndex = -1;
    while (l <= r) {
        // get the mid point and the element at that point
        let mid = Math.floor((l + r) / 2);
        const ELEMENT = ALL_AIRPORTS[ARRAY[mid]][index];
        // if the target is found, keep searching to its left
        if (ELEMENT === key) {
            leftIndex = mid;
            r = mid - 1;
        }
        else if (ELEMENT < key) { //otherwise, follow normal binary search rules
            l = mid + 1;
        }
        else {
            r = mid - 1;
        }
    }
    // only run second part if the target has been found in the array
    // here, binary search to the right of the the leftmost target element to find the rightmost target element
    if (leftIndex >= 0) {
        // binary search range to the right of the leftmost target element
        l = leftIndex;
        r = ARRAY.length - 1;
        // keep track of the leftmost index where key is found, default to the same as the leftmost element
        let rightIndex = leftIndex;
        while (l <= r) {
            // get the mid point and the element at that point
            let mid = Math.floor((l + r) / 2);
            const ELEMENT = ALL_AIRPORTS[ARRAY[mid]][index];
            // since the leftmost element in the search range equals to the target, 
            // all elements to its right has to be greater than or equal to the target, hence no need to check for "<"
            if (ELEMENT === key) {
                rightIndex = mid;
                l = mid + 1;
            }
            else if (ELEMENT > key) {
                r = mid - 1;
            }
        }
        return [leftIndex, rightIndex];
    }
    // in the case that key cannot be found in any elements
    return [-1, -1];
}
//# sourceMappingURL=searching.js.map