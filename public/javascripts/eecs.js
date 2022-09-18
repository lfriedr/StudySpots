//reference to converter input and output boxes
const numForm = document.querySelector('#numForm');
const ansBox = document.querySelector('#answerBox');
const twosBox = document.querySelector('#twosBox');
const twosCompInfo = document.querySelector('#twosInfo');

const select1 = document.querySelector('#radixSelect1');
const select2 = document.querySelector('#radixSelect2');


//when click submit: get input, call funct
numForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const numberInput = numForm.elements.numInput;
    console.log("hi")
    //dec to bin call
    if ((select1.value == 'Decimal') && (select2.value == 'Binary')) {
        ansDtoB(numberInput.value);
    }
    //dec to hex call
    else if ((select1.value == 'Decimal') && (select2.value == 'Hexadecimal')) {
        ansDtoH(numberInput.value);
    }
    //hex to dec call
    else if ((select1.value == 'Hexadecimal') && (select2.value == 'Decimal')) {
        ansHtoD(numberInput.value);
    }
    //hex to bin call
    else if ((select1.value == 'Hexadecimal') && (select2.value == 'Binary')) {
        ansHtoB(numberInput.value);
    }
    //bin to dec call
    else if ((select1.value == 'Binary') && (select2.value == 'Decimal')) {
        ansBtoD(numberInput.value);
    }
    //bin to hex call
    else if ((select1.value == 'Binary') && (select2.value == 'Hexadecimal')) {
        ansBtoH(numberInput.value);
    }
    numberInput.value = '';
});

//dec to bin
const ansDtoB = (num) => {
   let x = parseInt(num);
   ansBox.value = x.toString(2);
   if (twosCompInfo.classList.contains('hide')) {
    twosCompInfo.classList.toggle('hide');
    }
    if (x < 0) {
        let y = 65535;
        x = x & y;
    }
    twosBox.value = x.toString(2);
}

// dec to hex
const ansDtoH = (num) => {
    let x = parseInt(num);
    ansBox.value = x.toString(16);
    if (twosCompInfo.classList.contains('hide')) {
        twosCompInfo.classList.toggle('hide');
    }
    if (x >= 0) {
        twosBox.value = x.toString(16);
    }
    else {
        //converts operands to signed 32-bit integers in two's complement format
        twosBox.value = (x>>>0).toString(16)
    }
}

// hex to dec
const ansHtoD = (num) => {
    let x = parseInt(num, 16);
    ansBox.value = x;
    twosBox.value = "";
    if (!twosCompInfo.classList.contains('hide')) {
        twosCompInfo.classList.toggle('hide');
    }
}

// hex to bin
const ansHtoB = (num) => {
    let dec = parseInt(num, 16);
    ansBox.value = dec.toString(2);
    twosBox.value = "";
    if (!twosCompInfo.classList.contains('hide')) {
        twosCompInfo.classList.toggle('hide');
    }
}

//bin to dec
const ansBtoD = (num) => {
    let x = parseInt(num, 2);
    ansBox.value = x;
    twosBox.value = "";
    if (!twosCompInfo.classList.contains('hide')) {
        twosCompInfo.classList.toggle('hide');
    }
}

//bin to hex
const ansBtoH = (num) => {
    let dec = parseInt(num, 2);
    ansBox.value = dec.toString(16);
    twosBox.value = "";
    if (!twosCompInfo.classList.contains('hide')) {
        twosCompInfo.classList.toggle('hide');
    }
}

//FINAL GRADE CALCULATOR 

// Projects (4 assignments, 10% each) = 40%
// Individual Homework (6 homeworks, drop 1 lowest) = 5%
// Lecture quizzes (22 quizzes, drop 5 lowest, 2 attempts per quiz) = 2.5%        
// Discussion participation (13 worksheets, completion grade, drop 1 lowest) = 2.5%        
// Midterm = 25%        
// Final exam = 25%

//ref to form and output box
const finalOut = document.querySelector('#finalGrade');
const finalForm = document.querySelector('#finForm');

//event when submit pressed
finalForm.addEventListener('submit', function (event) {
    event.preventDefault();
    calcGrade();
});

//calculates grade from inputs
const calcGrade = () => {
    const scoreInputs = finalForm.getElementsByClassName("scoreIn");
    let total = 0;
    for (let i = 0; i < scoreInputs.length; ++i) {
        let x = parseInt(scoreInputs[i].value);
        if ((scoreInputs[i].id == "hw1") ||
            (scoreInputs[i].id == "hw2") ||
            (scoreInputs[i].id == "hw3") ||
            (scoreInputs[i].id == "hw4") ||
            (scoreInputs[i].id == "hw5")) {
                x *= .1;
                total += x;
        }
        else if (scoreInputs[i].id == "hw0") {
            x *= .01;
            total += x;
        }
        else if (scoreInputs[i].id == "hw6") {
            x *= .15;
            total += x;
        }
        else if ((scoreInputs[i].id == "quiz") ||
                (scoreInputs[i].id == "part")) {
            x *= .05;
            total += x;
        }
        else if ((scoreInputs[i].id == "midterm") ||
        (scoreInputs[i].id == "finalExam")) {
            x *= .12;
            total += x;
        } 
        scoreInputs[i].value = '';  
        console.log(total);
    }
    finalOut.value = total;
}