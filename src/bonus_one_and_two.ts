
/** Time complexity: assume math functions are constant: binarySearch = A(n), degreeToRadian = B(n)
 * O(1) + 2A(n) + 4B(n), 
 * Ω(1) + 2A(n)
 * 
 * @param firstAirportId the id of the first airport
 * @param secondAirportId the id of the second airport
 * @returns the distance between the two airports in km
 */

function getDistance(firstAirportId: string, secondAirportId: string): number {
  const ID_PRESORT: number[] = PRESORTED_ARRAYS[0];
  const AIRPORT_ONE: any[] = ALL_AIRPORTS[ID_PRESORT[binarySearch(0, firstAirportId)[0]]];
  const AIRPORT_TWO: any[] = ALL_AIRPORTS[ID_PRESORT[binarySearch(0, secondAirportId)[0]]];

  const TYPE_INDEX: number = 2;
  const LATITUDE_INDEX: number = 5;
  const LONGITUDE_INDEX: number = 4;
  const LATITUDE_ONE: number = AIRPORT_ONE[LATITUDE_INDEX];
  const LONGITUDE_ONE: number = AIRPORT_ONE[LONGITUDE_INDEX];
  const LATITUDE_TWO: number = AIRPORT_TWO[LATITUDE_INDEX];
  const LONGITUDE_TWO: number = AIRPORT_TWO[LONGITUDE_INDEX];
  if ((AIRPORT_ONE[TYPE_INDEX] != AIRPORT_TWO[TYPE_INDEX]) || AIRPORT_ONE[TYPE_INDEX] === "closed") {
    return -1;
  }
  const EARTH_RADIUS: number = 6371;
  const LATITUDE_CALC: number = Math.pow(Math.sin((degreeToRadian(LATITUDE_TWO - LATITUDE_ONE)) / 2), 2);
  const LONGITUDE_CALC: number = Math.pow(Math.sin((degreeToRadian(LONGITUDE_TWO - LONGITUDE_ONE)) / 2), 2);
  const DIST: number = 2 * EARTH_RADIUS * Math.asin(Math.sqrt(LATITUDE_CALC + Math.cos(degreeToRadian(LATITUDE_ONE)) * Math.cos(degreeToRadian(LATITUDE_TWO)) * LONGITUDE_CALC));
  return DIST;
}


// this function uses getAirportByID function from bonus_three.ts
// Time complexity: getAirportByID = A(n), getDistance = B(n)
/** Time complexity: 
 * O(1) + 2A(n) = 2B(n) 
 * Ω(1)
 * 
 * @param airportIdArray a list of airports to traverse through
 * @returns array of -1 not enough airport inputs, -2 = type diff, -3 = wrong airport ids
 * @returns array of two numbers, the culmulative distance travelled (index 0) and the displacement (index 1)
 */
function getCulmulativeDistance(airportIdArray: string[]): number[] {
  const DISTANCE_CALCULATOR_START_TIME: number = performance.now();

  // if there's not enough airports
  if (airportIdArray.length < 2) {
    return [-1, -1];
  }

  const FIRST_AIRPORT_ID: string = airportIdArray[0];
  const FIRST_AIRPORT: any[] = getAirportByID(FIRST_AIRPORT_ID)
  // if the first airport id does not exist
  if (FIRST_AIRPORT[0] === -1) {
    return [-3, -3];
  }

  // The type that all other airports should have to be able to transition
  const TYPE: string = FIRST_AIRPORT[2];

  let distanceTravelled: number = 0;
  for (let i = 1; i < airportIdArray.length; i++) {
    const NEW_AIRPORT_ID: string = airportIdArray[i];
    const PREVIOUS_AIRPORT_ID: string = airportIdArray[i-1]
    const NEW_AIRPORT: any[] = getAirportByID(NEW_AIRPORT_ID);
    if (NEW_AIRPORT[0] === -1) { // if an airport by that id does not exist
      return [-3, -3];
    }
    const NEW_AIRPORT_TYPE: string = NEW_AIRPORT[2];
    if (NEW_AIRPORT_TYPE !== TYPE) {
      return [-2, -2];
    }
    const DISTANCE_TO_PREVIOUS_AIRPORT: number = getDistance(NEW_AIRPORT_ID, PREVIOUS_AIRPORT_ID)
    distanceTravelled += DISTANCE_TO_PREVIOUS_AIRPORT;
  }

  const LAST_AIRPORT_ID: string = airportIdArray[airportIdArray.length - 1]
  const DISPLACEMENT: number = getDistance(FIRST_AIRPORT_ID, LAST_AIRPORT_ID);  
  const DISTANCE_CALCULATOR_END_TIME: number = performance.now();
  DISTANCE_CALCULATOR_TIME_DISPLAY.innerText = String(DISTANCE_CALCULATOR_END_TIME - DISTANCE_CALCULATOR_START_TIME);

  return [distanceTravelled, DISPLACEMENT];
}


// Time complexity: O(1) = Ω(1), therefore Θ(1)
function degreeToRadian(degree: number): number {
  return (degree / 180) * Math.PI;
}


/** Time complexity: O(1) = Ω(1), therefore Θ(1)
 * Function to update HTML display elements for adding/removing destinations
 */
function addNewDestination(): void {
  const NEW_DESTINATION_DISPLAY: HTMLDivElement = document.createElement("div");
  const NEW_INPUT: HTMLInputElement = document.createElement("input");
  const DELETE_BUTTON: HTMLButtonElement = document.createElement("button");
  const INPUT_LABEL: HTMLHeadingElement = document.createElement("h1");
  INPUT_LABEL.innerText =  `Input Airport ID: ` ;
  NEW_INPUT.setAttribute("class", "destination-input");
  NEW_DESTINATION_DISPLAY.appendChild(INPUT_LABEL);
  NEW_DESTINATION_DISPLAY.appendChild(NEW_INPUT);
  NEW_DESTINATION_DISPLAY.appendChild(DELETE_BUTTON);
  DESTINATION_LIST.appendChild(NEW_DESTINATION_DISPLAY);
  DELETE_BUTTON.addEventListener("click", () => {
    DESTINATION_LIST.removeChild(NEW_DESTINATION_DISPLAY);
  })
  DELETE_BUTTON.innerText = "Delete";
}


/** Time complexity: O(n), Ω(n)
 * Function called by user, responsible for updating HTML elements
 */
function calculateDistanceAndDisplayResult(): void {
  const DESTINATION_INPUTS: NodeListOf<HTMLInputElement> = document.querySelectorAll(".destination-input");
  const DESTINATIONS_IDS: string[] = Array(DESTINATION_INPUTS.length);
  for (let i = 0; i < DESTINATION_INPUTS.length; i++) {
    DESTINATIONS_IDS[i] = DESTINATION_INPUTS[i].value;
  }
  const RESULTS: number[] = getCulmulativeDistance(DESTINATIONS_IDS);
  let calculatorOutputMessage: string;
  if (RESULTS[0] === -1) {
    calculatorOutputMessage = "Error: Please input at least 2 airports";
  } else if (RESULTS[0] === -2) {
    calculatorOutputMessage = "Error: Please input airports of the same type";
  } else if (RESULTS[0] === -3) {
    calculatorOutputMessage = "Error: One or more of the airports input does not exist, please try again";
  } else {
    calculatorOutputMessage = `Culmulative Distance Travelled: ${RESULTS[0]}. \n Total Displacement: ${RESULTS[1]}`;
  }
  DISTANCE_CALCULATOR_OUTPUT.innerText = calculatorOutputMessage;
}