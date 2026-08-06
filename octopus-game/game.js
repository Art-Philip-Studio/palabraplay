/* ═══════════════════════════════════════════════════════════
   OCTOPUS — game.js
   Funciona igual en PC (Chrome/Firefox/Safari) y Android/iOS
═══════════════════════════════════════════════════════════ */
'use strict';

// ── CANVAS ───────────────────────────────────────────────
// Resolución LÓGICA fija — todas las coord van aquí
const GW = 480, GH = 200;

const canvas = document.getElementById('game');
const ctx    = canvas.getContext('2d');

// Ajustamos el buffer interno al DPR real para nitidez,
// pero el CSS controla el tamaño visual via aspect-ratio + max-width/height.
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width  = GW * dpr;
  canvas.height = GH * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ── AUDIO ENGINE con masterGain ───────────────────────────
let _actx=null, _mg=null, _vol=0.7, _muted=false;
function _ac() {
  if (!_actx) {
    _actx = new (window.AudioContext||window.webkitAudioContext)();
    _mg = _actx.createGain(); _mg.gain.value=_vol; _mg.connect(_actx.destination);
  }
  return _actx;
}
function ensureAudio() { _ac(); }
function tone(freq,dur,type='square',vol=0.15,delay=0) {
  const ac=_ac(), o=ac.createOscillator(), g=ac.createGain();
  o.connect(g); g.connect(_mg); o.type=type; o.frequency.value=freq;
  const t=ac.currentTime+delay;
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+0.01);
  g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.start(t); o.stop(t+dur+0.01);
}
function setVolume(v) { _vol=Math.max(0,Math.min(1,v)); if(_mg&&!_muted) _mg.gain.value=_vol; }
function toggleMute() { _muted=!_muted; if(_mg) _mg.gain.value=_muted?0:_vol; return _muted; }

const SFX = {
  move:    ()=>tone(330,0.04,'square',0.12),
  pick:    ()=>{ tone(660,0.07); tone(880,0.1,'square',0.1,0.07); },
  deposit: ()=>[523,659,784,1047].forEach((f,i)=>tone(f,0.1,'square',0.14,i*0.07)),
  hit:     ()=>{ tone(110,0.35,'sawtooth',0.28); tone(80,0.4,'square',0.18,0.05); },
  levelup: ()=>[392,494,587,784].forEach((f,i)=>tone(f,0.12,'square',0.16,i*0.08)),
  over:    ()=>[220,180,150,110].forEach((f,i)=>tone(f,0.22,'sawtooth',0.2,i*0.14)),
};

// ── ESTADO ────────────────────────────────────────────────
let mode='A', state='idle', score=0, hiScore=0;
let lives=3, level=1, frame=0, raf=null, lastTime=0;
let showTime=false, paused=false;

const LEVEL_A=[0,50,120,210,320,450,600,770,960,9999];
const LEVEL_B=[0,30,80,150,240,350,480,630,800,9999];

// ── JUGADOR ───────────────────────────────────────────────
const ROWS=[GH*0.24, GH*0.44, GH*0.62, GH*0.80];
const player={x:GW/2,row:0,hasTreasure:false,invincible:0,bubbles:[]};

// ── PULPO ─────────────────────────────────────────────────
const octo={x:GW/2,y:GH*0.1,phase:0};
let tentacles=[];

function buildTentacles(){
  tentacles=[];
  const spd=0.018+(level-1)*0.006, mx=mode==='B'?1.35:1;
  ROWS.forEach((rowY,ri)=>{
    const arms=(mode==='B'&&ri<2)?3:2;
    for(let a=0;a<arms;a++){
      tentacles.push({rowY,ri,phase:ri+a*0.55,
        speed:(spd*(1+ri*0.25)*mx)+a*0.003,
        reach:80+ri*22+a*15, dir:a%2===0?1:-1,
        tipX:GW/2,tipY:rowY});
    }
  });
}

// ── TESORO ────────────────────────────────────────────────
const TREAS={x:GW*0.5-10,y:ROWS[3]+12,w:20,h:14};

// ── INPUT ─────────────────────────────────────────────────
const keys={left:false,right:false}, lock={left:false,right:false};

// Helper anti-doble-disparo: click + touchend (Fix 4)
function _btn(id,fn){
  const el=document.getElementById(id); if(!el) return;
  let _t=0;
  const fire=e=>{const n=Date.now();if(n-_t<400)return;_t=n;e.stopPropagation();fn(e);};
  el.addEventListener('click',fire);
  el.addEventListener('touchend',e=>{e.preventDefault();fire(e);},{passive:false});
}

