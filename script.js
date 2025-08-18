// Simple example: "Daily Puzzle Generator"
const puzzles = [
  {
    instructions: "Find the number that completes the sequence: 2, 6, 12, 20, ?",
    answer: "30"
  },
  {
    instructions: "Unscramble the letters to make a word: 'RACTE'.",
    answer: "REACT"
  },
  {
    instructions: "What 4-letter word can be placed before 'Time' and 'Line' to make two words?",
    answer: "Dead"
  }
];

// Pick puzzle of the day based on current date
const today = new Date();
const puzzleIndex = today.getDate() % puzzles.length;
const puzzle = puzzles[puzzleIndex];

document.getElementById('puzzle-instructions').innerText = puzzle.instructions;

const streakKey = 'puzzleStreak';
const lastDateKey = 'lastPuzzleDate';
let streak = parseInt(localStorage.getItem(streakKey)) || 0;
const lastDate = localStorage.getItem(lastDateKey);

function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return new Date(date).toDateString() === yesterday.toDateString();
}

// Check streak logic
if(lastDate){
  if(new Date(lastDate).toDateString() === today.toDateString()){
    // Already completed today
    document.getElementById('streak-count').innerText = streak;
  } else if(isYesterday(lastDate)){
    // Continue streak
    streak += 1;
    localStorage.setItem(streakKey, streak);
    localStorage.setItem(lastDateKey, today);
    document.getElementById('streak-count').innerText = streak;
  } else {
    // Reset streak
    streak = 1;
    localStorage.setItem(streakKey, streak);
    localStorage.setItem(lastDateKey, today);
    document.getElementById('streak-count').innerText = streak;
  }
} else {
  streak = 0;
  document.getElementById('streak-count').innerText = streak;
}

document.getElementById('submit-btn').addEventListener('click', () => {
  const userAnswer = prompt("Enter your answer:");
  if(userAnswer.trim().toLowerCase() === puzzle.answer.toLowerCase()){
    document.getElementById('feedback').innerText = "✅ Correct!";
    streak += 1;
    localStorage.setItem(streakKey, streak);
    localStorage.setItem(lastDateKey, today);
    document.getElementById('streak-count').innerText = streak;
  } else {
    document.getElementById('feedback').innerText = "❌ Try Again!";
  }
});
