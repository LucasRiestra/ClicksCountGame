// Get Elements!
const startContainer = document.querySelector(".startContainer");
const usernameForm = document.getElementById("usernameForm");
const startButton = document.getElementById("startButton");
const gameWrapper = document.getElementById("gameWrapper");
const clickBox = document.getElementById("clickBox");
const ranking = document.getElementById("ranking");
const rankingList = document.getElementById("rankingList");
const scoreSection = document.getElementById("scoreSection");
const playAgainButton = document.getElementById("playAgainButton"); 

let clickCount = 0; 
let timer; 

gameWrapper.style.display = "none"; 
scoreSection.style.display = "none";

usernameForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  showGame(username);
});

//Functions!!

//Show Game and play game!!

function showGame(username) {

  startContainer.style.display = "none"; 
  ranking.style.display = "block"; 
  gameWrapper.style.display = "block"; 

  startButton.addEventListener("click", startGame);
  document.getElementById("result").textContent = "Catch the fish as many times as you can!";

  const startAgainButton = document.getElementById("startGameButton");
  startAgainButton.addEventListener("click", startGame);

  playAgainButton.addEventListener("click", playAgain); 

  function startGame() {
    clickCount = 0; 
    document.getElementById("result").textContent = "Catch the fish as many times as you can!";
    clickBox.addEventListener("click", countClick);
    moveBox();
    clearTimeout(timer);
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
    showFinalScore();
  }

  function getRandomOffset(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //Update Ranking!!

  function updateRanking(username, clickCount) {
    const currentScores = Array.from(rankingList.children).map((li) => {
      const [name, score] = li.textContent.split(" ");
      return { name, score: parseInt(score) }; 
    });


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
  } else {
    // Si no hay datos en el localStorage, mostramos la lista por defecto
    const defaultScores = [
      { name: "Ignacio", score: 20 },
      { name: "Andrea", score: 14 },
      { name: "Aaron", score: 8 },
      { name: "Michele", score: 5 },
    ];
    createRanking(defaultScores);
  }


  localStorage.getItem("rankingData", rankingList)

  function showFinalScore() {
    gameWrapper.style.display = "none"; // Ocultar el div del juego
    ranking.style.display = "block"; // Ocultar el div del ranking
    const rankingParent = ranking.parentNode;
    rankingParent.insertBefore(scoreSection, ranking);
    scoreSection.style.display = "block"; // Mostrar el div "Your Score!" con la puntuación
    document.getElementById("userScore").textContent = `You caught the fish ${clickCount} times in 10 seconds!!!`; // Mostrar el puntaje del jugador
  }

  function playAgain() {
    scoreSection.style.display = "none"; // Ocultar el div "Your Score!"
    gameWrapper.style.display = "block"; // Mostrar el div del juego nuevamente
    clickCount = 0; // Reiniciar el contador de clics
    document.getElementById("result").textContent = "Catch the fish as many times as you can!";
    moveBox();
    clearTimeout(timer); // Reiniciar el temporizador
    timer = setTimeout(endGame, 10000);
  }
}
