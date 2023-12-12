"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `        
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}€</div>
    </div>
  `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
//displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance} €`;
};
//calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income} €`;
  const outcome = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)} €`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} €`;
};
//calcDisplaySummary(account1.movements);

const user = "Steven Thomas Williams";

const createUsernames = function (accounts) {
  accounts.forEach(function (acc, i) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

//console.log(account1);

//updateUI

const updateUI = function (acc) {
  //display movements
  displayMovements(acc.movements);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
  //console.log(`${currentAccount.owner} is successfully logged in`);
};

//add login information, login button event listener

//current account for transferring
let currentAccount;
btnLogin.addEventListener("click", function (event) {
  //prevent form from submitting
  event.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(`current account is ${currentAccount?.owner}`);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and a welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`; //split method to display only the first name

    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    //remove the cursor blinking focus
    inputLoginPin.blur();
    updateUI(currentAccount);
    //console.log(`${currentAccount.owner} is successfully logged in`);
  } else {
    console.log(`Wrong pin number`);
  }
});

//transfer money to another account
btnTransfer.addEventListener("click", function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  console.log(amount, transferAccount, currentAccount);

  //add negative movement to current user, and check if he has enough money for transferring
  if (
    amount > 0 &&
    transferAccount &&
    amount <= currentAccount.balance &&
    transferAccount.username !== currentAccount.username
  ) {
    console.log(`transfer valid`);
    currentAccount.movements.push(-amount);
    transferAccount.movements.push(amount);
    inputTransferAmount.value = inputTransferTo.value = "";
    inputTransferAmount.blur();
    updateUI(currentAccount);
    //console.log(`${currentAccount.owner} is successfully logged in`);
  }
  console.log(currentAccount.movements);
  //add positive movement to transfer account
});

//add event listener to loan button
//grant a loan if there is at least one deposit that is at least 10% of the loan
btnLoan.addEventListener("click", function (event) {
  event.preventDefault();
  const loanAmount = Number(inputLoanAmount?.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => mov >= (loanAmount * 10) / 100)
  ) {
    currentAccount.movements.push(loanAmount);
    updateUI(currentAccount);
    console.log(`Approved`);
    inputLoanAmount.value = "";
  }
});

//add event listener to close account button
btnClose.addEventListener("click", function (event) {
  event.preventDefault();
  if (
    inputCloseUsername?.value === currentAccount.username &&
    Number(inputClosePin?.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === inputCloseUsername.value
    );

    accounts.splice(index, 1);
    inputClosePin.value = inputCloseUsername.value = "";
    containerApp.style.opacity = 0;
  } else {
    console.log(`Wrong pin number or not entering the current acount username`);
  }
});

//sort button to sort the movements
let sorted = false;
btnSort.addEventListener("click", function (event) {
  event.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

const totalDepositUSD = movements
  .filter((mov) => mov > 0)
  .map((mov) => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);

//console.log(`Total deposit in USD is ${totalDepositUSD}`);

const movementsUSD = movements.map((mov) => mov * eurToUsd);
//console.log(movementsUSD);

const movementsDescriptions = movements.map((mov, i, arr) => {
  if (mov > 0) {
    return `you number ${i + 1} deposited ${mov} dollars`;
  } else {
    return `you number ${i + 1} withdraw ${Math.abs(mov)} dollars`;
  }
});
//console.log(movementsDescriptions);

//const withdrawals = movements.filter((mov) => mov < 0);
//console.log(withdrawals);

const globalBalance = movements.reduce(
  (accumulator, mov) => accumulator + mov,
  0
);

const deposit = (mov) => mov > 0;
const anyDeposit = movements.some(deposit);
console.log(anyDeposit);
const everyDeposit = movements.every(deposit);
console.log(everyDeposit);
//console.log(globalBalance);

//maxiumum value
const max = movements.reduce((acc, mov) => {
  acc = mov > acc ? mov : acc;
  return acc;
}, movements[0]);
//console.log(max);

//flat and flat map

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const allAccountMovements = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => mov + acc, 0);
console.log(allAccountMovements);
const allAccountMovements2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => mov + acc, 0);
console.log(allAccountMovements2);

//sort method on numbers
movements.sort();
movements.sort((a, b) => (a > b ? 1 : -1));
movements.sort((a, b) => a - b);
console.log(movements);
movements.sort((a, b) => b - a);
console.log(movements);

const y = Array.from({ length: 7 }, () => 1);

const z = Array.from({ length: 7 }, (_, i) => i + 1);

console.log(z);

labelBalance.addEventListener("click", function () {
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (el) => el.textContent.replace("€", "USD")
  );
  console.log(movementsUI);
});
//console.log();
/////////////////////////////////////////////////

const depost1000 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((count, mov) => (mov > 1000 ? ++count : count), 0);
console.log(depost1000);

//object sum of deposit and withdrawls
const { deposits, withdrawals } = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (sums, curr) => {
      //curr > 0 ? (sums.deposits += curr) : (sums.withdrawals += curr);
      sums[curr > 0 ? "deposits" : "withdrawals"] += curr;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

const s = "this is a nice title";
const titleCaseConvert = function (title) {
  const exceptions = ["a", "b"];
  const capitalization = (str) => str[0].toUpperCase() + str.slice(1);
  const finalSentencce = title
    .split(" ")
    .map((word) => (exceptions.includes(word) ? word : capitalization(word)))
    .join(" ");

  console.log(finalSentencce);
};
titleCaseConvert(s);
/* let arr = ["a", "b", "c", "d", "e"];


console.log(arr.slice(2));

arr.splice(1, 3);
console.log(arr); */
//to get index or counter: for(const [i, movement] of movements.entries())
/* for (const movement of movements) {
  if (movement > 0) {
    console.log(`you deposited ${movement} dollars`);
  } else {
    console.log(`you withdraw ${Math.abs(movement)} dollars`);
  }
}

// movement same as const movement
console.log("-------FOREACH--------");
movements.forEach(function (movement, i, arr) {
  if (movement > 0) {
    console.log(`you number ${i + 1} deposited ${movement} dollars`);
  } else {
    console.log(`you number ${i + 1} withdraw ${Math.abs(movement)} dollars`);
  }
}); */