// Botones LEFT/RIGHT usan ontouchstart en HTML para respuesta inmediata
function btnDown(side,e){
  if(e) e.preventDefault();
  ensureAudio(); keys[side]=true;
  document.getElementById('btn-'+side).classList.add('pressed');
  if(state==='idle'||state==='gameover'){startGame();return;}
}
function btnUp(side,e){
  if(e) e.preventDefault();
  keys[side]=false;
  document.getElementById('btn-'+side).classList.remove('pressed');
}

// Teclado (PC)
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowLeft' ||e.key==='z'||e.key==='Z') btnDown('left',null);
  if(e.key==='ArrowRight'||e.key==='x'||e.key==='X') btnDown('right',null);
  if(e.key==='Escape'||e.key==='p'||e.key==='P')     togglePause();
});
document.addEventListener('keyup',e=>{
  if(e.key==='ArrowLeft' ||e.key==='z'||e.key==='Z') btnUp('left',null);
  if(e.key==='ArrowRight'||e.key==='x'||e.key==='X') btnUp('right',null);
});

// Registrar botones tras DOM listo
window.addEventListener('DOMContentLoaded',()=>{
  _btn('btn-settings',()=>togglePause());
  _btn('pause-resume',()=>closePause());
  _btn('btn-home',    ()=>goHome());
  _btn('btn-mute',()=>{
    const m=toggleMute();
    document.getElementById('btn-mute').textContent=m?'🔇':'🔊';
  });
  const sl=document.getElementById('volume-slider');
  if(sl) sl.addEventListener('input',e=>setVolume(parseFloat(e.target.value)));
  _btn('mb-a',()=>setMode('A'));
  _btn('mb-b',()=>setMode('B'));
  _btn('mb-time',()=>toggleTime());
});

// ── PAUSA ─────────────────────────────────────────────────
function togglePause(){if(state!=='playing')return;paused?closePause():openPause();}
function openPause(){paused=true;document.getElementById('pause-overlay').classList.add('visible');}
function closePause(){paused=false;document.getElementById('pause-overlay').classList.remove('visible');}

// Fix 7: ir al index raíz del sitio
function goHome(){
  closePause();
  const base=window.location.href.replace(/\/[^/]+\/?[^/]*$/,'/');
  window.location.href=base+'index.html';
}

// ── INIT ──────────────────────────────────────────────────
function startGame(){
  score=0;lives=3;level=1;frame=0;paused=false;
  resetPlayer();buildTentacles();updateHUD();
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('pause-overlay').classList.remove('visible');
  state='playing';
  if(raf) cancelAnimationFrame(raf);
  lastTime=performance.now();
  raf=requestAnimationFrame(loop);
}
function resetPlayer(){
  player.x=GW/2;player.row=0;
  player.hasTreasure=false;player.invincible=40;player.bubbles=[];
}

// ── LOOP ──────────────────────────────────────────────────
function loop(ts){
  const dt=Math.min((ts-lastTime)/(1000/60),3);
  lastTime=ts;frame++;
  if(!paused){showTime?drawClockScreen():(updateLogic(dt),drawScene());}
  updateClockDisplay();
  raf=requestAnimationFrame(loop);
}

// ── LÓGICA ────────────────────────────────────────────────
function updateLogic(dt){
  if(state!=='playing')return;
  if(keys.left &&!lock.left) {lock.left=true;  doMove(-1);}
  if(keys.right&&!lock.right){lock.right=true; doMove(1); }
  if(!keys.left)  lock.left=false;
  if(!keys.right) lock.right=false;
  tentacles.forEach(t=>{
    t.phase+=t.speed*dt;
    t.tipX=octo.x+Math.sin(t.phase)*t.reach*t.dir;
    t.tipX=Math.max(12,Math.min(GW-12,t.tipX));
    t.tipY=t.rowY+Math.cos(t.phase*1.3)*4;
  });
  octo.phase+=0.04*dt; octo.y=GH*0.09+Math.sin(octo.phase)*5;
  if(player.invincible>0) player.invincible-=dt;
  updateBubbles(dt);
  if(player.invincible<=0) checkCollisions();
}

