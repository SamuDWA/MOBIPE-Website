// ===== Background Animado (Hallucination Aesthetic) =====
const initBackground = () => {
  const container = document.getElementById('canvas-container');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });

  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Sparse Particle System (Neural Motes)
  const particleCount = 800;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = THREE.MathUtils.randFloatSpread(2000);
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x1a73e8,
    size: 3,
    transparent: true,
    opacity: 0.4
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  camera.position.z = 500;

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
  });

  function animate() {
    requestAnimationFrame(animate);

    // Subtle particle drift toward mouse
    points.rotation.x += 0.0002;
    points.rotation.y += 0.0002;
    points.position.x += (mouseX - points.position.x) * 0.01;
    points.position.y += (-mouseY - points.position.y) * 0.01;

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
};

const animateBlobs = () => {
  const blobs = document.querySelectorAll('.blob');
  const blobData = [
    { radius: 30, speed: 0.0008, offset: 0 },
    { radius: 40, speed: 0.0006, offset: Math.PI / 2 },
    { radius: 35, speed: 0.0007, offset: Math.PI },
    { radius: 45, speed: 0.0005, offset: Math.PI * 1.5 },
  ];

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 50;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 50;
  });

  function loop() {
    const time = Date.now();
    blobs.forEach((blob, i) => {
      const data = blobData[i];
      const x = Math.cos(time * data.speed + data.offset) * data.radius + mouseX;
      const y = Math.sin(time * data.speed + data.offset) * data.radius + mouseY;

      // Use translate3d for GPU acceleration
      blob.style.transform = `translate3d(${x}vw, ${y}vh, 0) scale(${1 + Math.sin(time * 0.001) * 0.1})`;
    });
    requestAnimationFrame(loop);
  }
  loop();
};

// Initialize all background effects
document.addEventListener('DOMContentLoaded', () => {
  initBackground();
  animateBlobs();
});

// ===== Toast =====
function showToast(message = 'Prompt copiado com sucesso!') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ===== Tema =====
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
  themeToggle.textContent = '☀️';
} else {
  themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  const isDark = body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ===== Abas =====
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ===== Animação dos cards =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('fade-in');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card').forEach(card => observer.observe(card));

// ===== Função genérica de copiar =====
function setupCopyButton(btnId, getText) {
  document.getElementById(btnId).addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(getText());
      showToast();
    } catch (e) {
      alert('Não foi possível copiar.');
    }
  });
}

setupCopyButton('copy-btn', () => document.getElementById('prompt-text').innerText);
setupCopyButton('copy-rapido', () => `Versão Rápida do Método A.C.E.R.T.O.:
1. Peça fontes e nível de certeza
2. Peça para a IA apontar limitações
3. Sempre compare com outra fonte`);
setupCopyButton('copy-prompt-gerado', () => document.getElementById('prompt-gerado').innerText);
setupCopyButton('copy-personalizado', () => document.getElementById('prompt-personalizado').innerText);

// ===== Ferramenta =====
const analisarBtn = document.getElementById('analisar-btn');
const limparBtn = document.getElementById('limpar-btn');
const inputTexto = document.getElementById('input-texto');
const resultado = document.getElementById('resultado');

analisarBtn.addEventListener('click', () => {
  const texto = inputTexto.value.trim();
  if (!texto) return alert('Cole um texto para analisar.');

  const problemas = [];
  let pontuacao = 0;

  if (texto.length > 800) { problemas.push('O texto é longo. Respostas extensas têm maior chance de imprecisões.'); pontuacao += 1; }
  if (!/(fonte|referência|segundo|de acordo com|baseado em)/i.test(texto)) { problemas.push('Não foram encontradas menções claras a fontes.'); pontuacao += 2; }
  if (/(sempre|nunca|todos|ninguém|com certeza|definitivamente|absolutamente)/i.test(texto)) { problemas.push('Linguagem excessivamente absoluta ou confiante.'); pontuacao += 1; }
  if (/(em \d{4}|no ano de|dia \d+)/i.test(texto)) { problemas.push('Dados específicos (datas/anos) encontrados. Recomenda-se verificar.'); pontuacao += 1; }
  if (problemas.length === 0) problemas.push('Nenhum ponto crítico óbvio detectado. Ainda assim, faça verificação manual.');

  let nivel = 'Baixo', cor = 'var(--success)', descricao = 'Poucos indícios de risco. Recomenda-se verificar as informações principais.';
  if (pontuacao >= 4) { nivel = 'Alto'; cor = 'var(--danger)'; descricao = 'Vários indícios de possível alucinação. Verifique com atenção.'; }
  else if (pontuacao >= 2) { nivel = 'Médio'; cor = 'var(--warning)'; descricao = 'Existem pontos que merecem atenção.'; }

  document.getElementById('score-valor').textContent = nivel;
  document.getElementById('score-valor').style.color = cor;
  document.getElementById('score-descricao').textContent = descricao;

  const lista = document.getElementById('lista-problemas');
  lista.innerHTML = '';
  problemas.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p;
    lista.appendChild(li);
  });

  document.getElementById('prompt-gerado').textContent = `Analise o texto a seguir aplicando o Método A.C.E.R.T.O.:
1. Aponte possíveis informações incorretas ou inventadas.
2. Separe fato de opinião.
3. Indique o nível de confiança de 0 a 10.
4. Reescreva de forma mais cautelosa e segura.

Texto:
"""
${texto.substring(0, 1500)}${texto.length > 1500 ? '...' : ''}
"""`;

  resultado.classList.remove('escondido');
  resultado.classList.add('fade-in');
  resultado.scrollIntoView({ behavior: 'smooth' });
});

