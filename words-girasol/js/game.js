// =============================================
//   WORD GIRASOL — game.js v3
//   Correcciones:
//   - Letras perfectamente centradas (grid + place-items)
//   - Botón Inicio (volver al nivel 1)
//   - Mecánica de arrastre reescrita con setPointerCapture
//   - Tap individual funciona en móvil sin arrastre
//   - Layout robusto móvil y escritorio
// =============================================

'use strict';

// ── NIVELES ──
const LEVELS = [
  // ── NIVEL 1: FÁCIL — 7 letras, palabras 3-4 letras ──
  {
    category:"Girasoles",
    main:"GIRASOL",
    letters:"GIRASOL",
    words:["SOL","GIRA","LIRA","RISA","GRIS","GIRASOL"],
    clue:"La flor que sigue al sol 🌻",
    curiosity:"🌻 El girasol joven gira siguiendo al sol: se llama heliotropismo. De adulto queda fijo mirando al este.",
    sharePhrase:"Como el girasol que gira hacia la luz, ¡hoy aprendí algo que me iluminó!",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/640px-Sunflower_sky_backdrop.jpg",
    imageLabel:"Heliotropismo — el girasol sigue al sol",
    facts:["🌻 Hasta 3m de alto","☀️ Sigue al sol de joven","🌍 Origen: América"]
  },
  // ── NIVEL 2: FÁCIL — 5 letras, palabras 3-5 letras ──
  {
    category:"Abejas",
    main:"ABEJA",
    letters:"ABEJA",
    words:["AJE","BAJE","BAJA","ABEJA"],
    clue:"Insecto polinizador 🐝",
    curiosity:"🐝 Una abeja obrera visita hasta 2.000 flores al día y produce solo 1/12 de cucharadita de miel en su vida.",
    sharePhrase:"Pequeña como una abeja, pero con el poder de mover el mundo flor a flor. 🐝",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_flying.jpg/640px-Apis_mellifera_flying.jpg",
    imageLabel:"Abeja melífera en vuelo",
    facts:["🐝 2.000 flores/día","🍯 1/12 cucharadita","👑 1 reina por colmena"]
  },
  // ── NIVEL 3: MEDIO — 6 letras, POLENA ──
  {
    category:"Polen",
    main:"POLEN",
    letters:"POLENA",
    words:["PENA","PALO","LONA","PLAN","PANEL","PENAL","PLANO","POLEN"],
    clue:"Polvo que viaja con el viento 🌼",
    curiosity:"🌼 El polen puede viajar hasta 3.000 km con el viento. Una flor de girasol produce millones de granos de polen.",
    sharePhrase:"El polen viaja 3.000 km en el viento. Las buenas ideas también viajan lejos cuando las compartes. 🌼",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Misc_pollen.jpg/640px-Misc_pollen.jpg",
    imageLabel:"Granos de polen al microscopio",
    facts:["🌬️ Viaja 3.000 km","🔬 Millones de granos","🐝 Alimento de abejas"]
  },
  // ── NIVEL 4: MEDIO — 6 letras, RAICES ──
  {
    category:"Raíces",
    main:"RAICES",
    letters:"RAICES",
    words:["AIRE","CERA","RISA","CAER","ARCE","RAICES"],
    clue:"Parte que ancla la planta ⬇️",
    curiosity:"🌱 Las raíces del rosal pueden bajar 2 metros buscando agua. Por eso sobreviven mejor en épocas de sequía.",
    sharePhrase:"Las raíces van profundo sin que nadie las vea. El aprendizaje también crece desde adentro. 🌱",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Root_of_a_Sycamore.jpg/640px-Root_of_a_Sycamore.jpg",
    imageLabel:"Raíces buscando agua y nutrientes",
    facts:["⬇️ Hasta 2 metros","💧 Buscan agua","🌱 Anclan la planta"]
  },
  // ── NIVEL 5: MEDIO — 7 letras, HOJASEC ──
  {
    category:"Jardín",
    main:"HOJAS",
    letters:"HOJASEC",
    words:["HOJA","SOJA","HACE","ECHA","COSE","HOJAS"],
    clue:"Partes verdes de las plantas 🍃",
    curiosity:"🍃 Una hoja de rosa tiene entre 5 y 7 foliolos dentados. Su forma ayuda a captar la luz del sol eficientemente.",
    sharePhrase:"Las hojas trabajan en silencio capturando luz. El conocimiento también transforma en silencio. 🍃",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/640px-24701-nature-natural-beauty.jpg",
    imageLabel:"Hojas capturando la luz solar",
    facts:["🍃 5–7 foliolos","☀️ Capturan luz","💧 Transpiran agua"]
  },
  // ── NIVEL 6: MEDIO — 6 letras, MIELOS (M,I,E,L,O,S) ──
  {
    category:"Miel",
    main:"MIEL",
    letters:"MIELOS",
    words:["MIEL","LISO","LEIS","MILES","MOLES","MIELOS"],
    clue:"Dulce producto de las abejas 🍯",
    curiosity:"🍯 La miel nunca caduca: se han encontrado tarros de 3.000 años en tumbas egipcias, todavía comestibles.",
    sharePhrase:"La miel de 3.000 años sigue siendo dulce. El conocimiento que cultivamos tampoco caduca. 🍯",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Honey_comb.jpg/640px-Honey_comb.jpg",
    imageLabel:"Panal de miel — nunca caduca",
    facts:["🍯 No caduca nunca","🏛️ 3.000 años de historia","🧪 Propiedades antibacterianas"]
  },
  // ── NIVEL 7: DIFÍCIL — 8 letras, HIBRIDAE (H,I,B,R,I,D,A,E) ──
  {
    category:"Rosas - Té Híbrida",
    main:"HIBRIDA",
    letters:"HIBRIDAE",
    words:["ARDE","BIDE","BRIDA","ABRID","HIBRIDA"],
    clue:"Mezcla de dos variedades 🌹",
    curiosity:"🌹 La rosa Té Híbrida es la más clásica: flor grande, tallo largo, ideal para ramos. Nació en el siglo XIX.",
    sharePhrase:"La rosa híbrida nació de la mezcla perfecta. Lo mejor siempre viene de unir lo mejor. 🌹",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Rosa_Hybrid_Tea_3.jpg/640px-Rosa_Hybrid_Tea_3.jpg",
    imageLabel:"Rosa Té Híbrida — la reina de las rosas",
    facts:["🌹 Siglo XIX","✂️ Tallo largo","🏆 La más popular"]
  },
  // ── NIVEL 8: DIFÍCIL — 9 letras, TREPADORA ──
  {
    category:"Rosas - Trepadora",
    main:"TREPADORA",
    letters:"TREPADORA",
    words:["PERA","ROPA","TROPA","PARTE","TARDO","TREPADORA"],
    clue:"Escala paredes y pérgolas 🌿",
    curiosity:"🌹 La rosa Trepadora puede subir hasta 5 metros y cubre pérgolas y muros con colores espectaculares.",
    sharePhrase:"La rosa Trepadora escala hasta donde nadie imagina. No hay muro que pare una flor con voluntad. 🌿",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Climbing_rose_on_fence.jpg/640px-Climbing_rose_on_fence.jpg",
    imageLabel:"Rosa Trepadora — sube hasta 5 metros",
    facts:["📏 Hasta 5 metros","🧱 Cubre muros","🌸 Florece en primavera"]
  },
  // ── NIVEL 9: DIFÍCIL — 9 letras, MINIATURA ──
  {
    category:"Rosas - Miniatura",
    main:"MINIATURA",
    letters:"MINIATURA",
    words:["MINI","MINA","TINA","RUTA","NATURA","MINIATURA"],
    clue:"La más pequeña de las rosas 🌺",
    curiosity:"🌹 La rosa Miniatura mide solo 30 cm de alto, perfecta para macetas. Tiene todas las características de una rosa normal.",
    sharePhrase:"La rosa Miniatura cabe en la palma de tu mano, pero su belleza no cabe en palabras. 🌺",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Miniature_rose.jpg/640px-Miniature_rose.jpg",
    imageLabel:"Rosa Miniatura — 30 cm de altura",
    facts:["📐 Solo 30 cm","🪴 Ideal en maceta","🌹 Rosa completa"]
  },
  // ── NIVEL 10: DIFÍCIL — 7 letras, SOLAREV ──
  {
    category:"Fotosíntesis",
    main:"SOLAR",
    letters:"SOLAREV",
    words:["LORA","VELA","VOLAR","VALOR","SALVO","SOLAR"],
    clue:"La energía que alimenta a las plantas ☀️",
    curiosity:"☀️ Las plantas convierten luz solar en azúcar mediante la fotosíntesis. Una hoja de girasol produce energía para formar una semilla entera.",
    sharePhrase:"Las plantas convierten luz en vida. Tú conviertes conocimiento en sabiduría. ¡Eso es fotosíntesis del alma! ☀️",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Photosynthesis_en.svg/640px-Photosynthesis_en.svg.png",
    imageLabel:"Fotosíntesis — luz solar → azúcar",
    facts:["☀️ Luz → azúcar","🌿 Produce oxígeno","🌱 Base de toda vida"]
  },
  // ── NIVEL 11: MUY DIFÍCIL — 9 letras, SILVESTRE (S,I,L,V,E,S,T,R,E) ──
  {
    category:"Rosas - Silvestre",
    main:"SILVESTRE",
    letters:"SILVESTRE",
    words:["TRES","LEVE","VISTE","LISTE","ESTRIL","SILVESTRE"],
    clue:"La rosa original de la naturaleza 🌱",
    curiosity:"🌹 La rosa Silvestre tiene solo 5 pétalos y produce escaramujos ricos en vitamina C que se usan en infusiones.",
    sharePhrase:"La rosa Silvestre no necesita jardín para ser perfecta. La naturaleza es el mejor diseñador. 🌱",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Rosa_canina_J1.jpg/640px-Rosa_canina_J1.jpg",
    imageLabel:"Rosa Silvestre — 5 pétalos naturales",
    facts:["🌿 5 pétalos","🍎 Rica en vitamina C","🌍 Crece en montañas"]
  },
  // ── NIVEL 12: EXPERTO — 10 letras, FLORIBUNDA (F,L,O,R,I,B,U,N,D,A) ──
  {
    category:"Rosas - Floribunda",
    main:"FLORIBUNDA",
    letters:"FLORIBUNDA",
    words:["FLOR","ORAL","RIFA","LABIO","FLORIDA","FLORIBUNDA"],
    clue:"Produce ramilletes de flores 🌸",
    curiosity:"🌹 La Floribunda produce ramilletes en vez de flores solas y florece todo el verano sin descanso.",
    sharePhrase:"La Floribunda no florece una sola vez: florece sin descanso todo el verano. Eso es perseverancia. 🌸",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Floribunda_rose.jpg/640px-Floribunda_rose.jpg",
    imageLabel:"Floribunda — ramillete de flores",
    facts:["🌸 Florece todo el verano","💐 Ramos naturales","🌡️ Muy resistente"]
  }
];
// ── ESTADO ──
let levelIdx      = parseInt(localStorage.getItem('wg_level') || '0');
let coins         = parseInt(localStorage.getItem('wg_coins') || '150');
let soundOn       = localStorage.getItem('wg_sound') !== 'off';
let found         = new Set();
let selected      = [];      // elementos DOM seleccionados
let currentWord   = '';
let isDragging    = false;   // true cuando el puntero está bajado
let activePointerId = null;
let clueTimer     = null;
let clueVisible   = false;
let lastActionTime = Date.now();

