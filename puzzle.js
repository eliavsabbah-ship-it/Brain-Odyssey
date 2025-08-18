const puzzles = [
  { img: "https://via.placeholder.com/1200x800.png?text=Puzzle+1", question: "Fill in the missing number", answer: "42" },
  { img: "https://via.placeholder.com/1200x800.png?text=Puzzle+2", question: "Which shape comes next?", answer: "CIRCLE" },
  { img: "https://via.placeholder.com/1200x800.png?text=Puzzle+3", question: "Choose the correct pair (A, B, or C)", answer: "B" }
];

const todayIndex = new Date().getDate() % puzzles.length;
const todayPuzzle = puzzles[todayIndex];

document.getElementById("puzzle-question").textContent = todayPuzzle.question;
document.getElementById("puzzle-image").src = todayPuzzle.img;

createAnswerBox("answer-area", todayPuzzle.answer, () => updateStreak(), null);

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