limparBtn.addEventListener('click', () => {
  inputTexto.value = '';
  resultado.classList.add('escondido');
});

// ===== Gerador de Prompt (com prévia ao vivo) =====
const contextoInput = document.getElementById('contexto');
const perguntaInput = document.getElementById('pergunta');
const nivelSelect = document.getElementById('nivel');
const tomSelect = document.getElementById('tom');
const previewPrompt = document.getElementById('preview-prompt');

function gerarTextoPrompt() {
  const contexto = contextoInput.value.trim();
  const pergunta = perguntaInput.value.trim();
  const nivel = nivelSelect.value;
  const tom = tomSelect.value;

  let detalhe = 'de forma clara e objetiva';
  if (nivel === 'medio') detalhe = 'com um bom nível de detalhe';
  if (nivel === 'detalhado') detalhe = 'de forma bem detalhada e completa';

  let tomTexto = 'com linguagem simples e acessível';
  if (tom === 'didatico') tomTexto = 'de forma didática e fácil de entender';
  if (tom === 'formal') tomTexto = 'com linguagem formal e profissional';

  let prompt = `Responda a pergunta a seguir ${detalhe} e ${tomTexto}, seguindo rigorosamente estas regras do Método A.C.E.R.T.O.:
1. Apresente as informações de forma clara e contextualizada.
2. Cite fontes ou referências sempre que possível.
3. Informe seu nível de certeza de 0 a 10.
4. Separe o que é fato e o que é opinião.
5. Aponte possíveis limitações da resposta.
6. Se não tiver certeza sobre algo, diga claramente.`;

  if (contexto) prompt += `\n\nContexto: ${contexto}`;
  if (pergunta) prompt += `\n\nPergunta: ${pergunta}`;
  else prompt += `\n\nPergunta: [escreva aqui sua pergunta]`;

  return prompt;
}

function atualizarPreview() {
  previewPrompt.textContent = gerarTextoPrompt();
}

// Atualiza a prévia em tempo real
[contextoInput, perguntaInput, nivelSelect, tomSelect].forEach(el => {
  el.addEventListener('input', atualizarPreview);
  el.addEventListener('change', atualizarPreview);
});

// Gerar (mostra o resultado final)
document.getElementById('gerar-prompt-btn').addEventListener('click', () => {
  const pergunta = perguntaInput.value.trim();
  if (!pergunta) return alert('Digite sua pergunta principal.');

  const prompt = gerarTextoPrompt();
  document.getElementById('prompt-personalizado').textContent = prompt;

  const res = document.getElementById('resultado-gerador');
  res.classList.remove('escondido');
  res.classList.add('fade-in');
  res.scrollIntoView({ behavior: 'smooth' });
});

// Limpar campos do gerador
document.getElementById('limpar-gerador').addEventListener('click', () => {
  contextoInput.value = '';
  perguntaInput.value = '';
  nivelSelect.value = 'medio';
  tomSelect.value = 'didatico';
  atualizarPreview();
  document.getElementById('resultado-gerador').classList.add('escondido');
});

// Inicializa a prévia
atualizarPreview();

// ===== Voltar ao topo =====
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) backToTop.classList.add('visible');
  else backToTop.classList.remove('visible');
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));