// const controlCharacters = [
//     {
//         value: 0,
//         string: ""
//     }
// ];

// const punchCardRowHeight = 35;
// let punchCardTopPosition = 0;

// const animateCard = {

//     cardTopRelative: 0,
//     feedCounter: 0,
//     feedInOut: function (direction, amountOfPunches) {

//         let punchCard = document.querySelectorAll(".punch-card");
//         let increment = 0;

//         if (direction == "up") {
//             console.log("up")
//             increment = -1 * punchCardRowHeight;
//         } else {
//             increment = punchCardRowHeight;
//         }
//         console.log(this.cardTopRelative)
//         this.cardTopRelative += increment;

//         console.log("delayed");

//         this.feedCounter++;
//         if (this.feedCounter < amountOfPunches) {
//             setTimeout(this.feedInOut(direction, amountOfPunches), 201);
//         }//closing for setTimeOut function
//     }//closing for punchUp function
// };


// let timerLoopCounter = 0, punchCount = 15;
// let punchCard = document.querySelectorAll(".punch-card");

// function punchFeed() {
//     punchCardTopPosition += punchCardRowHeight;
//     anime({
//         targets: punchCard,
//         translateY: (punchCardTopPosition),
//         duration: 200
//     });
//     console.log(punchCardTopPosition);

//     timerLoopCounter++;
//     if (timerLoopCounter < punchCount) {
//         setTimeout(punchFeed, 500);
//     }
// }

// function animateCard() {
//     punchFeed(punchCard);
// }

const rowFeedAnimationDelay = 250;
const cardRowHeight = 35;
let readMode = false;

function buildPunchAnimation(binaryArr, animDuration, rowHeight){
    let animationArray = [];
    for(let i=0; i < (binaryArr.length+1);i++){
        animationArray.push({
            duration: animDuration,
            value: ("-=" + rowHeight)
        });
    }
    return animationArray;
}

function moveRow(keyFrameArray){
    let punchCard = document.querySelectorAll(".punch-card");
    anime({
        targets: punchCard,
        translateY: keyFrameArray,
        duration: rowFeedAnimationDelay
    });
}


// function animateCard(cardTopPos, loopCounter, cardRowNumber){
//     if (loopCounter >= cardRowNumber) {
//         return;
//     }
//     moveRow(cardTopPos, delay);
//     cardTopPos+=35;
//     loopCounter+=1;
//     delay += 201;
//     setTimeout(animateCard(cardTopPos, loopCounter, cardRowNumber, delay), 1000);
// }


// function feed(){
//     for(let i=1; i<15; i++){
//     sleep(1500).then(() => {
//         animateCard(i*10);
//         console.log(i*10);
//       })
//     }
      
// }

