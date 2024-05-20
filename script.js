const square0 = document.getElementById("square0");
const square1 = document.getElementById("square1");
const square2 = document.getElementById("square2");
const square3 = document.getElementById("square3");

const centerText = document.getElementById("centerText");

async function main() {
  const time = 30;

  centerText.innerText = `Press space to start.\nUse arrow keys to select the square that lights up.\nYou have ${time} seconds to get as many correct as possible.\nIf you get 3 wrong, the game is over.`;

  while (true) {
    await waitForSpace();

    let score = await playGame(time);

    centerText.innerText = `Game over!\nYour score was:\n${score}\nPress space to play again.`;
  }
}

async function waitForSpace() {
  return new Promise((resolve) => {
    function keyDownHandler(event) {
      if (event.key === " ") {
        resolve();
        window.removeEventListener("keydown", keyDownHandler);
      }
    }

    window.addEventListener("keydown", keyDownHandler);
  });
}

async function playGame(timeoutSeconds = 30) {
  const timeout = new Date(new Date().getTime() + timeoutSeconds * 1000);

  let squareToPress = 0;

  let mistakes = 0;

  let pressedSquares = 0;

  // Display number of seconds remaining
  let interval = setInterval(() => {
    const secondsRemaining = Math.ceil((timeout - new Date()) / 1000);
    // Stop the interval if the game is over
    if (secondsRemaining <= 0 || mistakes >= 3) {
      clearInterval(interval);
    } else {
      centerText.innerText = `Seconds remaining: ${secondsRemaining}
      Mistakes: ${mistakes}`;
    }
  }, 1000);

  while (mistakes < 3 && new Date() < timeout) {
    squareToPress = randomSquare(squareToPress);

    // Highlight the square that the user needs to press
    const numberToSquare = {
      0: square0,
      1: square1,
      2: square2,
      3: square3,
    };
    numberToSquare[squareToPress].style.backgroundColor = "blue";

    const result = await checkPress(squareToPress);
    if (!result) {
      mistakes += 1;
    } else {
      pressedSquares += 1;
    }

    // Clear color of all squares
    for (let i = 0; i < 4; i++) {
      numberToSquare[i].style.backgroundColor = "";
    }
  }

  return pressedSquares;
}

main();

async function checkPress(squareToPress) {
  const numberToSquare = {
    0: square0,
    1: square1,
    2: square2,
    3: square3,
  };

  // Wait for the user to use arrow keys to select a square
  const key = await getKey();

  // Check if the user pressed the correct square
  if (key === squareToPress) {
    numberToSquare[key].style.backgroundColor = "green";
    await keyRelease();
    numberToSquare[key].style.backgroundColor = "";
    return true;
  } else {
    numberToSquare[key].style.backgroundColor = "red";
    await keyRelease();
    numberToSquare[key].style.backgroundColor = "";
    return false;
  }
}

async function getKey() {
  return new Promise((resolve) => {
    window.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        resolve(0);
      } else if (event.key === "ArrowLeft") {
        resolve(1);
      } else if (event.key === "ArrowRight") {
        resolve(2);
      } else if (event.key === "ArrowDown") {
        resolve(3);
      }
    });
  });
}

async function keyRelease() {
  return new Promise((resolve) => {
    function keyUpHandler(event) {
      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowDown"
      ) {
        resolve();
        window.removeEventListener("keyup", keyUpHandler);
      }
    }

    window.addEventListener("keyup", keyUpHandler);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomSquare(ignore) {
  let rand = Math.floor(Math.random() * 3);
  if (rand >= ignore) {
    rand += 1;
  }
  return rand;
}
