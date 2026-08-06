/* =============================================
   SnakePlay — snake.js  v11.0  (FINAL)
   PASO J: Partículas enganchadas
   PASO K: Pulido, optimizaciones, háptica
============================================= */
"use strict";

// ---- DETECCIÓN MÓVIL ----
const IS_MOBILE = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth < 600;

const WORLD_SIZE  = 3000;
const CELL_SIZE   = 18;
const MAX_PARTICLES = IS_MOBILE ? 120 : 280;
const SPEED       = IS_MOBILE ? 2.4 : 2.8;
const BOOST_SPEED = IS_MOBILE ? 4.4 : 5.2;
const BOOST_DRAIN = 0.28;   // segmentos por frame que se pierden en boost
const MIN_LENGTH  = 12;     // longitud mínima para existir / para poder boostear
const TURN_SPEED  = 0.07;
const INIT_LENGTH = 20;
const GRID_SIZE   = 60;
const ORBS_COUNT  = IS_MOBILE ? 220 : 350;
const BOT_COUNT   = IS_MOBILE ? 12  : 20;
const ORB_EAT_R   = CELL_SIZE * 1.4;
// En móvil checamos colisiones cada 2 segmentos para ahorrar CPU
const COL_STEP    = IS_MOBILE ? 3 : 1;

const BOT_NAMES=[
  'XxDragonxX','ProGamer99','SerpentKing','NoodleMaster',
  'BoaConstrictor','SlitherPro','SnakeBoss','CobralYT',
  'ViperElite','PythonGod','MambaMentality','AnaCondaFan',
  'TuboFlex','Lombricita','GusanoVIP','CulebronFC',
  'Noobslayer','EatOrBeEaten','SerpenteDios','TheWorm',
];
const ORB_COLORS=[
  ['#ff2d78','#ff8fb0'],['#00d4ff','#80eaff'],
  ['#39ff14','#a0ff80'],['#ffdd00','#fff080'],
  ['#bf5fff','#dfb0ff'],['#ff6b35','#ffb080'],
  ['#00ffcc','#80ffe8'],['#ff4444','#ff9999'],
];

let state={screen:'start',playerName:'Jugador'};
let game=null;

