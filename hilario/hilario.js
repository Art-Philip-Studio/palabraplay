/* ═══════════════════════════════════════════════════════════
   HILARIO — Sopa de Letras Temática (tipo NYT Strands)
   Motor completo: cuadrícula 6×8, pangrama, pistas, drag
═══════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────
   BANCO DE PUZZLES
   Cada puzzle tiene:
   - id, theme (tema mostrado), difficulty
   - pangram: palabra especial que cruza el tablero (toca 2 lados opuestos)
   - words: palabras temáticas a encontrar
   - grid: cuadrícula 6 columnas × 8 filas (48 celdas)
   - paths: {PALABRA: [[r,c], [r,c], ...]} rutas de cada palabra
   NOTA: Todas las letras del grid pertenecen a alguna palabra (tema o relleno válido)
────────────────────────────────────────── */
const PUZZLES = [

  /* ══ PUZZLE 1: ANIMALES ══ */
  {
    id: 1,
    theme: "Animales del mundo",
    difficulty: "facil",
    pangram: "MARIPOSA",  // cruza de arriba a abajo
    words: ["GATO", "PERRO", "LOBO", "ZORRO", "CIERVO"],
    grid: [
      ['M','A','R','I','P','O'],
      ['G','A','T','O','S','A'],
      ['P','E','R','R','O','L'],
      ['L','O','B','O','Z','O'],
      ['Z','O','R','R','O','B'],
      ['C','I','E','R','V','O'],
      ['A','N','I','M','A','L'],
      ['S','E','L','V','A','S'],
    ],
    paths: {
      "MARIPOSA": [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
      "GATO":     [[1,0],[1,1],[1,2],[1,3]],
      "PERRO":    [[2,0],[2,1],[2,2],[2,3],[2,4]],
      "LOBO":     [[3,0],[3,1],[3,2],[3,3]],
      "ZORRO":    [[4,0],[4,1],[4,2],[4,3],[4,4]],
      "CIERVO":   [[5,0],[5,1],[5,2],[5,3],[5,4],[5,5]],
    }
  },

  /* ══ PUZZLE 2: FRUTAS ══ */
  {
    id: 2,
    theme: "Frutas tropicales",
    difficulty: "facil",
    pangram: "MARACUYA",
    words: ["MANGO", "PAPAYA", "GUAVA", "COCO", "PIÑA"],
    grid: [
      ['M','A','R','A','C','U'],
      ['M','A','N','G','O','Y'],
      ['P','A','P','A','Y','A'],
      ['G','U','A','V','A','F'],
      ['C','O','C','O','P','R'],
      ['P','I','Ñ','A','U','U'],
      ['T','R','O','P','I','T'],
      ['A','S','F','R','U','A'],
    ],
    paths: {
      "MARACUYA": [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5]],
      "MANGO":    [[1,0],[1,1],[1,2],[1,3],[1,4]],
      "PAPAYA":   [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]],
      "GUAVA":    [[3,0],[3,1],[3,2],[3,3],[3,4]],
      "COCO":     [[4,0],[4,1],[4,2],[4,3]],
      "PIÑA":     [[5,0],[5,1],[5,2],[5,3]],
    }
  },

  /* ══ PUZZLE 3: OCÉANO ══ */
  {
    id: 3,
    theme: "Vida marina",
    difficulty: "normal",
    pangram: "TIBURONES",
    words: ["DELFIN", "BALLENA", "PULPO", "CORAL", "ALGA"],
    grid: [
      ['T','I','B','U','R','O'],
      ['D','E','L','F','I','N'],
      ['B','A','L','L','E','N'],
      ['A','P','U','L','P','O'],
      ['C','O','R','A','L','E'],
      ['A','L','G','A','S','S'],
      ['M','A','R','I','N','A'],
      ['O','C','E','A','N','O'],
    ],
    paths: {
      "TIBURONES": [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5],[3,5]],
      "DELFIN":    [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5]],
      "BALLENA":   [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[3,0]],
      "PULPO":     [[3,1],[3,2],[3,3],[3,4],[3,5]],
      "CORAL":     [[4,0],[4,1],[4,2],[4,3],[4,4]],
      "ALGA":      [[5,0],[5,1],[5,2],[5,3]],
    }
  },

  /* ══ PUZZLE 4: ESPACIO ══ */
  {
    id: 4,
    theme: "El universo",
    difficulty: "normal",
    pangram: "GALAXIAS",
    words: ["LUNA", "MARTE", "COMETA", "NEBULA", "SATURN"],
    grid: [
      ['G','A','L','A','X','I'],
      ['L','U','N','A','M','A'],
      ['M','A','R','T','E','S'],
      ['C','O','M','E','T','A'],
      ['N','E','B','U','L','A'],
      ['S','A','T','U','R','N'],
      ['A','S','T','R','O','S'],
      ['P','L','A','N','E','T'],
    ],
    paths: {
      "GALAXIAS": [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5]],
      "LUNA":     [[1,0],[1,1],[1,2],[1,3]],
      "MARTE":    [[2,0],[2,1],[2,2],[2,3],[2,4]],
      "COMETA":   [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5]],
      "NEBULA":   [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]],
      "SATURN":   [[5,0],[5,1],[5,2],[5,3],[5,4],[5,5]],
    }
  },

  /* ══ PUZZLE 5: DEPORTES ══ */
  {
    id: 5,
    theme: "Deportes olímpicos",
    difficulty: "normal",
    pangram: "ATLETISMO",
    words: ["NATACION", "BOXEO", "TENIS", "CICLISMO", "VELA"],
    grid: [
      ['A','T','L','E','T','I'],
      ['N','A','T','A','C','I'],
      ['B','O','X','E','O','S'],
      ['T','E','N','I','S','M'],
      ['C','I','C','L','I','O'],
      ['V','E','L','A','S','O'],
      ['D','E','P','O','R','T'],
      ['E','S','O','L','I','M'],
    ],
    paths: {
      "ATLETISMO": [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5],[3,5]],
      "NATACION":  [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[2,5],[3,5]],
      "BOXEO":     [[2,0],[2,1],[2,2],[2,3],[2,4]],
      "TENIS":     [[3,0],[3,1],[3,2],[3,3],[3,4]],
      "CICLISMO":  [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[3,5],[2,5]],
      "VELA":      [[5,0],[5,1],[5,2],[5,3]],
    }
  },

  /* ══ PUZZLE 6: COLORES ══ */
  {
    id: 6,
    theme: "El arcoíris",
    difficulty: "facil",
    pangram: "VIOLETA",
    words: ["ROJO", "NARANJA", "AMARILLO", "VERDE", "AZUL"],
    grid: [
      ['V','I','O','L','E','T'],
      ['R','O','J','O','N','A'],
      ['N','A','R','A','N','J'],
      ['A','M','A','R','I','L'],
      ['L','O','V','E','R','D'],
      ['E','A','Z','U','L','A'],
      ['C','O','L','O','R','S'],
      ['A','R','C','O','I','S'],
    ],
    paths: {
      "VIOLETA":  [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5]],
      "ROJO":     [[1,0],[1,1],[1,2],[1,3]],
      "NARANJA":  [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[3,5]],
      "AMARILLO": [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[4,5],[5,5]],
      "VERDE":    [[4,1],[4,2],[4,3],[4,4],[3,4]],
      "AZUL":     [[5,1],[5,2],[5,3],[5,4]],
    }
  },

  /* ══ PUZZLE 7: COCINA ══ */
  {
    id: 7,
    theme: "Especias de cocina",
    difficulty: "dificil",
    pangram: "CANELAYAJENGIBRE",
    words: ["PIMIENTA", "COMINO", "OREGANO", "TOMILLO", "LAUREL"],
    grid: [
      ['C','A','N','E','L','A'],
      ['P','I','M','I','E','N'],
      ['C','O','M','I','N','O'],
      ['O','R','E','G','A','N'],
      ['T','O','M','I','L','L'],
      ['L','A','U','R','E','L'],
      ['Y','A','J','E','N','G'],
      ['I','B','R','E','S','A'],
    ],
    paths: {
      "CANELAYAJENGIBRE": [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[6,4],[6,3],[6,2],[7,2],[7,1],[7,0]],
      "PIMIENTA": [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[0,5],[0,4]],
      "COMINO":   [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]],
      "OREGANO":  [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5]],
      "TOMILLO":  [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[3,5]],
      "LAUREL":   [[5,0],[5,1],[5,2],[5,3],[5,4],[5,5]],
    }
  },

  /* ══ PUZZLE 8: MÚSICA ══ */
  {
    id: 8,
    theme: "Instrumentos musicales",
    difficulty: "dificil",
    pangram: "CONTRABAJO",
    words: ["VIOLIN", "FLAUTA", "PIANO", "GUITARRA", "OBOE"],
    grid: [
      ['C','O','N','T','R','A'],
      ['V','I','O','L','I','N'],
      ['F','L','A','U','T','A'],
      ['P','I','A','N','O','B'],
      ['G','U','I','T','A','A'],
      ['R','R','A','O','B','J'],
      ['O','E','S','O','N','O'],
      ['M','U','S','I','C','A'],
    ],
    paths: {
      "CONTRABAJO": [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5],[3,5],[4,5]],
      "VIOLIN":   [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5]],
      "FLAUTA":   [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]],
      "PIANO":    [[3,0],[3,1],[3,2],[3,3],[3,4]],
      "GUITARRA": [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[5,5],[5,4]],
      "OBOE":     [[5,1],[5,2],[5,3],[6,3]],
    }
  },
];

