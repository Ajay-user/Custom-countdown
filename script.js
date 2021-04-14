const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdownForm");
const dateEl = document.getElementById("date-picker");

const countdownEl = document.getElementById("countdown");
const countdownElTitle = document.getElementById("countdown-title");
const timeElements = document.querySelectorAll("span");
const countdownElButton = document.getElementById("countdown-button");

const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("complete-info");
const completeElButton = document.getElementById("complete-button");
// global variables
let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();
let countdownActive;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// populate the countdown and update the UI
const updateDOM = () => {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const difference = countdownValue - now;

    if (difference < 0) {
      // update the complete info
      if (countdownTitle.length > 10) {
        completeElInfo.style.fontSize = "16px";
      }
      completeElInfo.innerText = `${countdownTitle}\ncompleted on ${countdownDate}`;
      // hidding the input container and displaying the complete
      inputContainer.hidden = true;
      countdownEl.hidden = true;
      completeEl.hidden = false;
    } else {
      const days = Math.floor(difference / day);
      const hours = Math.floor((difference % day) / hour);
      const minutes = Math.floor((difference % hour) / minute);
      const seconds = Math.floor((difference % minute) / second);

      // populating the title and  time elements
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;

      // hidding the input container and displaying the countdown
      inputContainer.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);
};

const updateCountdown = (e) => {
  e.preventDefault();
  // take values from the form inputs
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;
  if (countdownDate === "") {
    alert("please enter a valid date");
  } else {
    // get number version of current date and update the DOM
    countdownValue = new Date(countdownDate).getTime();
    // save the countdownValue in the localStorage
    window.localStorage.setItem(
      "countdown",
      JSON.stringify({ countdownTitle, countdownValue })
    );

    updateDOM();
  }
};
// reset all values
const reset = () => {
  // hide the views (countdown view,complete view) and display the inputform view
  inputContainer.hidden = false;
  completeEl.hidden = true;
  countdownEl.hidden = true;
  // stop counter
  clearInterval(countdownActive);
  // clear the local storage
  window.localStorage.removeItem("countdown");

  // reset values
  countdownDate = "";
  countdownTitle = "";
};

// restore the countdown, if exist
const restorePreviousCountdown = () => {
  if (window.localStorage.getItem("countdown")) {
    const countdown = JSON.parse(window.localStorage.getItem("countdown"));
    countdownTitle = countdown.countdownTitle;
    countdownValue = countdown.countdownValue;
    console.log(
      "load- TITLE:",
      countdownTitle,
      "Countdown value",
      countdownValue
    );
    updateDOM();
  }
};

// set Date input min with today's date
const today = new Date().toISOString().split("T")[0];
dateEl.setAttribute("min", today);

// event listeners
countdownForm.addEventListener("submit", updateCountdown);
countdownElButton.addEventListener("click", reset);
completeElButton.addEventListener("click", reset);

// on load
restorePreviousCountdown();
