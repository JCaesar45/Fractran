// script.js - HUMAN CRAFTED 2026
const canvas = document.getElementById("viz-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let sequence = [];
let currentN = 2;
let isRunning = false;
let timeoutId = null;
let stepCount = 0;
let lastTime = Date.now();

let fractions = [];

class Particle {
  constructor(x, y, vx, vy, color, size) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.life = 80;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.08;
    this.life--;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.life / 80;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.restore();
  }
}

function parseProgram(str) {
  return str
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.includes("/"))
    .map((s) => {
      const [n, d] = s.split("/").map(Number);
      return [n, d];
    })
    .filter((f) => f[0] && f[1]);
}

function applyFractran(n, fracs) {
  for (let [num, den] of fracs) {
    if (n % den === 0) {
      return (n / den) * num;
    }
  }
  return null;
}

function createExplosion(x, y, count, hue) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const vel = 2 + Math.random() * 7;
    particles.push(
      new Particle(
        x,
        y,
        Math.cos(angle) * vel,
        Math.sin(angle) * vel - 3,
        `hsl(${hue}, 100%, 70%)`,
        3 + Math.random() * 5
      )
    );
  }
}

function drawCanvas() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid
  ctx.strokeStyle = "rgba(0, 255, 157, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Big number
  ctx.save();
  ctx.font = "900 92px VT323";
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#00ff9d";
  ctx.shadowBlur = 60;
  ctx.fillText(
    currentN.toString(),
    canvas.width / 2 + 4,
    canvas.height / 2 + 28
  );

  ctx.fillStyle = "#00ff9d";
  ctx.shadowColor = "#ff00ff";
  ctx.shadowBlur = 40;
  ctx.fillText(currentN.toString(), canvas.width / 2, canvas.height / 2 + 24);
  ctx.restore();

  // Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].life <= 0) particles.splice(i, 1);
  }
}

function updateSequenceDisplay() {
  const list = document.getElementById("sequence-list");
  list.innerHTML = "";

  sequence.forEach((num, i) => {
    const div = document.createElement("div");
    div.textContent = `${String(i + 1).padStart(2, "0")} → ${num}`;

    // Power of 2 detection
    let isPower = false;
    let temp = num;
    while (temp > 1 && temp % 2 === 0) temp /= 2;
    if (temp === 1 && num > 1) {
      isPower = true;
      div.classList.add("power2");
    }

    list.appendChild(div);
  });

  document.getElementById("sequence-length").textContent = String(
    sequence.length
  ).padStart(2, "0");
}

function runStep() {
  if (!fractions.length) return;

  const next = applyFractran(currentN, fractions);

  if (next === null || next === currentN) {
    // HALT
    isRunning = false;
    document.getElementById("run-btn").textContent = "▶ RUN SIMULATION";
    createExplosion(canvas.width / 2, canvas.height / 2, 120, 0);
    return;
  }

  // Animate fraction
  const usedFrac = fractions.find((f) => currentN % f[1] === 0);
  if (usedFrac) {
    document.getElementById("num-val").textContent = usedFrac[0];
    document.getElementById("den-val").textContent = usedFrac[1];
  }

  // Explosion
  createExplosion(
    canvas.width / 2 + (Math.random() * 80 - 40),
    canvas.height / 2 - 60,
    38,
    280
  );

  currentN = Math.floor(next);
  sequence.push(currentN);
  stepCount++;

  document.getElementById("current-number").textContent = currentN;
  document.getElementById("step-num").textContent = String(stepCount).padStart(
    3,
    "0"
  );

  // Prime power flash
  let temp = currentN;
  while (temp % 2 === 0) temp /= 2;
  if (temp === 1 && currentN > 4) {
    const flash = document.getElementById("prime-indicator");
    flash.style.display = "block";
    setTimeout(() => (flash.style.display = "none"), 900);
  }

  updateSequenceDisplay();
  drawCanvas();

  // Runtime counter
  const runtime = ((Date.now() - lastTime) / 1000).toFixed(2);
  document.getElementById("runtime").textContent = runtime + "s";
}

function startSimulation() {
  if (isRunning) return;
  isRunning = true;
  document.getElementById("run-btn").textContent = "❚❚ PAUSE";

  const speed = parseInt(document.getElementById("speed-slider").value);

  const loop = () => {
    if (!isRunning) return;
    runStep();
    timeoutId = setTimeout(loop, speed);
  };
  loop();
}

function pauseSimulation() {
  isRunning = false;
  clearTimeout(timeoutId);
  document.getElementById("run-btn").textContent = "▶ RUN SIMULATION";
}

function resetAll() {
  pauseSimulation();
  currentN = parseInt(document.getElementById("start-n").value) || 2;
  sequence = [currentN];
  stepCount = 0;
  particles = [];
  document.getElementById("current-number").textContent = currentN;
  document.getElementById("step-num").textContent = "000";
  document.getElementById("runtime").textContent = "0.00s";
  updateSequenceDisplay();
  drawCanvas();
}

// Event listeners
document.getElementById("run-btn").addEventListener("click", () => {
  if (isRunning) pauseSimulation();
  else startSimulation();
});

document.getElementById("pause-btn").addEventListener("click", pauseSimulation);
document.getElementById("step-btn").addEventListener("click", () => {
  if (!isRunning) runStep();
});

document.getElementById("reset-btn").addEventListener("click", resetAll);

document.getElementById("speed-slider").addEventListener("input", (e) => {
  document.getElementById("speed-val").textContent = e.target.value;
});

document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".preset-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const prog = btn.getAttribute("data-program");
    document.getElementById("program-input").value = prog;

    fractions = parseProgram(prog);
    resetAll();
  });
});

document.getElementById("program-input").addEventListener("input", () => {
  fractions = parseProgram(document.getElementById("program-input").value);
});

document.getElementById("export-btn").addEventListener("click", () => {
  if (!sequence.length) return;
  const csv = sequence.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `fractran-sequence-${Date.now()}.txt`;
  a.click();
});

document.getElementById("info-btn").addEventListener("click", () => {
  document.getElementById("modal").style.display = "flex";
});

document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});

document.getElementById("presets-btn").addEventListener("click", () => {
  alert(
    "PRESETS LOADED IN SIDEBAR\n\nTry Conway's 14-fraction prime generator — it will blow your mind."
  );
});

// Keyboard
document.addEventListener("keydown", (e) => {
  if (e.key === " " && document.activeElement.tagName !== "TEXTAREA") {
    e.preventDefault();
    if (isRunning) pauseSimulation();
    else runStep();
  }
  if (e.key === "r" || e.key === "R") resetAll();
});

// Init
window.onload = () => {
  fractions = parseProgram(document.getElementById("program-input").value);
  sequence = [2];
  document.getElementById("current-number").textContent = "2";

  // Initial draw
  drawCanvas();

  // Random floating particles
  setInterval(() => {
    if (Math.random() > 0.7) {
      createExplosion(
        Math.random() * canvas.width,
        Math.random() * canvas.height * 0.6,
        6,
        160
      );
    }
  }, 420);

  // Animation loop
  function animate() {
    drawCanvas();
    requestAnimationFrame(animate);
  }
  animate();

  // Demo start
  setTimeout(() => {
    document.getElementById("run-btn").click();
  }, 680);
};
