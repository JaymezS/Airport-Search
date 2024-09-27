
const PROGRAM_START_TIMER: number = performance.now();


interface Data {
  continent: string[];
  ident: string[];
  iso_country: string[];
  iso_region: string[];
  latitude_deg: number[];
  longitude_deg: number[];
  name: string[];
  type: string[];
}



const data: Data = loadJSON("../DO_NOT_TOUCH/data.json") as Data; //Don't delete this line. All your data is here. It does take a few seconds for Replit to load the data because it's so large.


const DISPLAY_TABLE: HTMLTableElement = <HTMLTableElement>document.getElementById("table-body");
const NEXT_PAGE_BUTTON: HTMLButtonElement = <HTMLButtonElement>document.getElementById("next-page");
const PREV_PAGE_BUTTON: HTMLButtonElement = <HTMLButtonElement>document.getElementById("prev-page");
const TOTAL_PAGE_NUMBER: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("total-page-number");
const CURRENT_PAGE_NUMBER: HTMLInputElement = <HTMLInputElement>document.getElementById("current-page-number");
const BROWSE_PAGE_BUTTON: HTMLButtonElement = <HTMLButtonElement>document.getElementById("refresh-page-button");
const SEARCH_PROMPT_INPUT: HTMLInputElement = <HTMLInputElement>document.getElementById("search-prompt");
const SEARCH_BUTTON: HTMLButtonElement = <HTMLButtonElement>document.getElementById("start-search");
const SEARCH_OPTION_SELECTION: HTMLSelectElement = <HTMLSelectElement>document.getElementById("search-option-display");
const SORT_BUTTON: HTMLButtonElement = <HTMLButtonElement>document.getElementById("initiate-sort");
const SORT_CATEGORY_SELECTION: HTMLSelectElement = <HTMLSelectElement>document.getElementById("sort-category");
const SORT_ORDER_SELECTION: HTMLSelectElement = <HTMLSelectElement>document.getElementById("sort-order");
const ADD_DESTINATION_BUTTON: HTMLButtonElement = <HTMLButtonElement>document.getElementById("add-destination-button");
const DESTINATION_LIST: HTMLDivElement = <HTMLDivElement>document.getElementById("destination-list");
const DISTANCE_CALCULATOR_BUTTON: HTMLButtonElement = <HTMLButtonElement>document.getElementById("run-distance-calculator");
const DISTANCE_CALCULATOR_OUTPUT: HTMLTextAreaElement =
  <HTMLTextAreaElement>document.getElementById("distance-calculator-output");
const SORT_TIME_DISPLAY: HTMLTextAreaElement =
  <HTMLTextAreaElement>document.getElementById("sort-time-output");
const SEARCH_TIME_DISPlAY: HTMLTextAreaElement =
  <HTMLTextAreaElement>document.getElementById("search-time-output");
const DISTANCE_CALCULATOR_TIME_DISPLAY: HTMLTextAreaElement =
  <HTMLTextAreaElement>document.getElementById("distance-calculator-time-output");
const SHORTEST_PATH_FIRST_AIRPORT_INPUT: HTMLInputElement =
  <HTMLInputElement>document.getElementById("shortest-path-first-airport");
const SHORTEST_PATH_SECOND_AIRPORT_INPUT: HTMLInputElement =
  <HTMLInputElement>document.getElementById("shortest-path-second-airport");
const TRANSITION_NUMBER_INPUT: HTMLInputElement = <HTMLInputElement>document.getElementById("transition-number");
const RUN_SHORTEST_PATHFINDING: HTMLButtonElement =
  <HTMLButtonElement>document.getElementById("search-shortest-path-button");
const SHORTEST_PATH_OUTPUT: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById("shortest-path-output");
const SHORTEST_PATH_TIME_OUTPUT: HTMLTextAreaElement =
  <HTMLTextAreaElement>document.getElementById("shortest-path-time-output");
const PRORGAM_START_TIME_OUTPUT: HTMLTextAreaElement =
  <HTMLTextAreaElement>document.getElementById("program-start-time-output");


// amount of airports to be displayed every page, recommended value <= 5 as bigger values can exceed page size
const NUM_DISPLAYED = 5;

// The total number of airports
const NUM_AIRPORTS: number = data.ident.length;

