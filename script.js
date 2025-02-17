"use strict";

const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const modalMessage = document.querySelector(".game-result-message");
const newGameBtn = document.querySelector(".new-game-button");
const rowSolution = document.querySelector(".row-solution");

const rowsContainer = document.querySelector(".rows-container");
const colorContainer = document.querySelector(".color-options");
const gameRows = Array.from(document.querySelectorAll(".game-row"));
const submitBtn = document.querySelector(".button-submit");

const init = function () {
  renderGame();
  rowNum = 1;
  selectedBox = document.querySelector(".box-selected");
  currentRow = document.querySelector(`.row-${rowNum}`);
  generateSolution();
  assignBoxes();
  if (!modal.classList.contains("hidden")) modal.classList.add("hidden");
  renderAnswer();
  console.log("solution:", solution);
};
const renderGame = function () {
  rowsContainer.innerHTML = "";
  for (let i = 1; i <= 10; i++) {
    const markup = `
    <div class="game-row row-${i} ${i === 1 ? "current-row" : ""}">
    <div data-color="" class="game-box box-1 ${
      i === 1 ? "box-selected" : ""
    }"></div>
          <div data-color="" class="game-box box-2"></div>
          <div data-color="" class="game-box box-3"></div>
          <div data-color="" class="game-box box-4"></div>
          <div class="round-score">
          </div>
          </div>
          `;

    rowsContainer.insertAdjacentHTML("beforeend", markup);
  }
};

const renderAnswer = function () {
  const markup = `
  <div data-color="${solution[0]}" class="game-box box-1" style="background:${solution[0]}"></div>
  <div data-color="${solution[1]}" class="game-box box-2" style="background:${solution[1]}"></div>
  <div data-color="${solution[2]}" class="game-box box-3" style="background:${solution[2]}"></div>
  <div data-color="${solution[3]}" class="game-box box-4" style="background:${solution[3]}"></div>
`;

  rowSolution.insertAdjacentHTML("beforeend", markup);
};

let rowNum;
let selectedBox;
let currentRow;

let box1,
  box2,
  box3,
  box4,
  roundScore,
  guess,
  solution = [];

const colors = ["blue", "yellow", "red", "green", "orange", "pink"];

const generateSolution = function () {
  for (let i = 0; i < 4; i++) {
    const randomNumber = Math.trunc(Math.random() * 6);
    solution.push(colors[randomNumber]);
  }
};

const shuffleArray = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const assignBoxes = function () {
  // console.log(currentRow);
  box1 = currentRow.querySelector(".box-1");
  box2 = currentRow.querySelector(".box-2");
  box3 = currentRow.querySelector(".box-3");
  box4 = currentRow.querySelector(".box-4");
  roundScore = currentRow.querySelector(".round-score");
  // ("currentRow:", currentRow);
  // console.log(box1, box2, box3, box4);
};

rowsContainer.addEventListener("click", function (e) {
  if (!currentRow.contains(e.target)) return;

  const box = e.target.closest(".game-box");

  if (!box) return;

  if (selectedBox) selectedBox.classList.remove("box-selected");
  box.classList.add("box-selected");
  selectedBox = document.querySelector(".box-selected");
});

colorContainer.addEventListener("click", function (e) {
  const colorBtn = e.target;

  if (!selectedBox) return;

  selectedBox.dataset.color = colorBtn.dataset.color;

  selectedBox.style.background = colorBtn.dataset.color;
});

const getOccurence = function (array, value) {
  return array.filter((v) => v === value).length;
};

const assignGuess = function () {
  guess = [
    box1.dataset.color,
    box2.dataset.color,
    box3.dataset.color,
    box4.dataset.color,
  ];
};

const getscore = function (guess) {
  const colorCounter = {
    blue: 0,
    yellow: 0,
    green: 0,
    red: 0,
    orange: 0,
    pink: 0,
  };

  return guess
    .map((color, i) => {
      colorCounter[color]++;

      if (!solution.includes(color)) return;

      // check for repeat colors
      if (colorCounter[color] > getOccurence(solution, color)) return;

      return 2;
    })
    .map((score, i) => {
      if (!score) return;
      if (guess[i] === solution[i]) return 1;
      else return 2;
    });
};

const checkWin = function (score) {
  const win = score.every((s) => s === 1);
  if (win) {
    modal.classList.remove("hidden");
    modalMessage.textContent = "YOU WIN! 😁";
    modalMessage.style.color = "green";
    // console.log(" You win");
  }
  return win;
};

const checkLose = function () {
  if (rowNum > 10) {
    modal.classList.remove("hidden");
    modalMessage.textContent = "YOU LOSE! 😢";
    modalMessage.style.color = "red";
  }
};

const renderScore = function (score) {
  const correctGuessMarkup = `<div class="score-circle guess-correct"></div>`;
  const incorrectGuessMarkup = `<div class="score-circle guess-incorrect"></div>`;

  // console.log("score:", score);

  shuffleArray(score); //randomizes array so answer doesnt spoil

  score.forEach((s) => {
    if (s === 1) roundScore.insertAdjacentHTML("beforeend", correctGuessMarkup);
    if (s === 2)
      roundScore.insertAdjacentHTML("beforeend", incorrectGuessMarkup);
  });
};

const updateRow = function () {
  currentRow.classList.remove("current-row");
  // console.log("current row old:", currentRow);

  rowNum++;
  if (rowNum > 10) return;
  // console.log("row num:", rowNum);

  currentRow = document.querySelector(`.row-${rowNum}`);
  // console.log("current row new:", currentRow);

  currentRow.classList.add("current-row");

  assignBoxes();

  selectedBox.classList.remove("box-selected");
  box1.classList.add("box-selected");
  selectedBox = document.querySelector(".box-selected");
};

submitBtn.addEventListener("click", function () {
  assignGuess();
  const score = getscore(guess);

  if (checkWin(score)) return;

  // console.log(guess);

  if (!guess || guess.some((g) => !g)) return;
  // console.log("rowNum pre guess:", rowNum);
  renderScore(score);
  updateRow();
  checkLose();
  // console.log("rowNum post guess:", rowNum);
  // console.log(selectedBox);
});

newGameBtn.addEventListener("click", init);

init();
// to do: check winner, new game button,
