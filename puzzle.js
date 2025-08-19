const puzzleArea = document.getElementById("puzzleArea");
const instructions = document.getElementById("instructions");
const result = document.getElementById("result");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitAnswer");

let correctAnswer = null;

// Load chosen puzzle type
const selectedType = localStorage.getItem("selectedPuzzleType");
if(!selectedType){
  window.location.href = "index.html";
}

// Free or Premium check
const isPremium = localStorage.getItem("isPremium") === "true";
const lastPlayDate = localStorage.getItem("lastPlayDate");
const today = new Date().toDateString();

if(!isPremium && lastPlayDate === today){
  puzzleArea.innerText = "❌ Free players can only play 1 puzzle per day.\nCome back tomorrow, or subscribe for unlimited puzzles!";
  document.getElementById("answerInput").style.display = "none";
  document.getElementById("submitAnswer").style.display = "none";
  instructions.innerText = "";
  throw new Error("Daily limit reached");
}

// Puzzle sets with clearer instructions
const puzzlePool = {
  cipher: [
    {instruction:"🔐 Caesar Cipher:\nDecode this text (shift back by 1 letter): QVAAMF", answer:"PUZZLE"}
  ],
  memory: [
    {instruction:"🧠 Memory Challenge:\nRemember this number: 74291\nType it exactly after a few seconds.", answer:"74291"}
  ],
  binary: [
    {instruction:"💻 Binary Puzzle:\nDecode this binary into letters:\n01010000 01010101 01011010 01011010 01001100 01000101", answer:"PUZZLE"}
  ],
  maze: [
    {instruction:"🌀 ASCII Maze:\nFind the path from S (Start) to E (Exit). Answer with 'DONE' when you solved it mentally:\nS..#\n.#..\n..#E\n#...", answer:"DONE"}
  ],
  lightsout: [
    {instruction:"💡 Lights Out:\nImagine a 3x3 grid of lights. Toggle them until all are OFF. Type 'DONE' once solved.", answer:"DONE"}
  ],
  logic: [
    {instruction:"⚡ Logic Puzzle:\nInput A=1, B=0. Solve: (A AND B) OR (A XOR B).\nAnswer with the result: 0 or 1", answer:"1"}
  ]
};

// Pick one puzzle from chosen type
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
    localStorage.setItem("lastPlayDate", today);
  } else {
    result.innerText = "❌ Incorrect. Try again!";
  }
});

// Start puzzle
loadPuzzle();