// Array of all the airports stored in [[airport 1 information], [airport 2 information]... ] format
const ALL_AIRPORTS: any[][] = Array(NUM_AIRPORTS);

// Array of presorted indexes for ID, name, type, and country to search from
const PRESORTED_ARRAYS: number[][] = Array(4);

// an array of indexes to display from ALL_AIRPORTS
let displayData: number[] = Array(NUM_AIRPORTS);

// the starting index of the N airports that are currently being displayed
let displayIndex: number = 0;

// the total number of elements that can be displayed 
let totalNumberDisplayed: number = NUM_AIRPORTS;

// the start of all the possible elements that can be displayed in the displayData array
let displayStartIndex: number = 0;

// format the data in the form desired in 
for (let i = 0; i < NUM_AIRPORTS; i++) {
  ALL_AIRPORTS[i] = [
    String(data.ident[i]),
    data.name[i],
    data.type[i],
    data.iso_country[i],
    data.longitude_deg[i],
    data.latitude_deg[i],
    data.continent[i],
    data.iso_region[i]
  ];
}


/** Time complexity: O(n) = Ω(n), therefore Θ(n) 
 * reset the array of airports to be displayed and all display values back to default
 * 
 */
function resetData(): void {
  displayData = Array(NUM_AIRPORTS);
  for (let i = 0; i < NUM_AIRPORTS; i++) {
    displayData[i] = i;
  }
  displayStartIndex = 0;
  displayIndex = 0;
  totalNumberDisplayed = NUM_AIRPORTS;
}

/**
 * Time complexity: O(1) = Ω(1), therefore Θ(1) 
 */
function load(): void {
  CURRENT_PAGE_NUMBER.value = "1";
  TOTAL_PAGE_NUMBER.innerText = String(Math.ceil(NUM_AIRPORTS / NUM_DISPLAYED));

  // create the presorted arrays for id, name, type and country for searching
  resetData();
  for (let i = 0; i < 4; i++) {
    PRESORTED_ARRAYS[i] = copyArray(sortInterface(i, 0, displayData));
  }
  SORT_TIME_DISPLAY.innerText = "";

  // display the original data to the user on startup
  resetData();
  display();


  NEXT_PAGE_BUTTON.addEventListener("click", () => {
    nextPage();
    updatePageNumber();
    display();
  })


  PREV_PAGE_BUTTON.addEventListener("click", () => {
    previousPage();
    updatePageNumber();
    display();
  })


  BROWSE_PAGE_BUTTON.addEventListener("click", () => {
    updatePageFromNumber();
    updatePageNumber();
    display();
  })


  ADD_DESTINATION_BUTTON.addEventListener("click", () => {
    addNewDestination()
  })


  DISTANCE_CALCULATOR_BUTTON.addEventListener("click", () => {
    calculateDistanceAndDisplayResult()
  })


  SEARCH_BUTTON.addEventListener("click", () => {
    const PROMPT_INPUT: string = SEARCH_PROMPT_INPUT.value;
    const SEARCH_CATEGORY: number = Number(SEARCH_OPTION_SELECTION.value);

    // directly modifies displayStartIndex and displayData array to show the section of element(s) desired
    UserSearchInterface(SEARCH_CATEGORY, PROMPT_INPUT); 

    TOTAL_PAGE_NUMBER.innerText = String(Math.ceil(totalNumberDisplayed / NUM_DISPLAYED));
    display();
  })


  SORT_BUTTON.addEventListener("click", () => {
    const CATEGORY: number = Number(SORT_CATEGORY_SELECTION.value);
    const ORDER: number = Number(SORT_ORDER_SELECTION.value);
    resetData();
    sortInterface(CATEGORY, ORDER, displayData);

    displayIndex = displayStartIndex;
    TOTAL_PAGE_NUMBER.innerText = String(Math.ceil(totalNumberDisplayed / NUM_DISPLAYED));
    display();
  })


  RUN_SHORTEST_PATHFINDING.addEventListener("click", () => {
    shortestPathInterface();
  })
  
  const PROGRAM_END_TIMER: number = performance.now();
  PRORGAM_START_TIME_OUTPUT.innerText = `Program took ${PROGRAM_END_TIMER - PROGRAM_START_TIMER}ms to start`;
}


