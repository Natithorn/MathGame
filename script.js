const questionElement = document.querySelector('.question');
const optionsElement = document.querySelector('.options');
const timerElement = document.getElementById('time');
const startButton = document.getElementById('start-button');
let timeLeft = 30;
let interval;

function startGame() {
  generateQuestion();
  interval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(interval);
      showGameOverPopup();
    }
  }, 1000);
}

function resetGame() {
  timeLeft = 30;
  timerElement.textContent = timeLeft;
  startButton.disabled = false;
  clearInterval(interval);
  optionsElement.innerHTML = '';
  questionElement.textContent = '';
}

function generateQuestion() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operators = ['+', '-', '*', '/'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  let correctAnswer;
  switch (operator) {
    case '+':
      correctAnswer = num1 + num2;
      break;
    case '-':
      correctAnswer = num1 - num2;
      break;
    case '*':
      correctAnswer = num1 * num2;
      break;
    case '/':
      correctAnswer = parseFloat((num1 / num2).toFixed(2));
      break;
  }
  questionElement.textContent = `${num1} ${operator} ${num2} = ?`;
  const answers = [correctAnswer];
  while (answers.length < 4) {
    const wrongAnswer = Math.floor(Math.random() * 100) - 50;
    if (!answers.includes(wrongAnswer)) {
      answers.push(wrongAnswer);
    }
  }
  answers.sort(() => Math.random() - 0.5);
  optionsElement.innerHTML = '';
  answers.forEach(answer => {
    const button = document.createElement('button');
    button.textContent = answer;
    button.classList.add('option');
    button.addEventListener('click', () => checkAnswer(answer, correctAnswer));
    optionsElement.appendChild(button);
  });
}

function checkAnswer(selected, correct) {
  const buttons = document.querySelectorAll('.option');
  buttons.forEach(button => {
    if (parseFloat(button.textContent) === correct) {
      button.style.backgroundColor = 'green';
    } else if (parseFloat(button.textContent) === selected) {
      button.style.backgroundColor = 'red';
    }
    button.disabled = true;
  });
  setTimeout(() => {
    buttons.forEach(button => {
      button.style.backgroundColor = '';
      button.disabled = false;
    });
    if (selected === correct) {
      timeLeft += 5;
    } else {
      timeLeft -= 5;
    }
    timerElement.textContent = timeLeft;
    generateQuestion();
  }, 1000);
}

function showGameOverPopup() {
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.padding = '20px';
  popup.style.backgroundColor = '#fff';
  popup.style.borderRadius = '10px';
  popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  popup.style.textAlign = 'center';
  popup.innerHTML = `
    <img src="https://img.icons8.com/external-tulpahn-outline-color-tulpahn/64/external-game-over-video-game-tulpahn-outline-color-tulpahn.png" alt="Game Over Icon" style="margin-bottom: 10px;">
    <h2>Game Over</h2>
    <p>You ran out of time!</p>
    <button id="restart-button" style="display: flex; align-items: center; gap: 8px;">
      <img src="https://via.placeholder.com/20" alt="Restart Icon" style="width: 20px; height: 20px;">
      Restart Game
    </button>`;
  document.body.appendChild(popup);
  const restartButton = document.getElementById('restart-button');
  restartButton.addEventListener('click', () => {
    popup.remove();
    resetGame();
  });
}

startButton.addEventListener('click', () => {
  startButton.disabled = true;
  startGame();
});