function $(id){return document.getElementById(id);}
function lerp(a,b,t){return a+(b-a)*t;}
function clamp(v,mn,mx){return Math.max(mn,Math.min(mx,v));}
function fmtTime(ms){const s=Math.floor(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
function angleDiff(a,b){let d=b-a;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return d;}
function randInt(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function randFloat(a,b){return Math.random()*(b-a)+a;}
function randColor(){
  const p=[
    ['#39ff14','#1a8a00'],['#00d4ff','#006688'],
    ['#ff2d78','#880033'],['#ffdd00','#887700'],
    ['#ff6b35','#883300'],['#bf5fff','#660099'],
    ['#00ffcc','#007755'],['#ff4444','#881111'],
    ['#4488ff','#112288'],['#ff8c00','#884600'],
  ];
  return p[randInt(0,p.length-1)];
}

// ============================================================
// PANTALLAS
// ============================================================
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  $('screen-'+id).classList.add('active');
  state.screen=id;
}
function showKofiModal(){const m=$('kofi-modal');if(m){m.style.display='flex';document.body.style.overflow='hidden';}}
function closeKofiModal(){const m=$('kofi-modal');if(m){m.style.display='none';document.body.style.overflow='';}}

// ============================================================
// PANTALLA INICIO
// ============================================================
function initStart(){
  const canvas=$('bg-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  const deco={segs:[],angle:0,t:0};
  for(let i=0;i<80;i++) deco.segs.push({x:canvas.width/2-i*20,y:canvas.height/2});

  function animateBg(){
    if(state.screen!=='start')return;
    requestAnimationFrame(animateBg);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle='rgba(57,255,20,0.04)';ctx.lineWidth=1;
    for(let x=0;x<canvas.width;x+=GRID_SIZE){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
    for(let y=0;y<canvas.height;y+=GRID_SIZE){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
    deco.t+=0.012;
    deco.angle=Math.sin(deco.t*0.7)*Math.PI*0.4+Math.cos(deco.t*0.4)*Math.PI*0.2;
    const head=deco.segs[0];
    head.x+=Math.cos(deco.angle)*2.5; head.y+=Math.sin(deco.angle)*2.5;
    if(head.x<-50)head.x=canvas.width+50; if(head.x>canvas.width+50)head.x=-50;
    if(head.y<-50)head.y=canvas.height+50; if(head.y>canvas.height+50)head.y=-50;
    for(let i=deco.segs.length-1;i>0;i--){
      const s=deco.segs[i],p=deco.segs[i-1];
      const dx=p.x-s.x,dy=p.y-s.y,d=Math.hypot(dx,dy);
      if(d>14){s.x+=dx/d*(d-14);s.y+=dy/d*(d-14);}
    }
    deco.segs.forEach((s,i)=>{
      const r=14-i*0.15;if(r<=0)return;
      const alpha=0.1-i*0.001;
      ctx.beginPath();ctx.arc(s.x,s.y,Math.max(r,2),0,Math.PI*2);
      ctx.fillStyle=`rgba(57,255,20,${Math.max(alpha,0.01)})`;ctx.fill();
    });
  }
  animateBg();

  $('btn-play').addEventListener('click',()=>{
    Audio.unlock();
    state.playerName=$('player-name').value.trim()||'Jugador';
    showLevelSelect();
  });
  $('player-name').addEventListener('keydown',e=>{
    if(e.key==='Enter'){Audio.unlock();state.playerName=$('player-name').value.trim()||'Jugador';showLevelSelect();}
  });

  // ---- Skin selector ----
  _initSkinSelector();
}

function _initSkinSelector(){
  const wrap = $('skin-selector');
  if(!wrap) return;
  wrap.innerHTML = '';

  const currentId = Skins.getSkinId();

  Skins.SKINS.forEach(skin => {
    const btn = document.createElement('button');
    btn.className = 'skin-btn' + (skin.id === currentId ? ' skin-active' : '');
    btn.title = skin.name;
    btn.style.setProperty('--skin-color', skin.color);
    btn.style.setProperty('--skin-glow',  skin.glow);
    btn.innerHTML = `<span class="skin-dot"></span>`;
    btn.addEventListener('click', () => {
      Skins.setSkinId(skin.id);
      wrap.querySelectorAll('.skin-btn').forEach(b => b.classList.remove('skin-active'));
      btn.classList.add('skin-active');
      // Preview: actualizar el nombre de skin seleccionado
      const label = $('skin-name-label');
      if(label) label.textContent = skin.name;
    });
    wrap.appendChild(btn);
  });

  // Label inicial
  const label = $('skin-name-label');
  if(label) label.textContent = Skins.current().name;
}

// ============================================================
// NIVEL — configuración por dificultad
// ============================================================
const LEVEL_CFG = {
  1: { label:'Fácil',    botCount: IS_MOBILE?6:8,   botSpeed:0.72, botAgg:0.3, orbCount: IS_MOBILE?280:420 },
  2: { label:'Normal',   botCount: IS_MOBILE?12:14,  botSpeed:0.88, botAgg:0.6, orbCount: IS_MOBILE?220:350 },
  3: { label:'Difícil',  botCount: IS_MOBILE?16:20,  botSpeed:1.05, botAgg:0.85, orbCount: IS_MOBILE?180:280 },
  4: { label:'Infierno', botCount: IS_MOBILE?20:28,  botSpeed:1.22, botAgg:1.1, orbCount: IS_MOBILE?150:220 },
};

function showLevelSelect(){
  showScreen('level');
  _initLevelBg();
  _refreshLevelRecords();

  // Bind level cards
  const grid = $('level-grid');
  if(!grid) return;
  grid.querySelectorAll('.level-card').forEach(card=>{
    card.onclick = ()=>{
      const lvl = parseInt(card.dataset.level);
      state.level = lvl;
      startGame();
    };
  });
  const back = $('btn-level-back');
  if(back) back.onclick = ()=> showScreen('start');
}

function _refreshLevelRecords(){
  for(let i=1;i<=4;i++){
    const el=$('lrec-'+i);
    if(!el) continue;
    const rec = Records.get(i);
    if(rec && rec.score > 0){
      el.innerHTML = `🏆 Récord: <strong>${rec.score} pts</strong>`;
      el.style.display='block';
    } else {
      el.style.display='none';
    }
  }
}

function _initLevelBg(){
  const canvas=$('level-bg-canvas');
  if(!canvas) return;
  // Allow re-run each visit
  canvas._running=true;
  const ctx=canvas.getContext('2d');
  canvas.width=window.innerWidth; canvas.height=window.innerHeight;

  const particles=[];
  for(let i=0;i<60;i++) particles.push({
    x:Math.random()*canvas.width, y:Math.random()*canvas.height,
    vx:(Math.random()-.5)*0.4, vy:(Math.random()-.5)*0.4,
    r:Math.random()*3+1, a:Math.random()*0.5+0.1,
    c:['#39ff14','#00d4ff','#ff2d78','#ffdd00'][Math.floor(Math.random()*4)]
  });

  function loop(){
    if(state.screen!=='level'){ canvas._running=false; return; }
    requestAnimationFrame(loop);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#080c14'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle='rgba(57,255,20,0.03)'; ctx.lineWidth=1;
    for(let x=0;x<canvas.width;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
    for(let y=0;y<canvas.height;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0;
      if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.c; ctx.globalAlpha=p.a; ctx.fill(); ctx.globalAlpha=1;
    });
  }
  loop();
}

function startGame(){
  Audio.unlock();
  Audio.start();
  showScreen('game');
  if(game)game.destroy();
  const lvl = state.level || 2;
  game=new SnakeGame(state.playerName, lvl);
  game.init();
}


// ============================================================
// AUDIO ENGINE — Web Audio API puro, sin archivos externos
// ============================================================
const Audio = (() => {
  let ctx = null;
  let muted = false;
  let masterGain = null;
  let _volume = 0.7; // volumen por defecto 70%
  let _eatCooldown = 0; // evitar spam de sonido al comer

  function _ctx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = _volume;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Utilidad: crear oscilador + envelope + filtro
  function _tone({ type='sine', freq=440, freqEnd=440, duration=0.12,
                   gain=0.18, gainEnd=0.0, detune=0,
                   filterFreq=null, filterQ=1 } = {}) {
    if (muted) return;
    try {
      const ac = _ctx();
      const osc = ac.createOscillator();
      const env = ac.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(freqEnd, 1), ac.currentTime + duration
      );
      if (detune) osc.detune.setValueAtTime(detune, ac.currentTime);

      env.gain.setValueAtTime(gain, ac.currentTime);
      env.gain.exponentialRampToValueAtTime(
        Math.max(gainEnd, 0.0001), ac.currentTime + duration
      );

      let node = osc;
      if (filterFreq) {
        const flt = ac.createBiquadFilter();
        flt.type = 'bandpass';
        flt.frequency.value = filterFreq;
        flt.Q.value = filterQ;
        osc.connect(flt);
        flt.connect(env);
      } else {
        osc.connect(env);
      }
      env.connect(masterGain || ac.destination);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + duration + 0.01);
    } catch(e) { /* silencioso si falla */ }
  }

  // Ruido blanco breve (para explosiones/muertes)
  function _noise({ duration=0.18, gain=0.12, filterFreq=800 } = {}) {
    if (muted) return;
    try {
      const ac = _ctx();
      const bufSize = Math.floor(ac.sampleRate * duration);
      const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

      const src = ac.createBufferSource();
      src.buffer = buf;

      const flt = ac.createBiquadFilter();
      flt.type = 'bandpass';
      flt.frequency.value = filterFreq;
      flt.Q.value = 0.8;

      const env = ac.createGain();
      env.gain.setValueAtTime(gain, ac.currentTime);
      env.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);

      src.connect(flt); flt.connect(env); env.connect(masterGain || ac.destination);
      src.start(); src.stop(ac.currentTime + duration);
    } catch(e) {}
  }

  return {
    // ---- Unlock en el primer gesto ----
    unlock() { _ctx(); },

    toggleMute() {
      muted = !muted;
      if(masterGain) masterGain.gain.value = muted ? 0 : _volume;
      return muted;
    },
    isMuted() { return muted; },
    setVolume(v){
      _volume = Math.max(0, Math.min(1, v));
      if(masterGain && !muted) masterGain.gain.value = _volume;
    },
    getVolume(){ return _volume; },

    // ---- Comer un orbe: pop agudo y breve ----
    eat() {
      const now = performance.now();
      if (now - _eatCooldown < 80) return; // máx ~12 sonidos/seg
      _eatCooldown = now;
      _tone({ type:'sine', freq:520, freqEnd:760, duration:0.07, gain:0.14 });
      _tone({ type:'triangle', freq:1040, freqEnd:1400, duration:0.05,
              gain:0.06, gainEnd:0.0 });
    },

    // ---- Boost activo: zumbido grave pulsante ----
    // Se llama cada ~10 frames mientras boosteando
    boostHum() {
      _tone({ type:'sawtooth', freq:80, freqEnd:95, duration:0.18,
              gain:0.07, filterFreq:200, filterQ:3 });
    },

    // ---- Kill: crujido satisfactorio ----
    kill() {
      _noise({ duration:0.12, gain:0.22, filterFreq:600 });
      _tone({ type:'square', freq:180, freqEnd:60, duration:0.2,
              gain:0.12, gainEnd:0.0 });
    },

    // ---- Muerte del jugador: descenso dramático ----
    die() {
      _noise({ duration:0.35, gain:0.28, filterFreq:300 });
      _tone({ type:'sawtooth', freq:220, freqEnd:40, duration:0.5,
              gain:0.18, gainEnd:0.0 });
      // Eco grave un poco después
      setTimeout(() => {
        _tone({ type:'sine', freq:80, freqEnd:30, duration:0.6,
                gain:0.10, gainEnd:0.0 });
      }, 120);
    },

    // ---- Inicio de partida: acorde ascendente ----
    start() {
      [0, 80, 180].forEach((delay, i) => {
        setTimeout(() => {
          _tone({ type:'sine',
                  freq: [330, 415, 523][i],
                  freqEnd: [415, 523, 660][i],
                  duration: 0.2, gain: 0.10 });
        }, delay);
      });
    },
  };
})();

// ============================================================
// RÉCORDS — localStorage (per-level)
// ============================================================
const Records = (() => {
  const KEY_BASE = 'snakeplay_records_v2_lvl';

  const defaults = { score: 0, length: 0, timeMs: 0, kills: 0 };

  function _key(level){ return KEY_BASE + (level||2); }

  function load(level) {
    try {
      return JSON.parse(localStorage.getItem(_key(level))) || { ...defaults };
    } catch(e) { return { ...defaults }; }
  }

  function save(data, level) {
    try { localStorage.setItem(_key(level), JSON.stringify(data)); } catch(e) {}
  }

  function get(level){ return load(level); }

  function update({ score, length, timeMs, kills }, level) {
    const rec = load(level);
    const newBests = [];
    if (score  > rec.score)  { rec.score  = score;  newBests.push('score');  }
    if (length > rec.length) { rec.length = length; newBests.push('length'); }
    if (timeMs > rec.timeMs) { rec.timeMs = timeMs; newBests.push('time');   }
    if (kills  > rec.kills)  { rec.kills  = kills;  newBests.push('kills');  }
    if (newBests.length) save(rec, level);
    return { records: rec, newBests };
  }

  function clear(level) {
    if(level){ save({ ...defaults }, level); }
    else { for(let i=1;i<=4;i++) save({ ...defaults }, i); }
  }

  return { load, update, clear, get };
})();

// ============================================================
// HÁPTICA — vibración en móvil
// ============================================================
const Haptic = {
  eat  () { if(navigator.vibrate) navigator.vibrate(6); },
  kill () { if(navigator.vibrate) navigator.vibrate([12,30,20]); },
  die  () { if(navigator.vibrate) navigator.vibrate([40,20,40,20,80]); },
};

// ============================================================
// SKINS — paletas de color para el jugador
// ============================================================
const SKINS = [
  { id:'green',    name:'Víbora',    color:'#39ff14', dark:'#1a8a00', glow:'rgba(57,255,20,0.5)'   },
  { id:'blue',     name:'Oceánica',  color:'#00d4ff', dark:'#006688', glow:'rgba(0,212,255,0.5)'   },
  { id:'pink',     name:'Neón Rosa', color:'#ff2d78', dark:'#880033', glow:'rgba(255,45,120,0.5)'  },
  { id:'yellow',   name:'Dorada',    color:'#ffdd00', dark:'#887700', glow:'rgba(255,221,0,0.5)'   },
  { id:'purple',   name:'Sombra',    color:'#bf5fff', dark:'#660099', glow:'rgba(191,95,255,0.5)'  },
  { id:'orange',   name:'Fuego',     color:'#ff6b35', dark:'#883300', glow:'rgba(255,107,53,0.5)'  },
  { id:'cyan',     name:'Glaciar',   color:'#00ffcc', dark:'#007755', glow:'rgba(0,255,204,0.5)'   },
  { id:'red',      name:'Sangre',    color:'#ff4444', dark:'#881111', glow:'rgba(255,68,68,0.5)'   },
  { id:'indigo',   name:'Galaxia',   color:'#4488ff', dark:'#112288', glow:'rgba(68,136,255,0.5)'  },
  { id:'white',    name:'Fantasma',  color:'#e8e8ff', dark:'#6666aa', glow:'rgba(232,232,255,0.5)' },
];

const Skins = (() => {
  const KEY = 'snakeplay_skin_v1';
  function getSkinId()    { return localStorage.getItem(KEY) || 'green'; }
  function setSkinId(id)  { try { localStorage.setItem(KEY, id); } catch(e){} }
  function getSkin(id)    { return SKINS.find(s=>s.id===id) || SKINS[0]; }
  function current()      { return getSkin(getSkinId()); }
  return { SKINS, getSkinId, setSkinId, getSkin, current };
})();

// ============================================================
// CLASE PRINCIPAL
// ============================================================
class SnakeGame{
  constructor(playerName, level){
    this.playerName=playerName;
    this.level = level || 2;
    this.cfg = LEVEL_CFG[this.level] || LEVEL_CFG[2];
    this.running=false; this.paused=false; this.animId=null;
    this.mouse={x:0,y:0}; this.boosting=false;
    this.startTime=0; this.maxLength=INIT_LENGTH; this.score=0;
    this.orbs=[]; this.bots=[]; this.allSnakes=[];
    this._lastTs=0; this._particles=[];
    this._boostAccum=0;   // acumulador fraccional para boost drain
    this._killCount=0;    // serpientes eliminadas por el jugador
    // Pool de colisiones: grid espacial para optimizar
    this._grid=null;
  }

  init(){
    this.canvas=$('game-canvas');
    this.ctx=this.canvas.getContext('2d');
    // Usar devicePixelRatio real para pantallas nítidas (límite 2 para rendimiento)
    this._pixelRatio = Math.min(window.devicePixelRatio || 1, IS_MOBILE ? 1.5 : 2);
    this._onResizeBound=()=>this.resize();
    this.resize();
    window.addEventListener('resize',this._onResizeBound);

    this.player=this._createSnake(WORLD_SIZE/2,WORLD_SIZE/2,true,this.playerName);
    this.bots=[];
    for(let i=0;i<this.cfg.botCount;i++){
      this.bots.push(this._createSnake(
        randFloat(300,WORLD_SIZE-300),randFloat(300,WORLD_SIZE-300),
        false,BOT_NAMES[i%BOT_NAMES.length]
      ));
    }
    this.allSnakes=[this.player,...this.bots];

    this.orbs=[];
    for(let i=0;i<this.cfg.orbCount;i++) this.orbs.push(this._spawnOrb());

    this.cam={
      x:this.player.segs[0].x-this.W/2,
      y:this.player.segs[0].y-this.H/2,
      scale:1,
    };
    this.mouse.x=this.W/2; this.mouse.y=this.H/2;

    this._bindEvents();
    this.running=true;
    this.startTime=performance.now();

    // Minimap setup
    this._mmCanvas=$('minimap-canvas');
    if(this._mmCanvas){
      // Resolución interna alta para nitidez
      this._mmCanvas.width=280;
      this._mmCanvas.height=280;
      this._mmCtx=this._mmCanvas.getContext('2d');
    }
    this._mmFrame=0; // dibujar cada N frames

    this.loop(this.startTime);
  }

  resize(){
    const pr=this._pixelRatio||1;
    this.canvas.width =window.innerWidth*pr;
    this.canvas.height=window.innerHeight*pr;
    this.canvas.style.width ='100%';
    this.canvas.style.height='100%';
    this.W=this.canvas.width;
    this.H=this.canvas.height;
    // BUGFIX: resetear transform antes de escalar para evitar acumulación en cada resize
    this.ctx.setTransform(1,0,0,1,0,0);
    if(pr!==1) this.ctx.scale(pr,pr);
  }

  _createSnake(sx,sy,isPlayer,name){
    let color, colorDark;
    if(isPlayer){
      const skin = Skins.current();
      color     = skin.color;
      colorDark = skin.dark;
    } else {
      [color, colorDark] = randColor();
    }
    const angle=Math.random()*Math.PI*2;
    const segs=[];
    for(let i=0;i<INIT_LENGTH;i++)
      segs.push({x:sx-Math.cos(angle)*i*14,y:sy-Math.sin(angle)*i*14});
    return{
      segs,angle,targetAngle:angle,speed:SPEED,
      color,colorDark,length:INIT_LENGTH,
      isPlayer,isDead:false,name:name||'Bot',
      boosting:false,_botTimer:0,_botTarget:null,
      _killCount:0,
    };
  }

  _spawnOrb(nearX,nearY){
    const pair=ORB_COLORS[randInt(0,ORB_COLORS.length-1)];
    return{
      x:nearX!=null?clamp(nearX+randFloat(-80,80),10,WORLD_SIZE-10):randFloat(10,WORLD_SIZE-10),
      y:nearY!=null?clamp(nearY+randFloat(-80,80),10,WORLD_SIZE-10):randFloat(10,WORLD_SIZE-10),
      r:randFloat(5,10),color:pair[0],glow:pair[1],
      pulse:randFloat(0,Math.PI*2),value:1,
    };
  }

  // ============================================================
  // GRID ESPACIAL — para colisiones eficientes O(n) en vez de O(n²)
  // ============================================================
  _buildGrid(){
    const cellSz=80;
    const cols=Math.ceil(WORLD_SIZE/cellSz);
    const grid={cells:{},cellSz,cols};
    this.allSnakes.forEach(s=>{
      if(s.isDead)return;
      // Solo insertar cada COL_STEP segmentos (optimización móvil)
      for(let i=COL_STEP;i<s.segs.length;i+=COL_STEP){
        const seg=s.segs[i];
        const gx=Math.floor(seg.x/cellSz);
        const gy=Math.floor(seg.y/cellSz);
        const key=`${gx},${gy}`;
        if(!grid.cells[key]) grid.cells[key]=[];
        grid.cells[key].push({s,i,x:seg.x,y:seg.y});
      }
    });
    return grid;
  }

  _queryGrid(grid,x,y,radius){
    const results=[];
    const cellSz=grid.cellSz;
    const r=Math.ceil(radius/cellSz);
    const gx=Math.floor(x/cellSz);
    const gy=Math.floor(y/cellSz);
    for(let dx=-r;dx<=r;dx++){
      for(let dy=-r;dy<=r;dy++){
        const key=`${gx+dx},${gy+dy}`;
        if(grid.cells[key]) results.push(...grid.cells[key]);
      }
    }
    return results;
  }

  // ============================================================
  // EVENTOS
  // ============================================================
  _bindEvents(){
    // --- Teclado ---
    this._onKey=e=>{
      if(e.code==='Space'){e.preventDefault();this.boosting=true;}
      if(e.code==='Escape'||e.code==='KeyP')this.togglePause();
      if(e.code==='KeyM')this._toggleMute();
    };
    this._onKeyUp=e=>{if(e.code==='Space')this.boosting=false;};
    window.addEventListener('keydown',this._onKey);
    window.addEventListener('keyup',  this._onKeyUp);

    // --- Mouse (desktop) ---
    this._onMouseMove=e=>{this.mouse.x=e.clientX;this.mouse.y=e.clientY;};
    this._onMouseDown=e=>{if(e.button===0)this.boosting=true;};
    this._onMouseUp  =e=>{if(e.button===0)this.boosting=false;};
    window.addEventListener('mousemove',this._onMouseMove);
    window.addEventListener('mousedown',this._onMouseDown);
    window.addEventListener('mouseup',  this._onMouseUp);

    // --- Touch principal sobre el canvas del juego ---
    this._bindCanvasTouch();

    // --- Botón BOOST móvil ---
    const btnBoost=$('btn-boost');
    if(btnBoost){
      btnBoost.addEventListener('touchstart',e=>{e.preventDefault();this.boosting=true;},{passive:false});
      btnBoost.addEventListener('touchend',  e=>{e.preventDefault();this.boosting=false;},{passive:false});
    }

    // Helper: registra botón para click Y touch sin doble-disparo ni preventDefault en desktop
    const _btn=(id, fn)=>{
      const el=$( id);
      if(!el) return;
      let _lastT=0;
      const _fire=e=>{
        const now=Date.now();
        if(now-_lastT<400) return; // evitar doble disparo click+touchend
        _lastT=now;
        e.stopPropagation();
        fn(e);
      };
      el.addEventListener('click',   _fire);
      el.addEventListener('touchend', e=>{ e.preventDefault(); _fire(e); }, {passive:false});
    };

    // --- Botón ⚙️ → abre/cierra pausa ---
    _btn('btn-settings', ()=> this.togglePause());

    // --- Botones DENTRO del panel de pausa ---
    _btn('btn-mute',      ()=> this._toggleMute());
    _btn('pause-resume',  ()=> this.togglePause());

    // Slider de volumen
    const volSlider=$('volume-slider');
    if(volSlider){
      volSlider.addEventListener('input', e=>{
        e.stopPropagation();
        Audio.setVolume(parseFloat(e.target.value));
      });
      volSlider.addEventListener('touchstart', e=>e.stopPropagation(), {passive:true});
      volSlider.addEventListener('touchmove',  e=>e.stopPropagation(), {passive:true});
    }

    // 🏠 → va a PalabraPlay (página padre)
    _btn('btn-menu-game', ()=>{
      this.destroy();
      const base = window.location.href.replace(/\/snakeplay\/?[^/]*$/, '/');
      window.location.href = base.endsWith('/') ? base + 'index.html' : base + '/index.html';
    });

    // Pantalla de fin de partida
    const btnRetry=$('btn-retry');
    const btnMenu =$('btn-menu');
    if(btnRetry) btnRetry.addEventListener('click', ()=>{ this.destroy(); showLevelSelect(); });
    if(btnMenu)  btnMenu.addEventListener('click',  ()=>{ this.destroy(); showScreen('start'); });

    document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeKofiModal(); });
  }

  // Touch directo en canvas: toque = ir ahí, mantener = seguir dedo, doble toque o swipe rápido = boost
  _bindCanvasTouch(){
    const canvas=$('game-canvas');
    if(!canvas)return;

    // Función que detecta si el toque está sobre el botón ⚙️ o el boost btn
    const _overUI=(x,y)=>{
      const settings=$('btn-settings');
      const boost=$('btn-boost');
      const _hits=(el,px,py)=>{
        if(!el)return false;
        const r=el.getBoundingClientRect();
        // Margen extra de 10px para dedos grandes
        return px>=r.left-10&&px<=r.right+10&&py>=r.top-10&&py<=r.bottom+10;
      };
      return _hits(settings,x,y)||_hits(boost,x,y);
    };

    let lastTap=0;
    let touchStartT=0;
    let touchStartX=0,touchStartY=0;

    canvas.addEventListener('touchstart',e=>{
      const t=e.touches[0];
      if(_overUI(t.clientX,t.clientY))return; // dejar pasar al botón
      e.preventDefault();

      touchStartX=t.clientX; touchStartY=t.clientY;
      touchStartT=performance.now();

      this.mouse.x=t.clientX;
      this.mouse.y=t.clientY;

      // Doble tap → boost
      const now=performance.now();
      if(now-lastTap<300) this.boosting=true;
      lastTap=now;

    },{passive:false});

    canvas.addEventListener('touchmove',e=>{
      const t=e.touches[0];
      if(_overUI(t.clientX,t.clientY))return;
      e.preventDefault();

      this.mouse.x=t.clientX;
      this.mouse.y=t.clientY;

      // Swipe rápido hacia arriba → boost
      const dy=touchStartY-t.clientY;
      if(dy>60&&(performance.now()-touchStartT)<250) this.boosting=true;
    },{passive:false});

    canvas.addEventListener('touchend',e=>{
      e.preventDefault();
      setTimeout(()=>{ this.boosting=false; },600);
    },{passive:false});

    canvas.addEventListener('touchcancel',e=>{
      this.boosting=false;
    },{passive:false});
  }

  _toggleMute(){
    const muted=Audio.toggleMute();
    const btn=$('btn-mute');
    if(btn) btn.textContent=muted?'🔇':'🔊';
    const vol=$('volume-slider');
    if(vol) vol.style.opacity=muted?'0.3':'1';
  }

  togglePause(){
    if(!this.running||this.player.isDead)return;
    this.paused=!this.paused;
    const overlay=$('pause-overlay');
    if(overlay)overlay.style.display=this.paused?'flex':'none';
    // Actualizar ícono del botón ⚙️
    const btn=$('btn-settings');
    if(btn)btn.textContent=this.paused?'▶':'⚙️';
    if(!this.paused){this._lastTs=performance.now();this.loop(this._lastTs);}
  }

  // ============================================================
  // LOOP
  // ============================================================
  loop(ts){
    if(!this.running||this.paused)return;
    this.animId=requestAnimationFrame(t=>this.loop(t));
    const dt=Math.min(ts-(this._lastTs||ts),50)/1000;
    this._lastTs=ts;
    this.update(dt,ts);
    this.draw();
    this.updateHUD();
  }

  // ============================================================
  // UPDATE
  // ============================================================
  update(dt,ts){
    const p=this.player;
    if(p.isDead)return;

    // ---- Mover jugador ----
    // BUGFIX: mouse.x/y son coordenadas CSS (lógicas), dividir solo por cam.scale
    const pr=this._pixelRatio||1;
    const worldMX=this.mouse.x/this.cam.scale+this.cam.x;
    const worldMY=this.mouse.y/this.cam.scale+this.cam.y;
    const head=p.segs[0];
    const dx=worldMX-head.x,dy=worldMY-head.y;
    if(Math.hypot(dx,dy)>5) p.targetAngle=Math.atan2(dy,dx);
    const diff=angleDiff(p.angle,p.targetAngle);
    p.angle+=clamp(diff,-TURN_SPEED*60*dt,TURN_SPEED*60*dt);

    // Boost: solo si tiene masa suficiente
    const canBoost=p.segs.length>MIN_LENGTH+4;
    p.boosting=this.boosting&&canBoost;
    this._moveSnake(p,p.boosting?BOOST_SPEED:SPEED);

    // Boost drain: por cada frame de boost acumulamos fracción
    if(p.boosting){
      this._boostAccum+=BOOST_DRAIN*60*dt;
      const drain=Math.floor(this._boostAccum);
      if(drain>0){
        this._boostAccum-=drain;
        // Emitir orbes en la cola y reducir length
        for(let k=0;k<drain;k++){
          const tail=p.segs[p.segs.length-1];
          if(tail) this.orbs.push(this._spawnOrb(tail.x,tail.y));
        }
        p.length=Math.max(MIN_LENGTH, p.length-drain);
      }
    } else {
      this._boostAccum=0;
    }

    // Zumbido de boost cada ~10 frames
    if(p.boosting){
      this._boostHumFrame=(this._boostHumFrame||0)+1;
      if(this._boostHumFrame%10===0) Audio.boostHum();
      if(this._boostHumFrame%3===0){
        const tail=p.segs[p.segs.length-1];
        if(tail) this._spawnBoostSpark(tail.x, tail.y, p.color);
      }
    } else {
      this._boostHumFrame=0;
    }

    p.segs[0].x=clamp(p.segs[0].x,CELL_SIZE,WORLD_SIZE-CELL_SIZE);
    p.segs[0].y=clamp(p.segs[0].y,CELL_SIZE,WORLD_SIZE-CELL_SIZE);

    // ---- Mover bots ----
    this.bots.forEach(b=>{if(!b.isDead)this._updateBot(b,dt);});

    // ---- Construir grid espacial para colisiones ----
    const grid=this._buildGrid();

    // ---- Colisiones de TODAS las serpientes ----
    this.allSnakes.forEach(s=>{
      if(s.isDead)return;
      this._checkCollision(s,grid);
    });

    // ---- Comer orbes ----
    this.allSnakes.forEach(s=>{if(!s.isDead)this._checkEatOrbs(s);});

    // Reponer orbes
    while(this.orbs.length<this.cfg.orbCount) this.orbs.push(this._spawnOrb());

    // Respawn bots muertos
    this.bots.forEach((b,i)=>{
      if(b.isDead&&!b._respawning){
        b._respawning=true;
        setTimeout(()=>{
          this.bots[i]=this._createSnake(
            randFloat(300,WORLD_SIZE-300),randFloat(300,WORLD_SIZE-300),
            false,BOT_NAMES[randInt(0,BOT_NAMES.length-1)]
          );
          this.allSnakes=[this.player,...this.bots];
        },3000);
      }
    });

    if(p.segs.length>this.maxLength) this.maxLength=p.segs.length;
    this._updateParticles(dt);
    this._updateCamera(p);
  }

  _moveSnake(s,spd){
    const h=s.segs[0];
    s.segs.unshift({x:h.x+Math.cos(s.angle)*spd,y:h.y+Math.sin(s.angle)*spd});
    while(s.segs.length>s.length)s.segs.pop();
  }

  // ============================================================
  // IA BOTS — mejorada con evasión
  // ============================================================
  _updateBot(b,dt){
    b._botTimer-=dt;
    const head=b.segs[0];
    const agg = this.cfg.botAgg; // 0=passive, 1.1=aggressive

    if(b._botTimer<=0){
      b._botTimer=(0.4+Math.random()*0.4) * (1 / (0.5+agg)); // lower timer = more reactive at high agg

      // Buscar orb más cercano (máx 400px)
      let bestD=400,bestOrb=null;
      this.orbs.forEach(o=>{
        const d=Math.hypot(o.x-head.x,o.y-head.y);
        if(d<bestD){bestD=d;bestOrb=o;}
      });
      if(bestOrb)b._botTarget=bestOrb;

      // At high aggression, bots hunt the player if close enough
      const huntRange = 200 + agg * 400;
      const playerHead = this.player && !this.player.isDead ? this.player.segs[0] : null;
      const dPlayer = playerHead ? Math.hypot(playerHead.x-head.x, playerHead.y-head.y) : Infinity;
      const willHunt = Math.random() < agg && dPlayer < huntRange && playerHead;

      // Detectar peligro: cabezas de serpientes grandes cercanas
      const dangerRange = 80 + (1-agg)*80; // timid bots have bigger danger radius
      let danger=null,dangerD=Infinity;
      this.allSnakes.forEach(s=>{
        if(s===b||s.isDead)return;
        const d=Math.hypot(s.segs[0].x-head.x,s.segs[0].y-head.y);
        // At high aggression bots only flee from much larger snakes
        const fleeThreshold = b.segs.length * (1 + (1-agg)*1.5);
        if(d<dangerRange&&s.segs.length>=fleeThreshold&&d<dangerD){dangerD=d;danger=s;}
      });

      if(danger && !willHunt){
        // Huir en dirección opuesta
        const dx=head.x-danger.segs[0].x,dy=head.y-danger.segs[0].y;
        b.targetAngle=Math.atan2(dy,dx);
        b._botTarget=null;
      } else if(willHunt && playerHead){
        // Chase player
        b.targetAngle=Math.atan2(playerHead.y-head.y, playerHead.x-head.x);
        b._botTarget=null;
      } else if(bestOrb){
        b.targetAngle=Math.atan2(bestOrb.y-head.y,bestOrb.x-head.x);
      }
    }

    // Evitar bordes
    const margin=120;
    if(head.x<margin)      b.targetAngle=lerp(b.targetAngle,0,0.3);
    if(head.x>WORLD_SIZE-margin) b.targetAngle=lerp(b.targetAngle,Math.PI,0.3);
    if(head.y<margin)      b.targetAngle=lerp(b.targetAngle,Math.PI/2,0.3);
    if(head.y>WORLD_SIZE-margin) b.targetAngle=lerp(b.targetAngle,-Math.PI/2,0.3);

    const diff=angleDiff(b.angle,b.targetAngle);
    b.angle+=clamp(diff,-TURN_SPEED*60*dt,TURN_SPEED*60*dt);
    this._moveSnake(b,SPEED*this.cfg.botSpeed);
    b.segs[0].x=clamp(b.segs[0].x,CELL_SIZE,WORLD_SIZE-CELL_SIZE);
    b.segs[0].y=clamp(b.segs[0].y,CELL_SIZE,WORLD_SIZE-CELL_SIZE);
  }

  // ============================================================
  // COLISIONES — grid espacial
  // ============================================================
  _checkCollision(s,grid){
    const head=s.segs[0];
    const nearby=this._queryGrid(grid,head.x,head.y,CELL_SIZE*3);

    for(const item of nearby){
      if(item.s===s) continue;          // no chocar consigo misma
      if(item.s.isDead) continue;
      const d=Math.hypot(head.x-item.x,head.y-item.y);
      if(d<CELL_SIZE*1.1){
        // Esta serpiente murió al chocar con el cuerpo de otra
        this._killSnake(s,item.s);
        return;
      }
    }

    // Chocar con borde del mundo
    if(head.x<=CELL_SIZE||head.x>=WORLD_SIZE-CELL_SIZE||
       head.y<=CELL_SIZE||head.y>=WORLD_SIZE-CELL_SIZE){
      this._killSnake(s,null);
    }
  }

  _killSnake(s,killer){
    if(s.isDead)return;
    s.isDead=true;

    // Explotar en orbes — cada 4 segmentos para no saturar
    s.segs.forEach((seg,i)=>{
      if(i%4===0) this.orbs.push(this._spawnOrb(seg.x,seg.y));
    });

    if(s.isPlayer){
      this._spawnExplosion(s.segs[0].x, s.segs[0].y, s.color, 32, true);
      Audio.die();
      Haptic.die();
      this._flashScreen();
      setTimeout(()=>this._endGame(),1200);
    } else {
      // El killer gana crédito
      if(killer&&killer.isPlayer){
        const bonus=Math.floor(s.segs.length/2)*5;
        this.score+=bonus;
        this._killCount++;
        this._spawnExplosion(s.segs[0].x, s.segs[0].y, s.color, 20, false);
        Audio.kill();
        Haptic.kill();
        this._spawnScoreParticle(s.segs[0].x,s.segs[0].y,`+${bonus} 💀`);
      }
    }
  }

  // ============================================================
  // ORBES
  // ============================================================
  _checkEatOrbs(s){
    const head=s.segs[0];
    for(let i=this.orbs.length-1;i>=0;i--){
      const o=this.orbs[i];
      if(Math.hypot(o.x-head.x,o.y-head.y)<ORB_EAT_R+o.r){
        s.length+=2;
        if(s.isPlayer){
          Audio.eat();
          Haptic.eat();
          this._spawnOrbTrail(o.x, o.y, o.color);
          this.score+=o.value*10;
          this._spawnScoreParticle(o.x,o.y,'+'+o.value*10);
        }
        this.orbs.splice(i,1);
      }
    }
  }

  // ============================================================
  // PARTÍCULAS
  // ============================================================
  _spawnScoreParticle(wx,wy,text){
    this._particles.push({type:'score',wx,wy,text,life:1.0,vy:-55});
  }

  _spawnExplosion(wx,wy,color,count=18,big=false){
    const available=MAX_PARTICLES-this._particles.length;
    if(available<=0)return;
    count=Math.min(count,available-1);
    for(let i=0;i<count;i++){
      const angle=Math.random()*Math.PI*2;
      const spd=(big?180:110)+Math.random()*(big?200:120);
      this._particles.push({
        type:'spark',wx,wy,
        vx:Math.cos(angle)*spd,vy:Math.sin(angle)*spd,
        color,r:big?3+Math.random()*4:2+Math.random()*3,
        life:1.0,decay:1.4+Math.random()*0.8,gravity:big?140:80,
      });
    }
    this._particles.push({
      type:'ring',wx,wy,color,r:0,
      targetR:big?160:90,life:1.0,decay:2.2,
    });
  }

  _spawnOrbTrail(wx,wy,color){
    for(let i=0;i<5;i++){
      const angle=Math.random()*Math.PI*2;
      const spd=25+Math.random()*50;
      this._particles.push({
        type:'star',
        wx:wx+Math.cos(angle)*8,wy:wy+Math.sin(angle)*8,
        vx:Math.cos(angle)*spd,vy:Math.sin(angle)*spd-30,
        color,r:1.5+Math.random()*2,life:1.0,decay:2.8+Math.random(),
      });
    }
  }

  _spawnBoostSpark(wx,wy,color){
    if(this._particles.length>=MAX_PARTICLES)return;
    const angle=Math.random()*Math.PI*2;
    const spd=30+Math.random()*60;
    this._particles.push({
      type:'spark',wx,wy,
      vx:Math.cos(angle)*spd,vy:Math.sin(angle)*spd,
      color,r:1.5+Math.random()*2,life:1.0,decay:4+Math.random()*2,gravity:20,
    });
  }

  _updateParticles(dt){
    for(let i=this._particles.length-1;i>=0;i--){
      const p=this._particles[i];
      switch(p.type){
        case 'score': p.wy+=p.vy*dt; p.life-=dt*1.8; break;
        case 'spark':
          p.wx+=p.vx*dt; p.wy+=p.vy*dt;
          p.vy+=(p.gravity||80)*dt; p.vx*=1-dt*2.5;
          p.life-=(p.decay||1.4)*dt; break;
        case 'star':
          p.wx+=p.vx*dt; p.wy+=p.vy*dt;
          p.vy+=60*dt; p.life-=(p.decay||2.8)*dt; break;
        case 'ring':
          p.r=lerp(p.r,p.targetR,dt*6);
          p.life-=(p.decay||2.2)*dt; break;
      }
      if(p.life<=0)this._particles.splice(i,1);
    }
  }

  _drawParticles(ctx){
    const pr=this._pixelRatio||1;
    this._particles.forEach(p=>{
      const alpha=Math.max(0,p.life);
      const sx=(p.wx-this.cam.x)*this.cam.scale/pr;
      const sy=(p.wy-this.cam.y)*this.cam.scale/pr;
      ctx.globalAlpha=alpha;
      switch(p.type){
        case 'score':
          ctx.font='bold 16px Orbitron,monospace';
          ctx.textAlign='center';
          ctx.strokeStyle='rgba(0,0,0,0.6)';ctx.lineWidth=3;
          ctx.strokeText(p.text,sx,sy);
          ctx.fillStyle='#ffdd00';ctx.fillText(p.text,sx,sy);
          break;
        case 'spark':
          ctx.beginPath();ctx.arc(sx,sy,Math.max(0.5,p.r*alpha),0,Math.PI*2);
          ctx.fillStyle=p.color;ctx.fill();
          ctx.globalAlpha=alpha*0.3;
          ctx.beginPath();ctx.arc(sx,sy,p.r*2.5*alpha,0,Math.PI*2);
          ctx.fillStyle=p.color;ctx.fill();
          break;
        case 'star':
          ctx.beginPath();ctx.arc(sx,sy,p.r*alpha,0,Math.PI*2);
          ctx.fillStyle=p.color;ctx.fill();
          break;
        case 'ring':
          ctx.beginPath();ctx.arc(sx,sy,p.r/pr*this.cam.scale,0,Math.PI*2);
          ctx.strokeStyle=p.color;ctx.lineWidth=Math.max(0.5,2*alpha);ctx.stroke();
          break;
      }
      ctx.globalAlpha=1;
    });
    ctx.textAlign='left';
  }


  _flashScreen(){
    const flash=document.createElement('div');
    flash.className='screen-flash';
    flash.style.cssText='position:fixed;inset:0;background:rgba(255,0,0,0.35);z-index:999;pointer-events:none;animation:hitFade 0.5s ease forwards';
    document.body.appendChild(flash);
    setTimeout(()=>flash.remove(),600);
  }

  _updateCamera(p){
    const head=p.segs[0];
    const pr=this._pixelRatio||1;

    // ---- Zoom dinámico según longitud ----
    // Serpiente pequeña (≤40 segs) → zoom in (scale 1.4)
    // Serpiente grande (≥300 segs) → zoom out (scale 0.45)
    const len=p.segs.length;
    let targetScale;
    if(len<=40)        targetScale=1.4;
    else if(len>=300)  targetScale=0.45;
    else {
      // interpolación logarítmica suave entre 40 y 300
      const t=(len-40)/(300-40);
      targetScale=1.4+(0.45-1.4)*Math.pow(t,0.6);
    }
    this.cam.scale=lerp(this.cam.scale,targetScale,0.04);

    // Centrar cámara en la cabeza
    const targetX=head.x-(this.W/pr)/(2*this.cam.scale);
    const targetY=head.y-(this.H/pr)/(2*this.cam.scale);
    this.cam.x=lerp(this.cam.x,targetX,0.12);
    this.cam.y=lerp(this.cam.y,targetY,0.12);

    // Indicador de zoom (visible 2s cuando cambia)
    const zoomEl=$('zoom-indicator');
    if(zoomEl){
      zoomEl.textContent=`ZOOM ×${this.cam.scale.toFixed(2)}`;
      clearTimeout(this._zoomTimer);
      zoomEl.classList.add('visible');
      this._zoomTimer=setTimeout(()=>zoomEl.classList.remove('visible'),2000);
    }
  }

  // ============================================================
  // DIBUJO
  // ============================================================
  draw(){
    const ctx=this.ctx;
    const pr=this._pixelRatio||1;
    const W=this.W/pr,H=this.H/pr;
    // BUGFIX: clearRect/fillRect usan coordenadas lógicas (CSS) porque ctx ya tiene scale(pr,pr)
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,W,H);

    ctx.save();
    ctx.scale(this.cam.scale,this.cam.scale);
    ctx.translate(-this.cam.x,-this.cam.y);

    this._drawGrid(ctx);
    this._drawWorldBorder(ctx);

    const now=performance.now()/1000;
    // En móvil solo dibujar orbes visibles en cámara
    this.orbs.forEach(o=>{
      if(IS_MOBILE){
        const screenX=(o.x-this.cam.x)*this.cam.scale;
        const screenY=(o.y-this.cam.y)*this.cam.scale;
        if(screenX<-50||screenX>W+50||screenY<-50||screenY>H+50)return;
      }
      this._drawOrb(ctx,o,now);
    });

    this.bots.forEach(b=>{
      if(!b.isDead){
        const bsx=(b.segs[0].x-this.cam.x)*this.cam.scale;
        const bsy=(b.segs[0].y-this.cam.y)*this.cam.scale;
        if(bsx>-W*0.6&&bsx<W*1.6&&bsy>-H*0.6&&bsy<H*1.6)
          this._drawSnake(ctx,b,false);
      }
    });
    if(!this.player.isDead)this._drawSnake(ctx,this.player,true);

    ctx.restore();
    this._drawParticles(ctx);
    this._drawMinimap();
  }

  _drawGrid(ctx){
    const startX=Math.floor(this.cam.x/GRID_SIZE)*GRID_SIZE;
    const startY=Math.floor(this.cam.y/GRID_SIZE)*GRID_SIZE;
    const pr=this._pixelRatio||1;
    const endX=this.cam.x+this.W/this.cam.scale/pr+GRID_SIZE;
    const endY=this.cam.y+this.H/this.cam.scale/pr+GRID_SIZE;
    ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1/this.cam.scale;
    for(let x=startX;x<endX;x+=GRID_SIZE){ctx.beginPath();ctx.moveTo(x,startY);ctx.lineTo(x,endY);ctx.stroke();}
    for(let y=startY;y<endY;y+=GRID_SIZE){ctx.beginPath();ctx.moveTo(startX,y);ctx.lineTo(endX,y);ctx.stroke();}
  }

  _drawWorldBorder(ctx){
    const now=performance.now()/1000;
    const head=this.player.segs[0];
    const dist=Math.min(head.x,head.y,WORLD_SIZE-head.x,WORLD_SIZE-head.y);
    const danger=Math.max(0,1-dist/300);
    const pulse=Math.sin(now*8)*0.5+0.5;
    const glowAlpha=0.08+danger*0.35*pulse;
    const glowColor=danger>0.3
      ?`rgba(255,${Math.floor(80*(1-danger))},0,${glowAlpha})`
      :`rgba(57,255,20,${glowAlpha})`;
    ctx.strokeStyle=glowColor; ctx.lineWidth=40;
    ctx.strokeRect(0,0,WORLD_SIZE,WORLD_SIZE);
    const lineColor=danger>0.3
      ?`rgba(255,${Math.floor(100*(1-danger))},0,${0.5+danger*0.4*pulse})`
      :`rgba(57,255,20,0.5)`;
    ctx.strokeStyle=lineColor; ctx.lineWidth=4;
    ctx.strokeRect(0,0,WORLD_SIZE,WORLD_SIZE);
  }

  _drawOrb(ctx,o,now){
    const pulse=Math.sin(now*3+o.pulse)*0.25+0.75;
    const r=o.r*pulse;
    if(!IS_MOBILE){
      const grad=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,r*2.5);
      grad.addColorStop(0,o.color);grad.addColorStop(0.4,o.glow);grad.addColorStop(1,'transparent');
      ctx.beginPath();ctx.arc(o.x,o.y,r*2.5,0,Math.PI*2);
      ctx.fillStyle=grad;ctx.globalAlpha=0.3*pulse;ctx.fill();ctx.globalAlpha=1;
    }
    ctx.beginPath();ctx.arc(o.x,o.y,r,0,Math.PI*2);
    ctx.fillStyle=o.color;ctx.fill();
    ctx.beginPath();ctx.arc(o.x-r*0.25,o.y-r*0.25,r*0.35,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.7)';ctx.fill();
  }

  _drawSnake(ctx,s,isPlayer){
    if(s.isDead||s.segs.length<2)return;
    const r=CELL_SIZE*0.9;
    const step=IS_MOBILE?2:1;
    const now=performance.now()/1000;

    // Aura de boost — halo pulsante detrás de la cabeza
    if(s.boosting){
      const pulse=Math.sin(now*18)*0.4+0.6;
      const glowColor = s.isPlayer ? Skins.current().glow : s.color;
      ctx.save();
      ctx.globalAlpha=0.18*pulse;
      const auraGrad=ctx.createRadialGradient(
        s.segs[0].x,s.segs[0].y,0,
        s.segs[0].x,s.segs[0].y,r*5
      );
      auraGrad.addColorStop(0, glowColor);
      auraGrad.addColorStop(1,'transparent');
      ctx.beginPath();ctx.arc(s.segs[0].x,s.segs[0].y,r*5,0,Math.PI*2);
      ctx.fillStyle=auraGrad;ctx.fill();
      ctx.globalAlpha=1;
      ctx.restore();

      // Estela de velocidad en los primeros 8 segs
      for(let i=1;i<Math.min(8,s.segs.length);i++){
        const seg=s.segs[i];
        const alpha=(1-i/8)*0.35*pulse;
        ctx.beginPath();ctx.arc(seg.x,seg.y,r*0.7,0,Math.PI*2);
        ctx.fillStyle=s.color;ctx.globalAlpha=alpha;ctx.fill();
        ctx.globalAlpha=1;
      }
    }
    for(let i=s.segs.length-1;i>=0;i-=step){
      const seg=s.segs[i];
      const t=1-i/s.segs.length;
      const rad=r*(0.5+t*0.5);
      ctx.beginPath();ctx.arc(seg.x+2,seg.y+2,rad,0,Math.PI*2);
      ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fill();
      ctx.beginPath();ctx.arc(seg.x,seg.y,rad,0,Math.PI*2);
      ctx.fillStyle=i===0?s.color:(i%2===0?s.color:s.colorDark);ctx.fill();
      if(!IS_MOBILE){ctx.strokeStyle=s.colorDark;ctx.lineWidth=1.5;ctx.stroke();}
    }
    // Ojos
    const head=s.segs[0],angle=s.angle;
    const eyeR=r*0.32,eyeD=r*0.45,perp=angle+Math.PI/2;
    [[1],[-1]].forEach(([sign])=>{
      const ex=head.x+Math.cos(angle)*eyeD*0.6+Math.cos(perp)*eyeD*0.55*sign;
      const ey=head.y+Math.sin(angle)*eyeD*0.6+Math.sin(perp)*eyeD*0.55*sign;
      ctx.beginPath();ctx.arc(ex,ey,eyeR,0,Math.PI*2);ctx.fillStyle='white';ctx.fill();
      ctx.beginPath();ctx.arc(ex+Math.cos(angle)*eyeR*0.4,ey+Math.sin(angle)*eyeR*0.4,eyeR*0.55,0,Math.PI*2);
      ctx.fillStyle='#111';ctx.fill();
    });
    // Lengua
    if(!IS_MOBILE){
      const tLen=r*1.2,tx1=head.x+Math.cos(angle)*r,ty1=head.y+Math.sin(angle)*r;
      const split=Math.sin(now*0.015)*0.3;
      ctx.strokeStyle='#ff2d78';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(tx1,ty1);ctx.lineTo(tx1+Math.cos(angle)*tLen,ty1+Math.sin(angle)*tLen);ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tx1+Math.cos(angle)*tLen*0.6,ty1+Math.sin(angle)*tLen*0.6);
      ctx.lineTo(tx1+Math.cos(angle+split)*tLen,ty1+Math.sin(angle+split)*tLen);
      ctx.moveTo(tx1+Math.cos(angle)*tLen*0.6,ty1+Math.sin(angle)*tLen*0.6);
      ctx.lineTo(tx1+Math.cos(angle-split)*tLen,ty1+Math.sin(angle-split)*tLen);
      ctx.stroke();
    }
    // Nombre sobre la cabeza
    ctx.save();
    ctx.globalAlpha=isPlayer?0.9:0.55;
    ctx.font=`bold ${isPlayer?13:10}px Orbitron,monospace`;
    ctx.textAlign='center';
    ctx.strokeStyle='rgba(0,0,0,0.8)';ctx.lineWidth=3;
    ctx.strokeText(s.name,head.x,head.y-r*2.8);
    ctx.fillStyle=isPlayer?s.color:'rgba(255,255,255,0.7)';
    ctx.fillText(s.name,head.x,head.y-r*2.8);
    ctx.restore();
    ctx.textAlign='left';
  }

  // ============================================================
  // MINIMAP
  // ============================================================
  _drawMinimap(){
    if(!this._mmCtx||this.player.isDead)return;

    // Actualizar cada 3 frames para ahorrar CPU (no necesita 60fps)
    this._mmFrame++;
    if(this._mmFrame%3!==0)return;

    const mc=this._mmCtx;
    const MW=this._mmCanvas.width;   // 280px interno
    const MH=this._mmCanvas.height;  // 280px interno
    const scale=MW/WORLD_SIZE;       // factor mundo→minimapa

    // ---- Fondo ----
    mc.clearRect(0,0,MW,MH);
    mc.fillStyle='rgba(5,8,18,0.0)'; // transparente (el CSS da el bg)
    mc.fillRect(0,0,MW,MH);

    // Grid tenue
    mc.strokeStyle='rgba(255,255,255,0.04)';
    mc.lineWidth=0.5;
    const gridStep=GRID_SIZE*scale*5; // cada 5 celdas del mundo
    for(let x=0;x<MW;x+=gridStep){mc.beginPath();mc.moveTo(x,0);mc.lineTo(x,MH);mc.stroke();}
    for(let y=0;y<MH;y+=gridStep){mc.beginPath();mc.moveTo(0,y);mc.lineTo(MW,y);mc.stroke();}

    // Borde del mundo
    mc.strokeStyle='rgba(57,255,20,0.3)';
    mc.lineWidth=1;
    mc.strokeRect(0.5,0.5,MW-1,MH-1);

    // ---- Orbes: puntos de 1.5px ----
    // Agruparlos en clusters para no pintar 350 puntos individuales
    // Solo pintamos 1 de cada 3 orbes
    this.orbs.forEach((o,i)=>{
      if(i%3!==0)return;
      const mx=o.x*scale, my=o.y*scale;
      mc.fillStyle=o.color;
      mc.globalAlpha=0.55;
      mc.fillRect(mx-1,my-1,2,2);
    });
    mc.globalAlpha=1;

    // ---- Bots: pequeños puntos de color ----
    this.bots.forEach(b=>{
      if(b.isDead||b.segs.length<1)return;
      const mx=b.segs[0].x*scale, my=b.segs[0].y*scale;
      mc.beginPath();
      mc.arc(mx,my,Math.max(1.5, b.segs.length*scale*0.4),0,Math.PI*2);
      mc.fillStyle=b.color;
      mc.globalAlpha=0.5;
      mc.fill();
    });
    mc.globalAlpha=1;

    // ---- Jugador: punto brillante con halo ----
    const ph=this.player.segs[0];
    const pmx=ph.x*scale, pmy=ph.y*scale;
    const pSize=Math.max(3, this.player.segs.length*scale*0.5);

    // Halo pulsante
    const pulse=Math.sin(performance.now()*0.006)*0.4+0.6;
    const halo=mc.createRadialGradient(pmx,pmy,0,pmx,pmy,pSize*3);
    halo.addColorStop(0,'rgba(57,255,20,0.5)');
    halo.addColorStop(1,'rgba(57,255,20,0)');
    mc.beginPath();mc.arc(pmx,pmy,pSize*3,0,Math.PI*2);
    mc.fillStyle=halo;mc.globalAlpha=pulse;mc.fill();
    mc.globalAlpha=1;

    // Punto del jugador
    mc.beginPath();mc.arc(pmx,pmy,pSize,0,Math.PI*2);
    mc.fillStyle=this.player.color;mc.fill();
    mc.strokeStyle='white';mc.lineWidth=0.8;mc.stroke();

    // ---- Viewport rect: área visible actualmente ----
    const pr=this._pixelRatio||1;
    const vx=this.cam.x*scale;
    const vy=this.cam.y*scale;
    const vw=(this.W/pr/this.cam.scale)*scale;
    const vh=(this.H/pr/this.cam.scale)*scale;
    mc.strokeStyle='rgba(255,255,255,0.18)';
    mc.lineWidth=0.8;
    mc.setLineDash([3,3]);
    mc.strokeRect(vx,vy,vw,vh);
    mc.setLineDash([]);
  }

  // ============================================================
  // HUD
  // ============================================================
  updateHUD(){
    const p=this.player;
    $('hud-score').textContent=this.score;
    const rank=this.allSnakes.filter(s=>!s.isDead&&s.segs.length>p.segs.length).length+1;
    $('hud-rank').textContent='#'+rank;
    $('hud-length').textContent=p.segs.length;
    const hudLvl=$('hud-level');
    if(hudLvl) hudLvl.textContent=this.cfg.label||'–';

    // Barra de boost — llena cuando puede boostear, vacía al límite
    const boostBar=$('boost-bar-fill');
    if(boostBar){
      const canBoost=p.segs.length>MIN_LENGTH+4;
      // Ratio: 0 = mínimo, 1 = lleno
      const ratio=canBoost ? Math.min(1,(p.segs.length-MIN_LENGTH-4)/(80)) : 0;
      boostBar.style.width=(ratio*100)+'%';
      boostBar.style.background=p.boosting
        ? 'linear-gradient(90deg,#ff2d78,#ff8c00)'
        : 'linear-gradient(90deg,#00d4ff,#39ff14)';
      const boostWrap=$('boost-bar-wrap');
      if(boostWrap) boostWrap.style.opacity=canBoost?'1':'0.35';
    }

    this._updateLeaderboard(rank);
  }

  _updateLeaderboard(playerRank){
    const container=$('lb-rows');
    if(!container)return;

    // Ordenar todas las serpientes vivas por tamaño descendente
    const alive=this.allSnakes
      .filter(s=>!s.isDead)
      .sort((a,b)=>b.segs.length-a.segs.length);

    // Mostrar top 8
    const top=alive.slice(0,8);
    const rows=[];
    top.forEach((s,i)=>{
      const isMe=s.isPlayer;
      const rankNum=i+1;
      rows.push(`
        <div class="lb-row${isMe?' lb-me':''}">
          <span class="lb-rank${rankNum<=3?' lb-top':''}">${rankNum}</span>
          <span class="lb-dot" style="color:${s.color};background:${s.color}"></span>
          <span class="lb-name${isMe?' lb-me-name':''}">${s.name}</span>
          <span class="lb-len${isMe?' lb-me-len':''}">${s.segs.length}</span>
        </div>`);
    });

    // Si el jugador no está en top 8, añadirlo al final
    const playerInTop=top.some(s=>s.isPlayer);
    if(!playerInTop){
      const p=this.player;
      rows.push(`
        <div style="border-top:1px solid rgba(255,255,255,0.1);margin-top:2px;padding-top:2px">
          <div class="lb-row lb-me">
            <span class="lb-rank">${playerRank}</span>
            <span class="lb-dot" style="color:${p.color};background:${p.color}"></span>
            <span class="lb-name lb-me-name">${p.name}</span>
            <span class="lb-len lb-me-len">${p.segs.length}</span>
          </div>
        </div>`);
    }

    container.innerHTML=rows.join('');
  }

  // ============================================================
  // FIN
  // ============================================================
  _endGame(){
    this.running=false;
    const elapsed=performance.now()-this.startTime;

    // ---- Título y emoji dinámicos ----
    let title,emoji;
    if(this.maxLength>=200){      title='¡LEYENDA!';       emoji='👑'; }
    else if(this.maxLength>=100){ title='¡Impresionante!'; emoji='🔥'; }
    else if(this.maxLength>=50){  title='¡Buen intento!';  emoji='⚡'; }
    else if(this._killCount>0){   title='¡Eliminado!';     emoji='💀'; }
    else{                         title='¡Eliminado!';     emoji='😵'; }

    // ---- Guardar y comparar récords ----
    const { records, newBests } = Records.update({
      score:  this.score,
      length: this.maxLength,
      timeMs: elapsed,
      kills:  this._killCount,
    }, this.level);

    // ---- Volcar stats actuales ----
    $('end-score').textContent  = this.score;
    $('end-length').textContent = this.maxLength;
    $('end-time').textContent   = fmtTime(elapsed);
    $('end-kills').textContent  = this._killCount;
    $('end-title').textContent  = title;
    $('end-emoji').textContent  = emoji;
    const lvlBadge=$('end-level-badge');
    if(lvlBadge){ lvlBadge.textContent='NIVEL: '+this.cfg.label; lvlBadge.style.display='block'; }

    // ---- Volcar récords ----
    $('rec-score').textContent  = records.score;
    $('rec-length').textContent = records.length;
    $('rec-time').textContent   = fmtTime(records.timeMs);
    $('rec-kills').textContent  = records.kills;

    // ---- Marcar nuevos récords con clase CSS ----
    const map = { score:'rec-score', length:'rec-length', time:'rec-time', kills:'rec-kills' };
    Object.values(map).forEach(id => $(`${id}`)?.parentElement?.classList.remove('is-record'));
    newBests.forEach(k => {
      const el = $(map[k]);
      if(el) el.parentElement.classList.add('is-record');
    });

    // ---- Badge "¡NUEVO RÉCORD!" ----
    const badge = $('new-record-badge');
    if(badge){
      badge.style.display = newBests.length ? 'block' : 'none';
      if(newBests.length) this._launchConfetti();
    }

    // ---- Animar stats de uno en uno ----
    const stats=document.querySelectorAll('.end-stat, .rec-stat');
    stats.forEach((el,i)=>{
      el.style.opacity='0';
      el.style.transform='translateY(20px)';
      el.style.transition='none';
      setTimeout(()=>{
        el.style.transition='opacity 0.4s ease, transform 0.4s ease';
        el.style.opacity='1';
        el.style.transform='translateY(0)';
      }, 300+i*120);
    });

    showScreen('end');
    setTimeout(()=>showKofiModal(),1800);
  }

  _launchConfetti(){
    const existing=document.getElementById('confetti-canvas');
    if(existing)existing.remove();
    const cv=document.createElement('canvas');
    cv.id='confetti-canvas';
    cv.style.cssText='position:fixed;inset:0;z-index:500;pointer-events:none;';
    cv.width=window.innerWidth; cv.height=window.innerHeight;
    document.body.appendChild(cv);
    const ctx=cv.getContext('2d');
    const COLORS=['#39ff14','#00d4ff','#ff2d78','#ffdd00','#bf5fff','#ff6b35','#00ffcc'];
    const pieces=Array.from({length:90},()=>({
      x:Math.random()*cv.width, y:-10-Math.random()*cv.height*0.3,
      vx:(Math.random()-0.5)*3, vy:2+Math.random()*4,
      rot:Math.random()*Math.PI*2, rotV:(Math.random()-0.5)*0.2,
      w:6+Math.random()*8, h:3+Math.random()*4,
      color:COLORS[Math.floor(Math.random()*COLORS.length)], alpha:1,
    }));
    let frame=0;
    const tick=()=>{
      if(frame++>140){cv.remove();return;}
      ctx.clearRect(0,0,cv.width,cv.height);
      pieces.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.08; p.rot+=p.rotV;
        if(frame>84)p.alpha=Math.max(0,p.alpha-0.025);
        ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
        ctx.globalAlpha=p.alpha;ctx.fillStyle=p.color;
        ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  destroy(){
    this.running=false;
    if(this.animId)cancelAnimationFrame(this.animId);
    window.removeEventListener('mousemove',this._onMouseMove);
    window.removeEventListener('mousedown',this._onMouseDown);
    window.removeEventListener('mouseup',  this._onMouseUp);
    window.removeEventListener('keydown',  this._onKey);
    window.removeEventListener('keyup',    this._onKeyUp);
    if(this._onResizeBound)window.removeEventListener('resize',this._onResizeBound);
    document.getElementById('confetti-canvas')?.remove();
    document.querySelectorAll('.screen-flash').forEach(el=>el.remove());
    this._particles=[];
  }
}

// ============================================================
// ARRANQUE
// ============================================================
document.addEventListener('DOMContentLoaded',()=>{
  // Añadir keyframe para flash de muerte
  const style=document.createElement('style');
  style.textContent='@keyframes hitFade{from{opacity:1}to{opacity:0}}';
  document.head.appendChild(style);

  initStart();
});
