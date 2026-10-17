import {solve,transition} from './engine.js';
export const worldFor=l=>Number.isInteger(l?.world)?l.world:l?.id==='wave'||l?.id>=4&&l?.id<=6?1:l?.id>=7?2:0;
export const chapterIdFor=l=>Number.isInteger(l?.chapter)?l.chapter:worldFor(l);
export const CHAPTERS=[{id:0,name:'Umbral',description:'Aprende a conectar'},{id:1,name:'Corriente',description:'Anticipa lo que cambia'},{id:2,name:'Órbita',description:'Piensa varios pasos por delante'}];
export function createChapters(levels){return [...new Set(levels.map(chapterIdFor))].sort((a,b)=>a-b).map(id=>{const world=worldFor(levels.find(l=>chapterIdFor(l)===id));return {id,world,name:id<3?CHAPTERS[id].name:`${CHAPTERS[world].name} ${Math.floor(id/3)+1}`,description:id<3?CHAPTERS[id].description:['Encuentra nuevos caminos','Sigue el alcance de la onda','Combina dirección y secuencia'][world]};});}
export function createCampaign(levels){
 const nodes=[{id:0,label:'1',x:50,y:18},{id:1,label:'2',x:79,y:72},{id:2,label:'3',x:21,y:72}];
 const base={version:1,nodes,edges:[[0,1],[1,2],[2,0]],initial:[0,1,2],suggestedMoves:1,maxMoves:1,tutorial:true};
 const first={...base,id:0,title:'El primer nexo',rule:'swap',target:[1,0,2],guide:'swap'};
 const wave={...base,id:'wave',title:'La primera onda',rule:'propagate',target:[1,0,0],guide:'wave'};
 const puzzles=levels.map((l,i)=>i===0||l.id===4||l.id===7||chapterIdFor(l)!==chapterIdFor(levels[i-1])||l.rule!==levels[i-1].rule?{...l,guide:l.rule==='swap'?'paths':'orbit'}:l);
 // The introductory puzzle teaches the gesture; ordinary level 1 follows freely.
 delete puzzles[0].guide;
 return [first,...puzzles.slice(0,5),wave,...puzzles.slice(5)].map(l=>l.guide?{...l,guideAction:l.solution?.[0]||solve(l)[0]}:l);
}
export const chapterStages=(stages,id)=>stages.filter(l=>chapterIdFor(l)===id);
export function nextCampaignStage(stages,id){const index=stages.findIndex(l=>l.id===id);return index>=0?stages[index+1]||null:null;}
export function completesChapter(stages,level){const next=nextCampaignStage(stages,level.id);return !next||chapterIdFor(next)!==chapterIdFor(level);}
export function levelProgress(stages,level){const puzzles=chapterStages(stages,chapterIdFor(level)).filter(l=>!l.tutorial);return {number:level.tutorial?null:puzzles.findIndex(l=>l.id===level.id)+1,total:puzzles.length};}
export function guideState(session,selected=null){
 const l=session.level;if(!l.guide||session.guidePhase==='practice')return null;
 const [a,b]=l.guideAction,phase=session.guidePhase||'connect';
 if(phase==='connect')return {phase,title:'UNE.',step:selected===null?'1 · ELIGE':'2 · CONECTA',text:selected===null?`Toca la pieza ${a+1} iluminada.`:`Ahora toca la pieza ${b+1} para conectarlas.`,focus:selected===null?[a]:[b],state:session.state};
 const before=session.history[0]||l.initial,swapped=transition({...l,rule:'swap'},before,a,b).state;
 if(phase==='swap')return {phase,title:'MIRA.',step:'3 · INTERCAMBIO',text:`Las piezas ${a+1} y ${b+1} intercambian sus símbolos. Falta la onda.`,focus:[a,b],state:swapped,button:'Ver la onda'};
 const neighbor=(b+1)%l.nodes.length,marks=['●','≋','+'];
 return {phase,title:l.rule==='swap'?'ASÍ ES.':'CAMBIA.',step:l.rule==='swap'?'3 · OBSERVA':'4 · PROPAGACIÓN',text:l.rule==='swap'?`Han cambiado las piezas ${a+1} y ${b+1}. Compáralas con el objetivo.`:`Después del destino ${b+1} viene la pieza ${neighbor+1}: ${marks[swapped[neighbor]]} → ${marks[session.state[neighbor]]}.`,focus:l.rule==='swap'?[a,b]:[neighbor],state:session.state,button:l.tutorial?'Lo he entendido':'Ahora pruebo yo'};
}
