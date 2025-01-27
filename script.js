let cl = console.log;

// ===== DOM elements =====
let endScreen = document.getElementById("end-screen");
let mainApp = document.getElementById("app");
const blanksContainer = document.getElementById("text-blanks-container");
const hangManContainer = document.getElementById("hang-man-container");
const startBtn = document.getElementById("start-btn");
let categoryBtn = document.querySelectorAll(".category-btn");
let letterBtn = document.querySelectorAll(".letter");
const button = document.getElementById("input-placeholder");
const input = document.getElementById("manual-guess-input");

// ===== Variables =====
let userCategoryChoice = "";
let partsLeft = 9;
let blankArray = [];
let userLetterChoice = "";
let winLoseStatus = "";
let randomWord = "";
let i = 0;
let title = "A Game of Hang Man...";
let speed = 75;

// ===== Typewriter Effect =====
function typeWriter() {
  if (i < title.length) {
    document.getElementById("title").innerHTML += title.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}
typeWriter();

// ===== Choosing category =====
categoryBtn.forEach((button) => {
  button.addEventListener("click", function () {
    userCategoryChoice = this.id;
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

// ===== starting game =====
function startGame() {
  document.getElementById("starting-screen").style.display = "none";
  document.getElementById("end-screen").style.display = "none";
  document.getElementById("app").style.display = "flex";
  chooseRandWrd();
}

// choosing random word
function chooseRandWrd() {
  fetch("words.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let selectedArray = data.categories[userCategoryChoice];
      let randomIndex = Math.floor(Math.random() * selectedArray.length);
      randomWord = selectedArray[randomIndex];

      cl(randomWord);
      displayBlanks();
      generateBlankArray();
    })
    .catch((error) => {
      console.error("Error fetching the JSON file:", error);
    });
  // return (randomWord = selectedArray[randomIndex]);
}

// displaying blanks
function displayBlanks() {
  let wordArray = Array.from(randomWord);
  for (let i = 0; i < wordArray.length; i++) {
    blanksContainer.innerHTML += "_ ";
  }
}
function generateBlankArray() {
  blankArray = blanksContainer.innerHTML.split(" ");
  blankArray.pop();
}

// User letter choice
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

// adding a body part to hang stand thing
function addBodyPart() {
  let i = 10 - partsLeft;

  hangManContainer.innerHTML += `<img src="./hangman-imgs/${i}.png">`;
}

//function to show manual guess input
button.addEventListener("click", () => {
  button.classList.add("clicked");
  input.focus();
});

//function to check manual guess
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (input.value.toLowerCase() === randomWord) {
      win();
    } else {
      lose();
    }
  }
});

//function to check status of win/lose
function checkStatus() {
  if (!blanksContainer.innerHTML.includes("_")) {
    win();
  } else if (partsLeft <= 0) {
    lose();
  }
}

// if the user wins...
function win() {
  winLoseStatus = "won";
  hangManContainer.innerHTML = `
    <img id="happy-man" src="./hangman-imgs/happy.png">
    <img src="./hangman-imgs/hang-man-stand.png">
  `;

  setTimeout(() => {
    let happyMan = document.getElementById("happy-man");
    if (happyMan) {
      happyMan.style.transform = "translateY(82px)";
      happyMan.style.transition =
        "transform 0.6s cubic-bezier(0.25, 1.5, 0.5, 1)";
    }

    setTimeout(() => {
      hangManContainer.innerHTML += `<img id="thx-bubble" src="./hangman-imgs/speech-bubble-thx.png">`;

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
    <img id="deadMan" src="./hangman-imgs/full-dead-guy.png">
    <img src="./hangman-imgs/hang-man-stand.png">`;
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
function endGame() {
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
