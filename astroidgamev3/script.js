const canvas = document.querySelector("#canvas");
const scoreEl = document.querySelector(".score");
const body = document.querySelector("body");
const ctx = canvas.getContext("2d");
const stars = [];
const asteroids = [];
const flameColors = ["red", "orange", "yellow"];
let time = 0;
let speed = 1000;
let score = 0;
let lose = false;
const particles = [];
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

class ExplosionParticle {
  constructor() {
    this.color = flameColors[Math.floor(Math.random() * 3)];
    this.size = Math.random() * 120;
    this.x = mouse.x + Math.random() * 200 - 100;
    this.y = mouse.y + Math.random() * 20 - 10;
    this.speed = Math.random() * 3000;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  update() {
    setTimeout(() => {}, this.speed);

    if (this.x < mouse.x) {
      this.x += -1 * Math.random() * 50;
    }

    if (this.x > mouse.x) {
      this.x += Math.random() * 50;
    }

    if (this.y < mouse.y) {
      this.y += -1 * (Math.random() * 50);
    }

    if (this.y > mouse.y) {
      this.y += Math.random() * 50;
    }
  }
}

class Asteroid {
  constructor() {
    this.size = Math.random() * 50 + 10;
    this.x = Math.random() * canvas.width;
    this.y = 1;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "rgb(92, 92, 92)";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.y += 10;

    if (this.y >= canvas.height) {
      asteroids.splice(this, 1);
      score++;
      scoreEl.textContent = score;
    }
  }

  checkIfLose() {
    if (
      this.x - this.size < mouse.x &&
      this.x + this.size > mouse.x &&
      this.y - this.size > mouse.y &&
      this.y - this.size > mouse.y
    ) {
      console.log("lose");
      lose = true;
      clearInterval(handleTime);
      clearInterval(updateAsteroids);
      clearInterval(renderAsteroids);
      for (let i = 0; i < 100; i++) {
        const particle = new ExplosionParticle();
        particles.push(particle);
      }

      setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle) => {
          particle.draw();
          particle.update();
        });
      }, 10);

      const html = `
      <div class="lose left">
      <h1>You Lose!</h1>
      <p>Score: ${score}</p>
      <button class="reset">Reset</button>
      </div>`;
      body.insertAdjacentHTML("beforeend", html);
      document.querySelector(".reset").addEventListener("click", () => {
        window.location.reload();
      });
      setTimeout(() => {
        document.querySelector(".lose").classList.remove("left");
      }, 750);
    }
  }
}

class Star {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 6;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

const generateStars = function () {
  for (let i = 0; i < 100; i++) {
    const star = new Star();
    stars.push(star);
  }
};

const generateShip = function (x, y) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(168, 64, 50)";
  ctx.lineTo(x, y - 50);
  ctx.lineTo(x + 17.5, y + 32.5);
  ctx.lineTo(x - 17.5, y + 32.5);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.srokeStyle = "rgb(168, 64, 50)";
  ctx.fillStyle = "rgb(168, 64, 50)";
  ctx.lineTo(x, y - 25);
  ctx.lineTo(x + 32.5, y + 32.5);
  ctx.lineTo(x - 32.5, y + 32.5);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "rgb(207, 202, 202)";
  ctx.rect(x - 12.5, y + 32.5, 25, 5);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "rgb(207, 202, 202)";
  ctx.ellipse(x, y, 15, 30, Math.PI, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "rgb(0, 168, 224)";
  ctx.arc(x, y, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
};

const generateFlames = function () {
  for (let i = 0; i < 3; i++) {
    const randColor = Math.floor(Math.random() * 3);
    const size = Math.random() * 10;
    const x = Math.random() * 25 - 12.5;
    const y = 45 + Math.random() * 10;

    ctx.beginPath();
    ctx.fillStyle = flameColors[randColor];
    ctx.arc(mouse.x + x, mouse.y + y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
};

const generateAsteroid = function () {
  const asteroid = new Asteroid();
  asteroids.push(asteroid);
  asteroid.draw();
  asteroid.checkIfLose();
};

const updateAsteroids = setInterval(() => {
  asteroids.forEach((asteroid) => {
    asteroid.update();
    asteroid.checkIfLose();
  });
  const event = new Event("mousemove");
  canvas.dispatchEvent(event);
}, 10);

const displayAsteroids = () => {
  if (lose) return;
  generateAsteroid();
  asteroids.forEach((asteroid) => {
    asteroid.update();
    asteroid.draw();
  });
};

let renderAsteroids = setInterval(displayAsteroids, speed);

const handleTime = setInterval(() => {
  let oldSpeed = speed;
  if (time >= 10) {
    speed = 800;
  }

  if (time >= 20) {
    speed = 600;
  }

  if (time >= 30) {
    speed = 500;
  }
  if (time >= 45) {
    speed = 400;
  }

  time++;

  if (oldSpeed != speed) {
    renderAsteroids = setInterval(displayAsteroids, speed);
  }
}, 1000);

canvas.addEventListener("mousemove", (e) => {
  if (lose) return;

  if (e.x && e.y) {
    mouse.x = e.x;
    mouse.y = e.y;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach((star) => star.draw());
  generateShip(mouse.x, mouse.y);
  generateFlames();
  asteroids.forEach((asteroid) => {
    asteroid.draw();
  });
});

generateStars();
stars.forEach((star) => star.draw());
generateShip(canvas.width / 2, canvas.height / 2);
