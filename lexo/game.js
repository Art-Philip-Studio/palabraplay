/* ============================================================
   LEXO v2.0 — game.js
   ============================================================ */

// ============ BANCO DE PALABRAS ============
const WORDS = {
  4: [
    "AMOR","AZUL","BESO","BIEN","BOCA","CAER","CAFE","CARA","CASA","CASO",
    "DADO","DEDO","DUDA","FARO","FINO","FRIO","GATO","GUIA","HILO","IDEA",
    "ISLA","LAGO","LANA","LATA","LEER","LUNA","LUJO","MANO","MASA","MAYO",
    "MESA","META","MIRA","MODO","MONO","NADA","NAVE","NIDO","NOTA","OBRA",
    "OLOR","ONDA","PALO","PAPA","PARA","PASO","PELO","PENA","PINO","PISO",
    "PLAN","POCO","POLO","RAMA","RARO","RATA","RAZA","RETO","RICA","RISA",
    "ROCA","ROJO","ROSA","ROTO","SACO","SALA","SANO","SEDA","SOGA","SOLO",
    "SOPA","TACO","TAPA","TAZA","TEMA","TIPO","TIRO","TOCA","TONO","TORO",
    "VALE","VARA","VELA","VENA","VIDA","VINO","ZONA","FOCA","LUPA","MIEL",
    "BOTE","GIRO","PUMA","CUNA","DUNA","HOJA","RUTA","PIEL","TRES","MAPA"
  ],
  5: [
    "ABRIR","ACTOR","AGUJA","ALMAS","AMADO","AMIGA","AMIGO","ANCLA","ANDAR",
    "ANGEL","ANTES","ARENA","ARTES","ASADO","ASTRO","ATAJO","ATRAS","AYUDA",
    "BAILE","BANCO","BARRO","BARCO","BELLA","BELLO","BESAR","BLUSA","BOLSA",
    "BOMBA","BRAVO","BRUJA","CABAL","CAIDA","CALMA","CAMPO","CANTO","CAPAZ",
    "CARGO","CARTA","CAUSA","CEBRA","CERDO","CIELO","CIFRA","CINCO","CIRCO",
    "CLARO","CLAVO","COBRA","COCHE","COLOR","CORTE","COSER","COSTA","CREER",
    "CRUEL","CUEVA","CURVA","DANZA","DEBUT","DESEO","DISCO","DIETA","DOLOR",
    "DRAMA","DUELO","ECHAR","ENERO","ENTRE","ERROR","EXTRA","FALSO","FATAL",
    "FAVOR","FECHA","FERIA","FICHA","FIRMA","FLACO","FONDO","FORMA","FRASE",
    "FUEGO","FUERA","GARRA","GANAR","GENIO","GLOBO","GORDO","GRASA","GRAVE",
    "GRUPO","GUAPO","GUSTO","HACIA","HECHO","HIELO","HONDO","HONOR","HORNO",
    "HUESO","IGUAL","LARGO","LECHO","LEGAL","LEJOS","LETRA","LISTO","LLAMA",
    "LOCAL","LOGRO","LUCHA","LUGAR","LUNAR","LUNES","MADRE","MAGIA","MANGO",
    "MANTA","MARCO","MARZO","MAYOR","MEDIA","MEJOR","MENOR","MENOS","MENTE",
    "METRO","MIEDO","MIRAR","MISMO","MONTE","MORIR","MOTOR","MOVER","MUNDO",
    "NACER","NADAR","NADIE","NARIZ","NEGRO","NOCHE","NOBLE","NORTE","NUEVO",
    "NUNCA","PADRE","PAGAR","PALMA","PANEL","PAPEL","PASAR","PECHO","PELAR",
    "PERRO","PESAR","PLANO","PLATA","PLAZA","PLENA","POBRE","PODER","PONER",
    "PRIMO","PROSA","QUIEN","RADAR","RADIO","RANGO","RASGO","RATON","RAZON",
    "REINO","RELOJ","RENTA","RETAR","RITMO","RIVAL","ROBOT","RODAR","RUBIO",
    "SABIO","SALIR","SALSA","SALUD","SAUCE","SELLO","SERIO","SOLAR","SONAR",
    "SUAVE","SUBIR","SUEÑO","SUELO","TABLA","TANTO","TARDE","TECHO","TEXTO",
    "TIGRE","TINTO","TIRAR","TOCAR","TOMAR","TOTAL","TRAER","TRAMA","TRAMO",
    "TRATO","TRECE","TRIBU","TRIGO","TROZO","TURNO","ULTRA","UNIDO","VALER",
    "VALOR","VASTO","VERDE","VIAJE","VISTA","VITAL","VOLAR","VOTAR","VUELO"
  ],
  6: [
    "ABUELA","ACCION","ACENTO","AFECTO","AGENTE","AJUSTE","ALARMA","ALCOBA",
    "ALEGRE","ALIADO","AMABLE","AMARGO","AMBITO","AMPLIO","ANGULO","ANHELO",
    "ANTOJO","APLOMO","APUNTE","ARMADO","AROMAS","ASUNTO","AURORA","AVANCE",
    "AZUCAR","BEBIDA","BRILLA","BROCHE","BRONCE","BRUTAL","CABEZA","CABINA",
    "CALIDO","CAMINO","CAMISA","CANTAR","CARTEL","CASADO","CASUAL","CEREAL",
    "CHISTE","CIUDAD","CODIGO","COHETE","COLEGA","COLINA","COMETA","COMIDA",
    "COMPRA","CONEJO","CORTES","CRECER","CRISIS","CUARTO","CUENTO","CUERPO",
    "CUMBRE","DEBATE","DELFIN","DENTRO","DESEAR","DIARIO","DINERO","DIVINO",
    "DORADO","DUENDE","ELEGIR","EMPUJE","ENIGMA","ENLACE","ENORME","ENSAYO",
    "ESCUDO","ESPEJO","ESPUMA","ETERNO","EXACTO","EXAMEN","FAMOSO","FESTIN",
    "FIEBRE","FIESTA","FLECHA","FLORES","FONDOS","FRESCO","FUENTE","FUTURO",
    "GALOPE","GARRAS","GENERO","GENTIL","GORILA","GRACIA","GRANDE","GREMIO",
    "GRUESO","GUANTE","GUERRA","IMAGEN","INICIO","JARDIN","JUICIO","LADERA",
    "LATIDO","LAVADO","LEGADO","LIGERO","LINAJE","LOGICO","MADURO","MALEZA",
    "MANEJO","MARGEN","MARINO","MEDIDA","MENTAL","MIRADA","MOLINO","MORADO",
    "MOTIVO","NACIDO","NATIVO","NECTAR","NORMAL","NOVELA","NUTRIA","OBJETO",
    "OBRERO","OFERTA","ORGANO","ORIGEN","PAJARO","PALETA","PALOMA","PASAJE",
    "PASION","PATRON","PECADO","PEPINO","PERDIZ","PEREZA","PERFIL","PETALO",
    "PILOTO","PINCEL","PINTOR","PIRATA","PORTAL","POSADA","PRECIO","PREMIO",
    "PRENDA","PRUEBA","PUENTE","QUEDAR","QUERER","QUIETO","RANURA","RECIBO",
    "REGALO","REGION","REGLAS","RELEVO","REPARO","RETIRO","RINCON","RITUAL",
    "RODAJE","ROMPER","ROSADO","RUGIDO","SABANA","SANGRE","SEDOSO","SERENO",
    "SIERRA","SIMPLE","SIRENA","SOBRAR","SONIDO","SUBIDA","SUFRIR","TARIMA",
    "TESORO","TIEMPO","TIERNO","TIERRA","TORERO","TORNEO","TRAMPA","UNIDAD",
    "VALIDO","VASIJA","VECINO","VELERO","VENADO","VIENTO","VISION","VOLVER",
    "ZAFIRO","ZARPAR"
  ],
  7: [
    "ABOGADO","ABRASAR","ACEPTAR","ADMITIR","ADORNAR","AFIRMAR","AGOBIAR",
    "AGREGAR","ALARMAR","ALCANZAR","ALEGRAR","ALIVIAR","ALTERAR","AMBICION",
    "AMPLIAR","ANALIZAR","APOSTAR","APRENDER","ARRASAR","ARRANCAR","ARROJAR",
    "ARTERIA","ASEGURAR","ASOMBRAR","ATRAPAR","AVANZAR","BAILARIN","BALANCE",
    "BALCONES","BANDERAS","BATERIA","BELLEZA","CAMPEÓN","CANCION","CAPITAL",
    "CARACTER","CARRERA","CASTILLO","CELEBRAR","CEREBRO","CHAQUETA","CLIENTE",
    "COCINAR","COMBINAR","COMENTAR","COMPARTIR","CONECTAR","CONOCER","CONSEJO",
    "CONSUMIR","CONTROL","CREENCIA","CULTURA","DECIDIR","DEFENDER","DESAFIO",
    "DESCUBRIR","DESTINO","DIGITAL","DINAMICO","DOMINAR","ECONOMIA","ELABORAR",
    "EMPEZAR","EMPRESA","ENERGIA","ENFOCAR","ESCALAR","ESCOGER","ESPACIO",
    "ESTUDIO","EXISTIR","FAMILIA","FAMOSOS","FILTRAR","FORMATO","FORTUNA",
    "FRONTERA","FUNCION","GIGANTE","GLORIOSO","GOBERNAR","GRATUITO","GUARDAR",
    "HISTORIA","IMPULSO","INCLUIR","INFLUIR","INGRESAR","INTENSO","INVITAR",
    "JORNADA","JOVENES","LECCION","LIBERTAD","LLAMADAS","MEMORIA","MENSAJE",
    "MERCADO","MILLONES","MILAGRO","MODERNO","MOMENTO","MOSTRAR","MOTIVAR",
    "NATURAL","OBJETIVO","ORIGENES","PALABRA","PELICULA","PERSONAS","PLANETA",
    "POPULAR","POSIBLE","PREPARAR","PROCESO","PROYECTO","REALIDAD","REDACTAR",
    "REFORMA","RELACION","REPORTAR","RESERVAR","RESOLVER","RETOMAR","RITMICA",
    "ROMANTICO","SABIDURIA","SALARIOS","SEGURIDAD","SENTIDOS","SERVICIO",
    "SISTEMA","SITUACION","SOCIEDAD","SOLIDEZ","SOLUCION","SONREIR","TALENTO",
    "TENDENCIA","TERMINAR","TRABAJO","TRADICION","TRIUNFAR","USUARIO","VALORES",
    "VENTAJAS","VERSION","VIRTUD","YOUTUBE","CREADOR","HASHTAG","POSTEAR",
    "STORIES","SEGUIDO"
  ]
};

