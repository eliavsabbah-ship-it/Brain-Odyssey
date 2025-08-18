const todayPuzzle = {
  img: "https://via.placeholder.com/1200x800.png?text=Hard+Puzzle",
  question: "Find the missing pattern in this complex sequence",
  answer: "42"
};

document.getElementById("puzzle-question").textContent = todayPuzzle.question;
document.getElementById("puzzle-image").src = todayPuzzle.img;

// Create answer box
createAnswerBox("answer-area", todayPuzzle.answer, () => updateStreak(), null);

// Streak tracking
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