// ── DOM ──
const $ = id => document.getElementById(id);
const coinsEl      = $('coins');
const categoryEl   = $('category');
const wordsGrid    = $('wordsGrid');
const hive         = $('hive');
const hiveWrap     = $('hiveWrap');
const linesEl      = $('lines');
const wordDisplay  = $('wordDisplay');

// ── Renderiza las letras como fichas individuales ──
function renderWordDisplay(word){
  if(!word){
    wordDisplay.innerHTML = '';
    return;
  }
  wordDisplay.innerHTML = word.split('').map(ch =>
    `<span class="wd-letter">${ch}</span>`
  ).join('');
}
const superPopup   = $('superPopup');
const clueNote     = $('clueNote');
const clueText     = $('clueText');
const progressFill = $('progressFill');
const progressLabel= $('progressLabel');
const sbLevel      = $('sidebar-level');
const sbCat        = $('sidebar-cat');
const sbCuriosity  = $('sidebar-curiosity');
const volumeBtn    = $('volumeBtn');
const homeBtn      = $('homeBtn');

// ── AUDIO ──
let audioCtx = null;
function getAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  return audioCtx;
}
function beep(freq, vol=0.08, dur=0.12, type='sine'){
  if(!soundOn) return;
  try{
    const ctx = getAudio();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type=type; o.frequency.value=freq;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+dur);
    o.start(); o.stop(ctx.currentTime+dur);
  }catch(e){}
}

// ── BOTÓN VOLUMEN ──
function updateVolumeBtn(){
  volumeBtn.textContent = soundOn ? '🔊' : '🔇';
  volumeBtn.classList.toggle('muted', !soundOn);
  volumeBtn.title = soundOn ? 'Silenciar sonido' : 'Activar sonido';
}
volumeBtn.addEventListener('click', ()=>{
  soundOn = !soundOn;
  localStorage.setItem('wg_sound', soundOn ? 'on' : 'off');
  updateVolumeBtn();
  if(soundOn) beep(560, 0.1, 0.15, 'sine');
});
updateVolumeBtn();

// ── BOTÓN INICIO → abre mapa de niveles ──
homeBtn.addEventListener('click', ()=>{
  beep(420, 0.06, 0.12, 'sine');
  openLevelsModal();
});

function openLevelsModal(){
  const modal = $('levelsModal');
  buildLevelsPath();
  modal.classList.add('show');
  // Scroll al nivel actual
  setTimeout(()=>{
    const cur = modal.querySelector('.level-node.current');
    if(cur) cur.scrollIntoView({block:'center', behavior:'smooth'});
  }, 150);
}