/* ──────────────────────────────────────────
   ESTADO DEL JUEGO
────────────────────────────────────────── */
let G = {
  puzzle:         null,   // puzzle activo
  foundWords:     [],     // palabras tema encontradas
  foundPangram:   false,
  selecting:      [],     // celdas [[r,c]] seleccionadas ahora
  isDragging:     false,
  completedIds:   JSON.parse(localStorage.getItem('hilario_done') || '[]'),
  bonusCount:     0,      // palabras no-tema encontradas (→ pistas)
  hintsAvail:     0,      // pistas acumuladas disponibles
  hintsUsed:      0,
  bonusWords:     [],     // palabras extra encontradas
  startTime:      0,
  timerInterval:  null,
  selectedPuzzleIdx: 0,
};

/* ──────────────────────────────────────────
   HELPERS
────────────────────────────────────────── */
const $   = id => document.getElementById(id);
const clr = el => { el.className = el.className.replace(/(hidden|success|gold|error|info)/g,' ').trim(); };

let msgTimer;
function showMsg(text, type='info', ms=2500) {
  const el = $('status-msg');
  clr(el); el.textContent = text;
  el.className = `status-msg ${type}`;
  clearTimeout(msgTimer);
  if (ms > 0) msgTimer = setTimeout(() => el.className = 'status-msg hidden', ms);
}

