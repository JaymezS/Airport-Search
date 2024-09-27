"use strict";
/** Time complexity: O(n), Ω(1)
 *
 * @param array the array to insert into
 * @param element the element to insert
 * @param index the index that the element will appear in the array after insertion, default to end of array (push function)
 * note that all elements to its right will be shifted one index to the right
 * @returns array with element inserted
 */
function insert(array, element, index = array.length) {
    const NEW_ARRAY = Array(array.length + 1);
    for (let i = 0; i < array.length + 1; i++) {
        if (i === index) {
            NEW_ARRAY[i] = element;
        }
        else if (i < index) {
            NEW_ARRAY[i] = array[i];
        }
        else {
            NEW_ARRAY[i] = array[i - 1];
        }
    }
    return NEW_ARRAY;
}
/** Time complexity: binarySearch = A(n)
 * O(1) + A(n)
 * Ω(1) + A(n)
 *
 * @param id the id of the airport to search for (doesn't have to be valid)
 * @returns [-1] if an airport with that id cannot be found, or the array of the information about that airport if it can
 */
function getAirportByID(id) {
    const ID_PRESORT = PRESORTED_ARRAYS[0];
    const AIRPORT_INDEX = binarySearch(0, id)[0];
    if (AIRPORT_INDEX === -1) {
        return [-1];
    }
    const AIRPORT = ALL_AIRPORTS[ID_PRESORT[AIRPORT_INDEX]];
    return AIRPORT;
}
/** Time complexity: O(n^4) Ω(n^4)
 * can be reduced to n^3 and optimized by:
 *  - tabulating shortest deviations between airports to avoid repetitive computation
 *  - creating a hash table or array check off airports visited instead of looping through every visited airport
 *
 * @param startingAirport the airport to start at (endpoint #1)
 * @param endingAirport the ending airport (endpoint #2)
 * @param transitions the number of intermediate points desired (not including both endpoints)
 * @returns Array of containing the IDs of the shortest route from the starting airport to the ending airport (includsive)
 */
function findShortestPath(startingAirport, endingAirport, transitions) {
    const STARTING_AIRPORT = getAirportByID(startingAirport);
    const ENDING_AIRPORT = getAirportByID(endingAirport);
    const AIRPORT_TYPE = STARTING_AIRPORT[2];
    if (STARTING_AIRPORT[0] === -1 || ENDING_AIRPORT[0] === -1) {
        return ["airports do not exist"];
    }
    else if (ENDING_AIRPORT[2] != AIRPORT_TYPE) {
        return ["type error"];
    }
    const TYPE_PRESORT = PRESORTED_ARRAYS[2];
    const AIRPORTS_AVAILABLE = binarySearch(2, AIRPORT_TYPE);
    let bestPath = [startingAirport];
    for (let transitionsMade = 0; transitionsMade < transitions; transitionsMade++) {
        let bestOption;
        let bestOptionIndex;
        let smallestDeviation = 40075;
        // look through every possible pairs of airports to find the smallest deviation
        for (let currentStartingAirport = 0; currentStartingAirport < bestPath.length; currentStartingAirport++) {
            const AIRPORT_OPTION_ONE = bestPath[currentStartingAirport];
            let airportOptionTwo;
            if (currentStartingAirport === bestPath.length - 1) {
                airportOptionTwo = endingAirport;
            }
            else {
                airportOptionTwo = bestPath[currentStartingAirport + 1];
            }
            const DIRECT_DISTANCE = getDistance(AIRPORT_OPTION_ONE, airportOptionTwo);
            for (let i = AIRPORTS_AVAILABLE[0]; i < AIRPORTS_AVAILABLE[1] + 1; i++) {
                const AIRPORT_OPTION = ALL_AIRPORTS[TYPE_PRESORT[i]];
                const AIRPORT_OPTION_ID = AIRPORT_OPTION[0];
                let duplicate = false;
                for (let j = 0; j < bestPath.length; j++) {
                    if (AIRPORT_OPTION_ID === bestPath[j] || AIRPORT_OPTION_ID === endingAirport) {
                        duplicate = true;
                        break;
                    }
                }
                if (duplicate) {
                    continue;
                }
                const CURRENT_TO_OPTION_DISTANCE = getDistance(AIRPORT_OPTION_ONE, AIRPORT_OPTION[0]);
                const OPTION_TO_END_DISTANCE = getDistance(AIRPORT_OPTION[0], airportOptionTwo);
                const DEVIATION = CURRENT_TO_OPTION_DISTANCE + OPTION_TO_END_DISTANCE - DIRECT_DISTANCE;
                if (DEVIATION < smallestDeviation) {
                    smallestDeviation = DEVIATION;
                    bestOption = AIRPORT_OPTION_ID;
                    bestOptionIndex = currentStartingAirport;
                }
            }
        }
        bestPath = insert(bestPath, bestOption, bestOptionIndex + 1);
    }
    bestPath = insert(bestPath, endingAirport);
    return bestPath;
}
/** Time complexity: O(1), Ω(1)
 * interface for calling the pathfinding algorithm
 */