// ============ PALABRAS TRENDING ============
const TRENDING_WORDS = {
  5: ["VIRAL","EMOJI","MEMES","REMIX","LIVES","STORY","REELS","TREND","PIXEL","CLICK"],
  6: ["STREAM","SELFIE","FILTRO","AVATAR","FOLLOW","REPOST","REMOTO","STORIES"],
  7: ["HASHTAG","POSTEAR","YOUTUBE","CREADOR","USUARIO","DIGITAL","POPULAR","SEGUIDO"]
};

// ============ PISTAS ============
const HINTS = {
  "AMOR":    "Sentimiento fuerte hacia otra persona ❤️",
  "LUNA":    "Satélite natural de la Tierra 🌙",
  "CASA":    "Lugar donde vivimos 🏠",
  "GATO":    "Animal doméstico que maúlla 🐱",
  "MUNDO":   "El planeta en que vivimos 🌍",
  "FUEGO":   "Llamas y calor 🔥",
  "CIELO":   "Espacio azul sobre nuestras cabezas ☁️",
  "NOCHE":   "Periodo oscuro del día 🌙",
  "PLATA":   "Metal precioso de color grisáceo",
  "TIGRE":   "Gran felino con rayas 🐯",
  "SUEÑO":   "Lo que hacemos cuando dormimos 💤",
  "PERRO":   "Animal doméstico fiel al humano 🐕",
  "VERDE":   "Color de la vegetación 🌿",
  "CIUDAD":  "Zona urbana muy poblada 🏙️",
  "DINERO":  "Moneda usada para comprar cosas 💰",
  "CABEZA":  "Parte superior del cuerpo 💆",
  "TESORO":  "Riqueza oculta o muy valiosa 💎",
  "PUENTE":  "Estructura para cruzar ríos 🌉",
  "TIEMPO":  "Duración medida en horas, días... ⏰",
  "TIERRA":  "Planeta donde vivimos / suelo 🌍",
  "VIRAL":   "Contenido que se comparte masivamente en redes 📱",
  "EMOJI":   "Pequeñas imágenes que usamos en mensajes 😊",
  "MEMES":   "Imágenes o videos graciosos que se viralizan 😂",
  "REMIX":   "Versión modificada de una canción 🎵",
  "STORY":   "Publicación efímera de 24h en redes sociales 📖",
  "REELS":   "Videos cortos populares en Instagram 🎬",
  "SELFIE":  "Foto que uno se toma a sí mismo 🤳",
  "FILTRO":  "Efecto aplicado a fotos o videos 📷",
  "STREAM":  "Transmisión en vivo por internet 🎮",
  "HASHTAG": "Etiqueta usada para categorizar en redes sociales #",
  "YOUTUBE": "Plataforma de videos más grande del mundo 🎥",
  "DIGITAL": "Relacionado con tecnología e internet 💻",
  "USUARIO": "Persona que usa un servicio o app 👤",
  "POPULAR": "Que tiene muchos seguidores o likes ⭐",
  "CREADOR": "Quien produce contenido para redes 🎨",
  "AVATAR":  "Imagen que representa a alguien en internet 🖼️",
  "FOLLOW":  "Seguir a alguien en redes sociales",
  "PIXEL":   "La unidad mínima de imagen en una pantalla 🖥️",
  "TREND":   "Tendencia viral del momento 📈",
};