function saveCompleted(id) {
  if (!G.completedIds.includes(id)) G.completedIds.push(id);
  try { localStorage.setItem('hilario_done', JSON.stringify(G.completedIds)); } catch(e) {}
}

function elapsed() {
  const s = Math.floor((Date.now() - G.startTime) / 1000);
  return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
}

/* ──────────────────────────────────────────
   PANTALLAS
────────────────────────────────────────── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

/* ──────────────────────────────────────────
   MENÚ PRINCIPAL — lista de puzzles
────────────────────────────────────────── */
function buildPuzzleList() {
  const list = $('puzzle-list');
  list.innerHTML = '';
  PUZZLES.forEach((p, i) => {
    const done = G.completedIds.includes(p.id);
    const card = document.createElement('div');
    card.className = 'puzzle-card' + (done ? ' completed' : '') + (i === G.selectedPuzzleIdx ? ' selected' : '');
    card.innerHTML = `
      <div class="puzzle-info">
        <span class="puzzle-num">Puzzle #${p.id}</span>
        <span class="puzzle-theme">${p.theme}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="puzzle-tag tag-${p.difficulty}">${p.difficulty}</span>
        ${done ? '<span class="puzzle-done">✓</span>' : ''}
      </div>`;
    card.addEventListener('click', () => {
      G.selectedPuzzleIdx = i;
      buildPuzzleList();
    });
    list.appendChild(card);
  });
}

