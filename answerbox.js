// answerBox.js
// Makes a simple input + button for answering puzzles

function createAnswerBox(containerId, correctAnswer, onCorrect, onWrong) {
  const container = document.getElementById(containerId);

  container.innerHTML = `
    <div class="answer-box">
      <input type="text" id="userAnswer" placeholder="Type your answer..." />
      <button id="submitAnswer">Submit</button>
      <p id="feedback"></p>
    </div>
  `;

  document.getElementById("submitAnswer").addEventListener("click", () => {
    const userAnswer = document.getElementById("userAnswer").value.trim().toUpperCase();
    const feedback = document.getElementById("feedback");

    if (userAnswer === correctAnswer.toUpperCase()) {
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
