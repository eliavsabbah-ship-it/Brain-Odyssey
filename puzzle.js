// puzzle.js
// Picture puzzles + streak system

// Define puzzles with images
const puzzles = [
  {
    img: "puzzle-images/math-grid.png",   // example image
    question: "Solve the missing number",
    answer: "42"
  },
  {
    img: "puzzle-images/sequence-shapes.png",
    question: "Which shape comes next?",
    answer: "CIRCLE"
  },
  {
    img: "puzzle-images/logic-match.png",
    question: "Find the matching pair",
    answer: "B"
  }
];

// --- Pick today's puzzle ---
const todayIndex = new Date().getDate() % puzzles.length;
const todayPuzzle = puzzles[todayIndex];

// --- Show puzzle ---
document.getElementById("puzzle-container").innerHTML = `
  <p class="puzzle-question"><strong>${todayPuzzle.question}</strong></p>
  <img src="${todayPuzzle.img}" alt="Puzzle Image" class="puzzle-image" />
  <div id="answer-area"></div>
`;

// --- Create answer box ---
createAnswerBox("answer-area", todayPuzzle.answer, () => {
  updateStreak();
}, null);

// --- Close-enough answer checking ---
function normalize(str) {
  return str.toString().trim().toUpperCase().replace(/\s+/g, "");
}

function isCloseEnough(userAnswer, correctAnswer) {
  const u = normalize(userAnswer);
  const c = normalize(correctAnswer);

  // Accept if exact OR Levenshtein distance <= 1 (almost correct)
  return (u === c || levenshtein(u, c) <= 1);
}

// Small Levenshtein distance function (to allow "close enough" answers)
function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => []);
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = a[i - 1] === b[j - 1]
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1]
