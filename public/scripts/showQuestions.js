const BUZZER_TIMER_COUNTDOWN = 5;
let timer = BUZZER_TIMER_COUNTDOWN;
const ANSWER_TIMER_COUNTDOWN = 30;
let answerTimerInSeconds = ANSWER_TIMER_COUNTDOWN;
let isAnswerCorrect = false;
let round = 1;
let currentPoints = 0; 
let clue;
// set css timeCountdown:
// SKAL være vars.:
var root = document.querySelector(':root');
let seconds = timer + 's';
var timeCountdown = root.style.setProperty('--timeCountdown', seconds);
// get css timeCountdown:
var rootStyles = getComputedStyle(root);
var timeCountdown= rootStyles.getPropertyValue('--timeCountdown');

let questionsFinished = 0;

//Yderligere refac ideer:
// OK: 0. Skift object fra User til Player og implementér overalt!
// ½   1. Opret funktion til at vise og skjule, som tager henholdsvis elementID og element, som argumenter og implementér overalt.
//     Er startet under showQuestionPopup().
//     2. Opret loop under activateBuzzers().
//     3. Opret loop under playerWhoAnsweredRightGetsToPick()
//     4. Opret loop under newPlayerPickQuestionIfAnswerIsWrong()
//     5. Opret loop under removeQuestion() - brug de nye klassenavne i stedet for Id'er.
//     6. Måske opret nogle objekter?
//     7. loadQuestion() kan omskrives og helt fjernes. Se noter i funktionen.
//     8. Saml clear timeouts og reset timeouts i små funktioner.

async function correctClueSpecialChars(){
 clue.answer = await clue.answer.replace(/\â\\/g, "'");
 clue.answer = await clue.answer.replace("Â", "");
 clue.answer = await clue.answer.replace("Ã³", "ó");
 clue.answer = await clue.answer.replace("Ã©", "é");
 clue.answer = await clue.answer.replace("\\", "");
};



for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
 let cells =  document.querySelectorAll(`.tableRow${rowIndex+1} th`); 
 for (var columnIndex = 0; columnIndex < cells.length; columnIndex++) {
  cells[columnIndex].onclick = function () {  clickCell(rowIndex, this.getAttribute("value")); };
 };
};

async function clickCell(rowIndex, columnIndex) {
 try {
  // columnIndex går fra 1-12. Vi har to tabeller. Se det som om runde 1 er kolonne 1-5, og runde 2 er kolonne 6-10.
  // så her justeret kolonneIndex baseret på runde-nummeret:
  columnIndex = parseInt(columnIndex) + ((round - 1) * 6  );
  currentPoints = (rowIndex + 1) * (round * 100);
  sessionStorage.setItem("activeCategory", columnIndex);
  sessionStorage.setItem("activeQuestion", (rowIndex + 1));
  let categoriID = sessionStorage.getItem(`cat${columnIndex}`);
  clue = await getClueFromAPI(rowIndex, categoriID);
  await correctClueSpecialChars();
  await showQuestionPopup();
 } catch (error) {
 };
};

async function getClueFromAPI(rowIndex, categoriID){
 let clueIndex = rowIndex;
 let apiPath = `https://jservice.io/api/clues?category=${categoriID}`;
 try {
  const response = await fetch(apiPath);
  const clue = await response.json();
  return clue[clueIndex];
 } catch(e) {
  console.log(e);
 };
};

function hideElementbyID(ID){
 document.getElementById(ID).classList.add("hide");
};

function showElementbyID(ID){
 document.getElementById(ID).classList.remove("hide");
}

// ------------------------------ QUESTION POPUP ------------------------------------
let startQuestionTimer;
async function showQuestionPopup() {
 // TEST:
 clearTimeout(startAnswerTimer);
 timer = BUZZER_TIMER_COUNTDOWN;
 window.clearInterval(answerTimer, 1000);
 clearTimeout(startAnswerTimer);
 answerTimerInSeconds = ANSWER_TIMER_COUNTDOWN;
 document.getElementById("skipButton").classList.remove("knap");

 // Eksempel:
 hideElementbyID("skipButton");
 hideElementbyID("OKButtonSkip");
 hideElementbyID("backQuestion");

 showElementbyID("answerInput");
 showElementbyID("itWasRightButton");

 document.getElementById("question_popup_H2").innerHTML = "Spørgsmål";
 document.getElementById("thecard").classList.remove("flipcard");

 var popup = document.getElementById("Question_popup");
 popup.classList.add("question-open-popup");
 var popup = document.getElementById("fadeQuestion_popup_background");
 popup.classList.add("fade");

 document.getElementById("question_popup_H2").innerHTML += " til " + currentPoints;
 //Fix forkerte characters fra API:
 //Tilføj de resterende fixes fra loadQuestion - og træk ud i egen funktion:
 clue.question = await clue.question.replace(/\â\\/g, "'");
 clue.question = await clue.question.replace("Â", "");
 clue.question = await clue.question.replace("Ã³", "ó");
 clue.question = await clue.question.replace("Ã©", "é");
 clue.question = await clue.question.replace("\\", "");

 document.getElementById("question_popup_H2").innerHTML += "<h3>" + clue.question + "</h3>";
 startQuestionTimer = window.setInterval(inputTimer, 1000);
};

