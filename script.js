let raceTime = 0;
let raceInterval;
let obstacleInterval;
let obstacles = [];
let gameOver = false;

const playerCar = document.getElementById('playerCar');
const offsetSlider = document.getElementById('offsetSlider');
const offsetValueDisplay = document.getElementById('offsetValue');

let offsetX = parseInt(offsetSlider.value);

const trackWidth = 600;
const trackHeight = 500;
const lanes = 3;
const laneWidth = trackWidth / lanes;
const speed = 2;

let currentSpeed = speed;
let currentObstacleInterval = 8000;
let score = 0;

let carPosition = { x: 1 }; // faixa do meio
let lastObstacleLane = -1;  // <- ✅ ADICIONADO: controla a última faixa usada

// Atualiza posição do carro
function updateCarPosition() {
  playerCar.style.left = (offsetX + carPosition.x * laneWidth) + 'px';
  playerCar.style.bottom = '0px';
}

// Move o carro automaticamente durante o jogo
function moveCar() {
  if (gameOver) return;

  raceTime++;
  document.getElementById('raceTime').textContent = `Tempo de Corrida: ${raceTime}s`;

  score++;
  document.getElementById('score').textContent = `Pontuação: ${score}`;

  updateCarPosition();
}

// Teclas para mover o carro
function movePlayerCar(e) {
  if (gameOver) return;

  if (e.key === 'ArrowLeft' && carPosition.x > 0) {
    carPosition.x--;
  } else if (e.key === 'ArrowRight' && carPosition.x < lanes - 1) {
    carPosition.x++;
  }

  updateCarPosition();
}

// Geração de obstáculos com deslocamento e faixa aleatória
function generateObstacle() {
  if (gameOver) return;

  // Escolhe uma faixa diferente da anterior
  const availableLanes = [0, 1, 2].filter(l => l !== lastObstacleLane);
  const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
  lastObstacleLane = lane;

  const images = ['obstacle1.png', 'obstacle2.png'];
  const selectedImage = images[Math.floor(Math.random() * images.length)];

  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.left = (offsetX + lane * laneWidth) + 'px';
  obstacle.style.bottom = trackHeight + 'px';
  obstacle.style.backgroundImage = `url('${selectedImage}')`;

  document.querySelector('.race-track').appendChild(obstacle);
  obstacles.push({ element: obstacle, lane: lane });
}

// Movimento dos obstáculos
function moveObstacles() {
  if (gameOver) return;

  obstacles.forEach(obstacle => {
    let currentBottom = parseInt(obstacle.element.style.bottom.replace('px', ''));
    obstacle.element.style.bottom = (currentBottom - currentSpeed) + 'px';

    if (currentBottom <= -100) {
      obstacle.element.remove();
      obstacles = obstacles.filter(o => o !== obstacle);
    }
  });
}

// Checa colisão com obstáculos
function checkCollision() {
  obstacles.forEach(obstacle => {
    const bottom = parseInt(obstacle.element.style.bottom.replace('px', ''));
    
    if (bottom <= 100 && obstacle.lane === carPosition.x) {
      gameOver = true;
      clearInterval(raceInterval);
      clearInterval(obstacleInterval);
      clearInterval(speedIncreaseInterval);
      clearInterval(obstacleInterval);   
      document.getElementById('gameOver').classList.remove('hidden');
      document.getElementById('gameOver').textContent = `Game Over - Pontuação Final: ${score}`;
    }
  });
}

let speedIncreaseInterval;

// Inicia a corrida
function startRace() {
    score = 0;
    document.getElementById('score').textContent = `Pontuação: ${score}`;
    raceTime = 0;
    carPosition = { x: 1 };
    gameOver = false;
    lastObstacleLane = -1;
    currentSpeed = speed;
  
    // Remove obstáculos antigos
    obstacles.forEach(ob => ob.element.remove());
    obstacles = [];
  
    document.getElementById('gameOver').classList.add('hidden');
    document.getElementById('raceTime').textContent = `Tempo de Corrida: 0s`;
  
    updateCarPosition();
  
    raceInterval = setInterval(() => {
      if (!gameOver) {
        moveCar();
        moveObstacles();
        checkCollision();
      }
    }, 100);
  
    obstacleInterval = setInterval(generateObstacle, currentObstacleInterval);
  
    // ⏩ Aumenta a velocidade a cada 10 segundos
    speedIncreaseInterval = setInterval(() => {
        currentSpeed += 1.5;
      
        // Reduz tempo entre obstáculos proporcional à velocidade
        if (currentObstacleInterval > 1500) { // limite mínimo
          currentObstacleInterval -= 600;
      
          // Reinicia o intervalo de obstáculos com novo tempo
          clearInterval(obstacleInterval);
          obstacleInterval = setInterval(generateObstacle, currentObstacleInterval);
        }
      }, 8000);
  }

// Slider de offset
offsetSlider.addEventListener('input', () => {
  offsetX = parseInt(offsetSlider.value);
  offsetValueDisplay.textContent = `${offsetX}px`;

  // Atualiza a posição do carro instantaneamente
  updateCarPosition();
});

// Inicia jogo com Enter
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !gameOver) {
    startRace();
  }
});

document.addEventListener('keydown', movePlayerCar);

document.getElementById('startButton').addEventListener('click', startRace);

function setOffsetX(value) {
    offsetX = parseInt(value);
    offsetSlider.value = offsetX;
    offsetValueDisplay.textContent = `${offsetX}px`;
  
    updateCarPosition(); // Atualiza posição do carro na tela
  }

  window.setOffsetX = setOffsetX;

  setOffsetX(60);

