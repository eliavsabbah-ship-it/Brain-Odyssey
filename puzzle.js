// puzzle.js

// Example daily puzzles (replace/add as many as you want)
const puzzles = [
  {
    question: "Unscramble this word: NITSPU",
    answer: "INPUT"
  },
  {
    question: "What number comes next? 2, 4, 8, 16, ?",
    answer: "32"
  },
  {
    question: "Fill in the blank: The capital of France is ____.",
    answer: "PARIS"
  }
];

// Pick puzzle based on today's date
const todayIndex = new Date().getDate() % puzzles.length;
const todayPuzzle = puzzles[todayIndex];

// Display puzzle
const container = document.getElementById("puzzle-container");
container.innerHTML = `
  <div class="puzzle-box">
    <p class="puzzle-question"><strong>${todayPuzzle.question}</strong></p>
    <input type="text" id="userAnswer" placeholder="Type your answer here" />
    <button id="submitAnswer">Submit</button>
    <p id="feedback"></p>
  </div>
`;

// Handle answer submission
document.getElementById("submitAnswer").addEventListener("click", () => {
  const userAnswer = document.getElementById("userAnswer").value.trim().toUpperCase();
  const feedback = document.getElementById("feedback");

  if (userAnswer === todayPuzzle.answer.toUpperCase()) {
    feedback.textContent = "✅ Correct! Well done!";
    feedback.style.color = "lightgreen";
    updateStreak();
  } else {
    feedback.textContent = "❌ Wrong, try again!";
    feedback.style.color = "red";
  }
});

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

// Load streak on page load
window.onload = () => {
  const streak = localStorage.getItem("puzzleStreak") || 0;
  document.getElementById("streakCount").textContent = streak;
};