/* ──────────────────────────────────────────
   INICIAR JUEGO
────────────────────────────────────────── */
function startGame() {
  const p = PUZZLES[G.selectedPuzzleIdx];
  G.puzzle       = p;
  G.foundWords   = [];
  G.foundPangram = false;
  G.selecting    = [];
  G.isDragging   = false;
  G.bonusCount   = 0;
  G.hintsAvail   = 0;
  G.hintsUsed    = 0;
  G.bonusWords   = [];
  G.startTime    = Date.now();
  clearInterval(G.timerInterval);

  $('theme-display').textContent = p.theme;
  $('words-total-count').textContent = p.words.length + 1; // +pangrama
  $('words-found-count').textContent = 0;
  $('hint-count').textContent = 0;
  $('status-msg').className = 'status-msg hidden';

  buildWordChips();
  buildGrid();
  buildBonusPips();

  showScreen('screen-game');
}

/* ── chips de palabras a encontrar ── */
function buildWordChips() {
  const container = $('word-chips');
  container.innerHTML = '';
  // Pangrama chip
  const pg = document.createElement('span');
  pg.className = 'word-chip';
  pg.id = 'chip-pangram';
  pg.textContent = '★ PANGRAMA';
  container.appendChild(pg);
  // Tema chips
  G.puzzle.words.forEach(w => {
    const chip = document.createElement('span');
    chip.className = 'word-chip';
    chip.id = `chip-${w}`;
    chip.textContent = w;
    container.appendChild(chip);
  });
}

