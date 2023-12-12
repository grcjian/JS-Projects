"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2022-11-18T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2023-06-14T09:15:04.904Z",
    "2023-06-10T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2023-06-15T17:01:17.194Z",
    "2022-07-11T23:36:17.929Z",
    "2022-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions
const formatMovementDate = function (date1, date2, locale) {
  let dateDisplay = "";
  const calculateDays = (date1, date2) =>
    Math.trunc(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const datePassed = calculateDays(date1, date2);
  if (datePassed === 0) {
    dateDisplay = "today";
  }
  if (datePassed === 1) {
    dateDisplay = "yesterday";
  }
  if (datePassed >= 2 && datePassed <= 7) {
    dateDisplay = `${datePassed} days ago`;
  }
  if (datePassed > 7) {
    /* dateDisplay = `${`${date1.getDate()}`.padStart(2, 0)}/${`${
      date1.getMonth() + 1
    }`.padStart(2, 0)}/${date1.getFullYear()}`; */
    dateDisplay = new Intl.DateTimeFormat(`${locale}`).format(date1);
  }

  return dateDisplay;
};
const options = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "long", //numeric for only the exact number, long to display as August,June, 2-digit to display as 08, short to display as Aug, narrow to display as A(only the first letter)
  year: "numeric",
  weekday: "short",
};
const formatCurrency = function (acc, num) {
  return new Intl.NumberFormat(`${acc.locale}`, {
    style: "currency",
    currency: `${acc.currency}`,
  }).format(num);
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const movDates = new Date(acc.movementsDates[i]);

    //display the date as today yesterday or n days ago
    const dateDisplay = formatMovementDate(movDates, new Date(), acc.locale);
    /*    <div class="movements__date">${`${movDates.getDate()}`.padStart(2, 0)}/${`${
      movDates.getMonth() + 1
    }`.padStart(2, 0)}/${movDates.getFullYear()}</div>*/

    const currencyDisplay = formatCurrency(acc, mov);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${dateDisplay}</div>
        <div class="movements__value">${currencyDisplay}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCurrency(acc, acc.balance);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0)
    .toFixed(2);

  labelSumIn.textContent = formatCurrency(acc, incomes);

  const out = +acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0)
    .toFixed(2);

  labelSumOut.textContent = formatCurrency(acc, Math.abs(out));

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((acc, int) => acc + int, 0)
    .toFixed(2);

  labelSumInterest.textContent = formatCurrency(acc, interest);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

//start Log out timer when user logged in
const startLogOutTimer = function () {
  // set time to 5 minutes 5* 60 * 1000
  let timeStart = 300;

  const tick = () => {
    const min = `${Math.trunc(timeStart / 60)}`.padStart(2, 0);
    const sec = `${timeStart % 60}`.padStart(2, 0);
    console.log(sec);
    labelTimer.textContent = `${min}:${sec}`;
    //check if the time left is 0, log the user out
    if (timeStart === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    timeStart--;
  };
  //start to count down 1000 miliseconds, call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    //balance current date
    const now = new Date();

    labelDate.textContent = new Intl.DateTimeFormat(
      `${currentAccount.locale}`,
      options
    ).format(now);
    // Update UI
    updateUI(currentAccount);

    //start timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    //balance date
    /*     const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const day = `${now.getDate()}`.padStart(2, 0);
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`; */
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //add the current date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//console.log(Math.trunc("25.53"));

//console.log(parseInt("233_123"));

/* const now = new Date();
console.log(now);
now.getFullYear();
now.getMonth();
now.getDate();
now.getDay();
now.getHours();
now.getMinutes();
now.getSeconds();
now.toISOString(); //2019-11-18T21:31:17.178Z (Z is UTC standard timezone)
now.getTime(); //milliseconds passed since 1970 */

const account1Mov = new Date(account1.movementsDates[0]);
//console.log(account1Mov);

const date1 = new Date(2023, 6, 8, 3, 45);
//console.log(date1);

const daysPassed = (date1, date2) => {
  return Math.trunc((date2 - date1) / (1000 * 60 * 60 * 24));
};

const checkDayPassed = daysPassed(new Date(), date1);
//console.log(checkDayPassed);

const optionsNumber = {
  style: "unit",
  unit: "mile-per-hour",
};

/* const timeoutSet = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
  3000,
  "olives",
  "spinach"
); //schedule executing the function 3 seconds later */
