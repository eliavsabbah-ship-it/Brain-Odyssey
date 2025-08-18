// puzzle.js
// Defines puzzles + streak system

const puzzles = [
  { question: "Unscramble: NITSPU", answer: "INPUT" },
  { question: "Next number? 2, 4, 8, 16, ?", answer: "32" },
  { question: "Capital of France?", answer: "PARIS" }
];

// Pick today’s puzzle (rotates daily)
const todayIndex = new Date().getDate() % puzzles.length;
const todayPuzzle = puzzles[todayIndex];

// Show puzzle
document.getElementById("puzzle-container").innerHTML = `
  <p class="puzzle-question"><strong>${todayPuzzle.question}</strong></p>
  <div id="answer-area"></div>
`;

// Create answer box
createAnswerBox("answer-area", todayPuzzle.answer, () => {
  updateStreak();
}, null);

// --- Streak tracking ---
function updateStreak() {
  let streak = localStorage.getItem("puzzleStreak") || 0;
  let lastPlayed = localStorage.getItem("lastPlayedDate");
  const today = new Date().toDateString();

  if (lastPlayed !== today) {
    streak++;
    localStorage.setItem("puzzleStreak", streak);
    localStorage.setItem("lastPlayedDate", today);
  }

  document.getElementById("streakCount").textContent = streak;
}

// Load streak when page opens
window.onload = () => {
  const streak = localStorage.getItem("puzzleStreak") || 0;
  document.getElementById("streakCount").textContent = streak;
};
