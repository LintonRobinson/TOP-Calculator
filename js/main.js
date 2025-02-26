let calculator = document.querySelector('.calculatorMainWrapper'); 


/* Live Date and Time */
function updateTime() {
    let now = new Date();
    
    // Day, Month, and Date
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let day = days[now.getDay()];
    let month = months[now.getMonth()];
    let date = now.getDate();

    // Get Hours and Minutes
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    
    // Convert to 12-hour Format (short circut)
    hours = hours % 12 || 12;
    
    // Leading Zero to Minutes
    minutes = minutes < 10 ? "0" + minutes : minutes;

    // Format final time string
    let formattedTime = `${day} ${month}  ${date}  ${hours}:${minutes}${ampm}`;
    document.querySelector(".liveDateAndTime").textContent = formattedTime;
};

// Update Time Every Second
setInterval(updateTime, 1000);
updateTime(); 

/* Remove Click To Drag Message After 5 Seconds */
setTimeout(() => {
    document.querySelector('.clickToDragMessage').style.display = "none"
} , "5000")

/* Scroll Result Window When Content Overflows */
// Check if result window content is overflowing 
function resultWindowOverflowing() {
    let calculatorResultWindow = document.querySelector(".calculatorResultWindow");
    let calculatorBottomWrapper = document.querySelector(".calculatorBottomWrapper");

    return calculatorResultWindow.scrollWidth > calculatorBottomWrapper.clientWidth;
};

// Update scroll left to be the difference between the result window width, and result window with including scroll
function resultWindowScrollToRight() {
    if (resultWindowOverflowing()) {
        let calculatorResultWindow = document.querySelector(".calculatorResultWindow");
        let calculatorBottomWrapper = document.querySelector(".calculatorBottomWrapper")
        calculatorResultWindow.scrollLeft = calculatorResultWindow.scrollWidth - calculatorBottomWrapper.clientWidth;
    };
};




/* Make Calculator Draggable */
// On Calculator Top Wrapper Mouse Down: 
let isDraggable = false;

document.querySelector('.calculatorTopWrapper').addEventListener('mousedown' , (e) => {
    document.querySelector('.calculatorTopWrapper').style.cursor = "grabbing";                                                                                                                                                                                                                                                                                                                       
    isDraggable = true;
    // Find the difference between mouse click (location) + how far top left of calcular is from screen
    let offsetX = (e.clientX - calculator.offsetLeft);
    let offsetY = (e.clientY - calculator.offsetTop);
    // If the mouse is down and moving, top left of the calculator follows the mouse (relative to top left of calculator)
    document.addEventListener('mousemove' , (e) => {
        if (isDraggable) {
            calculator.style.left = `${e.clientX - offsetX}px`;
            calculator.style.top = `${e.clientY - offsetY}px`;
        }; 
    });

// Stop calculator from following mouse on mouse up + change back cursor
    document.addEventListener('mouseup' , () => {
        isDraggable = false;
        document.querySelector('.calculatorTopWrapper').style.cursor = "default";

    })
});

// If the calculator isn't being grabbed, change cursor to "grab" on hover
document.querySelector('.calculatorTopWrapper').addEventListener('mouseover',() => {
    if (!isDraggable) {
        document.querySelector('.calculatorTopWrapper').style.cursor = "grab";
    }
})


/* Reset Calculator Position */
let clickToReset = document.querySelector('.clickToReset');
let resetButtonDown = false;

// On mouse down change "click to reset" background color
clickToReset.addEventListener('mousedown' , () => {
    clickToReset.style.backgroundColor =  "#363636";
    resetButtonDown = true;
});

// On mouse up change "click to reset" background color, and reset calculator position
document.addEventListener('mouseup' , () => {
    if (resetButtonDown) {
        calculator.style.top = "230px";
        calculator.style.left = "50%";
        clickToReset.style.backgroundColor =  "transparent";
    };
    resetButtonDown = false;
});

/* Fade Keypad Buttton If Clicked */
const allButtons = document.querySelectorAll('button');
let keypadButtonPressed = false

// Add event listeners to all buttons that add the button filter once pressed
allButtons.forEach((currentButton) => {
    // Store get current button child (to add filter before it)
    
    const numberDiv = currentButton.firstElementChild;
    // When an individual button is pressed create a div for the parent that was clicked, and insert it 
    currentButton.addEventListener('mousedown' , () => {
        keypadButtonPressed = true;
        const buttonFilter = document.createElement("div");
        buttonFilter.classList.add("btnFilter");
        currentButton.insertBefore(buttonFilter,numberDiv);
    });
});

// Once mouse is released(if button was pressed), remove the element that was added (faded button)