let startAnswerTimer;
function flipCardDelay(){
 document.getElementById("backQuestion").classList.remove("hide");
 document.getElementById("thecard").classList.add("flipcard");
 document.getElementById("frontQuestion").classList.add("hide")
 document.getElementById("question_popup_H2_Back").innerHTML = "Spørgsmål"
 document.getElementById("answerButton").classList.remove("hide");
 document.getElementById("answerInput").readOnly = false;
 document.getElementById("answerInput").value = "";
 answerResponce.innerHTML = "";

answerTimer();

 document.getElementById("continueButton").classList.add("hide");
 document.getElementById("itWasRightButton").classList.add("hide");
 document.getElementById("question_popup_H2_Back").innerHTML += " til " + currentPoints;
 document.getElementById("question_popup_H2_Back").innerHTML += "<h3>" + clue.question + "</h3>";
};

function closeQuestionPopup() {
 var popup = document.getElementById("Question_popup");
 popup.classList.remove("question-open-popup");
 var popup = document.getElementById("fadeQuestion_popup_background");
 popup.classList.remove("fade");
 document.getElementById("frontQuestion").classList.remove("hide");
 timer = BUZZER_TIMER_COUNTDOWN;
 document.getElementById("numberTimeout").classList.remove("numberTimeout");
 document.getElementById("textTimeout").classList.remove("textTimeout");
};

function skipQuestion(){
 flipCardDelay();
 let answerText = document.getElementById("answerResponce")
 answerText.classList.remove("hide");
 //Fix forkerte character fra API:
 clue.answer = clue.answer.replace(/\â\\/g, "'");
 clue.answer = clue.answer.replace("Â", "");
 clue.answer = clue.answer.replace("Ã³", "ó");
 clue.answer = clue.answer.replace("Ã©", "é");
 clue.answer = clue.answer.replace("\\", "");
 answerText.innerHTML = clue.answer;
 let answerButton = document.getElementById("answerButton");
 answerButton.classList.add("hide");
 document.getElementById("answerInput").classList.add("hide");
 document.getElementById("itWasRightButton").classList.add("hide");
 let OKButtonSkip = document.getElementById("OKButtonSkip");
 OKButtonSkip.classList.remove("hide");
 let countdownAnswer = document.getElementById("countdownAnswer");
 countdownAnswer.classList.add("hide");
};

function OKButtonSkip(){
 document.getElementById("firstToBuzzH2").innerHTML = "";
 document.getElementById("numberTimeout").innerHTML = "";
 document.getElementById("frontQuestion").classList.remove("hide");
 firstToBuzz = "";
 document.onkeydown = null;
 removeQuestion();
 closeQuestionPopup();
 questionsFinished += 1;

 if (questionsFinished == 30) {
   startRoundTwo();
 };

 if (questionsFinished == 60) {
   gameEnd();
 };
 // TEST:
 clearTimeout(startAnswerTimer);
 timer = BUZZER_TIMER_COUNTDOWN;
 window.clearInterval(answerTimer, 1000);
 clearTimeout(startAnswerTimer);
 answerTimerInSeconds = ANSWER_TIMER_COUNTDOWN;
};
// --------------------------------------------------------------------------------