function buildLevelsPath(){
  const path = $('levelsPath');
  if(!path) return;
  path.innerHTML = '';
  const completedLevels = JSON.parse(localStorage.getItem('wg_completed') || '[]');
  const starsMap  = JSON.parse(localStorage.getItem('wg_stars') || '{}');

  // Emojis por categoría
  const emojiMap = {
    'Girasoles':'🌻','Abejas':'🐝','Rosas - Té':'🌹','Rosas - Floribunda':'🌸',
    'Rosas - Trepadora':'🌿','Rosas - Miniatura':'🌺','Rosas - Silvestre':'🌱',
    'Polen':'🌼','Jardín':'🍃','Miel':'🍯','Raíces':'🌾','Fotosíntesis':'☀️'
  };

  // Actualizar texto de progreso
  const progressEl = $('levelsProgressText');
  if(progressEl){
    const done = completedLevels.length;
    progressEl.textContent = `${done} / ${LEVELS.length} niveles completados`;
  }

  LEVELS.forEach((lv, i) => {
    const isDone    = completedLevels.includes(i);
    const isCurrent = i === levelIdx;
    const isLocked  = i > levelIdx && !isDone;
    const stars     = starsMap[i] || (isDone ? 3 : 0);
    const emoji     = emojiMap[lv.category] || '🌸';

    // Zigzag: fila alterna izquierda/derecha
    const isEven = i % 2 === 0;

    // Nodo contenedor (posición zigzag vía CSS variables)
    const node = document.createElement('div');
    node.className = 'level-node' +
      (isDone    ? ' done'    : '') +
      (isCurrent ? ' current' : '') +
      (isLocked  ? ' locked'  : '');
    node.style.setProperty('--side', isEven ? '1' : '-1');

    node.innerHTML = `
      <div class="level-node-inner">
        <div class="level-bubble">
          <span class="lbubble-emoji">${isDone ? '✅' : isCurrent ? emoji : isLocked ? '🔒' : emoji}</span>
          <span class="lbubble-num">${i + 1}</span>
        </div>
        <div class="level-info">
          <div class="level-info-title">${lv.category}</div>
          <div class="level-info-word">${isLocked ? '🔒 Bloqueado' : lv.main}</div>
          <div class="level-info-stars">
            <span class="lst ${stars>=1?'on':''}">★</span>
            <span class="lst ${stars>=2?'on':''}">★</span>
            <span class="lst ${stars>=3?'on':''}">★</span>
          </div>
        </div>
      </div>
      ${i < LEVELS.length - 1 ? '<div class="level-connector"><span>•••</span></div>' : ''}
    `;

    if(!isLocked){
      node.addEventListener('click', ()=>{
        beep(560, 0.08, 0.15, 'sine');
        $('levelsModal').classList.remove('show');
        loadLevel(i);
      });
    }
    path.appendChild(node);
  });
}

$('levelsCloseBtn').addEventListener('click', ()=>{
  $('levelsModal').classList.remove('show');
  beep(320, 0.05, 0.1);
});

// ── PÉTALOS ──
(function spawnPetals(){
  const container = $('petals');
  for(let i=0;i<14;i++){
    const s = document.createElement('span');
    s.style.cssText = `left:${Math.random()*100}%;--d:${6+Math.random()*10}s;--delay:${-Math.random()*12}s`;
    container.appendChild(s);
  }
})();

// ── NUBES CSS ──
(function spawnClouds(){
  const sizes  = [80,110,140,100,90,130];
  const tops   = [4,9,14,6,11,8];
  const delays = [0,-12,-25,-8,-18,-34];
  const durs   = [55,70,80,65,75,90];
  for(let i=0;i<6;i++){
    const c = document.createElement('div');
    c.className = 'cloud';
    const w = sizes[i];
    c.style.cssText = `
      --w:${w}px;
      --t:${tops[i]}%;
      --l:${-w-20}px;
      --cd:${durs[i]}s;
      --cdelay:${delays[i]}s;
    `;
    document.body.appendChild(c);
  }
})();

// ── PLANTAS DEL CAMPO CSS ──
(function spawnFieldPlants(){
  // Girasoles y flores mezclados
  const emojis = ['🌻','🌻','🌻','🌸','🌼','🌻','🌼','🌻','🌸','🌻','🌼','🌻'];
  const container = document.createElement('div');
  container.className = 'field-plants';
  document.body.appendChild(container);

  const totalPlants = 22;
  for(let i=0;i<totalPlants;i++){
    const p = document.createElement('span');
    p.className = 'plant';
    const pct  = (i / totalPlants) * 100;
    // Plantas más grandes cerca del borde, pequeñas en el horizonte
    const size = 28 + Math.random() * 52;       // 28–80px de alto
    const tsize= Math.max(3, size * 0.05);       // grosor del tallo
    const fsize= Math.max(14, size * 0.45);      // tamaño del emoji
    const sway = (1 + Math.random() * 2).toFixed(1); // grado de balanceo
    const dur  = (4 + Math.random() * 5).toFixed(1); // duración balanceo
    const dly  = (-Math.random() * 5).toFixed(1);
    const emoji= emojis[i % emojis.length];

    p.style.cssText = `
      --pl:${pct + (Math.random()-0.5)*4}%;
      --ph:${size}px;
      --pw:${Math.max(tsize*2, fsize)}px;
      --tw:${tsize}px;
      --fs:${fsize}px;
      --fc:"${emoji}";
      --pa:${sway}deg;
      --ps:${dur}s;
      --pd:${dly}s;
    `;
    container.appendChild(p);
  }
})();

// ── GIRASOLES SVG ──
function makeSunflower(size=48){
  const tpl = $('sfTpl');
  if(!tpl) return null;
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 100 110');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size * 1.1);
  svg.innerHTML = tpl.innerHTML;
  return svg;
}
function seedFlowers(containerId, count=3, size=40){
  const el = $(containerId);
  if(!el) return;
  for(let i=0;i<count;i++){
    const sf = makeSunflower(size);
    if(sf) el.appendChild(sf);
  }
}
seedFlowers('welcomeFlowers', 3, 44);
seedFlowers('doneFlowers', 3, 40);
(function(){
  const lf = $('logoFlower');
  if(!lf) return;
  const sf = makeSunflower(46);
  if(sf) lf.appendChild(sf);
})();

// ══════════════════════════════════════════
//   TUTORIAL
// ══════════════════════════════════════════
const TOTAL_TUT_STEPS = 4;
let tutStep = 0;

function showTutStep(n){
  for(let i=0;i<TOTAL_TUT_STEPS;i++){
    const step = $('tut'+(i+1));
    const dot  = $('dot'+i);
    if(step) step.classList.toggle('active', i===n);
    if(dot)  dot.classList.toggle('active', i===n);
  }
  const btn = $('tutNextBtn');
  if(n === TOTAL_TUT_STEPS - 1){
    btn.textContent = '¡Jugar! 🌻';
    btn.classList.add('finish');
  } else {
    btn.textContent = 'Siguiente →';
    btn.classList.remove('finish');
  }
}