function doMove(dir){
  if(state!=='playing')return;
  SFX.move();
  player.x+=dir*26; player.x=Math.max(14,Math.min(GW-14,player.x));
  if(!player.hasTreasure){
    if(Math.abs(player.x-GW/2)<60&&player.row<3) player.row++;
  } else {
    if(player.row>0) player.row--;
  }
  spawnBubble();
  if(!player.hasTreasure&&player.row===3){
    if(Math.abs(player.x-(TREAS.x+TREAS.w/2))<TREAS.w&&Math.abs(ROWS[3]-TREAS.y)<30){
      player.hasTreasure=true;SFX.pick();
    }
  }
  if(player.hasTreasure&&player.row===0){
    const pts=(mode==='B'?20:10)*level;
    score+=pts;if(score>hiScore)hiScore=score;
    player.hasTreasure=false;player.x=GW/2;
    SFX.deposit();updateHUD();checkLevelUp();
  }
}

function checkLevelUp(){
  const th=mode==='B'?LEVEL_B:LEVEL_A;
  for(let l=9;l>=1;l--){
    if(score>=th[l]&&l+1>level){level=l+1;SFX.levelup();buildTentacles();updateHUD();break;}
  }
}

function checkCollisions(){
  const px=player.x,py=ROWS[player.row],PR=9;
  for(const t of tentacles){
    let dx=px-t.tipX,dy=py-t.tipY;
    if(dx*dx+dy*dy<(PR+8)*(PR+8)){onHit();return;}
    for(let s=1;s<=3;s++){
      const u=s/4,mx=lerp(octo.x,t.tipX,u),my=lerp(octo.y+16,t.tipY,u);
      dx=px-mx;dy=py-my;
      if(dx*dx+dy*dy<(PR+5)*(PR+5)){onHit();return;}
    }
  }
}

function onHit(){
  lives=Math.max(0,lives-1);player.invincible=60;
  SFX.hit();resetPlayer();updateHUD();
  const w=document.getElementById('game-wrap');
  w.classList.remove('miss');void w.offsetWidth;w.classList.add('miss');
  setTimeout(()=>w.classList.remove('miss'),350);
  if(lives<=0) gameOver();
}

function gameOver(){
  state='gameover';SFX.over();
  setTimeout(()=>{
    const ov=document.getElementById('overlay');
    ov.classList.remove('hidden');
    document.getElementById('overlay-title').textContent='GAME OVER';
    document.getElementById('overlay-sub').textContent='Presiona LEFT o RIGHT para reiniciar';
    document.getElementById('overlay-score').textContent=
      `SCORE ${String(score).padStart(5,'0')}  HI ${String(hiScore).padStart(5,'0')}`;
  },800);
}

// ── BURBUJAS ──────────────────────────────────────────────
function spawnBubble(){
  if(player.row===0)return;
  for(let i=0;i<2;i++){
    player.bubbles.push({
      x:player.x+(Math.random()-.5)*10, y:ROWS[player.row]-8,
      vx:(Math.random()-.5)*0.6, vy:-(0.6+Math.random()*0.5),
      r:1.5+Math.random()*2, life:1});
  }
}
function updateBubbles(dt){
  player.bubbles=player.bubbles.filter(b=>{
    b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=0.025*dt;return b.life>0&&b.y>-10;
  });
}

// ── MODE 7 SUELO ──────────────────────────────────────────
function drawMode7Floor(){
  const floorY=GH*0.88,horizon=GH*0.92,camD=120,tileZ=32,scrollZ=frame*0.4;
  for(let sy=floorY;sy<GH;sy++){
    const depth=camD/Math.max(sy-horizon+camD,1);
    const colStep=depth*tileZ, vOff=depth*scrollZ;
    const rowTile=Math.floor((sy*depth+vOff)/tileZ)%2;
    let sx=0;
    while(sx<GW){
      const u=(sx-GW/2)/depth, colTile=Math.floor((u+vOff)/tileZ)&1;
      ctx.fillStyle=(rowTile+colTile)%2===0
        ?`hsl(36,${40+rowTile*8}%,${18-depth*4}%)`
        :`hsl(26,${35+rowTile*6}%,${14-depth*3}%)`;
      ctx.fillRect(sx,sy,Math.ceil(colStep)+1,1);
      sx+=Math.max(1,Math.floor(colStep));
    }
  }
}