/** Create a deep copy of an array
 * Time complexity: O(n) = Ω(n), therefore Θ(n)
 * @param arr the array to create a deep copy for
 * @returns a deep copy of "arr"
 */
function copyArray<T>(arr: T[]): T[] {
  const NEW_ARRAY: T[] = Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    NEW_ARRAY[i] = arr[i];
  }
  return NEW_ARRAY;
}


/** Time complexity: O(1) = Ω(1), therefore Θ(1)
 * update the page number based on the displayIndex
 */
function updatePageNumber(): void {
  CURRENT_PAGE_NUMBER.value = String(Math.floor((displayIndex - displayStartIndex) / NUM_DISPLAYED) + 1);
}


/** create up to the specified "length" of airports to the table, 
 * starting from the specified index "start" in the displayData array
 * 
 * Time complexity: O(n) = Ω(n), therefore Θ(n) (the inner for loop runs constant amount of times)
 * 
 * @param array the array of the indices of airports in ALL_AIRPORTS to be displayed
 * @param start the index to start displaying at
 * @param length the amount of airports to be displayed after the one at index "start" in "array" (including start)
 */
function display(array: number[] = displayData, start: number = displayIndex, length: number = NUM_DISPLAYED): void {
  DISPLAY_TABLE.innerHTML = "";
  const LAST_INDEX_AVAILABLE: number = displayStartIndex + totalNumberDisplayed;
  const DESIRED_LAST_INDEX_TO_DISPLAY: number = start + length;
  const INDEX_OF_LAST_ELEMENT_TO_DISPLAY: number = Math.min(DESIRED_LAST_INDEX_TO_DISPLAY, LAST_INDEX_AVAILABLE);
  for (let i = start; i < INDEX_OF_LAST_ELEMENT_TO_DISPLAY; i++) {
    const NEW_ROW = document.createElement("tr");
    const AIRPORT_TO_DISPLAY: any[] = ALL_AIRPORTS[array[i]];
    for (let category = 0; category < 8; category++) {
      const NEW_TABLE_DATA_CELL = document.createElement("td");
      NEW_TABLE_DATA_CELL.innerText = AIRPORT_TO_DISPLAY[category];
      NEW_ROW.appendChild(NEW_TABLE_DATA_CELL);
    }
    DISPLAY_TABLE.appendChild(NEW_ROW);
  }
  updatePageNumber();
}


// Time complexity: O(1), Ω(1)
function nextPage(): void {
  const UPPER_BOUND: number = displayStartIndex + totalNumberDisplayed;
  const NEXT_INDEX_TO_DISPLAY: number = displayIndex + NUM_DISPLAYED;
  if (NEXT_INDEX_TO_DISPLAY < UPPER_BOUND) {
    displayIndex += NUM_DISPLAYED;
  }
}


// Time complexity: O(1) Ω(1)
function previousPage(): void {
  const PREVIOUS_INDEX_TO_DISPLAY: number = displayIndex - NUM_DISPLAYED;
  if (PREVIOUS_INDEX_TO_DISPLAY < displayStartIndex) { // if the page reached the lower bound 
    displayIndex = displayStartIndex;
  } else { 
    displayIndex -= NUM_DISPLAYED;
  }
}

/** Time complexity: O(1), Ω(1)
 * Update the displayed elements and displayIndex based on user's page number input in the input box
 */
function updatePageFromNumber(): void {
  const NEW_PAGE_NUMBER: number = Number(CURRENT_PAGE_NUMBER.value);
  const TOTAL_PAGES: number = Math.ceil(totalNumberDisplayed / NUM_DISPLAYED);
  if (NEW_PAGE_NUMBER <= TOTAL_PAGES && NEW_PAGE_NUMBER > 0) {
    const INDEX_AT_GIVEN_PAGE = (NEW_PAGE_NUMBER - 1) * NUM_DISPLAYED + displayStartIndex;
    displayIndex = INDEX_AT_GIVEN_PAGE;
  }
}


// SCRIPT FOR CSS
// change and shrink the shape of the header when scrolling down
const HEADER: HTMLHeadElement = <HTMLHeadElement>document.getElementById("main-header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    HEADER.classList.add("sticky");
  } else {
    HEADER.classList.remove("sticky");
  }
});