$('tutNextBtn').addEventListener('click', ()=>{
  if(tutStep < TOTAL_TUT_STEPS - 1){
    tutStep++;
    showTutStep(tutStep);
    beep(420, 0.05, 0.1);
  } else {
    const tm = $('tutorialModal');
    tm.style.opacity='0';
    tm.style.transition='opacity .3s';
    setTimeout(()=>{ tm.style.display='none'; tm.classList.remove('show'); }, 320);
    beep(560, 0.1, 0.18, 'sine');
    localStorage.setItem('wg_tutorial_done','1');
  }
});

// ── CARGAR NIVEL ──
function loadLevel(idx){
  levelIdx = idx % LEVELS.length;
  localStorage.setItem('wg_level', levelIdx);
  const lv = LEVELS[levelIdx];

  found = new Set();
  selected = [];
  currentWord = '';
  isDragging = false;
  activePointerId = null;
  ghostActive = false;
  renderWordDisplay('');
  linesEl.innerHTML = '';

  categoryEl.textContent = lv.category.toUpperCase();
  if(sbLevel)     sbLevel.textContent     = `Nivel ${levelIdx+1} / ${LEVELS.length}`;
  if(sbCat)       sbCat.textContent       = lv.category;
  if(sbCuriosity) sbCuriosity.textContent = lv.curiosity;

  // Badge temático en sidebar
  const emojiMap = {
    'Girasoles':'🌻','Abejas':'🐝','Rosas - Té':'🌹','Rosas - Floribunda':'🌸',
    'Rosas - Trepadora':'🌿','Rosas - Miniatura':'🌺','Rosas - Silvestre':'🌱',
    'Polen':'🌼','Jardín':'🍃','Miel':'🍯','Raíces':'🌾','Fotosíntesis':'☀️'
  };
  const topicEmoji = $('sidebar-topic-emoji');
  const topicName  = $('sidebar-topic-name');
  const topicSub   = $('sidebar-topic-sub');
  if(topicEmoji) topicEmoji.textContent = emojiMap[lv.category] || '🌸';
  if(topicName)  topicName.textContent  = lv.category;
  if(topicSub)   topicSub.textContent   = `Nivel ${levelIdx+1} — Palabra: ${lv.main}`;

  // Facts en sidebar
  const factsEl = document.getElementById('sidebar-facts');
  if(factsEl && lv.facts){
    factsEl.innerHTML = lv.facts.map(f=>`<span class="curiosity-fact-pill">${f}</span>`).join('');
  }

  updateProgress();
  buildWordsGrid(lv);
  buildHive(lv);
  scheduleClue();
  lastActionTime = Date.now();
}

// ── GRID DE PALABRAS ──
function buildWordsGrid(lv){
  wordsGrid.innerHTML = '';
  const sorted = [...lv.words].sort((a,b)=>a.length-b.length);
  sorted.forEach(w=>{
    const row = document.createElement('div');
    row.className = 'word-row';
    row.dataset.word = w;
    for(let i=0;i<w.length;i++){
      const slot = document.createElement('div');
      slot.className = 'letter-slot';
      row.appendChild(slot);
    }
    wordsGrid.appendChild(row);
  });
}

// ── PANAL ──
function buildHive(lv){
  hive.innerHTML = '';
  linesEl.innerHTML = '';

  // FIX: No usar Set — conservar letras duplicadas (ej. ABEJA tiene 2×A, MINIATURA tiene 2×I y 2×A)
  const letters = lv.letters.toUpperCase().split('');
  const n = letters.length;

  // Esperar que el DOM haya pintado para obtener tamaño real
  requestAnimationFrame(()=>{
    const wrapSize = hiveWrap.offsetWidth || 300;
    const cx = wrapSize / 2;
    const cy = wrapSize / 2;

    const letterSize = n <= 6 ? 62 : n <= 8 ? 56 : 48;
    const radius     = n <= 6 ? wrapSize * 0.32
                     : n <= 8 ? wrapSize * 0.34
                     : wrapSize * 0.36;
    // Tamaño de fuente: 40% del diámetro del círculo
    const fontSize   = Math.round(letterSize * 0.40);

    letters.forEach((ch, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const x = cx + radius * Math.cos(angle) - letterSize / 2;
      const y = cy + radius * Math.sin(angle) - letterSize / 2;

      const el = document.createElement('div');
      el.className = 'hive-letter';
      el.dataset.letter = ch;
      el.style.cssText = `
        left:${x}px;
        top:${y}px;
        width:${letterSize}px;
        height:${letterSize}px;
        font-size:${fontSize}px;
      `;

      // Span interior: garantiza centrado independientemente del browser
      const span = document.createElement('span');
      span.textContent = ch;
      el.appendChild(span);
      hive.appendChild(el);
    });

    setupPointerEvents();
  });
}

// ══════════════════════════════════════════
//   MECÁNICA DE ARRASTRE — reescrita v3
//   Usa setPointerCapture para robustez en móvil
// ══════════════════════════════════════════
function setupPointerEvents(){
  // Limpiar listeners anteriores clonando el nodo
  const oldWrap = hiveWrap;
  const newWrap = oldWrap.cloneNode(true);
  // Reemplazar en el DOM conservando hive y lines adentro
  oldWrap.parentNode.replaceChild(newWrap, oldWrap);

  // Reasignar referencias a los elementos internos tras el clon
  // (hiveWrap sigue siendo la variable global, pero ahora apunta al nodo nuevo)
  // — hacemos referencia por id para mayor seguridad
  const wrap  = $('hiveWrap');
  const hiveEl= $('hive');
  const linesE= $('lines');

  // Helper: devuelve el .hive-letter bajo el punto (x,y) de pantalla
  function letterAt(x, y){
    const els = document.elementsFromPoint(x, y);
    for(const el of els){
      if(el.classList && el.classList.contains('hive-letter')) return el;
    }
    return null;
  }

  // Helper: centro de un .hive-letter en coordenadas relativas al wrap
  function centerOf(el){
    const wr = wrap.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return {
      x: er.left - wr.left + er.width  / 2,
      y: er.top  - wr.top  + er.height / 2
    };
  }

  // Redibujar las líneas de conexión
  function redrawLines(){
    linesE.innerHTML = '';
    for(let i = 0; i < selected.length - 1; i++){
      const a = centerOf(selected[i]);
      const b = centerOf(selected[i+1]);
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
      line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
      linesE.appendChild(line);
    }
  }

  function addLetter(el){
    if(selected.includes(el)) return; // ya está → no duplicar
    // Limpiar letras fantasma en cuanto el usuario toca la primera letra
    clearGhostIfActive();
    selected.push(el);
    el.classList.add('active');
    currentWord += el.dataset.letter;
    wordDisplay.style.background = '';
    wordDisplay.style.borderColor = '';
    renderWordDisplay(currentWord);
    beep(380 + selected.length * 35, 0.05, 0.1);
    resetClueTimer();
    lastActionTime = Date.now();
  }

  function clearSel(){
    selected.forEach(s => s.classList.remove('active'));
    selected = [];
    currentWord = '';
    renderWordDisplay('');
    linesE.innerHTML = '';
  }

  // ── pointerdown ──
  wrap.addEventListener('pointerdown', function(e){
    e.preventDefault();
    // Capturar el puntero para recibir move/up aunque salga del elemento
    try{ wrap.setPointerCapture(e.pointerId); }catch(_){}

    isDragging = true;
    activePointerId = e.pointerId;
    clearSel();
    wordDisplay.classList.remove('error');

    const t = letterAt(e.clientX, e.clientY);
    if(t) addLetter(t);
    redrawLines();
    lastActionTime = Date.now();
  }, {passive:false});

  // ── pointermove ──
  wrap.addEventListener('pointermove', function(e){
    if(!isDragging || e.pointerId !== activePointerId) return;
    e.preventDefault();

    const t = letterAt(e.clientX, e.clientY);
    if(t && !selected.includes(t)){
      addLetter(t);
      redrawLines();
    }
    lastActionTime = Date.now();
  }, {passive:false});

  // ── pointerup / pointercancel ──
  function onUp(e){
    if(!isDragging || e.pointerId !== activePointerId) return;
    isDragging = false;
    activePointerId = null;
    try{ wrap.releasePointerCapture(e.pointerId); }catch(_){}

    if(currentWord.length >= 2){
      submitWord();
    } else {
      clearSel();
    }
    lastActionTime = Date.now();
  }
  wrap.addEventListener('pointerup',     onUp, {passive:false});
  wrap.addEventListener('pointercancel', onUp, {passive:false});
}

