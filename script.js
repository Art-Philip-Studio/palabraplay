/* ============================================================
   PalabraPlay — script.js
   Wordle Español + Ahorcado + Sopa de Letras
   ============================================================ */

/* ──────────────────────────────────────────────────────────
   DATOS COMPARTIDOS
────────────────────────────────────────────────────────── */

const WORDLE_WORDS = [
  "CAMPO","CLIMA","LIBRO","JUEGO","PLAYA","SAUCE","TIGRE","MUNDO","CIELO","DULCE",
  "CARTA","FERIA","GRAMO","HEROE","ISLAD","JAMON","KARMA","LLAVE","MANGO","NOCHE",
  "OPACO","PIANO","QUESO","RADIO","SABOR","TECHO","UMBRA","VALOR","XENIA","YERBA",
  "ZARPA","BOSCO","CANOA","DATOS","ESPAD","FLORE","GLOBO","HURTO","INDIO","JEWEL",
  "KARATE","LAZOS","MANSO","NOBLE","OFREN","PABLO","QUEJA","ROCIO","SALUD","TUMOR",
  "ADOBE","BURLA","CALDO","DANZO","ERROR","FUNDA","GALLO","HIELO","IMPAR","JAULA",
  "KIOSK","LARGO","MENTA","NORTE","OVEJA","PARED","QUERO","RUEDA","SIGLO","TABLA",
  "URBAN","VINOS","WISKEY","XIFOS","YUNTA","ZAPATO","ALAMO","BARON","CEBRA","DISCO",
  "ELOTE","FUEGO","GUISO","HABLO","IDEAL","JURAR","LAURO","MAIZ","NUEVE","OBRAS",
  "POLVO","QUILO","RECTO","SILBA","TINTO","URDIO","VIAJE","WAFLE","XENON","ZAFRA",
  "ARENA","BESOS","CIMAS","DUELO","EMPRE","FISCO","GOLPE","HEBRA","IMPOS","JUBIL",
  "LIMON","MALVA","NARDO","OCASO","PAUSA","RALLY","SABIA","TURBA","UVULA","VACAS",
  "YEDRA","ZUMO","BALSA","CLAVO","DEPOT","EMBUS","FLETE","GRIPE","HOYOS","INTRO",
  "JUNTA","LLANO","MOROS","NEGRO","ORINA","PINTO","QUESO","RAMOS","SEMEN","TORTA",
  "USURA","VELLO","XISTO","YATES","ZAFIO","ACEBO","BARRO","CINZA","DUNAS","EGIDO"
];

const WORDLE_VALID = new Set([...WORDLE_WORDS,
  "ANTES","BUENO","COMER","DECIR","ESTAR","HACER","JUGAR","LETRA","METER","NOTAR",
  "PODER","QUEDA","SABER","TENER","USUAL","VENIR","YAZCA","ZORRA","ABRIR","BAJAR",
  "CAER","DEBER","ECHAR","FALLAR","GANAR","HABLAR","IGUAL","JUZGAR","LLEGAR","METER",
  "NACER","OFRECER","PASAR","QUERER","REIR","SALIR","TOMAR","UNIR","VOLAR","YACER",
  "ANDAR","BOTAR","CORTA","DEJAR","ENTRA","FORMA","GIRAR","HUNDIR","IRSE","JUNTO"
]);

const AHORCADO_DATA = {
  easy: ["GATO","PERRO","PATO","LOBO","RATA","SAPO","TORO","PUMA","LINCE","CIERVO","ARDILLA","AGUILA","BURRO","CABRA","CERDO"],
  medium: ["TIGRE","ELEFANTE","JIRAFA","PINGÜINO","DELFIN","COCODRILO","CAMELLO","CANGREJO","ESCORPION","MEDUSA","PULPO","TARÁNTULA","TORTUGA","FAISÁN","PERDIZ"],
  hard: ["ORNITORRINCO","AXOLOTE","EQUIDNA","VAMPIRO","MANTARRAYA","ANACOONDA","QUETZAL","CACHALOTE","OKAPI","TARSERO","PANGOLIN","CAPIBARA","TAPIR","COYPU","NARVAL"]
};

