import { createSession, move, undo, solve, isSolved, isAllowed, dailyIndex } from './engine.js';

const levels = await fetch('/src/levels.json').then(r => { if (!r.ok) throw Error('No se pudo cargar el catálogo'); return r.json(); });
const $ = (selector, root=document) => root.querySelector(selector);
const main = $('#main');
const palette = ['Ámbar · punto', 'Turquesa · líneas', 'Lavanda · cruz'];
const marks = ['●','≋','+'];
const defaults = {theme:'dark',reduced:false,sound:false,haptic:false,harder:false,metrics:false};
const emptyData = () => ({version:1,prefs:{...defaults},solved:[],sessions:[],resume:null,tutorialDone:false});
let storageAvailable = true;
function load() {
  try {
    const data = JSON.parse(localStorage.getItem('nexo-v1') || 'null');
    if (!data || data.version!==1) return emptyData();
    const prefs = {...defaults};
    for (const key of Object.keys(prefs)) {
      if (key==='theme' ? ['dark','light','system'].includes(data.prefs?.[key]) : typeof data.prefs?.[key]==='boolean') prefs[key]=data.prefs[key];
    }
    const validState = (s,n) => Array.isArray(s) && s.length===n && s.every(v=>Number.isInteger(v)&&v>=0&&v<=2);
    const level = levels.find(l=>l.id===data.resume?.id);
    const resume = level && validState(data.resume.state,level.nodes.length) && Array.isArray(data.resume.history) && data.resume.history.every(s=>validState(s,level.nodes.length)) ? data.resume : null;
    return {...emptyData(),prefs,solved:Array.isArray(data.solved)?data.solved.filter(id=>levels.some(l=>l.id===id)):[],sessions:prefs.metrics&&Array.isArray(data.sessions)?data.sessions.slice(-100):[],resume,tutorialDone:data.tutorialDone===true};
  } catch { storageAvailable=false; return emptyData(); }
}
let data=load(), view='home', mode='reset', session=null, selected=null, hintStep=0, hintPair=null;
let playing=false, started=0, elapsed=0, hints=0, restarts=0, totalMoves=0, tutorial=0, drag=null, suppressClick=false, feedback='';
let audioContext;
const modes = {
  daily:{title:'DESPIERTA.',subtitle:'Un pequeño descubrimiento para empezar.',duration:'2–4 min',label:'El reto del día',number:'01',icon:'sun'},
  reset:{title:'REINICIA.',subtitle:'Cambia el ruido por una conexión.',duration:'2–3 min',label:'Una pausa breve',number:'02',icon:'orbit'},
  deep:{title:'PROFUNDIZA.',subtitle:'Pocas piezas. Una idea más lejos.',duration:'4–5 min',label:'Un poco más de reto',number:'03',icon:'layers'}
};
const dateKey = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
function save() { try { localStorage.setItem('nexo-v1',JSON.stringify(data)); } catch { storageAvailable=false; } }
function announce(message) { $('#announcer').textContent=''; setTimeout(()=>$('#announcer').textContent=message,30); }
function applyPrefs() {
  const systemLight=matchMedia('(prefers-color-scheme: light)').matches;
  document.documentElement.dataset.theme=data.prefs.theme==='system' ? (systemLight?'light':'dark') : data.prefs.theme;
  document.documentElement.dataset.reduced=String(data.prefs.reduced || matchMedia('(prefers-reduced-motion: reduce)').matches);
  $('meta[name="theme-color"]').content=document.documentElement.dataset.theme==='light'?'#F0EDE5':'#101820';
}
applyPrefs();
matchMedia('(prefers-color-scheme: light)').addEventListener('change',applyPrefs);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',applyPrefs);
function sound() {
  if (data.prefs.haptic && navigator.vibrate) navigator.vibrate(12);
  if (!data.prefs.sound) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume();
    const o=audioContext.createOscillator(), g=audioContext.createGain();
    o.frequency.value=440; o.type='sine'; g.gain.setValueAtTime(.035,audioContext.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.18);
    o.connect(g); g.connect(audioContext.destination); o.start(); o.stop(audioContext.currentTime+.18);
  } catch { /* Audio is optional. */ }
}
function icon(name) {
  const paths={sun:'<circle cx="16" cy="16" r="5"/><path d="M16 2v4m0 20v4M2 16h4m20 0h4M6 6l3 3m14 14 3 3M6 26l3-3M23 9l3-3"/>',orbit:'<circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="3"/><path d="M6 6l20 20"/>',layers:'<path d="m16 4 12 7-12 7L4 11Zm-12 13 12 7 12-7M4 23l12 7 12-7"/>'};
  return `<svg viewBox="0 0 32 32" aria-hidden="true">${paths[name]}</svg>`;
}
function art() {
  return `<div class="artboard" aria-hidden="true"><div class="art-grid"></div><svg class="art-lines" viewBox="0 0 460 400"><circle cx="230" cy="200" r="151"/><path d="M112 108 349 109 350 292 112 293 112 108 350 292M349 109 112 293"/><path class="accent-path" d="M112 108 349 109"/></svg><div class="art-node art-a"><span>●</span></div><div class="art-node art-b"><span>≋</span></div><div class="art-node art-c"><span>+</span></div><div class="art-node art-d"><span>●</span></div><span class="art-coordinate coord-one">01</span><span class="art-coordinate coord-two">02</span><span class="art-coordinate coord-three">03</span><span class="art-coordinate coord-four">04</span><span class="art-note">CONECTA PARA TRANSFORMAR</span><span class="art-spark">+</span></div>`;
}
function nav() {
  document.querySelectorAll('[data-nav]').forEach(el=>{const active=el.dataset.nav===(['game','done','rest','tutorial'].includes(view)?'home':view);el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
  $('#section-label').textContent=view==='game'?'UNA COSA A LA VEZ':view==='collection'?'PEQUEÑOS SISTEMAS, GRANDES IDEAS':'EL ARTE DE HACER UNA PAUSA';
}
function show(next, focus=true) {
  if (view==='game' && next!=='game') pauseClock();
  view=next; document.body.dataset.view=view; nav();
  ({home:renderHome,collection:renderCollection,about:renderAbout,game:renderGame,done:renderDone,rest:renderRest,tutorial:renderTutorial})[view]();
  if(focus) { main.focus(); window.scrollTo({top:0,behavior:'instant'}); }
}
function renderHome() {
  const m=modes[mode];
  main.innerHTML=`<section class="home-hero"><div class="hero-copy"><div class="overline"><span class="small-line"></span>UNA PAUSA CON SENTIDO</div><h1>${m.title}</h1><p class="hero-description">${m.subtitle}<br>Un reto, un momento para ti.<br>Y después, sigue con tu día.</p><button class="primary" id="begin">${mode==='daily'?'Abrir el reto de hoy':'Empezar mi pausa'}<span aria-hidden="true"><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></button><div class="hero-meta"><span class="clock-icon" aria-hidden="true">◷</span>${m.duration}<span class="meta-dot">·</span>Sin reloj. A tu ritmo.</div>${data.resume?'<button class="text-button resume" id="resume">Continuar mi puzzle pendiente ↗</button>':''}</div>${art()}</section><section class="modes-section" aria-label="Elige tu pausa"><div class="section-heading"><h2>¿Qué necesitas ahora?</h2><span>TRES FORMAS DE ENCONTRARTE</span></div><div class="mode-grid">${Object.entries(modes).map(([key,item])=>`<button class="mode-card ${mode===key?'chosen':''}" data-mode="${key}" aria-pressed="${mode===key}"><div class="mode-top">${icon(item.icon)}<span>${item.number} /</span></div><h3>${item.title}<span aria-hidden="true"><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></h3><p>${item.label}</p><div class="mode-bottom"><span>${item.duration}</span>${mode===key?'<span class="selected-pill">TU PAUSA</span>':'<span>Explorar</span>'}</div></button>`).join('')}</div></section><div class="home-note"><span class="note-symbol" aria-hidden="true">✳</span><p>No necesitas llegar más lejos.<br><strong>Solo estar aquí un momento.</strong></p><button class="text-button" id="learn">¿Cómo se juega? <span aria-hidden="true">→</span></button></div>`;
  $('#begin').onclick=()=>startLevel(chooseLevel());
  $('#resume')?.addEventListener('click',resume);
  document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;renderHome();$(`[data-mode="${mode}"]`).focus();});
  $('#learn').onclick=()=>{tutorial=0;show('tutorial');};
}
function chooseLevel() {
  if(mode==='daily') return levels[dailyIndex(dateKey(),levels.length)];
  const min=mode==='deep'||data.prefs.harder?5:0, max=mode==='deep'||data.prefs.harder?10:5;
  const group=levels.slice(min,max);
  if(data.prefs.metrics && data.sessions.length>=3 && !data.prefs.harder && mode==='reset') {
    const recent=data.sessions.slice(-3);
    if(recent.every(s=>s.completed && s.hints===0 && s.moves<=s.minimum+1)) return levels.slice(5).find(l=>!data.solved.includes(l.id))||levels[5];
  }
  return group.find(l=>!data.solved.includes(l.id))||group[0];
}
function startLevel(level, restoring=false) {
  if(!restoring) {
    if(session && data.resume) record(false);
    session=createSession(level);elapsed=0;hints=0;restarts=0;totalMoves=0;
  }
  selected=null;hintStep=0;hintPair=null;feedback='';started=performance.now();playing=true;
  persistSession();show('game');
}
function persistSession() {
  if(!session) return;
  data.resume={id:session.level.id,state:session.state,history:session.history,elapsed:elapsed+(playing?performance.now()-started:0),hints,restarts,totalMoves,mode};save();
}
function pauseClock() { if(playing) {elapsed+=performance.now()-started;playing=false;persistSession();} }
function resume() {
  const r=data.resume,level=levels.find(l=>l.id===r?.id); if(!level)return;
  session={...createSession(level),state:[...r.state],history:r.history.map(s=>[...s])};elapsed=Number.isFinite(r.elapsed)?r.elapsed:0;hints=r.hints||0;restarts=r.restarts||0;totalMoves=r.totalMoves||r.history.length;mode=modes[r.mode]?r.mode:'reset';
  startLevel(level,true);
}
function targetMarkup(level) {
  return `<div class="target-label"><span class="eyebrow">TU OBJETIVO</span><span>Iguala cada posición</span></div><ol class="target-nodes" aria-label="Patrón objetivo">${level.target.map((c,i)=>`<li><span class="target-chip color-${c}" role="img" aria-label="Posición ${i+1}: ${palette[c]}"><span aria-hidden="true">${marks[c]}</span></span><span class="target-index">${i+1}</span></li>`).join('')}</ol>`;
}
function renderGame(focusNode=null) {
  const l=session.level;
  main.innerHTML=`<section class="game-view"><div class="game-top"><button class="text-button" id="pause">← Guardar y salir</button><span class="eyebrow">${String(l.id).padStart(2,'0')} / 10 <span class="slash">—</span> ${l.family}</span></div><div class="game-heading"><div><div class="overline">${l.title}</div><h1>ORDENA.</h1><p>${l.rule==='swap'?'Une dos piezas para intercambiar sus símbolos.':'Intercambia y transforma al siguiente vecino del destino.'}</p></div><button class="round-help" id="rule-help" aria-label="Ver las reglas">?</button></div><div class="play-layout"><div class="board-area"><span class="board-instruction">${selected===null?'ARRASTRA O TOCA DOS PIEZAS':`PIEZA ${selected+1} ELEGIDA · TOCA UN DESTINO`}</span><div class="board" id="board" role="group" aria-label="Tablero de ${l.nodes.length} piezas. Conecta por las líneas visibles."><svg viewBox="0 0 100 100" preserveAspectRatio="none" class="edges" aria-hidden="true">${l.edges.map(([a,b])=>`<line x1="${l.nodes[a].x}" y1="${l.nodes[a].y}" x2="${l.nodes[b].x}" y2="${l.nodes[b].y}" class="${hintPair&&hintPair.includes(a)&&hintPair.includes(b)?'hint-edge':''}"/>`).join('')}<line id="drag-line" x1="0" y1="0" x2="0" y2="0" class="drag-line" visibility="hidden"/></svg>${l.nodes.map((n,i)=>`<button class="node color-${session.state[i]} ${selected===i?'is-selected':''} ${hintPair?.includes(i)?'hint-node':''} ${session.events.some(e=>e.nodes.includes(i))?'changed':''}" data-node="${i}" style="--x:${n.x}%;--y:${n.y}%" aria-label="Pieza ${i+1}, ${palette[session.state[i]]}" aria-pressed="${selected===i}"><span class="node-mark" aria-hidden="true">${marks[session.state[i]]}</span><span class="node-number" aria-hidden="true">${i+1}</span></button>`).join('')}</div><div class="board-caption"><span class="live-dot"></span>${l.rule==='swap'?'Una conexión. Dos piezas que cambian.':'Una conexión. Una onda que continúa.'}</div></div><aside class="puzzle-aside">${targetMarkup(l)}<div class="rule-card"><span class="eyebrow">${l.rule==='swap'?'01 / INTERCAMBIO':'02 / PROPAGACIÓN'}</span><p>${l.rule==='swap'?'Los símbolos viajan de una pieza a otra. Las líneas marcan los caminos posibles.':'Tras intercambiar, el siguiente nodo del destino en sentido horario cambia: ● → ≋ → + → ●. También puede ser el origen.'}</p>${l.rule==='propagate'?'<span class="rule-direction">1 → 2 → … → 1 · sentido horario</span>':''}</div><div class="hint-box ${feedback?'has-hint':''}" role="status">${feedback||'Prueba una conexión.<br>Puedes deshacer todas las veces que quieras.'}</div><div class="game-controls"><button class="secondary" id="undo" ${!session.history.length?'disabled':''}><span aria-hidden="true">↶</span> Deshacer</button><button class="secondary" id="hint"><span aria-hidden="true">✧</span> Pista</button></div><button class="text-button reset-button" id="restart">Reiniciar puzzle ↻</button><span class="moves-label">${session.history.length} ${session.history.length===1?'movimiento':'movimientos'} · sin límite</span></aside></div></section>`;
  $('#pause').onclick=()=>{pauseClock();show('home');announce('Puzzle guardado. Puedes volver cuando quieras.');};
  $('#undo').onclick=undoMove; $('#restart').onclick=restart; $('#hint').onclick=giveHint;
  $('#rule-help').onclick=()=>{feedback=l.rule==='swap'?'Conecta solo piezas unidas por una línea. Sus símbolos se intercambian. El objetivo muestra el símbolo de cada posición.':'La dirección importa: el vecino horario se cuenta desde el destino y también puede ser el origen. Sigue la numeración visible. ● cambia a ≋, ≋ a + y + a ●.';renderGame();};
  document.querySelectorAll('[data-node]').forEach(el=>{
    el.onclick=()=>{if(suppressClick){suppressClick=false;return;}selectNode(Number(el.dataset.node));};
    el.onpointerdown=e=>{
      if(e.button!==0)return;
      drag={from:Number(el.dataset.node),x:e.clientX,y:e.clientY,moved:false};
      el.setPointerCapture(e.pointerId);
    };
    el.onpointermove=e=>{
      if(!drag)return;
      if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8)drag.moved=true;
      if(!drag.moved)return;
      const r=$('#board').getBoundingClientRect(), n=l.nodes[drag.from],line=$('#drag-line');
      line.setAttribute('x1',n.x);line.setAttribute('y1',n.y);line.setAttribute('x2',(e.clientX-r.left)/r.width*100);line.setAttribute('y2',(e.clientY-r.top)/r.height*100);line.setAttribute('visibility','visible');
    };
    el.onpointerup=e=>{
      if(!drag)return;
      const d=drag;drag=null;
      $('#drag-line').setAttribute('visibility','hidden');
      if(d.moved){
        suppressClick=true;setTimeout(()=>suppressClick=false,50);
        const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-node]');
        if(target&&Number(target.dataset.node)!==d.from)connect(d.from,Number(target.dataset.node));
      }
    };
    el.onpointercancel=()=>{drag=null;$('#drag-line')?.setAttribute('visibility','hidden');};
    let inspectTimer;
    el.addEventListener('pointerdown',()=>{inspectTimer=setTimeout(()=>{if(drag&&!drag.moved&&session.events.length){const message=session.events.map(e=>e.type==='swap'?`Se intercambiaron las piezas ${e.nodes.map(n=>n+1).join(' y ')}.`:`La onda cambió la pieza ${e.nodes[0]+1}.`).join(' ');announce(message);feedback=message;$('.hint-box').textContent=message;}},650);});
    for(const type of ['pointerup','pointercancel','pointermove'])el.addEventListener(type,()=>clearTimeout(inspectTimer));
  });
  if(focusNode!==null)$(`[data-node="${focusNode}"]`)?.focus({preventScroll:true});
}
function selectNode(i) {
  if(selected===null){selected=i;renderGame(i);return;}
  if(selected===i){selected=null;renderGame(i);return;}
  connect(selected,i);
}
function connect(a,b) {
  if(!isAllowed(session.level,a,b)){feedback='Estas piezas no comparten una línea. Elige una conexión visible.';selected=null;renderGame(a);announce(feedback);return;}
  session=move(session,a,b);totalMoves++;selected=null;hintPair=null;hintStep=0;feedback='';sound();persistSession();
  const msg=session.events.map(e=>e.type==='swap'?`Intercambio entre ${a+1} y ${b+1}.`:`La onda transforma la pieza ${e.nodes[0]+1}.`).join(' ');
  if(isSolved(session.level,session.state))complete();else{renderGame(b);announce(msg);}
}
function undoMove() {
  session=undo(session);selected=null;hintPair=null;hintStep=0;feedback='Un paso atrás. Todo vuelve a su lugar.';persistSession();renderGame();$('#undo').disabled?$('#hint').focus():$('#undo').focus();announce(feedback);
}
function restart() {
  session=createSession(session.level);restarts++;selected=null;hintPair=null;hintStep=0;feedback='De nuevo, sin ninguna penalización.';persistSession();renderGame();$('#restart').focus();announce(feedback);
}
function giveHint() {
  const path=solve(session.level,session.state);
  if(!path?.length){feedback='Ya has encontrado el objetivo.';renderGame();return;}
  hintStep=Math.min(hintStep+1,3);hints++;
  const [a,b]=path[0];
  if(hintStep===1){feedback=`Mira la pieza ${a+1} y compárala con su objetivo.`;hintPair=[a];}
  if(hintStep===2){feedback=session.level.rule==='swap'?`La relación entre las piezas ${a+1} y ${b+1} puede acercarte al objetivo.`:`La dirección ${a+1} → ${b+1} importa: observa también el vecino horario del destino.`;hintPair=[a,b];}
  if(hintStep===3){feedback=`Primer paso: conecta la pieza ${a+1} con la ${b+1}, en ese orden. Después vuelve a mirar el objetivo.`;hintPair=[a,b];}
  persistSession();renderGame();$('#hint').focus();announce(feedback);
}
function record(completed) {
  if(!data.prefs.metrics || !session)return;
  data.sessions.push({date:dateKey(),level:session.level.id,mode,completed,seconds:Math.round((elapsed+(playing?performance.now()-started:0))/1000),moves:totalMoves,netMoves:session.history.length,minimum:session.level.suggestedMoves,hints,restarts});
  data.sessions=data.sessions.slice(-100);save();
}
function complete() {
  pauseClock();record(true);
  if(!data.solved.includes(session.level.id))data.solved.push(session.level.id);
  data.resume=null;save();show('done');announce('Hecho. Has igualado todas las posiciones. Ahora sigue con tu día.');
}
function renderDone() {
  main.innerHTML=`<section class="ending"><div class="overline">TODAS LAS PIEZAS EN SU LUGAR</div><div class="resolved-art" aria-hidden="true">${session.state.map(c=>`<span class="resolved-node color-${c}">${marks[c]}</span>`).join('')}</div><h1>HECHO.</h1><p>Ahora sigue con tu día.</p><span class="ending-note">El reto termina aquí.<br>Lo que viene después es tuyo.</span><button class="primary" id="finish">Cerrar <span aria-hidden="true"><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></button><details class="more-menu"><summary>Otras opciones</summary><button class="text-button" id="another">Elegir otra partida</button><button class="text-button" id="review">Volver al último movimiento</button></details></section>`;
  $('#finish').onclick=()=>{session=null;show('rest');};
  $('#another').onclick=()=>{session=null;show('collection');};
  $('#review').onclick=()=>{session=undo(session);started=performance.now();playing=true;hintPair=null;selected=null;feedback='';persistSession();show('game');};
}
function renderRest() {
  main.innerHTML=`<section class="ending rest"><span class="rest-symbol" aria-hidden="true">✳</span><div class="overline">LA PAUSA ESTÁ COMPLETA</div><h1>HASTA<br>LUEGO.</h1><p>Puedes cerrar esta ventana.<br>Tu día te espera.</p><button class="text-button" id="back-home">Volver al inicio</button></section>`;
  $('#back-home').onclick=()=>show('home');
}
function renderCollection() {
  main.innerHTML=`<section class="collection"><div class="overline">VOL. 01 / DIEZ PEQUEÑOS DESCUBRIMIENTOS</div><h1>CONECTA.</h1><p class="page-description">Sin candados, sin un camino obligatorio.<br>Elige la idea que te apetezca explorar.</p>${['RESONANCIA','PROPAGACIÓN'].map((family,k)=>`<div class="family-heading"><h2>${family}</h2><span>${k?'Una conexión afecta a su vecino.':'Una conexión intercambia dos símbolos.'}</span></div><div class="level-grid">${levels.filter(l=>l.family===family).map(l=>`<button class="level-card" data-level="${l.id}"><span class="level-number">${String(l.id).padStart(2,'0')}</span><span class="level-name">${l.title}<small>${l.nodes.length} piezas · ${l.rule==='swap'?'intercambio':'propagación'}</small></span><span class="level-complete" aria-label="${data.solved.includes(l.id)?'Resuelto':'Disponible'}">${data.solved.includes(l.id)?'✓':'<svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>'}</span></button>`).join('')}</div>`).join('')}</section>`;
  document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{mode=Number(b.dataset.level)>5?'deep':'reset';startLevel(levels.find(l=>l.id===Number(b.dataset.level)));});
}
function renderAbout() {
  main.innerHTML=`<section class="about"><div class="overline">ABRE. COMPRENDE. RESUELVE. CIERRA.</div><h1>MENOS.<br>PERO MEJOR.</h1><p class="about-lead">Un espacio pequeño para<br>una idea que merece tu atención.</p><div class="about-grid"><article><span class="eyebrow">01 / UNA SOLA COSA</span><h2>Conectar para transformar.</h2><p>Une dos piezas por una línea. Observa lo que cambia. Encuentra el patrón que ves en el objetivo. La profundidad está en las relaciones.</p></article><article><span class="eyebrow">02 / A TU RITMO</span><h2>El tiempo es tuyo.</h2><p>No hay cuenta atrás, rachas ni penalizaciones. Deshaz, pide una pista o deja el puzzle para otro momento.</p></article><article><span class="eyebrow">03 / UN FINAL CLARO</span><h2>Resolver y seguir.</h2><p>Sin anuncios, recompensas sorpresa ni otra partida automática. Un reto es suficiente; tú decides cuándo volver.</p></article><article><span class="eyebrow">04 / SIN PROMESAS VACÍAS</span><h2>Un juego. Una pausa.</h2><p>NEXO es entretenimiento, no un tratamiento ni una promesa de mejora cognitiva. Nombre provisional y prototipo en validación.</p></article></div><button class="primary" id="about-learn">Aprender jugando <span aria-hidden="true"><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></button></section>`;
  $('#about-learn').onclick=()=>{tutorial=0;show('tutorial');};
}
function renderTutorial() {
  const words=['TOCA.','UNE.','CAMBIA.','ORDENA.'];
  const copy=['Todo empieza con una pieza.','Toca las dos piezas para conectarlas.','Al conectar, sus símbolos se intercambian.','Ahora busca el patrón del objetivo.'];
  main.innerHTML=`<section class="tutorial"><div class="game-top"><span class="eyebrow">UN MINUTO PARA DESCUBRIRLO</span><button class="text-button" id="skip-tutorial">Ir al puzzle →</button></div><h1>${words[tutorial]}</h1><p>${copy[tutorial]}</p><div class="tutorial-stage ${tutorial===1?'guide':''}">${tutorial===0?'<button class="tutorial-node color-0" id="touch" aria-label="Toca la pieza para descubrir dos nodos">●</button>':tutorial<3?`<div class="tutorial-connection" aria-hidden="true"></div><button class="tutorial-node color-${tutorial===2?1:0}" id="tutorial-a" aria-label="Seleccionar primera pieza">${tutorial===2?'≋':'●'}</button><button class="tutorial-node color-${tutorial===2?0:1}" id="tutorial-b" aria-label="Conectar segunda pieza">${tutorial===2?'●':'≋'}</button>`:'<div class="tutorial-target" aria-hidden="true"><span class="target-chip color-1">≋</span><span class="target-chip color-0">●</span><span class="target-chip color-0">●</span><span class="target-chip color-2">+</span></div>'}</div><div class="tutorial-dots" aria-label="Paso ${tutorial+1} de 4">${words.map((_,i)=>`<i class="${i<=tutorial?'active':''}"></i>`).join('')}</div>${tutorial>=2?`<button class="primary" id="tutorial-next">${tutorial===3?'Probar mi primer puzzle':'Ver el objetivo'} <span aria-hidden="true"><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></button>`:'<p class="fine-print">También puedes jugar arrastrando una pieza hasta otra.</p>'}</section>`;
  $('#touch')?.addEventListener('click',()=>{tutorial=1;renderTutorial();sound();$('#tutorial-a').focus();});
  let first=false;
  for(const id of ['tutorial-a','tutorial-b'])$('#'+id)?.addEventListener('click',()=>{
    if(tutorial!==1)return;
    if(!first){first=id;$('#'+id).classList.add('is-selected');$('#'+(id==='tutorial-a'?'tutorial-b':'tutorial-a')).focus();}
    else if(first!==id){tutorial=2;renderTutorial();sound();announce('Los símbolos han cambiado de lugar.');$('#tutorial-next').focus();}
  });
  $('#tutorial-next')?.addEventListener('click',()=>{if(tutorial===2){tutorial=3;renderTutorial();$('#tutorial-next').focus();}else{data.tutorialDone=true;save();startLevel(levels[0]);}});
  $('#skip-tutorial').onclick=()=>startLevel(levels[0]);
}
document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>show(b.dataset.nav));
$('.brand').onclick=e=>{e.preventDefault();show('home');};
const dialog=$('#settings'), form=$('#preferences');
function openSettings() {
  if(view==='game')pauseClock();
  for(const key of Object.keys(defaults)){if(key==='theme')form.elements[key].value=data.prefs[key];else form.elements[key].checked=data.prefs[key];}
  $('#storage-notice').textContent=storageAvailable?'Progreso y preferencias se guardan solo en este navegador. Sin cuenta ni conexión obligatoria.':'El almacenamiento está bloqueado. Puedes jugar, pero el progreso se perderá al cerrar.';
  dialog.showModal();
}
$('#settings-open').onclick=openSettings;$('.mobile-settings').onclick=openSettings;
$('#settings-close').onclick=()=>dialog.close();
dialog.addEventListener('close',()=>{if(view==='game'&&!document.hidden){started=performance.now();playing=true;}});
form.onchange=()=>{
  for(const key of Object.keys(defaults))data.prefs[key]=key==='theme'?form.elements[key].value:form.elements[key].checked;
  if(!data.prefs.metrics)data.sessions=[];
  save();applyPrefs();
};
$('#clear-data').onclick=()=>{
  if(!confirm('¿Borrar progreso, puzzle pendiente, preferencias y métricas de este dispositivo?'))return;
  data=emptyData();session=null;playing=false;save();applyPrefs();dialog.close();show('home');announce('Datos locales borrados.');
};
$('#export-data').onclick=()=>{
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='nexo-mis-datos.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&selected!==null&&view==='game'){selected=null;renderGame();}});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden)pauseClock();else if(view==='game'&&!dialog.open){started=performance.now();playing=true;}
});
window.addEventListener('pagehide',()=>{pauseClock();});
const shortcut=new URLSearchParams(location.search).get('mode');
if(modes[shortcut]){
  mode=shortcut;
  if(data.resume?.mode===shortcut && (shortcut!=='daily'||data.resume.id===chooseLevel().id))resume();
  else startLevel(chooseLevel());
}else show('home',false);
if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