// ------------------------------ TIMER -------------------------------------------
function inputTimer(){

 let numberTimeout = document.getElementById("numberTimeout");
 let textTimeout = document.getElementById("textTimeout");
 numberTimeout.classList.add("numberTimeout");
 textTimeout.classList.add("textTimeout");
 numberTimeout.innerHTML = timer + " sekunder...";
 if (timer <= 0) {
  clearTimeout(startQuestionTimer);
  console.log("tiden er udløbet og der må svares...");
  activateBuzzers();
  numberTimeout.innerHTML = "DER MÅ NU BUZZES !!!";

  document.getElementById("skipButton").classList.remove("hide");
  document.getElementById("skipButton").classList.add("knap");
 };
 timer = timer - 1;
};

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 15;
const ALERT_THRESHOLD = 7;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 30;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("countdownAnswer").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
  timeLeft
)}</span>
</div>
`;



function answerTimer(){

console.log("it starts now");


   timerInterval = setInterval(() => {
     timePassed = timePassed += 1;
     timeLeft = TIME_LIMIT - timePassed;
     console.log(timeLeft);
     document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
     setCircleDasharray();
     setRemainingPathColor(timeLeft);

     if (timeLeft === 0) {
       onTimesUp();
     }
   }, 1000);
 }



function onTimesUp() {
  clearTimeout(startAnswerTimer);
  // TODO: Giv besked og luk question popup:
  // window.alert("Tiden løb ud");
  console.log("time is over");

  isAnswerCorrect = false;

  window.clearInterval(answerTimer, 1000);
  clearTimeout(startAnswerTimer);
  answerTimerInSeconds = 30;

  document.getElementById("countdownAnswer").innerHTML = "";
  document.getElementById("answerButton").classList.add("hide");
  document.getElementById("answerInput").classList.add("hide");
  
  let answerResponce = document.getElementById("answerResponce");
  answerResponce.innerHTML = "Tiden løb ud, det rigtige svar er: ";
  answerResponce.innerHTML += clue.answer;

  document.getElementById("continueButton").classList.remove("hide");
  document.getElementById("continueButton").classList.add("knap");

  window.isAnswerCorrect = isAnswerCorrect;
  window.currentPoints = currentPoints;

  document.getElementById("continueButton").onclick = function () {
    closePopUpAndContinueGame();
  };

}


function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}


//------------------------------ ACTIVATE BUZZERS & SOUND ------------------------------------------------
let firstToBuzz = "";
let playerWhoBussedFirst = -1;

function activateBuzzers(){
 document.onkeydown = function (e) {
  document.getElementById("firstToBuzzH2").innerHTML = "";
  for (let i = 0; i < 4; i++) {
   if (firstToBuzz == "" && e.key == sessionStorage.getItem(`buzzer${i+1}Label`)) {
    firstToBuzz = e.key;
    console.log(sessionStorage.getItem(`player${i+1}`), "var først!");
    playBuzzer();
    document.getElementById("firstToBuzzH2").innerHTML = sessionStorage.getItem(`player${i+1}`) + " var først!";
    window.setTimeout(flipCardDelay, 1000);
    sessionStorage.setItem("playerAnswering", sessionStorage.getItem(`player${i+1}`));
     playerWhoBussedFirst = i;
   };
  };
 };
};

// Man kunne lade det være op til spillere at vælge lyd under game setup:
function playBuzzer() {
 var audio = new Audio("../sounds/buzz2.wav");
 audio.play();
};

//--------------------------------------------------------------------------------------------------------

//------------SVAR KNAP CLICK OG VALIDERING---------------------------------------------------------------
async function answerButton() {

 document.getElementById("countdownAnswer").innerHTML = "";
 document.getElementById("answerButton").classList.add("hide");
 document.getElementById("answerInput").readOnly = true;

 let answerText = document.getElementById("answerInput").value;
 let answerResponce = document.getElementById("answerResponce");

 window.clearInterval(answerTimer, 1000);
 clearTimeout(startAnswerTimer);
 answerTimerInSeconds = ANSWER_TIMER_COUNTDOWN;

 if (checkAnswer(answerText)) {
  answerResponce.innerHTML = "Tillykke du svarede rigtigt!"; 
  document.getElementById("continueButton").classList.remove("hide");
  document.getElementById("continueButton").classList.add("knap");
  isAnswerCorrect = true;
  playerWhoAnsweredRightGetsToPick();
   
 } else {
  answerResponce.innerHTML = "Det rigtige svar er: " ;
  clue.answer = await clue.answer.replace(/\â\\/g, "'");
  clue.answer = await clue.answer.replace("Â", "");
  clue.answer = await clue.answer.replace("Ã³", "ó");
  clue.answer = await clue.answer.replace("Ã©", "é");
  clue.answer = await clue.answer.replace("\\", "");
  answerResponce.innerHTML += clue.answer;
  document.getElementById("continueButton").classList.remove("hide");
  document.getElementById("continueButton").classList.add("knap");
  document.getElementById("itWasRightButton").classList.remove("hide");
  document.getElementById("itWasRightButton").classList.add("knap");
  isAnswerCorrect = false;
  newPlayerPickQuestionIfAnswerIsWrong();
 };

 window.isAnswerCorrect = isAnswerCorrect;
 window.currentPoints = currentPoints;

 document.getElementById("continueButton").onclick = function () {
  closePopUpAndContinueGame();
 };

 document.getElementById("itWasRightButton").onclick = function () {
   window.isAnswerCorrect = true;
   playerWhoAnsweredRightGetsToPick();
   closePopUpAndContinueGame();
 };

};

function closePopUpAndContinueGame() {
  
 document.getElementById("firstToBuzzH2").innerHTML = "";
 document.getElementById("numberTimeout").innerHTML = "";
 document.getElementById("frontQuestion").classList.remove("hide");
 document.getElementById("answerInput").classList.remove("hide");

 firstToBuzz = "";
 document.onkeydown = null;

 adjustScore();
 removeQuestion();
 closeQuestionPopup();

 questionsFinished += 1;

 if (questionsFinished == 30) {
   startRoundTwo();
 };

 if (questionsFinished == 60) {
   gameEnd();
 }
};

function checkAnswer(answer) {
 return (answer.toUpperCase() == clue.answer.toUpperCase());
};

function adjustScore() {
  const players = getPlayers();
  const playerAnswering = sessionStorage.getItem("playerAnswering");
  let player;
  let newPlayerScore;

  if (playerAnswering) {
    player = players.find(player => player.name === playerAnswering);
  };

  sessionStorage.getItem("pointsPlayer" + player.id);

  if (window.isAnswerCorrect) {
    const currentPlayerScore = parseInt(sessionStorage.getItem("pointsPlayer" + player.id));
    newPlayerScore = currentPlayerScore + window.currentPoints;
    sessionStorage.setItem("pointsPlayer" + player.id, newPlayerScore.toString());
  } else {
    const currentPlayerScore = parseInt(sessionStorage.getItem("pointsPlayer" + player.id));
    newPlayerScore = currentPlayerScore - window.currentPoints;
    sessionStorage.setItem("pointsPlayer" + player.id, newPlayerScore.toString());
  };
  player.score = newPlayerScore;
  document.querySelector(`#card${player.id} > div.points > p`).innerHTML = player.score;
};

