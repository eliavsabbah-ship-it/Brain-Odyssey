function choosePuzzle(type) {
  localStorage.setItem("chosenPuzzle", type);
  window.location.href = "puzzle.html";
}
