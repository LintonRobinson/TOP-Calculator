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
}

// Update Time Every Second
setInterval(updateTime, 1000);
updateTime(); 

/* Remove Click To Drag Message After 5 Seconds */
setTimeout(() => {
    document.querySelector('.clickToDragMessage').style.display = "none"
} , "5000")

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
        buttonFilter.className = "btnFilter";
        currentButton.insertBefore(buttonFilter,numberDiv);
    });
});

// Once mouse is released(if button was pressed), remove the element that was added
document.addEventListener('mouseup',() => {
    if (keypadButtonPressed) {
        allButtons.forEach((currentButton) => {
            if(currentButton.childElementCount > 1) {
                currentButton.firstElementChild.remove();
            };
        });
    };  
})

////////////////////////////////////////////////////////////////////////////////////

let numOne = 1

let operator = "*"

let numTwo = 2

let currentResult



let userEquation = [20,"+",5,"-",612,"/",8,"/",-27,"/",0,"*",59,"-",1,"-",6,"*",1,"/",3,"+",74,"-",6];





/* Calculator "Calculations" */

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
        currentResult = multiplication(userEquation[multiplicationArrayIndex-1], userEquation[multiplicationArrayIndex+1]);
        //console.log(`Multiplication: ${userEquation[multiplicationArrayIndex-1]} * ${userEquation[multiplicationArrayIndex+1]} = ${currentResult}`) 
        userEquation.splice(multiplicationArrayIndex-1,3,currentResult);
        //console.log(`The updated equation is: ${userEquation}`);
        
    } else {
        currentResult = division(userEquation[divisionArrayIndex-1], userEquation[divisionArrayIndex+1]);
        //console.log(`Division: ${userEquation[divisionArrayIndex-1]} / ${userEquation[divisionArrayIndex+1]} = ${currentResult}`)
        userEquation.splice(divisionArrayIndex-1,3,currentResult);
        //console.log(`The updated equation is: ${userEquation}`);
    }
};


// If there is at least one equation left, addition or subtraction equation in order of operations (whichever is index 1) + push the result to the equation array
while(userEquation.length >= 3) {
    if (userEquation[1] === "+") {
        let additionArrayIndex = userEquation.indexOf("+");
        currentResult = addition(userEquation[additionArrayIndex-1], userEquation[additionArrayIndex+1]);
        userEquation.splice(additionArrayIndex-1,3,currentResult);
    } else {
        let subtractionArrayIndex = userEquation.indexOf("-");
        currentResult = subtraction(userEquation[subtractionArrayIndex-1], userEquation[subtractionArrayIndex+1]);
        userEquation.splice(subtractionArrayIndex-1,3,currentResult);
    }
}

    

// [2, '/', 9, '+', 24, '-', 9, '/', 7, '+', 130, '/', 2, '+', 3, '-', 67, '/', 8]

// [0.2222222222222222, '+', 24, '-', 1.2857142857142858, '+', 65, '+', 3, '-', 8.375]









    
   

    






// Pemdas

// Find location of operators in order of pemdas





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
}