const DEFAULT_HINTS = [
  "Piensa en palabras cotidianas 🤔",
  "Empieza con vocales comunes: A, E, O",
  "Considera palabras con R o S en el medio",
  "¿Ya usaste todas las vocales posibles?",
  "Prueba palabras de uso diario",
  "¿Qué palabras ves seguido en redes? 📱",
];

// ============ CONFIGURACIÓN DE DIFICULTAD ============
const DIFFICULTY = {
  facil:   { letters: 4, attempts: 6, scoreBase: 100,  label: "🌱 FÁCIL"   },
  normal:  { letters: 5, attempts: 6, scoreBase: 150,  label: "⚡ NORMAL"  },
  dificil: { letters: 6, attempts: 5, scoreBase: 220,  label: "🔥 DIFÍCIL" },
  extremo: { letters: 7, attempts: 4, scoreBase: 350,  label: "💀 EXTREMO" },
};

const KB_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L","Ñ"],
  ["ENTER","Z","X","C","V","B","N","M","⌫"],
];

// ============ ESTADO DEL JUEGO ============
let state = {
  diff:         "normal",
  letters:      5,
  maxAttempts:  6,
  scoreBase:    150,
  diffLabel:    "⚡ NORMAL",
  secretWord:   "",
  currentRow:   0,
  currentGuess: [],
  gameOver:     false,
  score:        0,
  totalScore:   0,
  level:        1,
  streak:       0,
  usedWords:    [],
  keyStates:    {},
  won:          false,
  attemptsUsed: 0,
  tileResults:  [],
};

