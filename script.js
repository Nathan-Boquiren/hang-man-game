let cl = console.log;

const blanksContainer = document.getElementById("text-blanks-container");

const hangManContainer = document.getElementById("hang-man-container");

const startBtn = document.getElementById("start-btn");
// ===== Typewriter Effect =====
let i = 0;
let title = "A Game of Hang Man...";
let speed = 75;
function typeWriter() {
  if (i < title.length) {
    document.getElementById("title").innerHTML += title.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

typeWriter();

// ===== Choosing category =====

let categoryBtn = document.querySelectorAll(".category-btn");

let userCategoryChoice = "";

categoryBtn.forEach((button) => {
  button.addEventListener("click", function () {
    userCategoryChoice = this.id;
    cl(userCategoryChoice);
    this.style.backgroundImage = `url(button-bg-imgs/${this.id}.png)`;
    this.style.filter = "saturate(1)";
    if (this.id !== "countries") {
      this.style.color = "white";
    }

    if (button !== this) {
      button.style.backgroundImage = `url(button-bg-imgs/white-bg.png)`;
      button.style.filter = "saturate(0)";
    }

    startBtn.style.color = "white";
    startBtn.style.backgroundColor = "lightblue";
    startBtn.style.textShadow = "2px 2px 2px rgba(0, 0, 0, 0.2)";
    startBtn.addEventListener("click", startGame);
  });
});

//starting game

function startGame() {
  document.getElementById("starting-screen").style.display = "none";
  document.getElementById("end-screen").style.display = "none";
  document.getElementById("app").style.display = "flex";
  chooseRandWrd();
  cl(randomWord);
  displayBlanks();
  generateBlankArray();
}

// ===== words =====

// Animals

const categories = {
  animals: [
    "elephant",
    "kangaroo",
    "platypus",
    "giraffe",
    "penguin",
    "octopus",
    "crocodile",
    "dolphin",
    "jaguar",
    "chameleon",
    "peacock",
    "rhinoceros",
    "flamingo",
    "cheetah",
    "armadillo",
  ],
  countries: [
    "australia",
    "belgium",
    "canada",
    "denmark",
    "finland",
    "germany",
    "hungary",
    "iceland",
    "jamaica",
    "lebanon",
    "malaysia",
    "morocco",
    "namibia",
    "portugal",
    "uruguay",
  ],
  people: [
    "einstein",
    "shakespeare",
    "beethoven",
    "napoleon",
    "picasso",
    "mandela",
    "lincoln",
    "churchill",
    "socrates",
    "cleopatra",
    "davinci",
    "washington",
    "aristotle",
    "galileo",
    "tesla",
  ],
  christmas: [
    "santa",
    "reindeer",
    "stocking",
    "elf",
    "sleigh",
    "jingle",
    "ornament",
    "mistletoe",
    "gingerbread",
    "wreath",
    "snowflake",
    "nutcracker",
    "eggnog",
    "carol",
    "bethlehem",
  ],
};

// ===== choosing random word =====

let randomWord = "";

function chooseRandWrd() {
  if (!categories[userCategoryChoice]) {
    console.error("Invalid category choice or no category selected.");
    return "";
  }

  const selectedArray = categories[userCategoryChoice];
  const randomIndex = Math.floor(Math.random() * selectedArray.length);
  return (randomWord = selectedArray[randomIndex]);
}

//===== displaying blanks =====

function displayBlanks() {
  let wordArray = Array.from(randomWord);
  for (let i = 0; i < wordArray.length; i++) {
    blanksContainer.innerHTML += "_ ";
  }
}

let blankArray = [];

function generateBlankArray() {
  blankArray = blanksContainer.innerHTML.split(" ");
  blankArray.pop();
}

//body parts left
let partsLeft = 9;

// ===== User letter choice =====
let letterBtn = document.querySelectorAll(".letter");

let userLetterChoice = "";

letterBtn.forEach((button) => {
  button.addEventListener("click", function () {
    userLetterChoice = this.innerHTML;
    userLetterChoice = userLetterChoice.toLowerCase();
    this.style.textDecoration = "line-through";
    this.disabled = true;
    if (randomWord.includes(userLetterChoice)) {
      for (let i = 0; i < randomWord.length; i++) {
        if (randomWord[i] === userLetterChoice) {
          blankArray[i] = userLetterChoice;
        }
      }

      let newBlankArray = blankArray.join(" ");
      blanksContainer.innerHTML = newBlankArray;
    } else {
      addBodyPart();
      partsLeft -= 1;
    }
    checkStatus();
  });
});

// ===== adding a body part to hang stand thing =====
function addBodyPart() {
  let i = 10 - partsLeft;

  hangManContainer.innerHTML += `<img src="./hangman-imgs/hangman-imgs/${i}.png">`;
}

//function to check status of win/lose

function checkStatus() {
  if (!blanksContainer.innerHTML.includes("_")) {
    cl("you got it");
    win();
  } else if (partsLeft <= 0) {
    cl("you lost");
    lose();
  }
}

let winLoseStatus = "";
// if the user wins...
function win() {
  winLoseStatus = "won";
  hangManContainer.innerHTML = `
    <img id="happy-man" src="./hangman-imgs/hangman-imgs/happy.png">
    <img src="./hangman-imgs/hangman-imgs/hang-man-stand.png">
  `;

  setTimeout(() => {
    let happyMan = document.getElementById("happy-man");
    if (happyMan) {
      happyMan.style.transform = "translateY(82px)";
      happyMan.style.transition =
        "transform 0.6s cubic-bezier(0.25, 1.5, 0.5, 1)";
    }

    setTimeout(() => {
      hangManContainer.innerHTML += `<img id="thx-bubble" src="/hangman-imgs/speech-bubble-thx.png">`;

      setTimeout(() => {
        let happyMan = document.getElementById("happy-man");
        if (happyMan) {
          happyMan.style.transform = "translateX(-500px)";
          document.getElementById("thx-bubble").style.display = "none";
        }
      }, 500);
    }, 500);
  }, 500);
  setTimeout(endGame, 2000);
}
// if the user loses...
function lose() {
  winLoseStatus = "lost";
  hangManContainer.innerHTML = `
    <img id="deadMan" src="./hangman-imgs/hangman-imgs/full-dead-guy.png">
    <img src="./hangman-imgs/hangman-imgs/hang-man-stand.png">`;
  let deadMan = document.getElementById("deadMan");

  setTimeout(() => {
    deadMan.style.transform = "rotate(-90deg)";
    deadMan.style.transformOrigin = "37% 50%";

    setTimeout(() => {
      deadMan.style.transform = "rotate(-90deg) translateX(-125px)";

      setTimeout(() => {
        deadMan.style.transform =
          "rotate(-90deg) translateX(-125px) translateY(-600px)";
      }, 500);
    }, 500);
  }, 500);

  setTimeout(endGame, 2000);
}

//end of game, app dissapears

let endScreen = document.getElementById("end-screen");
function endGame() {
  let mainApp = document.getElementById("app");

  mainApp.style.transform = "scale(0) rotate(90deg)";
  mainApp.style.opacity = "0";

  setTimeout(showEndScreen, 500);
  // showEndScreen();
}

function showEndScreen() {
  endScreen.style.display = "flex";
  let endMsg = `You ${winLoseStatus}!`;
  endScreen.innerHTML = endMsg;
  setTimeout(addRestartBtn, 500);
}

function addRestartBtn() {
  endScreen.innerHTML += `<button id="restart-btn">Play Again?</button>`;
  document.getElementById("restart-btn").addEventListener("click", function () {
    location.reload();
  });
}
