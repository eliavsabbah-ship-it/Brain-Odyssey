// Subscription is still tracked but no restriction for free users
const isSubscribed = localStorage.getItem("isSubscribed") === "true";

const puzzleArea = document.getElementById("puzzleArea");
const instructions = document.getElementById("instructions");
const result = document.getElementById("result");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitAnswer");
const newBtn = document.getElementById("newPuzzle");

let currentPuzzle = null;
let correctAnswer = null;

// Example puzzle pool (expandable)
const puzzles = [
  {
    type: "cipher",
    instruction: "Decode this Caesar Cipher (shift -1): QVAAMF",
    answer: "PUZZLE"
  },
  {
    type: "memory",
    instruction: "Memorize this sequence for 3 seconds: 74291. Type it back.",
    answer: "74291"
  },
  {
    type: "binary",
    instruction: "Decode this binary: 01010000 01010101 01011010 01011010 01001100 01000101",
    answer: "PUZZLE"
  }
];

// Load a random puzzle
function loadPuzzle(){
  const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  currentPuzzle = puzzle.type;
  correctAnswer = puzzle.answer;

  instructions.innerText = puzzle.instruction;
  puzzleArea.innerText = "Solve the puzzle above.";
  answerInput.style.display = "inline-block";
  submitBtn.style.display = "inline-block";
  newBtn.style.display = "inline-block";
}

submitBtn.addEventListener("click", () => {
  if(answerInput.value.trim().toUpperCase() === correctAnswer){
    result.innerText = "✅ Correct!";
  } else {
    result.innerText = "❌ Try again.";
  }
});

newBtn.addEventListener("click", () => {
  loadPuzzle(); // free users can generate new puzzles infinitely
});

// Start
loadPuzzle();