// ── ENVIAR PALABRA ──
function submitWord(){
  const w = currentWord.toUpperCase();
  const lv = LEVELS[levelIdx];

  if(lv.words.includes(w) && !found.has(w)){
    found.add(w);
    fillWordRow(w);
    coins += 10;
    coinsEl.textContent = coins;
    localStorage.setItem('wg_coins', coins);
    beep(700, 0.1, 0.2, 'triangle');
    showPopup(w === lv.main ? '¡PALABRA CLAVE! 🌻' : '¡BIEN! 🌸');
    updateProgress();
    if(found.size === lv.words.length){
      setTimeout(showLevelDone, 1000);
    }
  } else if(found.has(w)){
    wordDisplay.classList.add('error');
    beep(200, 0.12, 0.2, 'square');
    showPopup('Ya encontrada 😄');
    setTimeout(()=>wordDisplay.classList.remove('error'), 600);
  } else {
    wordDisplay.classList.add('shake','error');
    beep(160, 0.15, 0.2, 'square');
    if(navigator.vibrate) navigator.vibrate(80);
    setTimeout(()=>wordDisplay.classList.remove('shake','error'), 400);
  }

  // Limpiar selección con pequeño delay para que el usuario vea el feedback
  setTimeout(()=>{
    const letters = document.querySelectorAll('.hive-letter');
    letters.forEach(l => l.classList.remove('active'));
    selected = [];
    currentWord = '';
    renderWordDisplay('');
    $('lines').innerHTML = '';
  }, 120);

  resetClueTimer();
  lastActionTime = Date.now();
}

// ── RELLENAR FILA ──
function fillWordRow(w){
  const rows = wordsGrid.querySelectorAll('.word-row');
  let row = null;
  rows.forEach(r => { if(r.dataset.word === w) row = r; });
  if(!row) return;
  const slots = row.querySelectorAll('.letter-slot');
  for(let i = 0; i < slots.length; i++){
    (function(slot, ch, delay){
      setTimeout(()=>{
        slot.textContent = ch;
        slot.classList.add('filled');
        beep(560 + i * 22, 0.04, 0.09);
      }, delay);
    })(slots[i], w[i], i * 65);
  }
}

// ── PROGRESO ──
function updateProgress(){
  const lv = LEVELS[levelIdx];
  const pct = lv.words.length ? (found.size / lv.words.length) * 100 : 0;
  progressFill.style.width = pct + '%';
  progressLabel.textContent = `${found.size} / ${lv.words.length}`;
}

// ── POPUP ──
function showPopup(txt){
  superPopup.textContent = txt;
  superPopup.classList.remove('show');
  void superPopup.offsetWidth;
  superPopup.classList.add('show');
  setTimeout(()=>superPopup.classList.remove('show'), 900);
}

// ── NIVEL COMPLETADO ──
function showLevelDone(){
  const lv = LEVELS[levelIdx];

  // Guardar progreso unificado (compatible con mapa)
  const prog = JSON.parse(localStorage.getItem('wg_progress_v1') || '{}');
  prog.stars   = prog.stars || {};
  prog.stars[levelIdx + 1] = 3;
  prog.unlocked = Math.max(prog.unlocked || 1, levelIdx + 2);
  prog.lastLevel = levelIdx + 1;
  localStorage.setItem('wg_progress_v1', JSON.stringify(prog));
  // También guardar lista vieja
  const completed = JSON.parse(localStorage.getItem('wg_completed') || '[]');
  if(!completed.includes(levelIdx)) completed.push(levelIdx);
  localStorage.setItem('wg_completed', JSON.stringify(completed));
  localStorage.setItem('wg_level', levelIdx);

  // Emoji del nivel según categoría
  const emojiMap = {
    'Girasoles':'🌻','Abejas':'🐝','Rosas - Té':'🌹','Rosas - Floribunda':'🌸',
    'Rosas - Trepadora':'🌿','Rosas - Miniatura':'🌺','Rosas - Silvestre':'🌱',
    'Polen':'🌼','Jardín':'🍃','Miel':'🍯','Raíces':'🌾','Fotosíntesis':'☀️'
  };
  const emoji = emojiMap[lv.category] || '🌻';

  // Rellenar modal
  const celebEl = $('celebEmoji');
  if(celebEl) celebEl.textContent = emoji;

  const subEl = $('celebSubtitle');
  if(subEl) subEl.textContent = `¡Aprendiste sobre ${lv.category}! 🎉`;

  // Frase botánica del nivel
  const phraseEl = $('celebSharePhrase');
  if(phraseEl) phraseEl.textContent = lv.sharePhrase || '';

  const textEl = $('doneCuriosityText');
  if(textEl) textEl.textContent = lv.curiosity;

  const factsEl = $('doneCuriosityFacts');
  if(factsEl && lv.facts){
    factsEl.innerHTML = lv.facts.map(f=>`<span class="curiosity-fact-pill">${f}</span>`).join('');
  }

  // Confetti con emojis del nivel
  const confettiEl = $('celebConfetti');
  if(confettiEl){
    const flowers = ['🌸','🌻','🌺','🌼','🌷','🌿','🍀','✨'];
    confettiEl.textContent = Array.from({length:6},()=>flowers[Math.floor(Math.random()*flowers.length)]).join('');
  }

  $('levelDoneModal').classList.add('show');
  beep(800, 0.08, 0.2, 'sine');
  setTimeout(()=>beep(1000, 0.1, 0.2, 'sine'), 220);
  setTimeout(()=>beep(1200, 0.1, 0.2, 'sine'), 440);
}

$('nextLevelBtn').onclick = function(){
  $('levelDoneModal').classList.remove('show');
  loadLevel(levelIdx + 1);
};

