const wordEl = document.getElementById("word");
const textEl = document.getElementById("text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const endGameEl = document.getElementById("end-game-container");
const settingsBtn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");

let score = 0;
let time = 10;
let randomWord = "";
let difficulty = localStorage.getItem("difficulty") || "medium";

const timer = setInterval(updateTime, 1000);

async function getRandomWord() {
  const res = await fetch("https://random-word-api.herokuapp.com/word?number=1");
  const data = await res.json();
  return data[0];
}

async function addWord() {
  randomWord = await getRandomWord();
  wordEl.innerText = randomWord;
}

function updateTime() {
  time--;
  timeEl.innerText = `${time}s`;

  if (time === 0) {
    clearInterval(timer);
    gameOver();
  }
}

function gameOver() {
  endGameEl.innerHTML = `
    <h1>Time ran out</h1>
    <p>Your final score is ${score}</p>
    <button onclick="location.reload()">Play Again</button>
  `;
  endGameEl.style.display = "flex";
}

textEl.addEventListener("input", async e => {
  if (e.target.value === randomWord) {
    e.target.value = "";
    await addWord();
    score++;
    scoreEl.innerText = score;
    time += difficulty === "hard" ? 2 : difficulty === "medium" ? 3 : 5;
  }
});

settingsBtn.addEventListener("click", () =>
  settings.classList.toggle("hide")
);

settingsForm.addEventListener("change", e => {
  difficulty = e.target.value;
  localStorage.setItem("difficulty", difficulty);
});

difficultySelect.value = difficulty;
addWord();
textEl.focus();
