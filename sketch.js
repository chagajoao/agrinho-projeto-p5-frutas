// Jogo do projeto agrinho com tema de fazenda
let player;
let frutas = [];
let buracos = [];
let score = 0;
let gravidade = 0.6;
let forcaPulo = -12;
let tempoRestante = 120;
let gameOver = false;
let tempoInicial;

function setup() {
  createCanvas(600, 400);
  player = new Player();

  for (let i = 0; i < 3; i++) {
    frutas.push(new Fruta());
    buracos.push(new Buraco());
  }

  tempoInicial = millis();
}

function draw() {
  background(120, 200, 120);
  
  // cronômetro
  let tempoDecorrido = int((millis() - tempoInicial) / 1000);
  tempoRestante = max(0, 120 - tempoDecorrido);

  // chão
  fill(80, 150, 80);
  rect(0, height - 40, width, 40);

  if (tempoRestante === 0) {
    gameOver = true;
  }

  if (gameOver) {
    fill(0);
    textSize(30);
    textAlign(CENTER, CENTER);
    text("⏰ Tempo esgotado!\n🌽 Pontuação final: " + score, width / 2, height / 2);
    noLoop();
    return;
  }

  // score e tempo
  fill(255);
  textSize(20);
  text("🌽 Pontos: " + score, 100, 30);
  text("⏱ Tempo: " + tempoRestante + "s", 400, 30);

  player.update();
  player.show();

  for (let fruta of frutas) {
    fruta.update();
    fruta.show();

    if (fruta.hits(player)) {
      score++;
      fruta.reset();
    }
  }

  for (let buraco of buracos) {
    buraco.update();
    buraco.show();

    if (buraco.hits(player)) {
      score = max(0, score - 1);
      buraco.reset();
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    player.pular();
  }
}

class Player {
  constructor() {
    this.x = 150;
    this.y = height - 20;
    this.r = 40;
    this.velY = 0;
    this.noChao = true;
  }

  pular() {
    if (this.noChao) {
      this.velY = forcaPulo;
      this.noChao = false;
    }
  }

  update() {
    this.y += this.velY;
    this.velY += gravidade;

    if (this.y > height - 60) {
      this.y = height - 60;
      this.noChao = true;
      this.velY = 0;
    }
  }

  show() {
    fill(255);
    textSize(this.r);
    text("👩‍🌾", this.x, this.y);
  }
}

class Fruta {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width, width + 300);
    this.y = height - 60;
    this.speed = random(3, 6);
    this.tipo = random(["🍎", "🍓", "🍇", "🍊"]);
  }

  update() {
    this.x -= this.speed;
    if (this.x < -20) this.reset();
  }

  show() {
    textSize(30);
    text(this.tipo, this.x, this.y);
  }

  hits(player) {
    return dist(this.x, this.y, player.x, player.y) < 30;
  }
}

class Buraco {
  constructor() {
    this.reset();
    this.contado = false;
  }

  reset() {
    this.x = random(width + 200, width + 600);
    this.y = height - 40;
    this.speed = random(3, 6);
    this.contado = false;
  }

  update() {
    this.x -= this.speed;
    if (this.x < -20) this.reset();

    // Se passou por cima e ainda não contou
    if (!this.contado && this.x < player.x && player.y >= height - 60) {
      score = max(0, score - 1);
      this.contado = true;
    }
  }

  show() {
    fill(50);
    ellipse(this.x, this.y + 10, 40, 20);
  }

  hits(player) {
    return false; // Tira a colisão direta, só perde se passar por cima
  }
}