const SOPA_THEMES = {
  animales: { words:["GATO","PERRO","TIGRE","LOBO","AGUILA","SERPIENTE","DELFIN","ELEFANTE","PANDA","KOALA"], size:12 },
  colores:  { words:["ROJO","AZUL","VERDE","NEGRO","BLANCO","AMARILLO","MORADO","NARANJA","ROSADO","GRIS"], size:12 },
  paises:   { words:["ECUADOR","CHILE","PERU","BRASIL","COLOMBIA","ARGENTINA","MEXICO","ESPAÑA","CUBA","PANAMA"], size:14 },
  comida:   { words:["ARROZ","PIZZA","TACOS","SUSHI","PASTA","CEVICHE","EMPANADA","HAMBUR","HELADO","JUGOS"], size:12 }
};

/* ──────────────────────────────────────────────────────────
   W O R D L E
────────────────────────────────────────────────────────── */
let wState = { word:'', guesses:[], current:'', row:0, done:false };

function initWordle(){
  wState.word = WORDLE_WORDS[Math.floor(Math.random()*WORDLE_WORDS.length)].toUpperCase();
  wState.guesses = [];
  wState.current = '';
  wState.row = 0;
  wState.done = false;
  buildWordleGrid();
  buildWordleKeyboard();
  setWordleMsg('');
}

function buildWordleGrid(){
  const g = document.getElementById('wordle-grid');
  if(!g) return;
  g.innerHTML = '';
  for(let r=0;r<6;r++){
    const row = document.createElement('div');
    row.className = 'wordle-row';
    row.id = `wrow-${r}`;
    for(let c=0;c<5;c++){
      const cell = document.createElement('div');
      cell.className = 'wordle-cell';
      cell.id = `wcell-${r}-${c}`;
      row.appendChild(cell);
    }
    g.appendChild(row);
  }
}

function buildWordleKeyboard(){
  const kb = document.getElementById('wordle-keyboard');
  if(!kb) return;
  const rows = ['QWERTYUIOP','ASDFGHJKLÑ','ZXCVBNM'];
  kb.innerHTML = '';
  rows.forEach((row,ri)=>{
    const rowEl = document.createElement('div');
    rowEl.className = 'wordle-kb-row';
    if(ri===2){
      const enter = document.createElement('button');
      enter.className='wordle-key wordle-key-wide';
      enter.textContent='↵';
      enter.onclick=()=>wSubmit();
      rowEl.appendChild(enter);
    }
    [...row].forEach(l=>{
      const btn = document.createElement('button');
      btn.className='wordle-key';
      btn.textContent=l;
      btn.id=`wkey-${l}`;
      btn.onclick=()=>wType(l);
      rowEl.appendChild(btn);
    });
    if(ri===2){
      const del = document.createElement('button');
      del.className='wordle-key wordle-key-wide';
      del.textContent='⌫';
      del.onclick=()=>wDelete();
      rowEl.appendChild(del);
    }
    kb.appendChild(rowEl);
  });
}

function wType(l){
  if(wState.done || wState.current.length>=5) return;
  wState.current += l;
  const c = document.getElementById(`wcell-${wState.row}-${wState.current.length-1}`);
  if(c){ c.textContent=l; c.classList.add('wordle-cell-filled'); }
}

function wDelete(){
  if(wState.done || !wState.current.length) return;
  const c = document.getElementById(`wcell-${wState.row}-${wState.current.length-1}`);
  if(c){ c.textContent=''; c.classList.remove('wordle-cell-filled'); }
  wState.current = wState.current.slice(0,-1);
}

function wSubmit(){
  if(wState.done) return;
  if(wState.current.length<5){ setWordleMsg('⚠️ Escribe 5 letras'); return; }
  if(!WORDLE_VALID.has(wState.current) && !WORDLE_WORDS.includes(wState.current)){
    setWordleMsg('❌ Palabra no válida'); return;
  }

  const guess = wState.current;
  const target = wState.word;
  const result = Array(5).fill('absent');
  const used = Array(5).fill(false);
  const targetLeft = [...target];

  // correct pass
  for(let i=0;i<5;i++){
    if(guess[i]===target[i]){ result[i]='correct'; targetLeft[i]='*'; used[i]=true; }
  }
  // present pass
  for(let i=0;i<5;i++){
    if(result[i]==='correct') continue;
    const idx = targetLeft.indexOf(guess[i]);
    if(idx!==-1){ result[i]='present'; targetLeft[idx]='*'; }
  }

  // render row with flip
  for(let i=0;i<5;i++){
    const cell = document.getElementById(`wcell-${wState.row}-${i}`);
    if(!cell) continue;
    setTimeout(()=>{
      cell.classList.add('wordle-flip');
      setTimeout(()=>{ cell.setAttribute('data-state',result[i]); }, 250);
    }, i*80);
    // update keyboard
    const key = document.getElementById(`wkey-${guess[i]}`);
    if(key){
      const cur = key.getAttribute('data-state');
      if(cur!=='correct'){
        setTimeout(()=>key.setAttribute('data-state',result[i]),i*80+300);
      }
    }
  }

  wState.guesses.push({guess,result});
  wState.row++;
  wState.current='';

  if(guess===target){
    wState.done=true;
    setTimeout(()=>setWordleMsg(`🎉 ¡Correcto! La palabra era <strong>${target}</strong>`),500);
  } else if(wState.row>=6){
    wState.done=true;
    setTimeout(()=>setWordleMsg(`😔 La palabra era <strong>${target}</strong>`),500);
  } else {
    setWordleMsg('');
  }
}

