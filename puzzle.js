const puzzles = [
  {
    img: "https://i.imgur.com/8z4Ew0h.png", // Math grid puzzle placeholder
    question: "Fill in the missing number in the grid",
    answer: "42"
  },
  {
    img: "https://i.imgur.com/9gHjX5K.png", // Sequence of shapes
    question: "Which shape comes next?",
    answer: "CIRCLE"
  },
  {
    img: "https://i.imgur.com/VkK8Ksi.png", // Logic matching puzzle
    question: "Find the matching pair (A, B, or C)",
    answer: "B"
  }
];

const todayIndex = new Date().getDate() % puzzles.length;
const todayPuzzle = puzzles[todayIndex];

document.getElementById("puzzle-container").innerHTML = `
  <p class="puzzle-question"><strong>${todayPuzzle.question}</strong></p>
  <img src="${todayPuzzle.img}" alt="Puzzle Image" class="puzzle-image" />
  <div id="answer-area"></div>
`;

createAnswerBox("answer-area", todayPuzzle.answer, () => { updateStreak(); }, null);

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
