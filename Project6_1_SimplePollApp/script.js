"use strict";

//starter poll object
const poll = {
  //a question
  question: "What is your favourite programming language?",
  // an array of options from which people can choose
  options: ["0: JavaScript", "1: Python", "2: Rust", "3: C++"],
  // an array with the number of replies for each options
  // This generates [0, 0, 0, 0]. More in the next section!
  answers: new Array(4).fill(0),
  testData: [5, 2, 3],
  //registerNewAnser method
  registerNewAnser() {
    // display a prompt window for the user to input the number of the selected option
    //let optionStrings = "";
    // Get answer
    const answer = Number(
      prompt(
        //join is to add things between each array item - .join follows an array
        `${this.question}\n${this.options.join("\n")}\n(Write option number)`
      )
    );
    /*     for (const option of this.options) {
      optionStrings += `${option}\n`;
    }
    const optionNumber = prompt(
      `${this.question}\n${optionStrings}(Write option number)`
    );

    //based on the input number, update the answers array property, for ex: if the option is 3
    //increase the value at position 3 of the array by 1.

    const optionInput = Number(optionNumber);
    isNaN(optionInput) === false && optionInput >= 1 && optionInput <= 4
      ? this.answers[optionInput]++
      : console.log("Please enter a number from 1-4");  */
    typeof answer === "number" && answer < this.answers.length && answer >= 0
      ? this.answers[answer]++
      : console.log("Please enter a number from 1-4");
    //create a method displayResults which display the poll results.
    //the method takes a string as an input(called type)
    // if the type is array, simply display the results array as it is
    // if the type is string, display a string like "Poll results are 13,2,4,1"
    console.log(this.answers);
    this.displayResults();
    this.displayResults("string");
  },
  displayResults(type = "array") {
    //console.log(`${type}`);
    if (type === "string") {
      //console.log(`${type}`);
      //const results = this.answers.join(",");
      console.log(`Poll results are ${this.answers.join(",")}`);
    } else if (type === "array") {
      //console.log("array");
      console.log(`${this.answers}`);
    }
  },
};

//call registerNewAnswer method whenever the user clicks the Answer poll button
document
  .querySelector(".poll")
  .addEventListener("click", poll.registerNewAnser.bind(poll));

//run displayResults method at the end of each registerNewAnser method call

// [5,2,3]
// [1,5,3,9,6,1]
// display these two arrays instead of the answers using displayResults method

poll.displayResults.call({ answers: [5, 2, 3] }, "string");