function shortestPathInterface() {
    const SHORTEST_PATH_START_TIME = performance.now();
    const FIRST_AIRPORT_ID = SHORTEST_PATH_FIRST_AIRPORT_INPUT.value;
    const SECOND_AIRPORT_ID = SHORTEST_PATH_SECOND_AIRPORT_INPUT.value;
    const TRANSITION_NUMBER = Number(TRANSITION_NUMBER_INPUT.value);
    if (isNaN(TRANSITION_NUMBER)) {
        SHORTEST_PATH_OUTPUT.innerText = "Please input a valid number";
        const SHORTEST_PATH_END_TIME = performance.now();
        SHORTEST_PATH_TIME_OUTPUT.innerText = String(SHORTEST_PATH_END_TIME - SHORTEST_PATH_START_TIME);
        return;
    }
    const PATH = findShortestPath(FIRST_AIRPORT_ID, SECOND_AIRPORT_ID, TRANSITION_NUMBER);
    let message = "";
    if (getAirportByID(PATH[0])[0] === -1) { // if the first element in the results is not an airport id, an error has occured
        message = PATH[0];
        SHORTEST_PATH_OUTPUT.innerText = message;
        const SHORTEST_PATH_END_TIME = performance.now();
        SHORTEST_PATH_TIME_OUTPUT.innerText = String(SHORTEST_PATH_END_TIME - SHORTEST_PATH_START_TIME);
        return;
    }
    for (let i = 0; i < PATH.length - 1; i++) {
        message += `${PATH[i]} -> `;
    }
    message += PATH[PATH.length - 1];
    const DISTANCES = getCulmulativeDistance(PATH);
    const LARGE_AIRPORT_SPEED = 800;
    const SMALL_AIRPORT_SPEED = 230;
    const HELIPORT_SPEED = 160;
    const AIRPORT_TYPE = getAirportByID(PATH[0])[2];
    message += `\n` + `Distance Travelled: ${DISTANCES[0]} km`;
    message += `\n` + `Displacement: ${DISTANCES[1]} km`;
    if (AIRPORT_TYPE === "large_airport") {
        message += `\n` + `Travel time: ${DISTANCES[0] / LARGE_AIRPORT_SPEED} hrs`;
    }
    else if (AIRPORT_TYPE === "small_airport") {
        message += `\n` + `Travel time: ${DISTANCES[0] / SMALL_AIRPORT_SPEED} hrs`;
    }
    else if (AIRPORT_TYPE === "heliport") {
        message += `\n` + `Travel time: ${DISTANCES[0] / HELIPORT_SPEED} hrs`;
    }
    else {
        message += `\n` + "speed not available for this type of airport";
    }
    const SHORTEST_PATH_END_TIME = performance.now();
    SHORTEST_PATH_OUTPUT.innerText = message;
    SHORTEST_PATH_TIME_OUTPUT.innerText = String(SHORTEST_PATH_END_TIME - SHORTEST_PATH_START_TIME);
}
//# sourceMappingURL=bonus_three.js.map