function removeQuestion() {
 for (let i = 1; i < 6; i++) { 
  if (sessionStorage.getItem("activeQuestion") == i) {
  sessionStorage.setItem("activeQuestion",`${round}RoundTableRow${i}`);
  };
 };
 let clickedCell = document.getElementById(sessionStorage.getItem("activeQuestion")).getElementsByTagName('th')[(parseInt(sessionStorage.getItem("activeCategory"))-1) - ((round - 1) * 6) ];
 clickedCell.classList.add("removedCell");
};

function startRoundTwo() {
 round = 2;
 document.getElementById("firstTable").classList.add("hide");
 document.getElementById("secondTable").classList.remove("hide");
 document.getElementById("secondTable").classList.add("theTableOne");
 document.getElementById("startingRoundTwo").classList.add("open-popup");
 document.getElementById("fadeBackground").classList.add("fade");
};

function gameEnd() {
 document.getElementById("gameFinished").classList.add("open-popup");
 document.getElementById("winnerName").innerHTML = findWinner();
};

function findWinner() {
  const players = getPlayers();
  let scores = [];
  for (let i = 0; i < players.length; i++) {
    scores.push(parseInt(sessionStorage.getItem("pointsPlayer" + players[i].id)));
  };
  let highest = scores[0];
  let highestIndex = 0;
  for (let i = 0; i < scores.length; i++) {
    if (scores[i] > highest ) {
      highestIndex = i;
      highest = scores[i];
    };
    return players[highestIndex].name;
  };
};

function newPlayerPickQuestionIfAnswerIsWrong() {
 let numberOfPlayers = getPlayerNames().length;
 let cards = [];
 for (let i = 0; i < numberOfPlayers; i++) {
  cards[i] = document.getElementById(`card${i+1}`);
  cards[i].classList.remove("card-selected");
 };
 let currentPlayerIndex = parseInt(sessionStorage.getItem("currentPlayerIndex"));
 if ((currentPlayerIndex + 1) == numberOfPlayers) {
   currentPlayerIndex = 0;
 } else {
   currentPlayerIndex += 1;
 };
 cards[currentPlayerIndex].classList.add("card-selected");
 sessionStorage.setItem("currentPlayerIndex" , currentPlayerIndex);
};

function playerWhoAnsweredRightGetsToPick() {
  let cards = [];
  for (let i = 0; i < getPlayerNames().length; i++) {
   cards[i] = document.getElementById(`card${i+1}`);
   cards[i].classList.remove("card-selected");
  }
  cards[playerWhoBussedFirst].classList.add("card-selected");
  sessionStorage.setItem("currentPlayerIndex" , playerWhoBussedFirst);
};
//--------------------------------------------------------------------------------------------------------