// ============ RÉCORDS localStorage ============
const Records = (() => {
  const KEY = "lexo_records_v2";
  const defaults = () => ({
    facil:   { bestScore: 0, bestStreak: 0, gamesWon: 0, gamesPlayed: 0 },
    normal:  { bestScore: 0, bestStreak: 0, gamesWon: 0, gamesPlayed: 0 },
    dificil: { bestScore: 0, bestStreak: 0, gamesWon: 0, gamesPlayed: 0 },
    extremo: { bestScore: 0, bestStreak: 0, gamesWon: 0, gamesPlayed: 0 },
  });

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || defaults(); }
    catch(e) { return defaults(); }
  }
  function save(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch(e) {}
  }
  function update(diff, { score, streak, won }) {
    const d = load();
    if (!d[diff]) d[diff] = { bestScore: 0, bestStreak: 0, gamesWon: 0, gamesPlayed: 0 };
    d[diff].gamesPlayed++;
    if (won) {
      d[diff].gamesWon++;
      if (score  > d[diff].bestScore)  d[diff].bestScore  = score;
      if (streak > d[diff].bestStreak) d[diff].bestStreak = streak;
    }
    save(d);
    return d[diff];
  }
  function getAll()  { return load(); }
  function clear()   { save(defaults()); }
  return { update, getAll, clear };
})();

// ============ UTILIDADES ============
function $(id) { return document.getElementById(id); }