/* ── construir la cuadrícula ── */
function buildGrid() {
  const grid    = $('game-grid');
  const COLS    = 6;
  const ROWS    = 8;
  const p       = G.puzzle;
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${COLS}, var(--cell-size))`;

  // Tamaño dinámico
  adjustCellSize();

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.dataset.letter = p.grid[r][c];
      cell.textContent = p.grid[r][c];
      cell.addEventListener('mousedown',  e => { e.preventDefault(); startSelect(r, c); });
      cell.addEventListener('mouseenter', e => { if (G.isDragging) continueSelect(r, c); });
      grid.appendChild(cell);
    }
  }

  document.addEventListener('mouseup', endSelect);
}

function adjustCellSize() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const COLS = 6, ROWS = 8, GAP = 4;
  const headerH = 110, bottomH = 90;
  const availW  = Math.min(vw - 24, 520);
  const availH  = vh - headerH - bottomH;
  const byW = Math.floor((availW - GAP * (COLS - 1)) / COLS);
  const byH = Math.floor((availH - GAP * (ROWS - 1)) / ROWS);
  const size = Math.max(36, Math.min(byW, byH, 58));
  document.documentElement.style.setProperty('--cell-size', size + 'px');
}

function buildBonusPips() {
  for (let i = 0; i < 3; i++) {
    const pip = $(`pip-${i}`);
    if (pip) pip.classList.remove('filled');
  }
}

/* ──────────────────────────────────────────
   SELECCIÓN CON MOUSE
────────────────────────────────────────── */
function getCell(r, c) {
  return document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
}

function isAlreadyFound(r, c) {
  return getCell(r, c)?.classList.contains('found-theme') ||
         getCell(r, c)?.classList.contains('found-pangram');
}

function startSelect(r, c) {
  if (isAlreadyFound(r, c)) return;
  G.isDragging = true;
  G.selecting  = [[r, c]];
  renderSelecting();
}

function continueSelect(r, c) {
  if (!G.isDragging) return;
  if (isAlreadyFound(r, c)) return;
  const last = G.selecting[G.selecting.length - 1];
  if (last[0] === r && last[1] === c) return;
  // Permitir retroceder
  const prev = G.selecting[G.selecting.length - 2];
  if (prev && prev[0] === r && prev[1] === c) {
    const removed = G.selecting.pop();
    getCell(removed[0], removed[1])?.classList.remove('selected','hovered');
    return;
  }
  // Solo adyacentes (8 direcciones)
  if (Math.abs(r - last[0]) <= 1 && Math.abs(c - last[1]) <= 1) {
    const already = G.selecting.some(([sr, sc]) => sr === r && sc === c);
    if (!already) {
      G.selecting.push([r, c]);
    }
  }
  renderSelecting();
}

function endSelect() {
  if (!G.isDragging) return;
  G.isDragging = false;
  if (G.selecting.length >= 2) submitSelection();
  else clearSelecting();
}

function renderSelecting() {
  document.querySelectorAll('.cell').forEach(c => {
    if (!c.classList.contains('found-theme') && !c.classList.contains('found-pangram')) {
      c.classList.remove('selected', 'hovered');
    }
  });
  G.selecting.forEach(([r, c]) => getCell(r, c)?.classList.add('selected'));
}

function clearSelecting() {
  G.selecting.forEach(([r, c]) => getCell(r, c)?.classList.remove('selected','hovered'));
  G.selecting = [];
}

/* ──────────────────────────────────────────
   SELECCIÓN TÁCTIL (móvil)
────────────────────────────────────────── */
window.gridTouchStart = function(e) {
  e.preventDefault();
  const t = e.touches[0];
  const el = document.elementFromPoint(t.clientX, t.clientY);
  if (el?.classList.contains('cell')) {
    const r = +el.dataset.r, c = +el.dataset.c;
    startSelect(r, c);
  }
};

window.gridTouchMove = function(e) {
  e.preventDefault();
  const t = e.touches[0];
  const el = document.elementFromPoint(t.clientX, t.clientY);
  if (el?.classList.contains('cell')) {
    const r = +el.dataset.r, c = +el.dataset.c;
    continueSelect(r, c);
  }
};

window.gridTouchEnd = function(e) {
  e.preventDefault();
  endSelect();
};

/* ──────────────────────────────────────────
   EVALUAR SELECCIÓN
────────────────────────────────────────── */
function pathsMatch(selPath, defPath) {
  if (selPath.length !== defPath.length) return false;
  return selPath.every(([r, c], i) => defPath[i][0] === r && defPath[i][1] === c);
}

function submitSelection() {
  const word      = G.selecting.map(([r, c]) => G.puzzle.grid[r][c]).join('');
  const selPath   = G.selecting.map(([r, c]) => [r, c]);
  const allPaths  = G.puzzle.paths;
  const p         = G.puzzle;

  // ¿Es el pangrama?
  if (!G.foundPangram && word === p.pangram) {
    const defPath = allPaths[p.pangram];
    if (defPath && pathsMatch(selPath, defPath)) {
      G.foundPangram = true;
      markCells(G.selecting, 'found-pangram');
      clearSelecting();
      updateChip('chip-pangram', 'found-pangram');
      updateFoundCount();
      showMsg(`⭐ ¡PANGRAMA! "${p.pangram}"`, 'gold', 3000);
      checkWin();
      return;
    }
  }

  // ¿Es una palabra tema?
  if (!G.foundPangram || true) {
    for (const w of p.words) {
      if (G.foundWords.includes(w)) continue;
      if (word === w) {
        const defPath = allPaths[w];
        if (defPath && pathsMatch(selPath, defPath)) {
          G.foundWords.push(w);
          markCells(G.selecting, 'found-theme');
          clearSelecting();
          updateChip(`chip-${w}`, 'found-theme');
          updateFoundCount();
          showMsg(`✓ "${w}" encontrado`, 'success', 2000);
          checkWin();
          return;
        }
      }
    }
  }

  // ¿Palabra válida mínima (bonus / pista)?
  if (word.length >= 4) {
    G.bonusCount++;
    G.bonusWords.push(word);
    advanceBonusPip();
    showMsg(`"${word}" — palabra extra (+1 pista progreso)`, 'info', 1800);
    clearSelecting();
    return;
  }

  // Selección incorrecta
  flashWrong();
  clearSelecting();
}

function markCells(coords, cls) {
  coords.forEach(([r, c]) => {
    const cell = getCell(r, c);
    if (cell) {
      cell.classList.remove('selected','hovered','hinted');
      cell.classList.add(cls);
    }
  });
}

function updateChip(chipId, cls) {
  const chip = $(chipId);
  if (chip) chip.classList.add(cls);
}

function updateFoundCount() {
  const total = G.puzzle.words.length + 1;
  const found = G.foundWords.length + (G.foundPangram ? 1 : 0);
  $('words-found-count').textContent = found;
  $('hint-count').textContent = G.hintsAvail;
}

function flashWrong() {
  G.selecting.forEach(([r, c]) => {
    const cell = getCell(r, c);
    if (cell) {
      cell.classList.add('wrong-flash');
      setTimeout(() => cell.classList.remove('wrong-flash'), 400);
    }
  });
}

/* ── BONUS → PISTAS ── */
function advanceBonusPip() {
  const idx = (G.bonusCount - 1) % 3;
  const pip = $(`pip-${idx}`);
  if (pip) pip.classList.add('filled');
  if (G.bonusCount % 3 === 0) {
    G.hintsAvail++;
    $('hint-count').textContent = G.hintsAvail;
    showMsg(`💡 ¡Ganaste una pista! (tienes ${G.hintsAvail})`, 'gold', 2500);
    // Reset pips
    for (let i = 0; i < 3; i++) $(`pip-${i}`)?.classList.remove('filled');
  }
}

/* ──────────────────────────────────────────
   SISTEMA DE PISTAS
────────────────────────────────────────── */
function useHint() {
  if (G.hintsAvail <= 0) {
    showMsg('No tienes pistas. Encuentra 3 palabras extra primero.', 'error', 2500);
    return;
  }
  // Encontrar la primera celda sin descubrir de la primera palabra no encontrada
  const remaining = G.puzzle.words.filter(w => !G.foundWords.includes(w));
  if (remaining.length === 0 && G.foundPangram) { showMsg('¡Ya ganaste!', 'success'); return; }

  const target = remaining.length > 0 ? remaining[0] : G.puzzle.pangram;
  const path   = G.puzzle.paths[target];
  if (!path) return;

  // Revelar primera celda no encontrada de esa palabra
  const firstUnfound = path.find(([r, c]) => {
    const cell = getCell(r, c);
    return cell && !cell.classList.contains('found-theme') && !cell.classList.contains('found-pangram') && !cell.classList.contains('hinted');
  });

  if (firstUnfound) {
    const cell = getCell(firstUnfound[0], firstUnfound[1]);
    cell?.classList.add('hinted');
    G.hintsAvail--;
    G.hintsUsed++;
    $('hint-count').textContent = G.hintsAvail;
    showMsg(`💡 Pista para "${target}": mira la letra resaltada`, 'gold', 3000);
  }
}

/* ──────────────────────────────────────────
   VERIFICAR VICTORIA
────────────────────────────────────────── */
function checkWin() {
  const allTheme = G.foundWords.length === G.puzzle.words.length;
  if (allTheme && G.foundPangram) {
    clearInterval(G.timerInterval);
    saveCompleted(G.puzzle.id);
    setTimeout(showWin, 800);
  }
}

function showWin() {
  const timeStr  = elapsed();
  const noHints  = G.hintsUsed === 0;
  const score    = Math.max(0,
    1000
    - G.hintsUsed * 150
    + G.bonusWords.length * 20
    - Math.floor((Date.now() - G.startTime) / 1000)
  );

  $('ws-time').textContent  = timeStr;
  $('ws-hints').textContent = G.hintsUsed;
  $('ws-bonus').textContent = G.bonusWords.length;
  $('ws-score').textContent = Math.max(0, score);
  $('win-subtitle').textContent = noHints ? '¡Sin pistas! Perfecto' : 'Encontraste todas las palabras';
  $('win-emoji').textContent = noHints ? '🏆' : '🎉';

  // Revisión de palabras
  const rev = $('found-review');
  rev.innerHTML = '';
  const allFound = [
    ...G.puzzle.words.map(w => ({ w, isPangram: false })),
    { w: G.puzzle.pangram, isPangram: true }
  ];
  allFound.forEach(({ w, isPangram }) => {
    const row = document.createElement('div');
    row.className = 'review-item';
    row.innerHTML = `
      <span class="review-word ${isPangram ? 'is-pangram' : 'is-theme'}">${w}</span>
      <span class="review-badge ${isPangram ? 'badge-pangram' : 'badge-theme'}">${isPangram ? '⭐ PANGRAMA' : 'TEMA'}</span>`;
    rev.appendChild(row);
  });

  // Compartir
  buildShareText(score, timeStr);

  showScreen('screen-win');
}

/* ── Texto para compartir ── */
function buildShareText(score, time) {
  const p = G.puzzle;
  const squares = G.puzzle.words.map(() => '🟦').join('') + '🟡';
  const txt = `🔍 HILARIO #${p.id} — ${p.theme}
