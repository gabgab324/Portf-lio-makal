// Suas thumbnails (imagem, título e subtítulo)
const projetos = [
  {"t": "ChatGPT sem censura", "s": "Guia completo", "img": "imagens/chatgpt-sem-censura.jpg"},
  {"t": "Orochimaru", "s": "Poder infinito", "img": "imagens/orochimaru.jpg"},
  {"t": "Gon", "s": "Hunter × Hunter · Jailbreak", "img": "imagens/gon.jpg"},
  {"t": "Casal Spy × Family", "s": "Modo infinito", "img": "imagens/casal-spy-family.jpg"},
  {"t": "Sasuke", "s": "Sharingan · Susanoo", "img": "imagens/sasuke.jpg"}
];

const track = document.getElementById("track");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const dotsBox = document.getElementById("dots");
const lb = document.getElementById("lb");
let atual = 0;

// Rola o carrossel até centralizar a arte número i
function irPara(i) {
  i = Math.max(0, Math.min(projetos.length - 1, i));
  const c = cards[i];
  track.scrollTo({ left: c.offsetLeft + c.offsetWidth / 2 - track.clientWidth / 2, behavior: "smooth" });
}

// Cria um cartão e uma bolinha para cada thumbnail
const cards = [];
projetos.forEach((p, i) => {
  const card = document.createElement("article");
  card.className = "card";
  const thumb = document.createElement("div");
  thumb.className = "thumb";
  thumb.style.backgroundImage = "url(" + p.img + ")";
  thumb.setAttribute("role", "img");
  thumb.setAttribute("aria-label", p.t);
  const info = document.createElement("div");
  info.className = "info";
  info.innerHTML = "<h3></h3><p></p>";
  info.querySelector("h3").textContent = p.t;
  info.querySelector("p").textContent = p.s;
  card.append(thumb, info);
  // Clique: se estiver desfocada, traz para o foco; se já está em foco, abre em tela cheia
  card.onclick = () => {
    if (i === atual) { lb.querySelector("img").src = p.img; lb.classList.add("on"); }
    else irPara(i);
  };
  track.appendChild(card);
  cards.push(card);

  const dot = document.createElement("button");
  dot.className = "dot";
  dot.setAttribute("aria-label", "Ir para " + p.t);
  dot.onclick = () => irPara(i);
  dotsBox.appendChild(dot);
});

// Calcula a distância de cada arte até o centro e aplica foco/desfoque
function atualizar() {
  const centro = track.scrollLeft + track.clientWidth / 2;
  const passo = cards[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || 28);
  let melhor = 0, menor = Infinity;
  cards.forEach((c, i) => {
    const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - centro);
    c.style.setProperty("--d", Math.min(1, dist / passo).toFixed(3));
    if (dist < menor) { menor = dist; melhor = i; }
  });
  atual = melhor;
  cards.forEach((c, i) => c.classList.toggle("ativo", i === atual));
  dotsBox.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("on", i === atual));
  prev.disabled = atual === 0;
  next.disabled = atual === projetos.length - 1;
}

// Executa no máximo uma vez por quadro (suave)
let esperando = false;
track.addEventListener("scroll", () => {
  if (esperando) return;
  esperando = true;
  requestAnimationFrame(() => { atualizar(); esperando = false; });
}, { passive: true });

prev.onclick = () => irPara(atual - 1);
next.onclick = () => irPara(atual + 1);
track.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") { e.preventDefault(); irPara(atual + 1); }
  if (e.key === "ArrowLeft") { e.preventDefault(); irPara(atual - 1); }
});
window.addEventListener("resize", () => { irPara(atual); atualizar(); });
atualizar();

lb.onclick = () => lb.classList.remove("on");
document.addEventListener("keydown", e => { if (e.key === "Escape") lb.classList.remove("on"); });