function pickWord(length) {
  // 20% chance palabra trending
  const trending = TRENDING_WORDS[length] || [];
  const unusedTrending = trending.filter(w => !state.usedWords.includes(w));
  if (unusedTrending.length > 0 && Math.random() < 0.2) {
    return unusedTrending[Math.floor(Math.random() * unusedTrending.length)];
  }
  const pool = (WORDS[length] || WORDS[5]).filter(w => w.length === length && !state.usedWords.includes(w));
  if (pool.length === 0) {
    state.usedWords = [];
    const all = (WORDS[length] || WORDS[5]).filter(w => w.length === length);
    return all[Math.floor(Math.random() * all.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

// ============ PANTALLAS ============
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
}

// ============ GRILLA ============
function buildGrid() {
  const grid = $("grid");
  grid.innerHTML = "";
  const sz = `size-${state.letters}`;
  for (let r = 0; r < state.maxAttempts; r++) {
    const row = document.createElement("div");
    row.className = "grid-row";
    row.id = `row-${r}`;
    for (let c = 0; c < state.letters; c++) {
      const tile = document.createElement("div");
      tile.className = `tile ${sz}`;
      tile.id = `tile-${r}-${c}`;
      tile.dataset.col = c;
      row.appendChild(tile);
    }
    grid.appendChild(row);
  }
  highlightActiveRow();
}

function highlightActiveRow() {
  document.querySelectorAll(".grid-row").forEach((row, i) => {
    row.querySelectorAll(".tile").forEach(t => {
      t.classList.toggle("active-row", i === state.currentRow && !state.gameOver);
    });
  });
}

// ============ TECLADO ============
function buildKeyboard() {
  KB_ROWS.forEach((row, i) => {
    const rowEl = $(`kb-row-${i + 1}`);
    rowEl.innerHTML = "";
    row.forEach(k => {
      const btn = document.createElement("button");
      btn.className = "key" + (k === "ENTER" || k === "⌫" ? " wide" : "");
      btn.textContent = k;
      btn.dataset.key = k;
      btn.addEventListener("click", () => handleKey(k));
      rowEl.appendChild(btn);
    });
  });
}

function updateKeyboard() {
  document.querySelectorAll(".key").forEach(btn => {
    const k = btn.dataset.key;
    if (state.keyStates[k]) {
      btn.className = `key${(k === "ENTER" || k === "⌫") ? " wide" : ""} ${state.keyStates[k]}`;
    }
  });
}

// ============ DOTS ============
function buildAttemptDots() {
  const container = $("attempt-dots");
  container.innerHTML = "";
  for (let i = 0; i < state.maxAttempts; i++) {
    const dot = document.createElement("div");
    dot.className = "attempt-dot";
    dot.id = `dot-${i}`;
    container.appendChild(dot);
  }
  updateAttemptsBar();
}

function updateAttemptsBar() {
  const remaining = state.maxAttempts - state.currentRow;
  $("attempts-text").textContent = `${remaining} intento${remaining !== 1 ? "s" : ""}`;
  for (let i = 0; i < state.maxAttempts; i++) {
    const dot = $(`dot-${i}`);
    if (dot) dot.classList.toggle("used", i < state.currentRow);
  }
}

// ============ MENSAJES ============
let msgTimer;
function showMessage(text, type = "info", duration = 2200) {
  const msg = $("message");
  clearTimeout(msgTimer);
  msg.textContent = text;
  msg.className = `message ${type}`;
  if (duration > 0) {
    msgTimer = setTimeout(() => { msg.className = "message hidden"; }, duration);
  }
}

// ============ ENTRADA ============
function handleKey(key) {
  if (state.gameOver) return;
  if (key === "⌫" || key === "BACKSPACE") {
    if (state.currentGuess.length > 0) state.currentGuess.pop();
  } else if (key === "ENTER") {
    submitGuess(); return;
  } else if (/^[A-ZÑ]$/.test(key.toUpperCase())) {
    if (state.currentGuess.length < state.letters) {
      state.currentGuess.push(key.toUpperCase());
    }
  }
  renderCurrentGuess();
}

function renderCurrentGuess() {
  for (let c = 0; c < state.letters; c++) {
    const tile = $(`tile-${state.currentRow}-${c}`);
    if (!tile) continue;
    const letter = state.currentGuess[c] || "";
    tile.textContent = letter;
    if (letter) {
      tile.classList.add("filled");
      tile.classList.remove("pop");
      void tile.offsetWidth;
      tile.classList.add("pop");
      setTimeout(() => tile.classList.remove("pop"), 150);
    } else {
      tile.classList.remove("filled");
    }
  }
}

// ============ EVALUAR INTENTO ============
function submitGuess() {
  if (state.currentGuess.length < state.letters) {
    showMessage(`Necesitas ${state.letters} letras`, "error");
    shakeRow(state.currentRow);
    return;
  }

  const guess  = state.currentGuess.join("");
  const result = evaluateGuess(guess, state.secretWord);

  state.tileResults.push(result.map(r => r.status));

  revealRow(state.currentRow, guess, result);

  result.forEach(({ letter, status }) => {
    const priority = { correct: 3, present: 2, absent: 1 };
    const current  = state.keyStates[letter];
    if (!current || priority[status] > priority[current]) {
      state.keyStates[letter] = status;
    }
  });

  const delay = state.letters * 110 + 200;

  setTimeout(() => {
    updateKeyboard();
    state.currentRow++;
    state.currentGuess = [];
    updateAttemptsBar();

    const allCorrect = result.every(r => r.status === "correct");

    if (allCorrect) {
      winGame(guess);
    } else if (state.currentRow >= state.maxAttempts) {
      loseGame();
    } else {
      highlightActiveRow();
    }
  }, delay);
}

function evaluateGuess(guess, secret) {
  const result = Array(guess.length).fill(null).map((_, i) => ({
    letter: guess[i], status: "absent"
  }));
  const pool = secret.split("");
  result.forEach((r, i) => {
    if (guess[i] === secret[i]) { r.status = "correct"; pool[i] = null; }
  });
  result.forEach((r, i) => {
    if (r.status !== "correct") {
      const idx = pool.indexOf(guess[i]);
      if (idx !== -1) { r.status = "present"; pool[idx] = null; }
    }
  });
  return result;
}

function revealRow(row, guess, result) {
  result.forEach(({ status }, c) => {
    const tile = $(`tile-${row}-${c}`);
    if (!tile) return;
    tile.textContent = guess[c];
    setTimeout(() => tile.classList.add(status), c * 110);
  });
}

function shakeRow(row) {
  const rowEl = $(`row-${row}`);
  if (!rowEl) return;
  rowEl.querySelectorAll(".tile").forEach(t => {
    t.classList.remove("shake");
    void t.offsetWidth;
    t.classList.add("shake");
    setTimeout(() => t.classList.remove("shake"), 400);
  });
}

// ============ GANAR ============
function winGame() {
  state.gameOver    = true;
  state.won         = true;
  state.streak++;
  const used        = state.currentRow;
  state.attemptsUsed = used;
  const bonus       = Math.max(1, state.maxAttempts - used + 1);
  const pts         = state.scoreBase * bonus;
  state.score       = pts;
  state.totalScore += pts;
  state.usedWords.push(state.secretWord);

  Records.update(state.diff, { score: state.totalScore, streak: state.streak, won: true });

  const rowEl = $(`row-${used - 1}`);
  if (rowEl) {
    rowEl.querySelectorAll(".tile").forEach((t, i) => {
      setTimeout(() => t.classList.add("win-dance"), i * 80);
    });
  }

  const msgs = [
    ["¡PERFECTO! 🏆", "¡Eres un maestro del léxico!"],
    ["¡BRILLANTE! ✨", "¡Impresionante!"],
    ["¡EXCELENTE! 🎯", "¡Gran vocabulario!"],
    ["¡MUY BIEN! 👏", "¡Lo lograste!"],
    ["¡BIEN! 😊", "Sigue practicando"],
    ["¡JUSTO! 😅", "Por poco, ¡pero ganaste!"],
  ];
  const [title, subtitle] = msgs[Math.min(used - 1, msgs.length - 1)];
  setTimeout(() => showResult(true, title, subtitle, used), 1200);
}

// ============ PERDER ============
function loseGame() {
  state.gameOver     = true;
  state.won          = false;
  state.attemptsUsed = state.maxAttempts;
  state.streak       = 0;
  Records.update(state.diff, { score: state.totalScore, streak: 0, won: false });
  showMessage(`La palabra era: ${state.secretWord}`, "error", 0);
  setTimeout(() => showResult(false, "¡SIN INTENTOS!", "Mejor suerte la próxima vez", state.maxAttempts), 800);
}

// ============ RESULTADO ============
function showResult(won, title, subtitle, attemptsUsed) {
  $("result-emoji").textContent   = won ? (attemptsUsed === 1 ? "🏆" : "🎉") : "😅";
  $("result-title").textContent   = title;
  $("result-subtitle").textContent = subtitle;
  $("res-score").textContent      = state.score.toLocaleString();
  $("res-attempts").textContent   = attemptsUsed;
  $("res-level").textContent      = state.level;
  $("res-streak").textContent     = state.streak;
  $("res-word-reveal").innerHTML  = `La palabra era: <span>${state.secretWord}</span>`;

  const badge = $("result-level-badge");
  if (badge) badge.textContent = state.diffLabel;

  setupShareButtons();
  showScreen("screen-result");
}

// ============ COMPARTIR ============
function buildShareText() {
  const emojiMap = { correct: "🟩", present: "🟨", absent: "⬛" };
  const lines    = state.tileResults.map(row => row.map(s => emojiMap[s] || "⬛").join(""));
  const status   = state.won ? `✅ ${state.attemptsUsed}/${state.maxAttempts}` : "❌ Sin intentos";
  return `🔤 LEXO — ${state.diffLabel}\n${status} · ${state.score} pts · Racha 🔥${state.streak}\n\n${lines.join("\n")}\n\n¡Juega en lexo.app!`;
}

function setupShareButtons() {
  const text = buildShareText();
  const enc  = encodeURIComponent(text);

  const wa = $("share-wa");
  const tw = $("share-tw");
  const tg = $("share-tg");
  const cp = $("share-cp");

  if (wa) wa.onclick = () => window.open(`https://wa.me/?text=${enc}`, "_blank");
  if (tw) tw.onclick = () => window.open(`https://twitter.com/intent/tweet?text=${enc}`, "_blank");
  if (tg) tg.onclick = () => window.open(`https://t.me/share/url?url=lexo.app&text=${enc}`, "_blank");

  if (cp) cp.onclick = () => {
    navigator.clipboard.writeText(text).then(() => {
      cp.innerHTML = `<span class="share-icon">✅</span><span>¡Copiado!</span>`;
      setTimeout(() => { cp.innerHTML = `<span class="share-icon">📋</span><span>Copiar</span>`; }, 2200);
    }).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      cp.innerHTML = `<span class="share-icon">✅</span><span>¡Copiado!</span>`;
      setTimeout(() => { cp.innerHTML = `<span class="share-icon">📋</span><span>Copiar</span>`; }, 2200);
    });
  };
}

// ============ RÉCORDS MODAL ============
function showRecordsModal() {
  const all    = Records.getAll();
  const labels = {
    facil:   "🌱 Fácil",
    normal:  "⚡ Normal",
    dificil: "🔥 Difícil",
    extremo: "💀 Extremo",
  };
  let html = "";
  for (const [diff, label] of Object.entries(labels)) {
    const r   = all[diff] || { bestScore: 0, bestStreak: 0, gamesWon: 0, gamesPlayed: 0 };
    const pct = r.gamesPlayed > 0 ? Math.round(r.gamesWon / r.gamesPlayed * 100) : 0;
    html += `
      <div class="rec-row">
        <div class="rec-diff-label">${label}</div>
        <div class="rec-stats-grid">
          <div class="rec-stat">
            <span class="rec-num">${r.bestScore.toLocaleString()}</span>
            <span class="rec-lbl">Mejor puntos</span>
          </div>
          <div class="rec-stat">
            <span class="rec-num">${r.bestStreak}</span>
            <span class="rec-lbl">Mejor racha 🔥</span>
          </div>
          <div class="rec-stat">
            <span class="rec-num">${r.gamesWon}</span>
            <span class="rec-lbl">Palabras</span>
          </div>
          <div class="rec-stat">
            <span class="rec-num">${pct}%</span>
            <span class="rec-lbl">Tasa éxito</span>
          </div>
        </div>
      </div>`;
  }
  $("records-content").innerHTML = html;
  $("records-modal").style.display = "flex";
}

// ============ SIGUIENTE NIVEL ============
function nextWord() {
  state.level++;
  state.gameOver    = false;
  state.currentRow  = 0;
  state.currentGuess = [];
  state.keyStates   = {};
  state.secretWord  = pickWord(state.letters);
  state.score       = 0;
  state.tileResults = [];

  $("hdr-level").textContent  = `Nivel ${state.level}`;
  $("hdr-score").textContent  = `${state.totalScore} pts`;
  $("hdr-streak").textContent = `🔥 ${state.streak}`;

  buildGrid();
  buildKeyboard();
  buildAttemptDots();
  showScreen("screen-game");
  $("message").className = "message hidden";
}

// ============ INICIAR JUEGO ============
function startGame() {
  const cfg          = DIFFICULTY[state.diff];
  state.letters      = cfg.letters;
  state.maxAttempts  = cfg.attempts;
  state.scoreBase    = cfg.scoreBase;
  state.diffLabel    = cfg.label;
  state.level        = 1;
  state.totalScore   = 0;
  state.streak       = 0;
  state.usedWords    = [];
  state.gameOver     = false;
  state.currentRow   = 0;
  state.currentGuess = [];
  state.keyStates    = {};
  state.secretWord   = pickWord(state.letters);
  state.score        = 0;
  state.tileResults  = [];

  $("hdr-level").textContent  = "Nivel 1";
  $("hdr-score").textContent  = "0 pts";
  $("hdr-streak").textContent = "🔥 0";

  buildGrid();
  buildKeyboard();
  buildAttemptDots();
  showScreen("screen-game");
  $("message").className = "message hidden";
}

// ============ PISTA ============
function showHint() {
  const word    = state.secretWord;
  const hint    = HINTS[word] || DEFAULT_HINTS[Math.floor(Math.random() * DEFAULT_HINTS.length)];
  const penalty = Math.round(state.scoreBase * 0.3);

  const overlay = document.createElement("div");
  overlay.className = "hint-overlay";
  overlay.innerHTML = `
    <div class="hint-card">
      <div class="hint-title">💡 Pista</div>
      <div class="hint-text">${hint}</div>
      <div class="hint-cost">⚠️ Usar esta pista reduce tu puntuación en ${penalty} pts</div>
      <button class="hint-close">ENTENDIDO</button>
    </div>`;
  document.body.appendChild(overlay);

  state.scoreBase = Math.max(50, state.scoreBase - penalty);
  overlay.querySelector(".hint-close").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });
}

