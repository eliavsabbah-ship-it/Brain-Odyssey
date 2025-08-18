// answerBox.js
// Creates input box and checks answer similarity

function stringSimilarity(str1, str2) {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  let matches = 0;
  const len = Math.min(str1.length, str2.length);
  for (let i = 0; i < len; i++) {
    if (str1[i] === str2[i]) matches++;
  }
  return matches / Math.max(str1.length, str2.length);
}

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
    const userAnswer = document.getElementById("userAnswer").value.trim();
    const feedback = document.getElementById("feedback");

    const similarity = stringSimilarity(userAnswer, correctAnswer);
    if (similarity > 0.7) {
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
