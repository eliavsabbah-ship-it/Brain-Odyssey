<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Daily Puzzle | PuzzleQuest</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>🧩 Today’s Puzzle</h1>
    <p class="puzzle-question" id="puzzle-question"></p>
    <img id="puzzle-image" class="puzzle-image" src="" alt="Puzzle Image">
    <div id="answer-area"></div>
    <p style="text-align:center;">🔥 Streak: <span id="streakCount">0</span> days</p>

    <div class="decor-shapes">
      <div class="shape circle"></div>
      <div class="shape square"></div>
      <div class="shape triangle"></div>
    </div>

    <div class="nav-buttons">
      <a href="index.html" class="btn">Home</a>
      <a href="membership.html" class="btn">Membership</a>
    </div>
  </div>

  <script src="answerBox.js"></script>
  <script src="puzzle.js"></script>
</body>
</html>