/* ============================================================
   TUTORIAL CON MANO FANTASMA
   ============================================================ */
const Tutorial = (() => {
  const STORAGE_KEY = "lexo_tut_v2";

  // Helper para construir demo de tiles
  function makeTiles(letters, statuses) {
    return letters.map((l, i) =>
      `<div class="tut-tile ${statuses[i]}">${l}</div>`
    ).join("");
  }

  // Definición de pasos
  const steps = [
    {
      emoji: "🔤",
      title: "¡Bienvenido a LEXO!",
      desc:  "Adivina la palabra oculta antes de que se agoten tus intentos. Cada intento te da pistas de colores.",
      demo:  makeTiles(["L","E","X","O"], ["empty","empty","empty","empty"]),
      highlightEl: null,
    },
    {
      emoji: "⌨️",
      title: "Escribe tu intento",
      desc:  "Usa el teclado en pantalla o el teclado físico. Escribe una palabra y presiona ENTER para confirmar.",
      demo:  makeTiles(["F","U","E","G","O"], ["absent","absent","absent","absent","absent"]),
      highlightEl: "kb-row-3",
    },
    {
      emoji: "🟩",
      title: "Verde = ¡Letra correcta!",
      desc:  "La letra está en la posición exacta. ¡Muy bien! Sigue con esas letras.",
      demo:  makeTiles(["M","U","N","D","O"], ["correct","absent","correct","absent","correct"]),
      highlightEl: null,
    },
    {
      emoji: "🟨",
      title: "Amarillo = Existe, otro lugar",
      desc:  "La letra está en la palabra pero en una posición diferente. ¡Reubícala!",
      demo:  makeTiles(["T","I","G","R","E"], ["absent","present","absent","present","correct"]),
      highlightEl: null,
    },
    {
      emoji: "⬛",
      title: "Gris = No está en la palabra",
      desc:  "Esa letra no aparece en la palabra. Elimínala de tus próximos intentos.",
      demo:  makeTiles(["P","L","A","Z","A"], ["absent","absent","correct","absent","correct"]),
      highlightEl: null,
    },
    {
      emoji: "💡",
      title: "¿Bloqueado? Usa la pista",
      desc:  "El botón 💡 en la esquina superior derecha te da una pista con una pequeña penalización de puntos.",
      demo:  "",
      highlightEl: "btn-hint",
    },
    {
      emoji: "🏆",
      title: "Niveles y puntuación",
      desc:  "Gana palabras seguidas para aumentar tu racha 🔥. Menos intentos = más puntos. Guarda tus récords por dificultad.",
      demo:  "",
      highlightEl: null,
    },
    {
      emoji: "🚀",
      title: "¡Listo para jugar!",
      desc:  "Elige dificultad: 🌱 Fácil (4 letras), ⚡ Normal (5), 🔥 Difícil (6) o 💀 Extremo (7). ¡Buena suerte!",
      demo:  "",
      highlightEl: null,
    },
  ];

  let currentStep = 0;
  let handAnimId  = null;
  let highlighted = null;

  // ---- Mano fantasma ----
  function positionHand(targetId) {
    const hand = $("ghost-hand");
    if (!hand) return;
    clearInterval(handAnimId);

    // Quitar highlight anterior
    if (highlighted) {
      const prev = $(highlighted);
      if (prev) prev.classList.remove("kb-highlight");
      highlighted = null;
    }

    if (!targetId) {
      hand.style.opacity = "0";
      setTimeout(() => { hand.style.display = "none"; }, 300);
      return;
    }

    const target = $(targetId);
    if (!target) {
      hand.style.opacity = "0";
      setTimeout(() => { hand.style.display = "none"; }, 300);
      return;
    }

    // Highlight del elemento
    target.classList.add("kb-highlight");
    highlighted = targetId;

    // Posición de la mano
    const rect = target.getBoundingClientRect();
    hand.style.display = "block";
    hand.style.left    = (rect.left + rect.width / 2 - 14) + "px";
    hand.style.top     = (rect.top  + rect.height - 8) + "px";
    hand.style.opacity = "1";

    // Bounce suave
    let t = 0;
    handAnimId = setInterval(() => {
      t += 0.08;
      const y   = Math.sin(t) * 6;
      const sc  = 1 + Math.sin(t) * 0.04;
      hand.style.transform = `translateY(${y}px) scale(${sc})`;
    }, 30);
  }

  // ---- Render de paso ----
  function renderStep() {
    const s = steps[currentStep];
    if (!s) { close(); return; }

    const totalSteps = steps.length;

    $("tut-emoji").textContent        = s.emoji;
    $("tut-title").textContent        = s.title;
    $("tut-desc").textContent         = s.desc;
    $("tut-demo").innerHTML           = s.demo || "";
    $("tut-step-count").textContent   = `${currentStep + 1} / ${totalSteps}`;
    $("tut-progress-fill").style.width = `${((currentStep + 1) / totalSteps) * 100}%`;
    $("tut-next-btn").textContent     = currentStep === totalSteps - 1 ? "¡JUGAR! 🎮" : "SIGUIENTE →";

    // Reset emoji anim
    const emojiEl = $("tut-emoji");
    emojiEl.style.animation = "none";
    void emojiEl.offsetWidth;
    emojiEl.style.animation = "";

    positionHand(s.highlightEl);
  }

  // ---- API pública ----
  function show() {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const overlay = $("tutorial-overlay");
    if (!overlay) return;
    overlay.style.display  = "flex";
    overlay.style.opacity  = "0";
    overlay.style.transition = "opacity 0.3s ease";
    void overlay.offsetWidth;
    overlay.style.opacity  = "1";
    currentStep = 0;
    renderStep();
  }

  function next() {
    currentStep++;
    if (currentStep >= steps.length) { close(); return; }
    renderStep();
  }

  function close() {
    localStorage.setItem(STORAGE_KEY, "1");
    clearInterval(handAnimId);

    // Quitar highlight
    if (highlighted) {
      const el = $(highlighted);
      if (el) el.classList.remove("kb-highlight");
      highlighted = null;
    }

    const overlay = $("tutorial-overlay");
    if (overlay) {
      overlay.style.opacity    = "0";
      overlay.style.transition = "opacity 0.35s ease";
      setTimeout(() => {
        overlay.style.display     = "none";
        overlay.style.opacity     = "";
        overlay.style.transition  = "";
      }, 360);
    }

    const hand = $("ghost-hand");
    if (hand) { hand.style.opacity = "0"; setTimeout(() => { hand.style.display = "none"; }, 300); }
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { show, next, close, reset };
})();

/* ============================================================
   TECLADO FÍSICO
   ============================================================ */
document.addEventListener("keydown", e => {
  const key = e.key.toUpperCase();
  if (key === "BACKSPACE") { handleKey("⌫"); return; }
  if (key === "ENTER")     { handleKey("ENTER"); return; }
  if (/^[A-Z]$/.test(key) || key === "Ñ") handleKey(key);
});

/* ============================================================
   EVENTOS UI
   ============================================================ */
document.querySelectorAll(".diff-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".diff-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.diff = btn.dataset.diff;
  });
});