$(document).ready(function () {

    //clear the message box on reload
    $(".message-input").val("");

    let messageInput = "";
    const blankRowLength = 12;
    let areHolesPunchable = false;

    //Clicking the process button triggers the processMessage function which converts the message to binary and punches out the card
    $(".submit-button").on("click", function (event) {

        if (readMode == false){
            //prevent user from manipulating holes in punch readout
            areHolesPunchable = false;
    
            //clear the punch card of content
            $(".punch-card").empty();
    
            //stope the message input
            messageInput = $(".message-input").val();
            console.log(messageInput);
    
            //process the message
            processMessage(messageInput);
        } else if(readMode == true){
            $(".message-input").val(readPunchedHoles());
        }
    });

    //Click event listener for READ button
    $(".blank-button").on("click", function (event) {

        if(readMode == true){
            setCardToBlank();
            //Allow the user to punch out holes
            areHolesPunchable = true;
        }
    });

    $(".mode-button").on("click", function (event) {
        if(readMode == false){
            readMode = true;
            $(".mode-button").html("READ");
            $(".blank-button").prop("disabled", false);

            console.log("read mode")
        } else if (readMode == true){
            readMode = false;
            $(".mode-button").html("PUNCH");
            $(".blank-button").prop("disabled", true);
            console.log("punch mode")
        }
        
        //Allow the user to punch out holes
    });

    //Click event listener for punch holes
    $(".punch-card").on("click", "div.punch-hole", function (event) {
        if (areHolesPunchable == true) {
            $(this).removeClass("punch-hole-closed");
        }
    });

    const processMessage = function (message) {

        let messageDecimalArray = [];
        let messageBinaryArray = [];

        //For the length of the entered message, each character in the message string is convereted to its UTF-8 decimal encoding number
        for (let i = 0; i < message.length; i++) {

            //Convert the character at position i to UTF-8 decimal code and push into the decimal array
            messageDecimalArray.push(message.charCodeAt(i));

            //Converting the decimal value to a binary string, storing it in an interim variable
            let binaryString = messageDecimalArray[i].toString(2);

            //Split the binary string into a single character array, then push this entire array into the master binary array ( creating a 2 dimensional array) 
            messageBinaryArray.push(binaryString.split(""));

        }

        //This code checks if the binary string is less than 8 characters. If it is, then it fills up the additional space ahead of the string with zero's by pushing them into the binary arrays.

        //Because UTF-8 characters 0-32 will never be used, the smallest binary value possible is therefore only 6 binary digits.

        for (let i = 0; i < messageBinaryArray.length; i++) {
            if (messageBinaryArray[i].length < 8) {
                let binaryLength = messageBinaryArray[i].length;

                for (let j = 0; j < (8 - binaryLength); j++) {
                    messageBinaryArray[i].unshift("0");
                }

                // switch (messageBinaryArray[i].length){
                //     case 6:
                //         messageBinaryArray[i].unshift("0");
                //         messageBinaryArray[i].unshift("0");
                //         break;
                //     case 7:
                //         messageBinaryArray[i].unshift("0");
                //         break;
                // }
            }
        }

        console.log(messageDecimalArray);
        console.log(messageBinaryArray);


        //Nested for loop: outer loop loops through each of the message characters, and for each character adds a div row to the punch card
        for (let i = 0; i < messageDecimalArray.length; i++) {

            //add a row to the punch card
            $(".punch-card").append(`<div class="punch-row punch-row${i}"></div>`);

            //Loop through each binary digit in the row for the character
            for (let j = 0; j < messageBinaryArray[i].length; j++) {

                //if the binary digit is a 1, print a punched hole into the row
                if (messageBinaryArray[i][j] === "1") {
                    $(".punch-row" + i).append(`<div class="punch-hole punch-hole${j}"></div>`);
                } else {
                    $(".punch-row" + i).append(`<div class="punch-hole punch-hole-closed punch-hole${j}"></div>`);
                }
            }

        }

    }//closing for process message function

    //This function fills the card completely with blank spaces
    function setCardToBlank() {

        //clear the punch card of html elements
        $(".punch-card").empty();

        //Clear the message box
        $(".message-input").val("");


        for (let i = 0; i < blankRowLength; i++) {

            //add div rows to card which will hold the holes
            $(".punch-card").append(`<div class="punch-row punch-row${i}"></div>`);
            for (j = 0; j < 8; j++) {

                //Print out all unpunched spaces
                $(".punch-row" + i).append(`<div class="punch-hole punch-hole-closed punch-hole${j}"></div>`);
            }
        }
    }//closing for setCardToBlank function

    //This section reads the data from holes that have been punched by the user
    function readPunchedHoles() {

        //declare arrays used to hold the binary and decimal values to be converted back to a message
        let binaryArray = [];
        let decimalArray = [];

        //nested for loop which picks a row and then a subsequent hole and reads whether it is punched or not
        for (let i = 0; i < blankRowLength; i++) {

            //initialize muldimentional array out of binaryarray
            binaryArray[i] = [];

            //pick a row, and then inside that row, pick a subsequent hole to see if it is punched or not
            for (let j = 0; j < 8; j++) {

                //jquery selector built from a string (ex: ".punch-row1 > .punch-hole4") and checks if that exact hole is punched or not. If it is, it pushes a 1 to the proper multidimensional array space, if not, it pushes a 0.
                if ($(".punch-row" + i + " > " + ".punch-hole" + j).hasClass("punch-hole-closed") == true) {
                    binaryArray[i].push("0");
                } else {
                    binaryArray[i].push("1");
                }
            }

            //at the end of every inner loop (once it finishes reading all the holes in a single row) it then collapses that nested array of [1,0,0,1] etc into a single string [1001] as an example.
            binaryArray[i] = binaryArray[i].join("");
        }
        console.log(binaryArray);

        //Parses the array of binary strings to an integer value using base 2 (binary counting) using the parseInt function and pushes it into the decimal array. Each punch card row now has a decimal number representation of its binary character.
        binaryArray.forEach(binaryValue => {
            decimalArray.push(parseInt(binaryValue, 2));
        });

        //init the string variable which will return the translated message
        let translatedString = "";

        //converts the decimal value of the decimal array to a string
        decimalArray.forEach(decimalValue => {
            translatedString += String.fromCharCode(decimalValue);
        });

        console.log(decimalArray);

        moveRow(buildPunchAnimation(binaryArray, rowFeedAnimationDelay,cardRowHeight));

        //return the final translated message
        return translatedString;

    }//closing for readPunchedHoles function

}); //closing for document ready function