// ── COMPARTIR — tarjeta botánica bonita por nivel ──
const shareBtnEl = $('celebShareBtn');
if(shareBtnEl){
  shareBtnEl.onclick = async function(){
    const lv = LEVELS[levelIdx];
    const emojiMap = {
      'Girasoles':'🌻','Abejas':'🐝','Rosas - Té':'🌹','Rosas - Floribunda':'🌸',
      'Rosas - Trepadora':'🌿','Rosas - Miniatura':'🌺','Rosas - Silvestre':'🌱',
      'Polen':'🌼','Jardín':'🍃','Miel':'🍯','Raíces':'🌾','Fotosíntesis':'☀️'
    };
    const emoji = emojiMap[lv.category] || '🌻';

    // Texto bonito para compartir
    const shareText =
`🌻 WORD GIRASOL — Nivel ${levelIdx+1}
${emoji} ${lv.category.toUpperCase()}

"${lv.sharePhrase}"

📚 Aprendí: ${lv.curiosity}

🌿 Palabras encontradas: ${lv.words.join(' · ')}
⭐⭐⭐ ¡Nivel completado con 3 estrellas!

¡Juega y aprende botánica conmigo! 🌻`;

    // Intentar generar imagen con Canvas
    try {
      const canvas = await buildShareCanvas(lv, levelIdx, emoji);
      if(canvas){
        canvas.toBlob(async (blob)=>{
          if(!blob){ fallbackShare(shareText); return; }
          try {
            const file = new File([blob], 'word-girasol-nivel'+(levelIdx+1)+'.png', {type:'image/png'});
            if(navigator.canShare && navigator.canShare({files:[file]})){
              await navigator.share({ files:[file], title:'Word Girasol', text:shareText });
            } else if(navigator.share){
              await navigator.share({ title:'Word Girasol', text:shareText });
            } else {
              // Descargar imagen
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = 'word-girasol-nivel'+(levelIdx+1)+'.png';
              a.click();
              navigator.clipboard.writeText(shareText).catch(()=>{});
              shareBtnEl.textContent = '✅ ¡Copiado!';
              setTimeout(()=>{ shareBtnEl.textContent = '📤 Compartir mi logro'; }, 2500);
            }
          } catch(e){ fallbackShare(shareText); }
        }, 'image/png');
        return;
      }
    } catch(e){}
    fallbackShare(shareText);
  };
}

function fallbackShare(text){
  if(navigator.share){
    navigator.share({title:'Word Girasol', text}).catch(()=>{});
  } else {
    navigator.clipboard.writeText(text).then(()=>{
      const btn = $('celebShareBtn');
      if(btn){ btn.textContent='✅ ¡Copiado!'; setTimeout(()=>{ btn.textContent='📤 Compartir mi logro'; },2500); }
    }).catch(()=>{});
  }
}

// Genera una tarjeta imagen 600×400 con Canvas
async function buildShareCanvas(lv, idx, emoji){
  const W=600, H=400;
  const canvas = document.createElement('canvas');
  canvas.width=W; canvas.height=H;
  const ctx = canvas.getContext('2d');

  // Degradado fondo según categoría
  const bgColors = {
    'Girasoles':['#1a3c00','#4a7c10'],'Abejas':['#3a1a00','#7c4a10'],
    'Rosas - Té':['#3a0018','#8c1040'],'Rosas - Floribunda':['#2a0030','#6c1060'],
    'Rosas - Trepadora':['#0a2800','#2c6020'],'Rosas - Miniatura':['#3a0028','#901050'],
    'Rosas - Silvestre':['#0a2210','#224c20'],'Polen':['#2a1a00','#6a4c00'],
    'Jardín':['#0a2200','#285020'],'Miel':['#2a1400','#7a4400'],
    'Raíces':['#1a0c00','#4a2c00'],'Fotosíntesis':['#1a1000','#5a3800']
  };
  const [c1,c2] = bgColors[lv.category] || ['#0a1a00','#1a4010'];
  const grad = ctx.createLinearGradient(0,0,W,H);
  grad.addColorStop(0, c1); grad.addColorStop(1, c2);
  ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);

  // Borde decorativo
  ctx.strokeStyle='rgba(253,230,138,0.4)'; ctx.lineWidth=3;
  ctx.strokeRect(10,10,W-20,H-20);
  ctx.strokeStyle='rgba(253,230,138,0.15)'; ctx.lineWidth=1;
  ctx.strokeRect(15,15,W-30,H-30);

  // Logo + título "WORD GIRASOL"
  ctx.font='900 28px "Nunito",sans-serif';
  ctx.fillStyle='#fde68a';
  ctx.textAlign='center';
  ctx.fillText('🌻 WORD GIRASOL', W/2, 56);

  // Subtítulo nivel
  ctx.font='800 15px "Nunito",sans-serif';
  ctx.fillStyle='rgba(253,230,138,0.75)';
  ctx.fillText(`Nivel ${idx+1} · ${lv.category.toUpperCase()}`, W/2, 80);

  // Separador
  ctx.strokeStyle='rgba(253,230,138,0.3)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(60,95); ctx.lineTo(W-60,95); ctx.stroke();

  // Emoji grande del nivel
  ctx.font='64px serif';
  ctx.textAlign='center';
  ctx.fillText(emoji, W/2, 168);

  // Frase botánica
  const phrase = lv.sharePhrase;
  ctx.font='italic 800 17px "Nunito",sans-serif';
  ctx.fillStyle='#fef9e0';
  wrapText(ctx, `"${phrase}"`, W/2, 210, W-80, 26);

  // Dato curioso (más pequeño)
  ctx.font='700 13px "Nunito",sans-serif';
  ctx.fillStyle='rgba(253,230,138,0.8)';
  const shortCuriosity = lv.curiosity.length > 95
    ? lv.curiosity.substring(0,92) + '…'
    : lv.curiosity;
  wrapText(ctx, shortCuriosity, W/2, 308, W-80, 20);

  // Separador inferior
  ctx.strokeStyle='rgba(253,230,138,0.25)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(60,355); ctx.lineTo(W-60,355); ctx.stroke();

  // Footer
  ctx.font='700 12px "Nunito",sans-serif';
  ctx.fillStyle='rgba(253,230,138,0.55)';
  ctx.textAlign='center';
  ctx.fillText('¡Aprende botánica jugando con Word Girasol! 🌿', W/2, 378);

  return canvas;
}

// Helper: texto con salto de línea automático
function wrapText(ctx, text, x, y, maxW, lineH){
  const words = text.split(' ');
  let line = '';
  let cy = y;
  for(const word of words){
    const test = line ? line+' '+word : word;
    if(ctx.measureText(test).width > maxW && line){
      ctx.textAlign='center';
      ctx.fillText(line, x, cy);
      line = word; cy += lineH;
    } else { line = test; }
  }
  if(line) ctx.fillText(line, x, cy);
}

// ── PISTAS AUTOMÁTICAS — 45 min de inactividad ──
const CLUE_DELAY = 45 * 60 * 1000; // 45 minutos

// ghostActive: true cuando las letras fantasma están visibles en word-display
let ghostActive = false;

function scheduleClue(){
  clearTimeout(clueTimer);
  clueTimer = setTimeout(showAutoClue, CLUE_DELAY);
}

function resetClueTimer(){
  clearTimeout(clueTimer);
  clueTimer = setTimeout(showAutoClue, CLUE_DELAY);
}

