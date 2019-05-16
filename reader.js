$(document).ready(function(){


let messageInput = "";
const blankRowLength = 12;
let areHolesPunchable = false;

//Clicking the process button triggers the processMessage function which converts the message to binary and punches out the card
$(".submit-button").on("click", function(event){

    //prevent user from manipulating holes in punch readout
    areHolesPunchable = false;

    //clear the punch card of content
    $(".punch-card").empty();

    //stope the message input
    messageInput = $(".message-input").val();
    console.log(messageInput);

    //process the message
    processMessage(messageInput);
});

//Click event listener for READ button
$(".read-button").on("click", function(event){
    
    setCardToBlank();
    //Allow the user to punch out holes
    areHolesPunchable = true;
});

$(".comp-button").on("click", function(event){
    $(".message-input").val(readPunchedHoles());
    //Allow the user to punch out holes
});

//Click event listener for punch holes
$(".punch-card").on("click", "div.punch-hole", function(event){
    if (areHolesPunchable == true){
        $(this).removeClass("punch-hole-closed");
    }
});

const processMessage = function(message){

    let messageDecimalArray = [];
    let messageBinaryArray = [];

    //For the length of the entered message, each character in the message string is convereted to its UTF-8 decimal encoding number
    for(let i = 0; i < message.length; i++){

        //Convert the character at position i to UTF-8 decimal code and push into the decimal array
        messageDecimalArray.push(message.charCodeAt(i));

        //Converting the decimal value to a binary string, storing it in an interim variable
        let binaryString = messageDecimalArray[i].toString(2);

        //Split the binary string into a single character array, then push this entire array into the master binary array ( creating a 2 dimensional array) 
        messageBinaryArray.push(binaryString.split(""));
        
    }

    //This code checks if the binary string is less than 8 characters. If it is, then it fills up the additional space ahead of the string with zero's by pushing them into the binary arrays.

    //Because UTF-8 characters 0-32 will never be used, the smallest binary value possible is therefore only 6 binary digits.
    
    for(let i = 0; i < messageBinaryArray.length; i++){
        if (messageBinaryArray[i].length < 8){
            switch (messageBinaryArray[i].length){
                case 6:
                    messageBinaryArray[i].unshift("0");
                    messageBinaryArray[i].unshift("0");
                    break;
                case 7:
                    messageBinaryArray[i].unshift("0");
                    break;
            }
        }
    }

    console.log(messageDecimalArray);
    console.log(messageBinaryArray);


    //Nested for loop: outer loop loops through each of the message characters, and for each character adds a div row to the punch card
    for(let i=0;i<messageDecimalArray.length; i++){

        //add a row to the punch card
        $(".punch-card").append(`<div class="punch-row punch-row${i}"></div>`);

        //Loop through each binary digit in the row for the character
        for(let j=0;j<messageBinaryArray[i].length;j++){

            //if the binary digit is a 1, print a punched hole into the row
            if(messageBinaryArray[i][j] === "1"){
                $(".punch-row"+i).append(`<div class="punch-hole punch-hole${j}"></div>`);
            } else {
                $(".punch-row"+i).append(`<div class="punch-hole punch-hole-closed punch-hole${j}"></div>`);
            }
        }

    }

}//closing for process message function


function setCardToBlank(){

    //clear the punch card of html elements
    $(".punch-card").empty();


    for(let i = 0; i < blankRowLength; i++){

        //add rows to card
        $(".punch-card").append(`<div class="punch-row punch-row${i}"></div>`);
        for(j=0;j < 8; j++){

            //Print out all unpunched spaces
            $(".punch-row"+i).append(`<div class="punch-hole punch-hole-closed punch-hole${j}"></div>`);
        }
    }
}//closing for setCardToBlank function

function readPunchedHoles() {
    let binaryArray = [];
    let decimalArray = [];
    for (let i = 0; i < blankRowLength; i++){
        binaryArray[i] = [];
        for(let j = 0; j < 8; j++){
            if ($(".punch-row"+i +" > " + ".punch-hole"+j).hasClass("punch-hole-closed") == true) {
                binaryArray[i].push("0");
            } else {
                binaryArray[i].push("1");
            }
        }
        binaryArray[i] = binaryArray[i].join("");
    }
    console.log(binaryArray);

    binaryArray.forEach(binaryValue => {
        decimalArray.push(parseInt(binaryValue, 2));
    });

    let translatedString = "";

    decimalArray.forEach(decimalValue => {
        translatedString += String.fromCharCode(decimalValue);
    });

    console.log(decimalArray);

    return translatedString;

}//closing for readPunchedHoles function

}); //closing for document ready function