${squares}
⏱ ${time} | 💡 ${G.hintsUsed} pistas | ⭐ Pangrama encontrado
🏆 Puntos: ${score}

¿Puedes superarme? ¡Atrévete tú también!
🎮 Juega en PalabraPlay`;
  const area = $('share-text-area');
  area.textContent = txt;
  area.classList.remove('hidden');
}

/* ──────────────────────────────────────────
   SIGUIENTE PUZZLE
────────────────────────────────────────── */
function nextPuzzle() {
  G.selectedPuzzleIdx = (G.selectedPuzzleIdx + 1) % PUZZLES.length;
  buildPuzzleList();
  startGame();
}

/* ──────────────────────────────────────────
   EVENTOS — botones (patrón anti-doble-disparo)
────────────────────────────────────────── */
const _btn = (id, fn) => {
  const el = $(id);
  if (!el) return;
  let _lastT = 0;
  const _fire = e => {
    const now = Date.now();
    if (now - _lastT < 400) return;
    _lastT = now;
    e.stopPropagation();
    fn(e);
  };
  el.addEventListener('click',    _fire);
  el.addEventListener('touchend', e => { e.preventDefault(); _fire(e); }, { passive: false });
};

_btn('btn-start',       () => startGame());
_btn('btn-back-game',   () => { clearInterval(G.timerInterval); buildPuzzleList(); showScreen('screen-welcome'); });
_btn('btn-hint-game',   () => useHint());
_btn('btn-next-puzzle', () => nextPuzzle());
_btn('btn-win-menu',    () => { buildPuzzleList(); showScreen('screen-welcome'); });
// btn-share replaced by social network buttons in index.html

/* Resize */
window.addEventListener('resize', () => {
  if (document.getElementById('screen-game').classList.contains('active')) {
    adjustCellSize();
  }
});

/* ──────────────────────────────────────────
   ARRANCAR
────────────────────────────────────────── */
buildPuzzleList();
showScreen('screen-welcome');