function setWordleMsg(m){
  const el=document.getElementById('wordle-message');
  if(el) el.innerHTML=m;
}

function showWordleHelp(){
  setWordleMsg('🟩 Verde = letra correcta en posición correcta<br>🟨 Amarillo = letra en otra posición<br>⬛ Gris = letra no está en la palabra');
}

// keyboard physical
document.addEventListener('keydown',e=>{
  if(!document.getElementById('wordle-grid')) return;
  const k = e.key.toUpperCase();
  if(k==='ENTER'){ wSubmit(); return; }
  if(k==='BACKSPACE'){ wDelete(); return; }
  if(/^[A-ZÁÉÍÓÚÑ]$/.test(k)) wType(k);
});

/* ──────────────────────────────────────────────────────────
   A H O R C A D O
────────────────────────────────────────────────────────── */
let ahState = { word:'', guessed:new Set(), errors:0, done:false };
const HANGMAN_PARTS = ['hangman-head','hangman-body','hangman-arm-l','hangman-arm-r','hangman-leg-l','hangman-leg-r'];

function initAhorcado(){
  const diff = (document.getElementById('ahorcado-difficulty')||{value:'medium'}).value;
  const pool = AHORCADO_DATA[diff] || AHORCADO_DATA.medium;
  ahState.word = pool[Math.floor(Math.random()*pool.length)].toUpperCase();
  ahState.guessed = new Set();
  ahState.errors = 0;
  ahState.done = false;

  HANGMAN_PARTS.forEach(id=>{ const el=document.getElementById(id); if(el) el.style.display='none'; });
  renderAhorcadoWord();
  buildAhorcadoKeyboard();
  const wl=document.getElementById('wrong-letters-list'); if(wl) wl.textContent='';
  const msg=document.getElementById('ahorcado-message'); if(msg) msg.textContent='';
}

function renderAhorcadoWord(){
  const wd=document.getElementById('ahorcado-word');
  if(!wd) return;
  wd.innerHTML = [...ahState.word].map(l=>
    `<span class="ah-letter ${ahState.guessed.has(l)?'revealed':''}">${ahState.guessed.has(l)?l:'_'}</span>`
  ).join('');
}

function buildAhorcadoKeyboard(){
  const kb=document.getElementById('ahorcado-keyboard');
  if(!kb) return;
  const letters='ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  kb.innerHTML='';
  [...letters].forEach(l=>{
    const btn=document.createElement('button');
    btn.className='ah-key';
    btn.textContent=l;
    btn.id=`ahkey-${l}`;
    if(ahState.guessed.has(l)) btn.disabled=true;
    btn.onclick=()=>ahGuess(l);
    kb.appendChild(btn);
  });
}

function ahGuess(l){
  if(ahState.done || ahState.guessed.has(l)) return;
  ahState.guessed.add(l);
  const btn=document.getElementById(`ahkey-${l}`);
  if(btn){
    btn.disabled=true;
    if(ahState.word.includes(l)){
      btn.classList.add('ah-correct');
    } else {
      btn.classList.add('ah-wrong');
    }
  }

  if(!ahState.word.includes(l)){
    ahState.errors++;
    const part=HANGMAN_PARTS[ahState.errors-1];
    if(part){ const el=document.getElementById(part); if(el) el.style.display=''; }
    const wl=document.getElementById('wrong-letters-list');
    if(wl) wl.textContent=[...ahState.guessed].filter(x=>!ahState.word.includes(x)).join(' ');
  }

  renderAhorcadoWord();

  const won=[...ahState.word].every(l=>ahState.guessed.has(l));
  const msg=document.getElementById('ahorcado-message');
  if(won){
    ahState.done=true;
    if(msg) msg.innerHTML=`🎉 ¡Ganaste! La palabra era <strong>${ahState.word}</strong>`;
  } else if(ahState.errors>=6){
    ahState.done=true;
    if(msg) msg.innerHTML=`💀 ¡Perdiste! La palabra era <strong>${ahState.word}</strong>`;
  }
}

