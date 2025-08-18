// puzzle.js
// Literal puzzles (not riddles)

const puzzles = [
  { 
    question: "Which number completes the sequence? 1, 4, 9, 16, ?", 
    answer: "25" 
  },
  { 
    question: "Fill in the blank: Circle, Triangle, Square, Pentagon, ?", 
    answer: "Hexagon" 
  },
  { 
    question: "What is 12 × 12?", 
    answer: "144" 
  }
];

// Pick today’s puzzle
const todayIndex = new Date().getDate() % puzzles.length;
const todayPuzzle = puzzles[todayIndex];

// Show puzzle
document.getElementById("puzzle-container").innerHTML = `
  <p class="puzzle-question"><strong>${todayPuzzle.question}</strong></p>
  <div id="answer-area"></div>
`;

createAnswerBox("answer-area", todayPuzzle.answer, () => {
  updateStreak();
}, null);

// --- Streak system ---
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

window.onload = () => {
  const streak = localStorage.getItem("puzzleStreak") || 0;
  document.getElementById("streakCount").textContent = streak;
};
