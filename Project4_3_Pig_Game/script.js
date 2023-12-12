"use strict";
//scores
const totalScore0 = document.getElementById("score--0");
const totalScore1 = document.getElementById("score--1");
const currentPlayer1 = document.querySelector("#current--0");
const currentPlayer2 = document.querySelector("#current--1");

//buttons
const btnNew = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");

//player section
const player0 = document.querySelector(".player--0");
const player1 = document.querySelector(".player--1");

//dice image
const diceImage = document.querySelector(".dice");
let changePlayerFlag = false;

//new game or start new game
const newGame = function () {
  totalScore0.textContent = 0;
  totalScore1.textContent = 0;
  currentPlayer1.textContent = 0;
  currentPlayer2.textContent = 0;
  if (!player0.classList.contains("player--active")) {
    player1.classList.remove("player--active");
    player0.classList.add("player--active");
  }

  diceImage.classList.add("hidden"); //because shouldnt display any image before the user rolls dice
};
newGame();

/* const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
}; */

const changePlayer = function (changePlayerFlag) {
  if (changePlayerFlag === true) {
    if (player0.classList.contains("player--active")) {
      player0.classList.remove("player--active");
      player1.classList.add("player--active");
    } else {
      player1.classList.remove("player--active");
      player0.classList.add("player--active");
    }
  } else {
  }
};
btnRoll.addEventListener("click", function () {
  //get the current score
  const currentScoreP1 = Number(currentPlayer1.textContent);
  const currentScoreP2 = Number(currentPlayer2.textContent);
  //roll dice
  const rollDice = Math.trunc(Math.random() * 6) + 1;
  //change the image of the dice
  diceImage.classList.remove("hidden");
  diceImage.src = `dice-${rollDice}.png`; //use template literal
  //check if rolled 1
  if (rollDice === 1) {
    player0.classList.contains("player--active") === true
      ? (currentPlayer1.textContent = 0)
      : (currentPlayer2.textContent = 0);
    changePlayerFlag = true;
    changePlayer(changePlayerFlag);
  } else {
    player0.classList.contains("player--active") === true
      ? (currentPlayer1.textContent = currentScoreP1 + rollDice)
      : (currentPlayer2.textContent = currentScoreP2 + rollDice);
  }
});

btnHold.addEventListener("click", function () {
  changePlayerFlag = true;
  //push the number to the total number and set current score to 0
  if (player0.classList.contains("player--active") === true) {
    totalScore0.textContent =
      Number(totalScore0.textContent) + Number(currentPlayer1.textContent);
    currentPlayer1.textContent = 0;
    /*     currentScore += dice;
    document.getElementById(
      `current--${activePlayer}`
    ).textContent = currentScore; */
  } else {
    totalScore1.textContent =
      Number(totalScore1.textContent) + Number(currentPlayer2.textContent);
    currentPlayer2.textContent = 0;
  }

  changePlayer(changePlayerFlag);
});

btnNew.addEventListener("click", newGame);