/* ──────────────────────────────────────────────────────────
   S O P A  D E  L E T R A S
────────────────────────────────────────────────────────── */
let sopaState = { grid:[], found:[], words:[], size:12, selecting:false, startCell:null, selected:[], timer:null, secs:0 };

function initSopa(){
  clearInterval(sopaState.timer);
  const theme=(document.getElementById('sopa-theme')||{value:'animales'}).value;
  const data=SOPA_THEMES[theme]||SOPA_THEMES.animales;
  sopaState.size=data.size;
  sopaState.words=data.words.map(w=>w.toUpperCase());
  sopaState.found=[];
  sopaState.selecting=false;
  sopaState.selected=[];
  sopaState.startCell=null;
  sopaState.secs=0;

  buildSopaGrid();
  placeSopaWords();
  fillSopaRandom();
  renderSopaGrid();
  renderSopaWordList();
  startSopaTimer();
}

function buildSopaGrid(){
  sopaState.grid=Array(sopaState.size).fill(null).map(()=>Array(sopaState.size).fill({letter:'',word:null,dir:null}));
}

const DIRS=[[0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];

function placeSopaWords(){
  sopaState.wordCells={};
  sopaState.words.forEach(word=>{
    let placed=false,attempts=0;
    while(!placed&&attempts<200){
      attempts++;
      const dir=DIRS[Math.floor(Math.random()*DIRS.length)];
      const r=Math.floor(Math.random()*sopaState.size);
      const c=Math.floor(Math.random()*sopaState.size);
      if(canPlace(word,r,c,dir)){
        sopaState.wordCells[word]=[];
        for(let i=0;i<word.length;i++){
          const nr=r+dir[0]*i, nc=c+dir[1]*i;
          sopaState.grid[nr][nc]={letter:word[i],word,i};
          sopaState.wordCells[word].push([nr,nc]);
        }
        placed=true;
      }
    }
  });
}

function canPlace(word,r,c,dir){
  for(let i=0;i<word.length;i++){
    const nr=r+dir[0]*i, nc=c+dir[1]*i;
    if(nr<0||nr>=sopaState.size||nc<0||nc>=sopaState.size) return false;
    const existing=sopaState.grid[nr][nc].letter;
    if(existing&&existing!==word[i]) return false;
  }
  return true;
}

function fillSopaRandom(){
  const ALPHA='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for(let r=0;r<sopaState.size;r++)
    for(let c=0;c<sopaState.size;c++)
      if(!sopaState.grid[r][c].letter)
        sopaState.grid[r][c]={letter:ALPHA[Math.floor(Math.random()*ALPHA.length)]};
}

function renderSopaGrid(){
  const container=document.getElementById('sopa-grid');
  if(!container) return;
  container.innerHTML='';
  container.style.gridTemplateColumns=`repeat(${sopaState.size},1fr)`;
  for(let r=0;r<sopaState.size;r++){
    for(let c=0;c<sopaState.size;c++){
      const cell=document.createElement('div');
      cell.className='sopa-cell';
      cell.textContent=sopaState.grid[r][c].letter;
      cell.dataset.r=r; cell.dataset.c=c;
      cell.addEventListener('mousedown',e=>sopaStartSel(r,c));
      cell.addEventListener('mouseover',e=>{ if(sopaState.selecting) sopaMoveSel(r,c); });
      cell.addEventListener('mouseup',e=>sopaEndSel());
      cell.addEventListener('touchstart',e=>{e.preventDefault();sopaStartSel(r,c);},{passive:false});
      cell.addEventListener('touchmove',e=>{
        e.preventDefault();
        const t=e.touches[0];
        const el=document.elementFromPoint(t.clientX,t.clientY);
        if(el&&el.classList.contains('sopa-cell')) sopaMoveSel(+el.dataset.r,+el.dataset.c);
      },{passive:false});
      cell.addEventListener('touchend',e=>sopaEndSel());
      container.appendChild(cell);
    }
  }
}

function getSopaCell(r,c){ return document.querySelector(`#sopa-grid .sopa-cell[data-r="${r}"][data-c="${c}"]`); }

function sopaStartSel(r,c){
  sopaState.selecting=true;
  sopaState.startCell=[r,c];
  sopaState.selected=[[r,c]];
  updateSopaHighlight();
}

function sopaMoveSel(r,c){
  if(!sopaState.selecting) return;
  const [sr,sc]=sopaState.startCell;
  const dr=r-sr, dc=c-sc;
  const len=Math.max(Math.abs(dr),Math.abs(dc));
  if(len===0){ sopaState.selected=[[sr,sc]]; updateSopaHighlight(); return; }
  const stepR=dr===0?0:(dr>0?1:-1);
  const stepC=dc===0?0:(dc>0?1:-1);
  // only allow straight lines
  if(dr!==0&&dc!==0&&Math.abs(dr)!==Math.abs(dc)) return;
  const cells=[];
  for(let i=0;i<=len;i++) cells.push([sr+stepR*i,sc+stepC*i]);
  sopaState.selected=cells;
  updateSopaHighlight();
}

function sopaEndSel(){
  sopaState.selecting=false;
  const sel=sopaState.selected;
  const letters=sel.map(([r,c])=>sopaState.grid[r][c].letter).join('');
  const lettersRev=letters.split('').reverse().join('');
  const match=sopaState.words.find(w=>w===letters||w===lettersRev);
  if(match&&!sopaState.found.includes(match)){
    sopaState.found.push(match);
    sel.forEach(([r,c])=>{ const el=getSopaCell(r,c); if(el) el.classList.add('sopa-found'); });
    renderSopaWordList();
    if(sopaState.found.length===sopaState.words.length){
      clearInterval(sopaState.timer);
      setTimeout(()=>alert(`🎉 ¡Completaste la sopa de letras en ${formatSopaTime(sopaState.secs)}!`),200);
    }
  }
  // clear selection highlight
  document.querySelectorAll('.sopa-cell.sopa-selected').forEach(el=>el.classList.remove('sopa-selected'));
  sopaState.selected=[];
}

function updateSopaHighlight(){
  document.querySelectorAll('.sopa-cell.sopa-selected').forEach(el=>el.classList.remove('sopa-selected'));
  sopaState.selected.forEach(([r,c])=>{ const el=getSopaCell(r,c); if(el) el.classList.add('sopa-selected'); });
}

function renderSopaWordList(){
  const ul=document.getElementById('sopa-word-list');
  if(!ul) return;
  ul.innerHTML=sopaState.words.map(w=>
    `<li class="${sopaState.found.includes(w)?'sopa-word-found':''}">${w}</li>`
  ).join('');
}

function startSopaTimer(){
  sopaState.secs=0;
  updateSopaTimerDisplay();
  sopaState.timer=setInterval(()=>{
    sopaState.secs++;
    updateSopaTimerDisplay();
  },1000);
}

function updateSopaTimerDisplay(){
  const el=document.getElementById('sopa-timer');
  if(el) el.textContent=formatSopaTime(sopaState.secs);
}

function formatSopaTime(s){
  const m=Math.floor(s/60);
  const sec=s%60;
  return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
}

/* ──────────────────────────────────────────────────────────
   STYLES (injected — keep wordle/ahorcado/sopa looking good)
────────────────────────────────────────────────────────── */
(function injectStyles(){
  const s=document.createElement('style');
  s.textContent=`
  /* WORDLE */
  .wordle-grid{display:flex;flex-direction:column;gap:5px;align-items:center;margin-bottom:12px;}
  .wordle-row{display:flex;gap:5px;}
  .wordle-cell{width:46px;height:46px;border:2px solid rgba(100,116,139,.4);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:1.35rem;font-weight:900;text-transform:uppercase;transition:border-color .1s;background:rgba(15,23,42,.7);color:#e2e8f0;}
  .wordle-cell-filled{border-color:rgba(148,163,184,.7);}
  .wordle-cell[data-state="correct"]{background:#059669;border-color:#059669;color:#fff;}
  .wordle-cell[data-state="present"]{background:#d97706;border-color:#d97706;color:#fff;}
  .wordle-cell[data-state="absent"]{background:#374151;border-color:#374151;color:#9ca3af;}
  .wordle-flip{animation:wflip .5s ease;}
  @keyframes wflip{0%{transform:rotateX(0);}50%{transform:rotateX(90deg);}100%{transform:rotateX(0);}}
  .wordle-keyboard{display:flex;flex-direction:column;gap:5px;align-items:center;}
  .wordle-kb-row{display:flex;gap:4px;}
  .wordle-key{padding:.45rem .55rem;min-width:30px;border-radius:5px;border:none;background:rgba(71,85,105,.9);color:#e2e8f0;font-weight:700;font-size:.8rem;cursor:pointer;font-family:'Poppins',sans-serif;transition:all .15s;}
  .wordle-key-wide{min-width:46px;}
  .wordle-key:hover{background:rgba(100,116,139,.9);}
  .wordle-key[data-state="correct"]{background:#059669;color:#fff;}
  .wordle-key[data-state="present"]{background:#d97706;color:#fff;}
  .wordle-key[data-state="absent"]{background:#1f2937;color:#6b7280;}
  .wordle-message{text-align:center;font-size:.85rem;color:#fbbf24;min-height:1.4em;margin:.5rem 0;padding:0 .5rem;}

  /* AHORCADO */
  .ah-letter{display:inline-block;width:1.6rem;text-align:center;font-size:1.4rem;font-weight:900;border-bottom:2.5px solid rgba(100,116,139,.5);margin:0 3px;color:transparent;}
  .ah-letter.revealed{color:#e2e8f0;border-bottom-color:#10b981;animation:revealLetter .25s ease;}
  @keyframes revealLetter{from{transform:scale(1.4);}to{transform:scale(1);}}
  .ahorcado-keyboard{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin:.6rem 0;}
  .ah-key{width:30px;height:30px;border-radius:5px;border:none;background:rgba(71,85,105,.9);color:#e2e8f0;font-weight:700;font-size:.78rem;cursor:pointer;font-family:'Poppins',sans-serif;transition:all .15s;}
  .ah-key:hover:not(:disabled){background:rgba(100,116,139,.9);}
  .ah-key:disabled{cursor:default;}
  .ah-key.ah-correct{background:#059669;color:#fff;}
  .ah-key.ah-wrong{background:#1f2937;color:#4b5563;}
  #ahorcado-message{text-align:center;font-size:.85rem;color:#fbbf24;min-height:1.2em;margin:.4rem 0;}

  /* SOPA */
  .sopa-grid{display:grid;gap:2px;user-select:none;-webkit-user-select:none;}
  .sopa-cell{aspect-ratio:1/1;min-width:20px;display:flex;align-items:center;justify-content:center;font-size:clamp(.6rem,.9vw,.8rem);font-weight:700;border-radius:3px;background:rgba(15,23,42,.7);color:#94a3b8;cursor:default;transition:background .1s,color .1s;border:1px solid rgba(30,41,59,.5);}
  .sopa-cell.sopa-selected{background:rgba(59,130,246,.4);color:#fff;}
  .sopa-cell.sopa-found{background:rgba(16,185,129,.25);color:#6ee7b7;border-color:rgba(16,185,129,.3);}
  #sopa-word-list{list-style:none;display:flex;flex-wrap:wrap;gap:.3rem;}
  #sopa-word-list li{font-size:.78rem;background:rgba(30,41,59,.8);padding:.2rem .6rem;border-radius:20px;color:#94a3b8;border:1px solid rgba(100,116,139,.2);}
  #sopa-word-list li.sopa-word-found{background:rgba(16,185,129,.15);color:#10b981;border-color:rgba(16,185,129,.3);text-decoration:line-through;}
  .sopa-timer{font-size:1.1rem;font-weight:700;color:#ff006e;margin-top:.6rem;display:flex;align-items:center;gap:.4rem;}
  `;
  document.head.appendChild(s);
})();

/* ──────────────────────────────────────────────────────────
   AUTO-INIT when DOM is ready
────────────────────────────────────────────────────────── */
function autoInit(){
  if(document.getElementById('wordle-grid'))   initWordle();
  if(document.getElementById('ahorcado-word')) initAhorcado();
  if(document.getElementById('sopa-grid'))     initSopa();
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', autoInit);
} else {
  autoInit();
}