$("btn-start").addEventListener("click", startGame);
$("btn-back").addEventListener("click", () => showScreen("screen-welcome"));
$("btn-hint").addEventListener("click", showHint);
$("btn-next-word").addEventListener("click", nextWord);
$("btn-menu").addEventListener("click", () => showScreen("screen-welcome"));
$("btn-show-records").addEventListener("click", showRecordsModal);
$("records-close").addEventListener("click", () => { $("records-modal").style.display = "none"; });
$("records-modal").addEventListener("click", e => {
  if (e.target === $("records-modal")) $("records-modal").style.display = "none";
});

$("btn-clear-records").addEventListener("click", () => {
  if (confirm("¿Borrar todos los récords?")) {
    Records.clear();
    showRecordsModal(); // refrescar
  }
});

/* Tutorial buttons — se asignan después del DOMContentLoaded */
document.addEventListener("DOMContentLoaded", () => {
  const nextBtn = $("tut-next-btn");
  const skipBtn = $("tut-skip-btn");
  if (nextBtn) nextBtn.addEventListener("click", () => Tutorial.next());
  if (skipBtn) skipBtn.addEventListener("click", () => Tutorial.close());
});

/* Mostrar tutorial la primera vez */
setTimeout(() => {
  if (!localStorage.getItem("lexo_tut_v2")) {
    Tutorial.show();
  }
}, 600);
