let chosenPuzzle = localStorage.getItem("chosenPuzzle");
let currentPuzzle = null;
let playerPos = {x: 1, y: 1};

// Puzzle definitions
const puzzles = {
  maze: () => {
    let maze = [
      "##########",
      "#S     #E#",
      "# ### #  #",
      "#   # ####",
      "##########"
    ].map(r => r.split(""));

    // find start position
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === "S") {
          playerPos = {x, y};
        }
      }
    }
    drawMaze(maze);
    document.addEventListener("keydown", (e) => handleMove(e, maze));
  },
  memory: () => {
    document.getElementById("puzzle").innerText =
      "Memorize this sequence: 9-3-7-1-4\n(Type it back after 3 seconds)";
  },
  logic: () => {
    document.getElementById("puzzle").innerText =
      "Logic Puzzle:\nYou have inputs A=1, B=0.\nTarget = 1\nAllowed Gates: AND, OR, XOR\nWhich gate gives the target?";
  },
  lights: () => {
    document.getElementById("puzzle").innerText =
      "Lights Out Puzzle:\nClick buttons to turn off all the lights (coming soon!)";
  },
  cipher: () => {
    document.getElementById("puzzle").innerText =
      "Cipher Puzzle:\nDecode this word (Caesar +3): QVAAMF";
  }
};

function drawMaze(maze) {
  let mazeCopy = maze.map(r => [...r]);
  mazeCopy[playerPos.y][playerPos.x] = "●";
  document.getElementById("puzzle").innerText =
    mazeCopy.map(r => r.join("")).join("\n");
}

function handleMove(e, maze) {
  let {x, y} = playerPos;
  if (e.key === "ArrowUp" && maze[y-1][x] !== "#") y--;
  if (e.key === "ArrowDown" && maze[y+1][x] !== "#") y++;
  if (e.key === "ArrowLeft" && maze[y][x-1] !== "#") x--;
  if (e.key === "ArrowRight" && maze[y][x+1] !== "#") x++;

  playerPos = {x, y};
  drawMaze(maze);

  if (maze[y][x] === "E") {
    document.getElementById("feedback").innerText = "🎉 You escaped the maze!";
  }
}

// puzzle chooser
function choosePuzzle(type) {
  localStorage.setItem("chosenPuzzle", type);
  window.location.href = "puzzle.html";
}

// run chosen puzzle
window.onload = () => {
  if (chosenPuzzle && puzzles[chosenPuzzle]) {
    puzzles[chosenPuzzle]();
  }
};

function checkAnswer() {
  document.getElementById("feedback").innerText = "Answer submitted!";
}