// ── DIBUJO ────────────────────────────────────────────────
function drawScene(){
  ctx.clearRect(0,0,GW,GH);
  // Fondo océano
  const bg=ctx.createLinearGradient(0,0,0,GH);
  bg.addColorStop(0.00,'#c2e8f8'); bg.addColorStop(0.12,'#6ab8d4');
  bg.addColorStop(0.30,'#1a5a88'); bg.addColorStop(0.65,'#0a2a50');
  bg.addColorStop(1.00,'#04101e');
  ctx.fillStyle=bg;ctx.fillRect(0,0,GW,GH);

  drawMode7Floor();

  // Shimmer superficie
  for(let i=0;i<6;i++){
    const wx=(i*80+frame*1.2)%(GW+80)-40;
    ctx.strokeStyle='rgba(255,255,255,0.18)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(wx,16+Math.sin(frame*0.07+i)*2);
    ctx.quadraticCurveTo(wx+25,12,wx+50,16);ctx.stroke();
  }

  drawBoat(); drawDecor();
  if(!player.hasTreasure) drawTreasure();

  // Guías de profundidad
  ROWS.forEach((ry,ri)=>{
    ctx.strokeStyle=`rgba(0,200,255,${0.06-ri*0.01})`;ctx.lineWidth=1;ctx.setLineDash([6,10]);
    ctx.beginPath();ctx.moveTo(0,ry);ctx.lineTo(GW,ry);ctx.stroke();ctx.setLineDash([]);
  });

  drawOctopus();drawTentacles();drawBubbles();
  const blink=player.invincible>0&&Math.floor(frame/4)%2===0;
  if(!blink) drawPlayer();
}

function drawBoat(){
  const bx=GW/2;
  const hg=ctx.createLinearGradient(bx-36,0,bx+36,0);
  hg.addColorStop(0,'#7a3010');hg.addColorStop(0.5,'#b05020');hg.addColorStop(1,'#7a3010');
  ctx.fillStyle=hg;
  ctx.beginPath();ctx.moveTo(bx-38,14);ctx.lineTo(bx+38,14);ctx.lineTo(bx+30,24);ctx.lineTo(bx-30,24);ctx.closePath();ctx.fill();
  ctx.fillStyle='#c06030';ctx.fillRect(bx-32,7,64,8);
  ctx.fillStyle='#e8c090';ctx.fillRect(bx-12,1,24,8);
  ctx.strokeStyle='#4a2808';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx,1);ctx.lineTo(bx,-10);ctx.stroke();
  ctx.fillStyle='#e8001e';ctx.beginPath();ctx.moveTo(bx,-10);ctx.lineTo(bx+12,-7);ctx.lineTo(bx,-4);ctx.closePath();ctx.fill();
}

