const startContainer = document.querySelector(".startContainer");
const usernameForm = document.getElementById("usernameForm");
const startButton = document.getElementById("startButton");
const gameWrapper = document.getElementById("gameWrapper");
const clickBox = document.getElementById("clickBox");
const ranking = document.getElementById("ranking");
const rankingList = document.getElementById("rankingList");
let clickCount = 0; // Variable para almacenar el número de clics
let timer; // Variable para almacenar el temporizador

gameWrapper.style.display = "none"; // Ocultar el div del juego al inicio

usernameForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  showGame(username);
});

function showGame(username) {
  startContainer.style.display = "none"; // Ocultar el div del formulario
  ranking.style.display = "block"; // Mostrar el div del ranking
  gameWrapper.style.display = "block"; // Mostrar el juego

  startButton.addEventListener("click", startGame);
  document.getElementById("result").textContent = "Catch the fish as many times as you can!";

  const startAgainButton = document.getElementById("startGameButton");
  startAgainButton.addEventListener("click", startGame);

  function startGame() {
    clickCount = 0; // Reiniciar el contador de clics
    document.getElementById("result").textContent = "Catch the fish as many times as you can!";
    clickBox.addEventListener("click", countClick);
    moveBox();
    clearTimeout(timer); // Reiniciar el temporizador si se presiona "Start Again"
    timer = setTimeout(endGame, 10000);
  }

  function moveBox() {
    const randomX = getRandomOffset(30, 180);
    const randomY = getRandomOffset(30, 180);
    const randomSize = Math.floor(Math.random() * 100) + 50;

    clickBox.style.transform = `translate(${randomX}px, ${randomY}px)`;
  }

  function countClick() {
    clickCount++;
    moveBox();
  }

  function endGame() {
    document.getElementById("result").textContent = `You caught the fish ${clickCount} times!!`;
    updateRanking(username, clickCount);
  }
}

function getRandomOffset(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateRanking(username, clickCount) {
  const currentScores = Array.from(rankingList.children).map((li) => {
    const [name, score] = li.textContent.split(" ");
    return { name, score: parseInt(score) }; // Asegurar que se obtiene un número válido
  });

  // Buscar si el usuario ya existe en el ranking
  const userScoreIndex = currentScores.findIndex((score) => score.name === username);

  if (userScoreIndex !== -1) {
    // Si el usuario ya existe, reemplazar su puntuación si es más alta
    if (clickCount > currentScores[userScoreIndex].score) {
      currentScores[userScoreIndex].score = clickCount;
    }
  } else {
    // Si el usuario no existe en el ranking y el ranking no está lleno, agregarlo
    if (currentScores.length < 4) {
      currentScores.push({ name: username, score: clickCount });
    } else {
      // Si el ranking está lleno, reemplazar al usuario con la puntuación más baja
      const lowestScoreIndex = currentScores.findIndex((score) => score.score === Math.min(...currentScores.map((s) => s.score)));
      currentScores[lowestScoreIndex] = { name: username, score: clickCount };
    }
  }

  // Ordenar en orden descendente por el número de clics
  currentScores.sort((a, b) => b.score - a.score);

  // Limitar el ranking a un máximo de 4 usuarios
  const limitedScores = currentScores.slice(0, 4);

  // Mostrar el ranking actualizado
  createRanking(limitedScores);

  localStorage.setItem("rankingData", JSON.stringify(limitedScores));
}

function createRanking(scores) {
  rankingList.innerHTML = "";
  for (const score of scores) {
    const li = document.createElement("li");
    li.textContent = `${score.name} ${score.score} catches`;
    rankingList.appendChild(li);
  }
}

const storedRanking = localStorage.getItem("rankingData");
if (storedRanking) {
  const currentScores = JSON.parse(storedRanking);
  createRanking(currentScores);
}