document.addEventListener('mouseup',() => {
    if (keypadButtonPressed && document.querySelector(".btnFilter")) {
        document.querySelector(".btnFilter").remove()
    };  
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                CALCULATOR        
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* Keypad Number Variables */
const keypadNumberZero = document.querySelector('#zero');
const keypadNumberOne = document.querySelector('#one');
const keypadNumberTwo = document.querySelector('#two');
const keypadNumberThree = document.querySelector('#three');
const keypadNumberFour = document.querySelector('#four');
const keypadNumberFive = document.querySelector('#five');
const keypadNumberSix = document.querySelector('#six');
const keypadNumberSeven = document.querySelector('#seven');
const keypadNumberEight = document.querySelector('#eight');
const keypadNumberNine = document.querySelector('#nine');

/* Keypad Operator Variables */
const keypadOperatorMultiplication = document.querySelector('#multiplication');
const keypadOperatorDivision = document.querySelector('#division');
const keypadOperatorAddition = document.querySelector('#addition');
const keypadOperatorSubtraction = document.querySelector('#subtraction');
const keypadOperatorEquals = document.querySelector('#equals');

// Keypad AC/Backspace //
const keypadClearEquationAC = document.querySelector('#ac');

// Keypad Decimal Point //
const keypadDecimalPoint = document.querySelector('#decimalPoint');

// Keypad Plus/Minus //
const keypadPlusMinus = document.querySelector('#plusMinus');

// Keypad Convert To Percentage //
const keypadPercentage = document.querySelector('#percentage');

// Number Entry, Operator Entry //
let numberEntry = true;
let operatorEntry = false;

// Initialize Equation, Equation UI, Current Number //
let userEquation = [];
let userEquationUIDisplay = [];
let currentNumber = [];

// Joined Current Number //
let currentNumberJoined;

// If true, calculator (equation) is clear //
let clearCalculation = true;




/* Add the currentNumber (joined) to userEquation */
function addCurrentNumberToEquation() {
    // If the last item in userEquation is different than an operator (a number), take off the last number
    if (userEquation[userEquation.length-1] != "*" && userEquation[userEquation.length-1] != "/" && userEquation[userEquation.length-1] != "%" && userEquation[userEquation.length-1] != "+" && userEquation[userEquation.length-1] != "-") {
        userEquation.pop();
        userEquationUIDisplay.pop();
    }

    // If the currentNumber is empty and the userEquation is empty, clearCalculation is true
    if (currentNumber.length === 0 && userEquation.length === 0) {
        clearCalculation = true;
    };
    
    // If there isn't a clear calculation: combine the current number and push to user equation (number and string (result window) arrays). If not, empty both arrays.
    if (!clearCalculation) { // If there are numbers in the equation
        currentNumberJoined = currentNumber.join(""); // Join current number and save into a new variable, currentNumberJoined
        userEquation.push(Number(currentNumberJoined)); // Push the combined number (currentNumberJoined) to userEquation (and convert to number) and userEquationUIDisplay (and convert to string)
        userEquationUIDisplay.push(currentNumberJoined)
    } else {
        userEquation = [];
        userEquationUIDisplay = [];
    };
};



/* Update Display Result: If userEquation is greater than Zero, the text in the result window is userEquationUIDisplay joined. If not, the text is 0. */ 
function updateDisplayResult() {
    if (userEquation.length > 0) {
        document.querySelector('.calculatorResultWindow').textContent = userEquationUIDisplay.join("");
        resultWindowScrollToRight() // Check if calculator equation is out of view, and scroll to right
    } else {
        document.querySelector('.calculatorResultWindow').textContent = "0";
    }
    
}


/* Keypad Plus Minus: Convert last number in the equation to a negative number/positive number */
keypadPlusMinus.addEventListener('click', () => {
    if (operatorEntry && userEquation[userEquation.length-1] != "%")  { // If the last item in the equation is a number and different than "%"
        // For the userEquation: Multiply the last number by -1
        userEquation[userEquation.length-1] = userEquation[userEquation.length-1] * -1; // Multiply the last number in userEquation by -1
        // For the userEquationUIDisplay: 
        currentNumber[0] = currentNumber[0] * -1; // Multiply the first number in current number by -1
        currentNumberJoined = currentNumber.join(""); // Join the current number
        userEquationUIDisplay.pop()
        userEquationUIDisplay.push(currentNumberJoined); // Push the currentNumberJoined to userEquationUIDisplay.
        updateDisplayResult(); // Update the display
    } else if (userEquation[userEquation.length-1] === "%") { // If the last entry is "%"
        // For the userEquation: Multiply the 2nd to last number by -1 (skipping %)
        userEquation[userEquation.length-2] = userEquation[userEquation.length-2] * -1; // Multiply the 2nd to last number by -1
        userEquationUIDisplay[userEquationUIDisplay.length-2] = userEquation[userEquation.length-2].toString() // Update the 2nd to last number to be userEquation's 2nd to last number and convert to a string
        updateDisplayResult();
    };
});




/* Decimal Point Event Listener: Add decimal point to current number, userEquation and userEquationUIDisplay  */
keypadDecimalPoint.addEventListener('click', keypadDecimalPointEvent);
document.addEventListener('keydown', (event) => {
    if (event.key === ".") {
        keypadDecimalPointEvent();
    };
});

function keypadDecimalPointEvent() {
    if (!currentNumber.includes(".")) { // If there is no decimal in the current number
        // if the current number is 0 and the decimal number is pressed, add 0.1
        if (currentNumber.length === 0 && userEquation.length === 0) {  // Only and current number is 0
            // push 0.1 to currentNumber (seperately)
            currentNumber.push(0);
            currentNumber.push(".");
            userEquation.push(0.);
            // push "0." to userEquationUIDisplay
            userEquationUIDisplay.push("0.");
            updateDisplayResult();
            // Clear calculation, allow operator and numbers
            clearCalculation = false;
            operatorEntry = true;
            numberEntry = true;
        } else { // If userEquation isn't clear, add "." to the current equation 
            if (numberEntry || currentNumber == 0) { // if the current number is 0, or number entry is true 
                clearCalculation = false;
                operatorEntry = true;
                currentNumber.push(".");
                addCurrentNumberToEquation(); // join current equation remove the last item from userEquationand add the joined equation to userEquation
                updateDisplayResult();
                numberEntry = true;
            };
        }
        
    };  
};


/* Keypad 0 Event Listener: If the calculation isn't clear or the current number is different than 0, Add zero */

keypadNumberZero.addEventListener('click',keypadNumberZeroEvent);
document.addEventListener('keydown', (event) => {
    if (event.key === "0") {
        keypadNumberZeroEvent();
    };
});

function keypadNumberZeroEvent() {
    let keypadZeroActive;
    // If userEquation greater than 0
    if (userEquation.length > 0) {
        // If the current number is zero, keypadZeroActive, numberEntry is false. Otherwise true
        if (currentNumber.length === 1 && currentNumber[currentNumber.length-1] === 0) {
            keypadZeroActive = false;
            numberEntry = false;
        } else {
            keypadZeroActive = true;
            numberEntry = true;
        };
        // If the current number is 0, don't allow other numbers to be entered
        if (!keypadZeroActive) {
            numberEntry = false;
        };
        // If the current number isnt zero and userEquation is not clear
        if (keypadZeroActive && userEquation.length > 0) {
            operatorEntry = true; // Allow an operator to be entered
            clearCalculation = false; // The equation isn't clear
            currentNumber.push(0); // push 0 to the current number
            addCurrentNumberToEquation(); // join the current number and push to userEquation
            updateDisplayResult();
        };
    };
};

/* Keypad 1 Event Listener: If numberEntry is true (last number in the equation isn't 0), add one to the equation*/

keypadNumberOne.addEventListener('click',keypadNumberOneEvent);
document.addEventListener('keydown', (event) => {
    if (event.key === "1") {
        keypadNumberOneEvent();
    };

});

function keypadNumberOneEvent() {
    if (numberEntry) {
        clearCalculation = false;
        operatorEntry = true;
        currentNumber.push(1);
        addCurrentNumberToEquation();
        updateDisplayResult();
    };
    // If the userEquation isn't empty, remove the "ac" text in button and replace it with the backspace image
    document.querySelector('#acText').style.display = "none"; // If one is pressed, the equation isn't 0 and the ac text should be hidden
    document.querySelector("#backspaceImage").style.display = "block"; // If one is pressed, the equation isn't 0 and the backspace icon should be visable
    document.querySelector(".calculatorPreviousEquationWindow").textContent = ""
};




/* Keypad 2 Event Listener: If numberEntry is true (last number in the equation isn't 0), add one to the equation*/

keypadNumberTwo.addEventListener('click',keypadNumberTwoEvent);
document.addEventListener('keydown', (event) => {
    if (event.key === "2") {
        keypadNumberTwoEvent();
    };

});

function keypadNumberTwoEvent() {
    if (numberEntry) {
        clearCalculation = false;
        operatorEntry = true;
        currentNumber.push(2);
        addCurrentNumberToEquation();
        updateDisplayResult();
    };
    // If the userEquation isn't empty, remove the "ac" text in button and replace it with the backspace image
    document.querySelector('#acText').style.display = "none"; // If one is pressed, the equation isn't 0 and the ac text should be hidden
    document.querySelector("#backspaceImage").style.display = "block"; // If one is pressed, the equation isn't 0 and the backspace icon should be visable
    document.querySelector(".calculatorPreviousEquationWindow").textContent = ""
};

/* Keypad 3 Event Listener: If numberEntry is true (last number in the equation isn't 0), add one to the equation*/

keypadNumberThree.addEventListener('click',keypadNumberThreeEvent);
document.addEventListener('keydown', (event) => {
    if (event.key === "3") {
        keypadNumberThreeEvent();
    };

});

function keypadNumberThreeEvent() {
    if (numberEntry) {
        clearCalculation = false;
        operatorEntry = true;
        currentNumber.push(3);
        addCurrentNumberToEquation();
        updateDisplayResult();
    };
    // If the userEquation isn't empty, remove the "ac" text in button and replace it with the backspace image
    document.querySelector('#acText').style.display = "none"; // If one is pressed, the equation isn't 0 and the ac text should be hidden
    document.querySelector("#backspaceImage").style.display = "block"; // If one is pressed, the equation isn't 0 and the backspace icon should be visable
    document.querySelector(".calculatorPreviousEquationWindow").textContent = ""
};
  
/* Keypad 4 Event Listener: If numberEntry is true (last number in the equation isn't 0), add one to the equation*/

keypadNumberFour.addEventListener('click',keypadNumberFourEvent);
document.addEventListener('keydown', (event) => {
    if (event.key === "4") {
        keypadNumberFourEvent();
    };

});

function keypadNumberFourEvent() {
    if (numberEntry) {
        clearCalculation = false;
        operatorEntry = true;
        currentNumber.push(4);
        addCurrentNumberToEquation();
        updateDisplayResult();
    };
    // If the userEquation isn't empty, remove the "ac" text in button and replace it with the backspace image
    document.querySelector('#acText').style.display = "none"; // If one is pressed, the equation isn't 0 and the ac text should be hidden
    document.querySelector("#backspaceImage").style.display = "block"; // If one is pressed, the equation isn't 0 and the backspace icon should be visable
    document.querySelector(".calculatorPreviousEquationWindow").textContent = ""
};


/* Keypad 5 Event Listener: If numberEntry is true (last number in the equation isn't 0), add one to the equation*/

keypadNumberFive.addEventListener('click',keypadNumberFiveEvent);
document.addEventListener('keydown', (event) => {
    if (event.key === "5") {
        keypadNumberFiveEvent();
    };

});

function keypadNumberFiveEvent() {
    if (numberEntry) {
        clearCalculation = false;
        operatorEntry = true;
        currentNumber.push(5);
        addCurrentNumberToEquation();
        updateDisplayResult();
    };
    // If the userEquation isn't empty, remove the "ac" text in button and replace it with the backspace image
    document.querySelector('#acText').style.display = "none"; // If one is pressed, the equation isn't 0 and the ac text should be hidden
    document.querySelector("#backspaceImage").style.display = "block"; // If one is pressed, the equation isn't 0 and the backspace icon should be visable
    document.querySelector(".calculatorPreviousEquationWindow").textContent = ""
};


/* Keypad 6 Event Listener: If numberEntry is true (last number in the equation isn't 0), add one to the equation*/

keypadNumberSix.addEventListener('click',keypadNumberSixEvent);
document.addEventListener('keydown', (event) => {
    if (event.key === "6") {
        keypadNumberSixEvent();
    };

});

function keypadNumberSixEvent() {
    if (numberEntry) {
        clearCalculation = false;
        operatorEntry = true;
        currentNumber.push(6);
        addCurrentNumberToEquation();
        updateDisplayResult();
    };
    // If the userEquation isn't empty, remove the "ac" text in button and replace it with the backspace image
    document.querySelector('#acText').style.display = "none"; // If one is pressed, the equation isn't 0 and the ac text should be hidden
    document.querySelector("#backspaceImage").style.display = "block"; // If one is pressed, the equation isn't 0 and the backspace icon should be visable
    document.querySelector(".calculatorPreviousEquationWindow").textContent = ""
};



/* Keypad 7 Event Listener: If numberEntry is true (last number in the equation isn't 0), add one to the equation*/

keypadNumberSeven.addEventListener('click',keypadNumberSevenEvent);
document.addEventListener('keydown', (event) => {
    if (event.key === "7") {
        keypadNumberSevenEvent();
    };

});

function keypadNumberSevenEvent() {
    if (numberEntry) {
        clearCalculation = false;
        operatorEntry = true;
        currentNumber.push(7);
        addCurrentNumberToEquation();
        updateDisplayResult();
    };
    // If the userEquation isn't empty, remove the "ac" text in button and replace it with the backspace image
    document.querySelector('#acText').style.display = "none"; // If one is pressed, the equation isn't 0 and the ac text should be hidden
    document.querySelector("#backspaceImage").style.display = "block"; // If one is pressed, the equation isn't 0 and the backspace icon should be visable
    document.querySelector(".calculatorPreviousEquationWindow").textContent = ""
};

/* Keypad 8 Event Listener: If numberEntry is true (last number in the equation isn't 0), add one to the equation*/

keypadNumberEight.addEventListener('click',keypadNumberEightEvent);
document.addEventListener('keydown', (event) => {
    if (event.key === "8") {
        keypadNumberEightEvent();
    };

});

function keypadNumberEightEvent() {
    if (numberEntry) {
        clearCalculation = false;
        operatorEntry = true;
        currentNumber.push(8);
        addCurrentNumberToEquation();
        updateDisplayResult();
    };
    // If the userEquation isn't empty, remove the "ac" text in button and replace it with the backspace image
    document.querySelector('#acText').style.display = "none"; // If one is pressed, the equation isn't 0 and the ac text should be hidden
    document.querySelector("#backspaceImage").style.display = "block"; // If one is pressed, the equation isn't 0 and the backspace icon should be visable
    document.querySelector(".calculatorPreviousEquationWindow").textContent = ""
};

/* Keypad 9 Event Listener: If numberEntry is true (last number in the equation isn't 0), add one to the equation*/

keypadNumberNine.addEventListener('click',keypadNumberNineEvent);
document.addEventListener('keydown', (event) => {
    if (event.key === "9") {
        keypadNumberNineEvent();
    };

});

function keypadNumberNineEvent() {
    if (numberEntry) {
        clearCalculation = false;
        operatorEntry = true;
        currentNumber.push(9);
        addCurrentNumberToEquation();
        updateDisplayResult();
    };
    // If the userEquation isn't empty, remove the "ac" text in button and replace it with the backspace image
    document.querySelector('#acText').style.display = "none"; // If one is pressed, the equation isn't 0 and the ac text should be hidden
    document.querySelector("#backspaceImage").style.display = "block"; // If one is pressed, the equation isn't 0 and the backspace icon should be visable
    document.querySelector(".calculatorPreviousEquationWindow").textContent = ""
};





/* Keypad Percent/Modulo Event Listener: */


keypadPercentage.addEventListener('click' , () => {
    // If the last entry was an operator and userEquation 2nd to last entry is %, remove the last operator
    if (!operatorEntry && userEquation[userEquation.length-2] === "%") {
        userEquation.pop();
        userEquationUIDisplay.pop();
        updateDisplayResult();
        numberEntry = true;
    };

    // If the last number was an entry, clear the current number and add "%" to userEquation
    if (operatorEntry) {
        currentNumber = [];
        userEquation.push("%");
        userEquationUIDisplay.push("%");   
        updateDisplayResult();  
        numberEntry = true;
    };
    // If theres a clear calculation, clear the current number, push 0 and "%" to both userEquation and userEquationUIDisplay and allow number entries
    if (clearCalculation) {
        currentNumber = [];
        userEquation.push(0);
        userEquation.push("%");
        userEquationUIDisplay.push("0");
        userEquationUIDisplay.push("%");
        updateDisplayResult();  
        numberEntry = true;
    };
});   




/* Keypad Multiplication Event Listener: */
keypadOperatorMultiplication.addEventListener('click' , () => {   
    // If the last number was an entry, clear the current number and add "*/×" to userEquation
    if (operatorEntry) {
        currentNumber = [];
        userEquation.push("*");
        userEquationUIDisplay.push("×");
        operatorEntry = false;
        updateDisplayResult();  
        numberEntry = true;
    };
    // If theres a clear calculation, clear the current number, push 0 and "*/×" to both userEquation and userEquationUIDisplay and allow number entries
    if (clearCalculation) {
        currentNumber = [];
        userEquation.push(0);
        userEquation.push("*");
        userEquationUIDisplay.push("0");
        userEquationUIDisplay.push("×");
        operatorEntry = false;
        updateDisplayResult();  
        numberEntry = true;
    };
});        


/* Keypad Division Event Listener: */
keypadOperatorDivision.addEventListener('click' , () => {   
    // If the last number was an entry, clear the current number and add "/ or ÷" to userEquation
    if (operatorEntry) {
        currentNumber = [];
        userEquation.push("/");
        userEquationUIDisplay.push("÷");
        operatorEntry = false;
        updateDisplayResult();  
        numberEntry = true;
    };
    // If theres a clear calculation, clear the current number, push 0 and "/ or ÷" to both userEquation and userEquationUIDisplay and allow number entries
    if (clearCalculation) {
        currentNumber = [];
        userEquation.push(0);
        userEquation.push("/");
        userEquationUIDisplay.push("0");
        userEquationUIDisplay.push("÷");
        operatorEntry = false;
        updateDisplayResult();  
        numberEntry = true;
    };
});

/* Keypad Addition Event Listener: */
keypadOperatorAddition.addEventListener('click' , () => {   
    // If the last number was an entry, clear the current number and add "+" to userEquation
    if (operatorEntry) {
        currentNumber = [];
        userEquation.push("+");
        userEquationUIDisplay.push("+");
        operatorEntry = false;
        updateDisplayResult();  
        numberEntry = true;
    };
    // If theres a clear calculation, clear the current number, push 0 and "+" to both userEquation and userEquationUIDisplay and allow number entries
    if (clearCalculation) {
        currentNumber = [];
        userEquation.push(0);
        userEquation.push("+");
        userEquationUIDisplay.push("0");
        userEquationUIDisplay.push("+");
        operatorEntry = false;
        updateDisplayResult();  
        numberEntry = true;
    };
});      

/* Keypad Subtraction Event Listener: */
keypadOperatorSubtraction.addEventListener('click' , () => {   
    // If the last number was an entry, clear the current number and add "-" to userEquation
    if (operatorEntry) {
        currentNumber = [];
        userEquation.push("-");
        userEquationUIDisplay.push("-");
        operatorEntry = false;
        updateDisplayResult();  
        numberEntry = true;
    };
    // If theres a clear calculation, clear the current number, push 0 and "-" to both userEquation and userEquationUIDisplay and allow number entries
    if (clearCalculation) {
        currentNumber = [];
        userEquation.push(0);
        userEquation.push("-");
        userEquationUIDisplay.push("0");
        userEquationUIDisplay.push("-");
        operatorEntry = false;
        updateDisplayResult();  
        numberEntry = true;
    };
});   



/* Keypad AC/Backspace Event Listener: Remove last entry */

keypadClearEquationAC.addEventListener('mouseup', keypadBackspaceEvent);
document.addEventListener('keydown', (event) => {
    if (event.key === "Backspace") {
        keypadBackspaceEvent();
    }
});

function keypadBackspaceEvent() {
    if (clearAfterComputedEquation) {
        updateDisplayResult();
        document.querySelector('.calculatorPreviousEquationWindow').textContent = ""
    };
    
    // If userEquation isn't clear
    if (userEquation.length > 0) {
        numberEntry = true; // Allow number entries (is a number or operator is removed)
        // If the last entry is an operator (change to !operator)
        if (userEquation[userEquation.length-1] === "*" || userEquation[userEquation.length-1] === "/" || userEquation[userEquation.length-1] === "%" ||  userEquation[userEquation.length-1] === "+" ||  userEquation[userEquation.length-1] === "-" ) {
            userEquation.pop(); // Remove the last entry from userEquation
            userEquationUIDisplay.pop(); // Remove the last entry from userEquationUIDisplay
            currentNumber = userEquationUIDisplay[userEquationUIDisplay.length-1].toString().split(""); // the current number is the last entry (after removal) split
            numberEntry = true;
            
            // If the current and only number in the userEquation is 0, clear the equation 
            if (currentNumber[0] === "0" && currentNumber.length === 1 && userEquation.length === 1 ) {
                currentNumber = [];
                userEquation = [];
                userEquationUIDisplay = [];
            };

            // (After the removal + clearing userEquation) if userEquation is empty, operatorEntry is false (allow 0x), and the calculation is clear. Otherwuse operatorEntry is true
            if (userEquation.length === 0) {
                operatorEntry = false;
                clearCalculation = true;
            } else {
                operatorEntry = true;
            };
            
            // If the current number is negative, remove the "-" negative symbol and 1st number, and replace it with the negative first number 
            if (currentNumber.includes("-")) {
                currentNumber.splice(0,2,currentNumber[1]*-1);
            };
            updateDisplayResult();
        } else { // If the last entry is a number
            if (currentNumber.length > 1) { // If the current number has more than one digit
                currentNumber.pop(); // Remove the last digit on current number
                if (userEquation[userEquation.length-1] < 0) { // If the last number in userEquation is negative
                    userEquation[userEquation.length-1] = Number(currentNumber.join("")) * -1; // Update the last number (negative )in userEquation to the current number joined (just removed a digit) + convert to a number
                };
                userEquationUIDisplay[userEquationUIDisplay.length-1] = currentNumber.join(""); // Update userEquationUIDisplay last number to current number joined (first digit already negative)
                updateDisplayResult();
            } else { // If current number only has one digit: remove that digit from userEquation, userEquationUIDisplay, and current number, and update the display
                currentNumber.pop();
                userEquation.pop();
                userEquationUIDisplay.pop();
                updateDisplayResult();
                operatorEntry = false;
                clearCalculation = true;
            };
        };
    };

    // If userEquation is clear, make the AC button text ("AC") visable, and hide the backspace image
    if (userEquation.length === 0) {
        document.querySelector('#acText').style.display = "block";
        document.querySelector("#backspaceImage").style.display = "none";
    };
};






/* Keypad AC/Backspace Event Listener: Clear Equation */
keypadClearEquationAC.addEventListener('mousedown', () => {
    let timeOnMouseDown = new Date().getTime(); // Time of mouse down
    const mouseupClearEquation = () => { // Mouseup function
        let timeOnMouseUp = new Date().getTime(); // Time of mouse up
        if ((timeOnMouseUp - timeOnMouseDown) > 1000) { // If time between mouse up and mouse down is over 1 second, clear the equation
            currentNumber = [];
            userEquation = [];
            userEquationUIDisplay = [];
            updateDisplayResult();
            document.querySelector('#acText').style.display = "block";
            document.querySelector("#backspaceImage").style.display = "none";

        };
        keypadClearEquationAC.removeEventListener('mouseup', mouseupClearEquation); // remove mouse up event listener
    };
    keypadClearEquationAC.addEventListener('mouseup', mouseupClearEquation, {once: true}); // Mouse up event listener can only be triggered once (backup)
});




/* Keypad Equals Event Listener: */
let clearAfterComputedEquation = false;

keypadOperatorEquals.addEventListener('click', () => {
    // If the result is infinity, give an error
    
    if (operatorEntry && userEquation.length > 0) {//If the last entry wasn't an operator
        document.querySelector('.calculatorPreviousEquationWindow').textContent =  userEquationUIDisplay.join(""); // Previous equation window is the user equation
        convertToDecimal(); // Convert all independent (0%) to decimal
        computeUserEquation() // compute user equation

        if (userEquation[0] === Infinity) { 
            document.querySelector('.calculatorPreviousEquationWindow').textContent =  userEquationUIDisplay.join(""); // Previous equation window is the user equation
            document.querySelector('.calculatorResultWindow').textContent = "ERROR";
            
        } else {
            if (userEquation[0].toString().includes(".")) { // If the result has a decimal point
                let resultSplitByDecimal = userEquation[0].toString().split("."); // Result split by decimal
                if (resultSplitByDecimal[1].split("").length >= 2) { // If the result's decimal point is greater or equal to zero, round it to 2 decimal places. If less, to 1.
                    document.querySelector('.calculatorResultWindow').textContent = userEquation[0].toFixed(2);
                } else {
                    document.querySelector('.calculatorResultWindow').textContent = userEquation[0].toFixed(1);
                }; 
            } else { // If the result doesn't have a decimal, the text in the result window is the computed result
                document.querySelector('.calculatorResultWindow').textContent = userEquation[0];
            }
        };   

        // Clear the calculator + settings
        userEquation = [];
        userEquationUIDisplay = [];
        currentNumber = [];
        document.querySelector('#acText').style.display = "block";
        document.querySelector("#backspaceImage").style.display = "none";
        clearAfterComputedEquation = true;
        operatorEntry = false;
    };
});















/* Calculator "Calculations" */

function convertToDecimal() {
    
    if (userEquation[userEquation.length-1] === "%") {
        let numberConvertedToPercentage = userEquation[userEquation.length-2] * 0.01; // convert the number that comes before "*" to a decimal
        userEquation.splice(userEquation.length-2,2,numberConvertedToPercentage); // Remove the number and decimal point and add the decimal number
    };

    for (let i = userEquation.length; i >= 0; i--) {
        if (userEquation[i] === "*" && userEquation[i-1] === "%" && typeof userEquation[i-2] === "number") { // If "%" comes before an operator
            let numberConvertedToPercentage = userEquation[i-2] * 0.01; // convert the number that comes before "*" to a decimal
            userEquation.splice(i-2,2,numberConvertedToPercentage); // Remove the number and decimal point and add the decimal number
        };
    };

    for (let i = userEquation.length; i >= 0; i--) {
        if (userEquation[i] === "/" && userEquation[i-1] === "%" && typeof userEquation[i-2] === "number") { // If "%" comes before an operator
            let numberConvertedToPercentage = userEquation[i-2] * 0.01; // convert the number that comes before "/" to a decimal
            userEquation.splice(i-2,2,numberConvertedToPercentage); // Remove the number and decimal point and add the decimal number
        };
    };

    for (let i = userEquation.length; i >= 0; i--) {
        if (userEquation[i] === "+" && userEquation[i-1] === "%" && typeof userEquation[i-2] === "number") { // If "%" comes before an operator
            let numberConvertedToPercentage = userEquation[i-2] * 0.01; // convert the number that comes before "+" to a decimal
            userEquation.splice(i-2,2,numberConvertedToPercentage); // Remove the number and decimal point and add the decimal number
        };
    };

    for (let i = userEquation.length; i >= 0; i--) {
        if (userEquation[i] === "-" && userEquation[i-1] === "%" && typeof userEquation[i-2] === "number") { // If "%" comes before an operator
            let numberConvertedToPercentage = userEquation[i-2] * 0.01; // convert the number that comes before "-" to a decimal
            userEquation.splice(i-2,2,numberConvertedToPercentage); // Remove the number and decimal point and add the decimal number
        };
    };
    console.log(userEquation)
};


function computeUserEquation() {
    
    // If there is modulo in the equation
    while (userEquation.includes("%")) {
        let moduloArrayIndex = userEquation.indexOf("%"); // Find the first instance of 
        let currentResult = modulo(userEquation[moduloArrayIndex-1], userEquation[moduloArrayIndex+1]);
        userEquation.splice(moduloArrayIndex-1,3,currentResult);
    
    }
    
    // If there is multiplication or division in the equation
    while (userEquation.includes("*") || userEquation.includes("/")) {
        // Find the index of the first multiplication and division operator in the equation array
        let multiplicationArrayIndex = userEquation.indexOf("*");
        let divisionArrayIndex = userEquation.indexOf("/");
        // Determine if this is the last equation
        if (userEquation.includes("*") && !userEquation.includes("/")) {
            multiplyFilter = true;
            divideFilter = false;
        } else if (userEquation.includes("/") && !userEquation.includes("*")) {
            multiplyFilter = false;
            divideFilter = true;
        }
        // If the multiplication or division comes first filter
        if (multiplicationArrayIndex < divisionArrayIndex && userEquation.includes("*")) {
            multiplyFilter = true;
            divideFilter = false;
        } else if (divisionArrayIndex < multiplicationArrayIndex && userEquation.includes("/")) {
            multiplyFilter = false;
            divideFilter = true;
        }
        // Multiplication or division equation in order of operations (whichever comes first) + push the result to the equation array
        if (multiplyFilter) {
            let currentResult = multiplication(userEquation[multiplicationArrayIndex-1], userEquation[multiplicationArrayIndex+1]);
            //console.log(`Multiplication: ${userEquation[multiplicationArrayIndex-1]} * ${userEquation[multiplicationArrayIndex+1]} = ${currentResult}`) 
            userEquation.splice(multiplicationArrayIndex-1,3,currentResult);
            //console.log(`The updated equation is: ${userEquation}`);
            
        } else {
            let currentResult = division(userEquation[divisionArrayIndex-1], userEquation[divisionArrayIndex+1]);
            //console.log(`Division: ${userEquation[divisionArrayIndex-1]} / ${userEquation[divisionArrayIndex+1]} = ${currentResult}`)
            userEquation.splice(divisionArrayIndex-1,3,currentResult);
            //console.log(`The updated equation is: ${userEquation}`);
        }
    };
    
    
    // If there is at least one equation left, addition or subtraction equation in order of operations (whichever is index 1) + push the result to the equation array
    while(userEquation.length >= 3) {
        if (userEquation[1] === "+") {
            let additionArrayIndex = userEquation.indexOf("+");
            let currentResult = addition(userEquation[additionArrayIndex-1], userEquation[additionArrayIndex+1]);
            userEquation.splice(additionArrayIndex-1,3,currentResult);
        } else {
            let subtractionArrayIndex = userEquation.indexOf("-");
            let currentResult = subtraction(userEquation[subtractionArrayIndex-1], userEquation[subtractionArrayIndex+1]);
            userEquation.splice(subtractionArrayIndex-1,3,currentResult);
        }
    };
};





// Pemdas Functions
function modulo(numberOne,numberTwo) {
    return numberOne % numberTwo 
};

function multiplication(numberOne,numberTwo) {
    return numberOne * numberTwo 
};

function division(numberOne,numberTwo) {
    return numberOne / numberTwo
};

function addition(numberOne,numberTwo) {
    return numberOne + numberTwo
};

function subtraction(numberOne,numberTwo) {
    return numberOne - numberTwo
};

function operate() {
if (operator === "*") return multiplication()
};




