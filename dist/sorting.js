"use strict";
/** Time complexity: O(n) + A(n) = Ω(n) + A(n), therefore Θ(n) + A(n)
 * Overall, since A(n) = O(n log n) and Ω(n log n) (as seen in the function below), time complexity overall becomes:
 * Time complexity: O(n log n) and Ω(n log n)
 *
 * @param category the index of the category to sort by, where 0 is id, 1 is name ...
 * @param order sort by ascending or descending, 0 = ascending, 1 = descending
 * @param array the array of numbers (that refer to indices of airports in ALL_AIRPORTS) to sort
 * @returns return the array of numbers (that refer to indices of airports in ALL_AIRPORTS) that
 * is sorted by the respective sorting category
 */
function sortInterface(category, order, array) {
    const SORT_START_TIME = performance.now();
    // create a deep copy reference array
    const REFERENCE_ARRAY = new Array(array.length);
    for (let i = 0; i < array.length; i++) {
        REFERENCE_ARRAY[i] = array[i];
    }
    // set as variable A(n)
    mergeSortTable(REFERENCE_ARRAY, array, category, order);
    const SORT_END_TIME = performance.now();
    SORT_TIME_DISPLAY.innerText = String(SORT_END_TIME - SORT_START_TIME);
    return array;
}
/** Time complexity overall: O(n log n), Ω(n log n) (as per a normal mergesort)
 *
 * Mergesort in place without creating new arrays,
 * even though it sorts in place, still return the sorted array for convenience
 *
 * @param reference a deep copy of the array to be sorted
 * @param array the array to be sorted (array of airport indices in ALL_AIRPORTS)
 * @param category the category to sort by, where 0 = id, 1 = name...
 * @param sortOrder the order to sort by, where 0 = ascending and 1 = descending
 * @param start the starting index of the section  to sort
 * @param length the length of the section  to sort
 * @returns the sorted array
 */
function mergeSortTable(reference, array, category, sortOrder = 0, start = 0, length = array.length) {
    // base case
    if (length === 1) {
        return [start, 1];
    }
    // "divide" the array into smaller ones by keeping track of indices only
    let mid = Math.floor(length / 2);
    let left = mergeSortTable(reference, array, category, sortOrder, start, mid);
    let right = mergeSortTable(reference, array, category, sortOrder, start + mid, Math.ceil(length / 2));
    // "merge" the left section and the right section in place
    return mergeTable(reference, array, category, sortOrder, left[0], left[1], right[0], right[1]);
}
/** Time complexity: O(n), Ω(n)
 * merge two sorted sections of the array by index
 *
 * @param reference a deep copy of the array as a reference
 * @param array the array that is to be sorted
 * @param category the category to sort by (0 = id, 1 = name...)
 * @param sortOrder the order to merge by (0 = ascending, 1 = descending)
 * @param left the starting index of the left array to combine
 * @param leftLength the length of the left array to combine
 * @param right the starting index of the right array to combine
 * @param rightLength the length of the right array to combine
 * @returns return the starting index of the left array and the length of the two arrays combined
 */
function mergeTable(reference, array, category, sortOrder, left, leftLength, right, rightLength) {
    // the number of elements that have been merged/used from the left (i) and right (j) side
    let i = 0;
    let j = 0;
    for (let x = 0; x < leftLength + rightLength; x++) {
        const LEFT_AIRPORT_INDEX = left + i;
        const RIGHT_AIRPORT_INDEX = right + j;
        const LEFT_AIRPORT = ALL_AIRPORTS[reference[LEFT_AIRPORT_INDEX]];
        const RIGHT_AIRPORT = ALL_AIRPORTS[reference[RIGHT_AIRPORT_INDEX]];
        const INDEX_TO_CHANGE = left + x;
        // if all elements from the left have been added, add the one from the right    
        if (i >= leftLength) {
            array[INDEX_TO_CHANGE] = reference[RIGHT_AIRPORT_INDEX];
            j++;
        }
        else if (j >= rightLength) { // if all elements from the right have been added, add the one from the left
            array[INDEX_TO_CHANGE] = reference[LEFT_AIRPORT_INDEX];
            i++;
        }
        else if (LEFT_AIRPORT[category] === RIGHT_AIRPORT[category]) {
            // sort by ID if the category is the same
            if (LEFT_AIRPORT[0] < RIGHT_AIRPORT[0]) { // 0th index of airport information array is id: compare and sort by id
                array[INDEX_TO_CHANGE] = reference[LEFT_AIRPORT_INDEX];
                i++;
            }
            else {
                array[INDEX_TO_CHANGE] = reference[RIGHT_AIRPORT_INDEX];
                j++;
            }
        }
        else if ((LEFT_AIRPORT[category] < RIGHT_AIRPORT[category] && sortOrder === 0) ||
            (LEFT_AIRPORT[category] > RIGHT_AIRPORT[category] && sortOrder === 1)) {
            // if left airport's category value is greater and it's sorting by descending 
            // or if the left airport's category value is lesser and it's sorting by ascending, add it
            array[INDEX_TO_CHANGE] = reference[LEFT_AIRPORT_INDEX];
            i++;
        }
        else { // otherwise, add the right airport
            array[INDEX_TO_CHANGE] = reference[RIGHT_AIRPORT_INDEX];
            j++;
        }
    }
    for (let i = left; i < left + leftLength + rightLength; i++) {
        reference[i] = array[i];
    }
    return [left, leftLength + rightLength];
}
//# sourceMappingURL=sorting.js.map