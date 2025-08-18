function normalize(str) {
  return str.toString().trim().toUpperCase().replace(/\s+/g, "");
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => []);
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      matrix[i][j] = a[i - 1] === b[j - 1]
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);

  return matrix[a.length][b.length];
}

function isCloseEnough(userAnswer, correctAnswer) {
  const u = normalize(userAnswer);
  const c = normalize(correctAnswer);
  return u === c || levenshtein(u, c) <= 1;
}

function createAnswerBox(containerId, correctAnswer, onCorrect, onWrong) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="answer-box">
      <input type="text" id="userAnswer" placeholder="Type your answer here..." />
      <button id="submitAnswer">Submit</button>
      <p id="feedback"></p>
    </div>
  `;
  document.getElementById("submitAnswer").addEventListener("click", () => {
    const userAnswer = document.getElementById("userAnswer").value;
    const feedback = document.getElementById("feedback");

    if (isCloseEnough(userAnswer, correctAnswer)) {
      feedback.textContent = "✅ Correct!";
      feedback.style.color = "lightgreen";
      if (onCorrect) onCorrect();
    } else {
      feedback.textContent = "❌ Wrong, try again!";
      feedback.style.color = "red";
      if (onWrong) onWrong();
    }
  });
}