// Llámalo cuando el usuario empieza a seleccionar letras
function clearGhostIfActive(){
  if(!ghostActive) return;
  ghostActive = false;
  if(!currentWord){
    wordDisplay.innerHTML = '';
    wordDisplay.style.background = '';
    wordDisplay.style.borderColor = '';
  }
}

function showAutoClue(){
  const lv = LEVELS[levelIdx];
  if(found.has(lv.main)) return; // ya encontró la clave
  // Letras fantasma en word-display — SE QUEDAN hasta que el usuario escriba
  if(!currentWord && !ghostActive){
    ghostActive = true;
    wordDisplay.innerHTML = lv.main.split('').map(ch =>
      `<span class="wd-letter wd-ghost">${ch}</span>`
    ).join('');
    wordDisplay.style.background = '';
    wordDisplay.style.borderColor = '';
  }
  // Pista flotante — desaparece sola a los 12 seg pero las letras fantasma quedan
  clueText.innerHTML = `💡 <strong>Pista:</strong> ${lv.clue}<br><span class="clue-note-close">Toca para cerrar</span>`;
  clueNote.classList.add('show');
  clueVisible = true;
  beep(560, 0.05, 0.1, 'sine');
  setTimeout(()=>{
    clueNote.classList.remove('show');
    clueVisible = false;
  }, 12000);
}

function hideClue(){
  clueNote.classList.remove('show');
  clueVisible = false;
  clearTimeout(clueTimer);
  clueTimer = setTimeout(showAutoClue, CLUE_DELAY);
}

clueNote.addEventListener('click', ()=>{
  hideClue();
  lastActionTime = Date.now();
});

// Revisar inactividad cada minuto
setInterval(()=>{
  const idleMs = Date.now() - lastActionTime;
  if(idleMs >= CLUE_DELAY && !ghostActive && !isDragging){
    showAutoClue();
  }
}, 60 * 1000);

// ── BOTONES ──
$('shuffleBtn').onclick = function(){
  const lv = LEVELS[levelIdx];
  lv.letters = lv.letters.split('').sort(()=>Math.random()-.5).join('');
  buildHive(lv);
  beep(300, 0.06, 0.1);
  lastActionTime = Date.now();
};

$('deleteBtn').onclick = function(){
  const letters = document.querySelectorAll('.hive-letter');
  letters.forEach(l => l.classList.remove('active'));
  selected = [];
  currentWord = '';
  renderWordDisplay('');
  $('lines').innerHTML = '';
  beep(240, 0.05, 0.1);
  lastActionTime = Date.now();
};

$('submitBtn').onclick = function(){
  if(currentWord.length >= 2) submitWord();
  lastActionTime = Date.now();
};

// ── PISTA MANUAL ──
// Lógica: elige la mejor palabra sin encontrar y revela su siguiente letra vacía.
// Prioridad: 1) palabras cortas pendientes (las más fáciles primero para animar),
//            2) la palabra clave si ya se encontraron las demás.
// Además muestra el panel "¿Qué palabra te falta?" con reveal lento letra a letra.
$('hintBtn').onclick = function(){
  if(coins < 15){
    showPopup('Sin monedas 😅');
    beep(150, 0.15);
    return;
  }
  const lv = LEVELS[levelIdx];

  // Elegir target: primero palabras cortas no encontradas (excl. main), si no hay → main
  const pending = lv.words.filter(w => !found.has(w));
  if(!pending.length){ showPopup('¡Ya las tienes todas! 🌻'); return; }

  // Preferir la más corta que no sea la principal; si solo queda la principal úsala
  const shorts = pending.filter(w => w !== lv.main).sort((a,b)=>a.length-b.length);
  const target = shorts.length ? shorts[0] : lv.main;

  // Encontrar el slot vacío más a la izquierda en esa fila
  const rows = wordsGrid.querySelectorAll('.word-row');
  let row = null;
  rows.forEach(r=>{ if(r.dataset.word === target) row = r; });
  if(!row){ showPopup('¡Ya casi! 🌻'); return; }

  const slots = row.querySelectorAll('.letter-slot');
  // Contar cuántas están ya reveladas (filled O hint-slot)
  let firstEmpty = -1;
  for(let i=0;i<slots.length;i++){
    if(!slots[i].textContent.trim()){ firstEmpty=i; break; }
  }
  if(firstEmpty === -1){
    // Esta palabra ya estaba llena de pistas — pasar a la siguiente
    showPopup('¡Esa ya la tienes! 🌻');
    return;
  }

  // Cobrar y revelar
  coins -= 15; coinsEl.textContent = coins;
  localStorage.setItem('wg_coins', coins);

  slots[firstEmpty].textContent = target[firstEmpty];
  slots[firstEmpty].classList.add('hint-slot');
  beep(780, 0.1);
  showPopup(`Pista en "${target}" 🌻`);
  hideClue();

  // Mostrar panel "palabra que te falta" con reveal lento
  showWordHintPanel(target, pending);
  lastActionTime = Date.now();
};

// ── PANEL PISTA DE PALABRA FALTANTE ──
// Efecto typewriter mágico: las letras se "descubren" una a una como magia
// Tiempo de lectura generoso para que el usuario lo asimile bien
let wordHintTimers = [];
function showWordHintPanel(target, pending){
  const panel = $('wordHintPanel');
  const titleEl = $('whpTitle');
  const lettersEl = $('whpLetters');
  const countEl = $('whpCount');
  if(!panel || !lettersEl) return;

  // Limpiar timers anteriores
  wordHintTimers.forEach(clearTimeout);
  wordHintTimers = [];

  // Ocultar panel si estaba visible, luego mostrar nuevo
  panel.classList.remove('show');

  // Título dinámico
  if(titleEl) titleEl.innerHTML = pending.length > 1
    ? `Te faltan <strong>${pending.length}</strong> palabras 🌿`
    : `¡Solo falta esta! 🌻`;
  if(countEl) countEl.textContent = `"${target}" — ${target.length} letra${target.length>1?'s':''}`;

  // Construir fichas vacías con ? y estilo misterioso
  lettersEl.innerHTML = target.split('').map((ch,i)=>
    `<span class="whp-letter whp-mystery" id="whpL${i}">✦</span>`
  ).join('');

  // Pequeño delay para que se vea el panel aparecer primero
  const t0 = setTimeout(()=>{
    panel.classList.add('show');
    beep(320, 0.06, 0.18, 'sine'); // sonido de apertura misterioso
  }, 80);
  wordHintTimers.push(t0);

  // Revelar letra por letra — 420ms entre cada una (más dramático)
  const LETTER_DELAY = 420;
  const START_OFFSET = 600; // esperar que abra el panel

  target.split('').forEach((ch, i) => {
    const t = setTimeout(()=>{
      const el = $(`whpL${i}`);
      if(el){
        el.classList.remove('whp-mystery');
        el.textContent = ch;
        el.classList.add('revealed');
        // Escala de tonos ascendente para cada letra
        const note = 380 + i * 45;
        beep(note, 0.05, 0.12, 'sine');
      }
    }, START_OFFSET + i * LETTER_DELAY);
    wordHintTimers.push(t);
  });

  // Tiempo total de reveal + tiempo generoso de lectura (3s por defecto + 0.8s por letra)
  const readTime = 3000 + target.length * 800;
  const totalVisible = START_OFFSET + target.length * LETTER_DELAY + readTime;

  const tClose = setTimeout(()=>{
    panel.classList.remove('show');
  }, totalVisible);
  wordHintTimers.push(tClose);
}

