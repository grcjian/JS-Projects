"use strict";

/* console.log(document.querySelector(".message").textContent);

document.querySelector(".message").textContent = "Correct Number!";

document.querySelector(".number").textContent = 13;
document.querySelector(".score").textContent = 10;
document.querySelector(".guess").value = 9; // when getting things from input, use .value
 */
let secretNumber = Math.trunc(Math.random() * 20) + 1;
//document.querySelector(".number").textContent = secretNumber;
let score = 20; //so called state variable
let highscore = 0;
const displayMessage = function (message) {
  document.querySelector(".message").textContent = message;
};
document.querySelector(".again").addEventListener("click", function () {
  //set a new secret number
  //set score back to 20
  //if guess the correct number, record the highest number to highscore
  //set .number to ?
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  document.querySelector(".number").textContent = "?";
  score = 20;
  document.querySelector(".score").textContent = score;
  document.querySelector("body").style.backgroundColor = "#222";
  document.querySelector(".number").style.width = "15rem";
  displayMessage("Start guessing...");
  document.querySelector(".guess").textContent = "";
});
document.querySelector(".check").addEventListener("click", function () {
  const guess = Number(document.querySelector(".guess").value);
  //console.log(guess, typeof guess);

  if (!guess) {
    displayMessage("No number!");
  } else {
    if (guess === secretNumber) {
      displayMessage("Correct Number!");
      document.querySelector(".number").textContent = secretNumber;
      document.querySelector("body").style.backgroundColor = "#60b347";
      document.querySelector(".number").style.width = "30rem";
      if (score > highscore) {
        highscore = score;
        document.querySelector(".highscore").textContent = highscore;
      }
    } else {
      if (score > 1) {
        if (guess > secretNumber) {
          displayMessage("Too High!");
        } else if (guess < secretNumber) {
          displayMessage("Too Low!");
        }
        score--;
        document.querySelector(".score").textContent = score;
      } else {
        displayMessage("You lost the game!");
        document.querySelector(".score").textContent = 0;
      }
    }
  }
});
