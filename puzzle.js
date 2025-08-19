window.onload = () => {
  const puzzleType = localStorage.getItem("chosenPuzzle");
  if (!puzzleType) {
    window.location.href = "puzzle-select.html"; // force puzzle choice
    return;
  }

  const puzzleDiv = document.getElementById("puzzle");
  const instructionsDiv = document.getElementById("instructions");

  switch (puzzleType) {
    case "maze":
      instructionsDiv.innerHTML = "<h2>Maze Puzzle</h2><p>Use arrow keys to reach the exit (E).</p>";
      puzzleDiv.textContent = `
#########
#S     E#
# ##### #
#       #
#########`;
      break;

    case "memory":
      instructionsDiv.innerHTML = "<h2>Memory Challenge</h2><p>Memorize the sequence shown for 3 seconds, then type it below.</p>";
      const seq = Math.random().toString(36).substring(2, 7).toUpperCase();
      puzzleDiv.textContent = seq;
      setTimeout(() => puzzleDiv.textContent = "???", 3000);
      window.expectedAnswer = seq;
      break;

    case "lights":
      instructionsDiv.innerHTML = "<h2>Lights Out</h2><p>Click the cells to turn all lights off.</p>";
      puzzleDiv.textContent = "[Lights Out grid would go here]";
      break;

    case "logic":
      instructionsDiv.innerHTML = "<h2>Logic Gates</h2><p>Combine gates (AND, OR, XOR) to match the target output.</p>";
      puzzleDiv.textContent = "Inputs: 1, 0\nTarget: 1\nYour challenge: build with OR";
      window.expectedAnswer = "OR";
      break;

    case "code":
      instructionsDiv.innerHTML = "<h2>Codebreaking</h2><p>Decode the Caesar cipher word.</p>";
      puzzleDiv.textContent = "QVAAMF (shifted)";
      window.expectedAnswer = "PUZZLE"; // pretend
      break;
  }
};

function submitAnswer() {
  const ans = document.getElementById("answer").value.trim().toUpperCase();
  if (ans === window.expectedAnswer) {
    alert("Correct! 🎉");
  } else {
    alert("Not quite, try again!");
  }
}
