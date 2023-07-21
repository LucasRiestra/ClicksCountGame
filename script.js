document.addEventListener("DOMContentLoaded", function () {
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
      document.getElementById("result").textContent = "¡Haz clic en la caja azul!";
  
      const startAgainButton = document.getElementById("startGameButton");
      startAgainButton.addEventListener("click", startGame);
  
      function startGame() {
        clickCount = 0; // Reiniciar el contador de clics
        document.getElementById("result").textContent = "¡Haz clic en la caja azul!";
        clickBox.addEventListener("click", countClick);
        moveBox();
        clearTimeout(timer); // Reiniciar el temporizador si se presiona "Start Again"
        timer = setTimeout(endGame, 10000);
      }
  
      function moveBox() {
        const randomX = getRandomOffset(50, 150);
        const randomY = getRandomOffset(50, 150);
        const randomSize = Math.floor(Math.random() * 100) + 50;
  
        clickBox.style.transform = `translate(${randomX}px, ${randomY}px)`;
        clickBox.style.width = `${randomSize}px`;
        clickBox.style.height = `${randomSize}px`;
      }
  
      function countClick() {
        clickCount++;
        moveBox();
      }
  
      function endGame() {
        document.getElementById("result").textContent = `Has realizado ${clickCount} clics en 10 segundos.`;
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
  
      // Actualizar la puntuación del usuario o agregarla si no está en el ranking
      const userScoreIndex = currentScores.findIndex((score) => score.name === username);
      if (userScoreIndex !== -1) {
        currentScores[userScoreIndex].score = clickCount;
      } else {
        currentScores.push({ name: username, score: clickCount });
      }
  
      // Ordenar en orden descendente por el número de clics
      currentScores.sort((a, b) => b.score - a.score);
  
      // Mostrar el ranking actualizado
      createRanking(currentScores);
    }
  
    function createRanking(scores) {
      rankingList.innerHTML = "";
      for (const score of scores) {
        const li = document.createElement("li");
        li.textContent = `${score.name} ${score.score} clicks`;
        rankingList.appendChild(li);
      }
    }
  });
  