function drawDecor(){
  [{x:40,c:'#d94040'},{x:GW-50,c:'#c060c0'},{x:100,c:'#e07030'},{x:GW-100,c:'#30a0e0'},{x:GW/2-80,c:'#50c060'}]
  .forEach(({x,c})=>{
    ctx.fillStyle=c;
    ctx.beginPath();ctx.arc(x,GH-18,5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(x-6,GH-22,4,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(x+6,GH-23,3.5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=c;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,GH-14);ctx.lineTo(x,GH-26);ctx.stroke();
  });
  for(let i=0;i<7;i++){
    const sx=25+i*65,sw=Math.sin(frame*0.03+i)*4;
    ctx.strokeStyle=`hsl(${130+i*8},60%,28%)`;ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(sx,GH-12);ctx.quadraticCurveTo(sx+sw+6,GH-28,sx+sw,GH-42);
    ctx.quadraticCurveTo(sx+sw-6,GH-55,sx+sw+4,GH-66);ctx.stroke();
  }
  for(let r=0;r<4;r++){
    const lx=60+r*110+Math.sin(frame*0.02+r)*8;
    const rg=ctx.createLinearGradient(lx,22,lx+30,GH*0.65);
    rg.addColorStop(0,'rgba(200,240,255,0.12)');rg.addColorStop(1,'rgba(200,240,255,0)');
    ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(lx,22);ctx.lineTo(lx+30,GH*0.65);ctx.lineTo(lx+10,GH*0.65);ctx.closePath();ctx.fill();
  }
}

function drawTreasure(){
  const{x:tx,y:ty,w:tw,h:th}=TREAS;
  ctx.shadowColor='#ffd700';ctx.shadowBlur=10+Math.sin(frame*0.1)*4;
  ctx.fillStyle='#8b6010';ctx.fillRect(tx,ty,tw,th);
  ctx.fillStyle='#c8a020';ctx.fillRect(tx+1,ty+1,tw-2,th/2);
  ctx.fillStyle='#d4b030';ctx.fillRect(tx,ty-3,tw,5);
  ctx.fillStyle='#c0c0c0';ctx.fillRect(tx+tw/2-2,ty+th/2-2,4,5);
  if(frame%8<4){ctx.fillStyle='#ffe060';[[tx-4,ty-4],[tx+tw+3,ty+2],[tx+tw/2,ty-7]].forEach(([sx,sy])=>{ctx.beginPath();ctx.arc(sx,sy,1.5,0,Math.PI*2);ctx.fill();});}
  ctx.shadowBlur=0;
}

function drawOctopus(){
  const ox=octo.x,oy=octo.y;
  const mg=ctx.createRadialGradient(ox-6,oy-6,2,ox,oy,22);
  mg.addColorStop(0,'#ff5566');mg.addColorStop(0.6,'#cc1122');mg.addColorStop(1,'#880008');
  ctx.fillStyle=mg;ctx.beginPath();ctx.ellipse(ox,oy,22,19,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(0,0,0,0.2)';
  ctx.beginPath();ctx.ellipse(ox-8,oy-5,6,4,-0.3,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(ox+8,oy-5,6,4,0.3,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.ellipse(ox-9,oy,6,5,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(ox+9,oy,6,5,0,0,Math.PI*2);ctx.fill();
  const ang=Math.atan2(ROWS[player.row]-oy,player.x-ox),pe=2.5;
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.arc(ox-9+Math.cos(ang)*pe,oy+Math.sin(ang)*pe,3,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(ox+9+Math.cos(ang)*pe,oy+Math.sin(ang)*pe,3,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.25)';ctx.beginPath();ctx.ellipse(ox-6,oy-8,7,4,-0.5,0,Math.PI*2);ctx.fill();
}

function drawTentacles(){
  tentacles.forEach(t=>{
    const sx=octo.x+(t.dir>0?10:-10),sy=octo.y+17,ex=t.tipX,ey=t.tipY;
    const cp1x=sx+(ex-sx)*0.25+Math.sin(t.phase+1)*18,cp1y=sy+(ey-sy)*0.45+25;
    const cp2x=sx+(ex-sx)*0.75+Math.cos(t.phase+0.5)*14,cp2y=ey-20;
    ctx.strokeStyle='#660008';ctx.lineWidth=7;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(sx,sy);ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,ex,ey);ctx.stroke();
    ctx.strokeStyle='#cc1122';ctx.lineWidth=5;
    ctx.beginPath();ctx.moveTo(sx,sy);ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,ex,ey);ctx.stroke();
    ctx.fillStyle='#ff6677';
    for(let s=1;s<=4;s++){
      const u=s/5,cx2=cB(sx,cp1x,cp2x,ex,u),cy2=cB(sy,cp1y,cp2y,ey,u);
      ctx.beginPath();ctx.arc(cx2,cy2,3,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#880015';ctx.lineWidth=0.5;ctx.stroke();
    }
    ctx.shadowColor='#ff2244';ctx.shadowBlur=8;
    ctx.fillStyle='#ff3355';ctx.beginPath();ctx.arc(ex,ey,7,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff8899';ctx.beginPath();ctx.arc(ex-2,ey-2,3,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
  });
}
function cB(p0,p1,p2,p3,t){const u=1-t;return u*u*u*p0+3*u*u*t*p1+3*u*t*t*p2+t*t*t*p3;}

function drawBubbles(){
  player.bubbles.forEach(b=>{
    ctx.globalAlpha=b.life*0.7;ctx.strokeStyle='rgba(180,230,255,0.8)';ctx.lineWidth=0.8;
    ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
  });
}

function drawPlayer(){
  const px=player.x,py=ROWS[player.row];
  ctx.strokeStyle='rgba(255,255,255,0.25)';ctx.lineWidth=1;ctx.setLineDash([3,5]);
  ctx.beginPath();ctx.moveTo(px,24);ctx.lineTo(px,py-14);ctx.stroke();ctx.setLineDash([]);
  const bg2=ctx.createRadialGradient(px-3,py-2,1,px,py+2,9);
  bg2.addColorStop(0,'#4488ff');bg2.addColorStop(1,'#1133cc');
  ctx.fillStyle=bg2;ctx.beginPath();ctx.ellipse(px,py+2,7,9,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#f8c840';ctx.beginPath();ctx.arc(px,py-8,8,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#aaddff';ctx.beginPath();ctx.arc(px,py-8,5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.beginPath();ctx.arc(px-2,py-10,2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#229922';
  ctx.beginPath();ctx.ellipse(px-10,py+10,9,3,-0.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+10,py+10,9,3,0.5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#cc8800';ctx.beginPath();ctx.ellipse(px+8,py,3,7,0.2,0,Math.PI*2);ctx.fill();
  if(player.hasTreasure){
    ctx.shadowColor='#ffd700';ctx.shadowBlur=10;ctx.fillStyle='#ffd700';
    ctx.beginPath();ctx.arc(px-12,py+2,7,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#8b6014';ctx.lineWidth=1;ctx.stroke();ctx.shadowBlur=0;
    if(frame%6<3){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(px-14,py-2,1.5,0,Math.PI*2);ctx.fill();}
  }
}

// ── RELOJ ─────────────────────────────────────────────────
function drawClockScreen(){
  ctx.clearRect(0,0,GW,GH);
  const g=ctx.createLinearGradient(0,0,0,GH);
  g.addColorStop(0,'#001020');g.addColorStop(1,'#000408');
  ctx.fillStyle=g;ctx.fillRect(0,0,GW,GH);
  ctx.fillStyle='rgba(0,255,200,0.06)';
  for(let cx=20;cx<GW;cx+=30) for(let cy=20;cy<GH;cy+=30){ctx.beginPath();ctx.arc(cx,cy,1,0,Math.PI*2);ctx.fill();}
  const n=new Date(),hh=String(n.getHours()).padStart(2,'0'),mm=String(n.getMinutes()).padStart(2,'0'),ss=String(n.getSeconds()).padStart(2,'0');
  ctx.fillStyle='#00ffe0';ctx.font='36px "Press Start 2P"';ctx.textAlign='center';
  ctx.shadowColor='#00ffe0';ctx.shadowBlur=18;ctx.fillText(`${hh}:${mm}`,GW/2,GH/2+4);ctx.shadowBlur=0;
  ctx.font='10px "Press Start 2P"';ctx.fillStyle='#006655';ctx.fillText(ss,GW/2,GH/2+22);
  ctx.font='7px "Press Start 2P"';ctx.fillStyle='#004433';
  ctx.fillText(['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'][n.getDay()],GW/2,GH/2+40);
  ctx.textAlign='left';
}

// ── HUD ───────────────────────────────────────────────────
function updateClockDisplay(){
  const n=new Date();
  document.getElementById('clock-display').textContent=
    `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
}
function updateHUD(){
  document.getElementById('score-val').textContent=String(score).padStart(5,'0');
  document.getElementById('hi-val').textContent=String(hiScore).padStart(5,'0');
  document.getElementById('mode-badge').textContent=`GAME ${mode}`;
  document.getElementById('level-badge').textContent=`LV ${level}`;
  for(let i=1;i<=3;i++) document.getElementById('h'+i).classList.toggle('active',i<=lives);
  document.getElementById('mb-a').classList.toggle('active',mode==='A');
  document.getElementById('mb-b').classList.toggle('active',mode==='B');
}

function setMode(m){ensureAudio();mode=m;updateHUD();}
function toggleTime(){ensureAudio();showTime=!showTime;}
function lerp(a,b,t){return a+(b-a)*t;}

// ── BOOT ──────────────────────────────────────────────────
updateHUD();updateClockDisplay();
setInterval(updateClockDisplay,10000);

// Animación idle mientras se espera al jugador
(function idleDraw(){
  if(state!=='idle')return;
  frame++;
  octo.phase+=0.04;octo.y=GH*0.09+Math.sin(octo.phase)*5;
  if(!tentacles.length) buildTentacles();
  tentacles.forEach(t=>{
    t.phase+=t.speed;
    t.tipX=octo.x+Math.sin(t.phase)*t.reach*t.dir;
    t.tipX=Math.max(12,Math.min(GW-12,t.tipX));
    t.tipY=t.rowY+Math.cos(t.phase*1.3)*4;
  });
  drawScene();
  requestAnimationFrame(idleDraw);
})();