$('whpCloseBtn') && $('whpCloseBtn').addEventListener('click', ()=>{
  $('wordHintPanel').classList.remove('show');
  wordHintTimers.forEach(clearTimeout);
  wordHintTimers = [];
});

// ── TECLADO ──
window.addEventListener('keydown', e => {
  if(e.key === 'Enter')                          { if(currentWord.length >= 2) submitWord(); }
  if(e.key === 'Escape' || e.key === 'Backspace'){ $('deleteBtn').onclick(); }
  lastActionTime = Date.now();
});

// ── BIENVENIDA ──
$('welcomePlayBtn').onclick = function(){
  const modal = $('welcomeModal');
  modal.style.opacity = '0';
  modal.style.transition = 'opacity .35s';
  beep(560, 0.1, 0.18, 'sine');
  setTimeout(()=>{
    modal.style.display='none';
    const tutDone = localStorage.getItem('wg_tutorial_done');
    if(!tutDone){
      tutStep = 0;
      showTutStep(0);
      $('tutorialModal').classList.add('show');
      $('tutorialModal').style.display = 'grid';
    }
  }, 380);
};

// ── INIT ──
(function init(){
  coinsEl.textContent = coins;
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      loadLevel(levelIdx);
    });
  });
  $('welcomeModal').style.display = 'grid';
  $('tutorialModal').style.display = 'none';
})();

// ══════════════════════════════════════════
//   MAPA DE NIVELES — openLevelsModal
// ══════════════════════════════════════════

function openLevelsModal(){
  buildLevelsPath();
  $('levelsModal').classList.add('show');
  setTimeout(()=>{
    const cur = $('levelsModal').querySelector('.level-node.current');
    if(cur) cur.scrollIntoView({block:'center', behavior:'smooth'});
  }, 150);
}

// ── Botón cerrar mapa ──
$('levelsCloseBtn').addEventListener('click', ()=>{
  $('levelsModal').classList.remove('show');
  beep(320, 0.05, 0.1);
});

// ── Botón 🗺️ directo en logo ──
const mapQuickBtn = $('mapQuickBtn');
if(mapQuickBtn){
  mapQuickBtn.addEventListener('click', ()=>{
    beep(420, 0.07, 0.14, 'sine');
    openLevelsModal();
  });
}

// ── Botón 🏠 → abre menú de inicio ──
homeBtn.addEventListener('click', ()=>{
  beep(420, 0.06, 0.12, 'sine');
  openHomeMenu();
});

function openHomeMenu(){
  seedFlowers('homeMenuFlowers', 3, 40);
  updateSoundMenuBtn();
  $('homeMenuModal').classList.add('show');
}

$('hmPlayBtn').addEventListener('click', ()=>{
  beep(560, 0.1, 0.18, 'sine');
  $('homeMenuModal').classList.remove('show');
});

$('hmMapBtn').addEventListener('click', ()=>{
  beep(420, 0.07, 0.14, 'sine');
  $('homeMenuModal').classList.remove('show');
  openLevelsModal();
});

$('hmSoundBtn').addEventListener('click', ()=>{
  soundOn = !soundOn;
  localStorage.setItem('wg_sound', soundOn ? 'on' : 'off');
  updateVolumeBtn();
  updateSoundMenuBtn();
  if(soundOn) beep(560, 0.1, 0.15, 'sine');
});

$('hmCloseBtn').addEventListener('click', ()=>{
  beep(320, 0.05, 0.1);
  $('homeMenuModal').classList.remove('show');
});

function updateSoundMenuBtn(){
  const btn = $('hmSoundBtn');
  if(!btn) return;
  btn.innerHTML = soundOn
    ? '<span class="hm-icon">🔊</span><span>Sonido activado</span>'
    : '<span class="hm-icon">🔇</span><span>Sonido silenciado</span>';
}
updateSoundMenuBtn();

// ── BOTÓN EMPEZAR DE NUEVO ──
$('hmRestartBtn') && $('hmRestartBtn').addEventListener('click', ()=>{
  // Confirmar con el usuario antes de borrar todo
  const confirmModal = document.createElement('div');
  confirmModal.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    display:flex;align-items:center;justify-content:center;
    background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);
  `;
  confirmModal.innerHTML = `
    <div style="
      background:linear-gradient(135deg,#1a3c00,#2d5a0e);
      border:2px solid #fde68a;border-radius:20px;
      padding:28px 32px;max-width:320px;text-align:center;
      box-shadow:0 8px 40px rgba(0,0,0,0.5);
      font-family:'Nunito',sans-serif;color:#fef9e0;
    ">
      <div style="font-size:48px;margin-bottom:8px">🌱</div>
      <h3 style="font-size:20px;font-weight:900;color:#fde68a;margin:0 0 10px">¿Empezar de nuevo?</h3>
      <p style="font-size:14px;margin:0 0 20px;opacity:0.85;line-height:1.5">
        Se borrará todo tu progreso:<br>niveles, monedas y estrellas.
      </p>
      <div style="display:flex;gap:12px;justify-content:center">
        <button id="confirmRestartYes" style="
          background:#dc2626;color:white;border:none;border-radius:12px;
          padding:10px 22px;font-size:15px;font-weight:800;cursor:pointer;
          font-family:'Nunito',sans-serif;
        ">🔄 Sí, reiniciar</button>
        <button id="confirmRestartNo" style="
          background:#16a34a;color:white;border:none;border-radius:12px;
          padding:10px 22px;font-size:15px;font-weight:800;cursor:pointer;
          font-family:'Nunito',sans-serif;
        ">✕ Cancelar</button>
      </div>
    </div>
  `;
  document.body.appendChild(confirmModal);

  confirmModal.querySelector('#confirmRestartNo').onclick = ()=>{
    document.body.removeChild(confirmModal);
    beep(320, 0.05, 0.1);
  };
  confirmModal.querySelector('#confirmRestartYes').onclick = ()=>{
    // Borrar todo el progreso
    localStorage.removeItem('wg_level');
    localStorage.removeItem('wg_coins');
    localStorage.removeItem('wg_completed');
    localStorage.removeItem('wg_stars');
    localStorage.removeItem('wg_progress_v1');
    localStorage.removeItem('wg_tutorial_done');
    document.body.removeChild(confirmModal);
    $('homeMenuModal').classList.remove('show');
    // Reiniciar estado en memoria
    coins = 150;
    coinsEl.textContent = coins;
    // Volver al nivel 0 y mostrar bienvenida
    levelIdx = 0;
    loadLevel(0);
    // Mostrar modal de bienvenida
    const wm = $('welcomeModal');
    if(wm){ wm.style.display='grid'; wm.style.opacity='1'; wm.style.transition=''; }
    beep(560, 0.1, 0.2, 'sine');
    setTimeout(()=>beep(800, 0.08, 0.2, 'sine'), 220);
  };
});
