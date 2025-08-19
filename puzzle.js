const puzzleArea = document.getElementById("puzzleArea");
const instructions = document.getElementById("instructions");
const result = document.getElementById("result");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitAnswer");

let correctAnswer = null;

// Load chosen puzzle type from localStorage
const selectedType = localStorage.getItem("selectedPuzzleType");

if(!selectedType){
  // If no type chosen, force them back to index
  window.location.href = "index.html";
}

const puzzlePool = {
  cipher: [
    {instruction:"Decode Caesar Cipher (shift -1): QVAAMF", answer:"PUZZLE"}
  ],
  memory: [
    {instruction:"Memorize this sequence for 3 seconds: 74291. Type it back.", answer:"74291"}
  ],
  binary: [
    {instruction:"Decode binary: 01010000 01010101 01011010 01011010 01001100 01000101", answer:"PUZZLE"}
  ],
  maze: [
    {instruction:"Navigate this ASCII maze to the exit (top-left to bottom-right):\nS..#\n.#..\n..#E\n#...", answer:"DONE"}
  ],
  lightsout: [
    {instruction:"Lights Out: Toggle all buttons to turn them off. Type 'DONE' when solved.", answer:"DONE"}
  ],
  logic: [
    {instruction:"Logic Puzzle: Solve the AND/OR/XOR to reach target. Type 'DONE' when solved.", answer:"DONE"}
  ]
};

// Pick a random puzzle from the chosen type
function loadPuzzle() {
  const puzzles = puzzlePool[selectedType];
  const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  instructions.innerText = puzzle.instruction;
  puzzleArea.innerText = "Solve the puzzle above.";
  correctAnswer = puzzle.answer;
}

submitBtn.addEventListener("click", () => {
  if(answerInput.value.trim().toUpperCase() === correctAnswer){
    result.innerText = "✅ Correct!";
  } else {
    result.innerText = "❌ Try again.";
  }
});

// Load the puzzle immediately
loadPuzzle();
