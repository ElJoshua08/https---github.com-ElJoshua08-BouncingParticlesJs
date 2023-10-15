const canvas = document.getElementById("canvas1");
const context = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;

const maxParticles = 200;

let particles = [];

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Utils
const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randBool = () => {
  return randInt(0, 1) == true;
};

class Particle {
  constructor(
    x,
    y,
    angle,
    speed,
    radius,
    fillColor,
    strokeColor,
    fill,
    stroke,
    strokeWidth
  ) {
    this.x = x;
    this.y = y;
    this.angle = angle * (Math.PI / 180);
    this.speed = speed;
    this.radius = radius;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.fill = fill;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    this.canBounce = true;
  }

  bounce(collision) {
    if (collision == "horizontal") {
      let angle = this.angle * (180 / Math.PI);
      let enterAngle = 90 - this.angle;
      let exitAngle = ((180 - angle) % 360) - (180 - enterAngle * 2);
      this.angle = exitAngle * (Math.PI / 180);
    } else {
      this.angle = -this.angle;
    }

    this.canBounce = false;

    setTimeout(() => {
      this.canBounce = true;
    }, 100);
  }

  visible() {
    return this.radius > 2 ? true : false;
  }

  isOutsideWindow() {
    if (
      this.x - this.radius > canvas.width ||
      this.x + this.radius < 0 ||
      this.y - this.radius > canvas.height ||
      this.y + this.radius < 0
    ) {
      return true;
    }
    return false;
  }

  isTouchingBorder() {
    if (this.x + this.radius + 2 > canvas.width) {
      return [true, "horizontal", "right"];
    }
    if (this.x - this.radius - 2 < 0) {
      return [true, "horizontal", "left"];
    }
    if (this.y + this.radius + 2 > canvas.height) {
      return [true, "vertical", "bottom"];
    }
    if (this.y - this.radius - 2 < 0) {
      return [true, "vertical", "top"];
    }
    return [false];
  }

  update(deltaTime) {
    this.velX = Math.cos(this.angle) * this.speed * deltaTime;
    this.velY = Math.sin(this.angle) * this.speed * deltaTime;

    this.x += this.velX;
    this.y += this.velY;

    // this.radius -= 0.01;

    let isTouchingBorder = this.isTouchingBorder();

    if (isTouchingBorder[0]) {
      this.bounce(isTouchingBorder[1]);
    }
  }

  draw() {
    context.beginPath();

    context.strokeStyle = this.strokeColor;
    context.fillStyle = this.fillColor;

    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    if (this.fill) {
      context.fill();
    }
    if (this.stroke) {
      context.lineWidth = this.strokeWidth;
      context.stroke();
    }
  }
}

function HandleParticles(deltaTime) {
  for (let i = particles.length; i < maxParticles; i++) {
    particles.push(
      new Particle(
        canvas.width / 2,
        canvas.height / 2,
        randInt(0, 360),
        randInt(1, 2),
        randInt(7, 20),
        `hsl(${randInt(0, 360)}, 100%, 50%)`,
        `hsl(${randInt(0, 360)}, 85%, 65%)`,
        false,
        randBool(),
        randInt(1, 3)
      )
    );
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].update(deltaTime);
    particles[i].draw();

    if (!particles[i].visible() || particles[i].isOutsideWindow()) {
      particles.splice(i, 1);

      i -= 1;
    }
  }
}

function start() {
  requestAnimationFrame(animate);
}

function animate(timestamp) {
  deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
  lastTimestamp = timestamp;

  requestAnimationFrame(animate);
  context.fillStyle = "rgba(0, 0, 0, 0.5)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  HandleParticles(deltaTime);
}

start();
