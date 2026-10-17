import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {actions,transition,solve,validateLevel} from '../src/engine.js';
function random(seed){let value=seed>>>0;return ()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};}
function shuffle(values,rng){const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function puzzleSignature(level){
 const n=level.initial.length,keys=[];
 for(const direction of [1,-1])for(let rotation=0;rotation<n;rotation++){
  const index=i=>((direction*i+rotation)%n+n)%n,initial=[],target=[];
  level.initial.forEach((v,i)=>initial[index(i)]=v);level.target.forEach((v,i)=>target[index(i)]=v);
  // For propagation only cyclic palette shifts preserve the rule's direction.
  for(const shift of [0,1,2]){
   const colors=new Map();const normalized=[...initial,...target].map(v=>{if(level.rule==='propagate')return (v+shift)%3;if(!colors.has(v))colors.set(v,colors.size);return colors.get(v);}).join('');
   const edges=level.edges.map(([a,b])=>[index(a),index(b)].sort((x,y)=>x-y).join('-')).sort().join(',');keys.push(`${level.rule}|${n}|${edges}|${normalized}`);
  }
 }
 return keys.sort()[0];
}
function reachable(level){
 const queue=[{state:level.initial,depth:0}],seen=new Set([level.initial.join('')]),moves=actions(level);
 for(let cursor=0;cursor<queue.length;cursor++)for(const [a,b] of moves){const next=transition(level,queue[cursor].state,a,b).state,key=next.join('');if(!seen.has(key)){seen.add(key);queue.push({state:next,depth:queue[cursor].depth+1});}}
 return queue;
}
export function buildCatalogue(intro,total=250){
 const levels=structuredClone(intro.slice(0,10));
 for(const l of levels){l.solution=solve(l);l.suggestedMoves=l.solution.length;l.maxMoves=l.suggestedMoves+1;}
 const signatures=new Set(levels.map(puzzleSignature)),nouns=['Sendero','Pulso','Órbita','Umbral','Trama','Horizonte','Resonancia','Cruce','Estela','Equilibrio'];
 for(let id=11;id<=total;id++){
  const group=Math.floor((id-11)/5),chapter=group+3,world=group%3,slot=(id-11)%5,tier=group<6?0:group<18?1:2,n=5+tier;
  const rule=world===0?'swap':'propagate',rng=random(0x4e45584f+id*7919);let authored=null;
  for(let attempt=0;attempt<40&&!authored;attempt++){
   const initial=shuffle(Array.from({length:n},(_,i)=>i%3),rng);
   const nodes=Array.from({length:n},(_,i)=>{const theta=(-90+360*i/n)*Math.PI/180;return {id:i,label:String(i+1),x:Math.round(50+32*Math.cos(theta)),y:Math.round(50+32*Math.sin(theta))};});
   const topology=(group+slot)%3,edges=Array.from({length:topology===1?n:n-1},(_,i)=>[i,(i+1)%n]);if(topology===2)edges.push([0,Math.floor(n/2)]);
   const level={version:1,id,title:`${nouns[(id-11)%10]} ${String(id).padStart(3,'0')}`,family:rule==='swap'?'RESONANCIA':'PROPAGACIÓN',chapter,world,rule,nodes,edges,initial,target:[...initial]};
   const states=reachable(level),max=Math.max(...states.map(x=>x.depth)),depth=Math.min(max,3+tier+Math.floor(slot/2)+(rule==='swap'?tier:0));
   const candidates=shuffle(states.filter(x=>x.depth===depth&&depth>=3&&new Set(x.state).size>=2&&x.state.filter((v,i)=>v!==initial[i]).length>=Math.ceil(n/2)),rng);
   for(const candidate of candidates){level.target=candidate.state;const signature=puzzleSignature(level);if(signatures.has(signature))continue;
    level.solution=solve(level);level.suggestedMoves=level.solution.length;level.maxMoves=level.suggestedMoves+1;validateLevel(level);signatures.add(signature);authored=level;break;
   }
  }
  if(!authored)throw Error(`Could not author ${id}`);levels.push(authored);
 }
 return levels;
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){const intro=JSON.parse(fs.readFileSync(new URL('../src/intro-levels.json',import.meta.url)));fs.writeFileSync(new URL('../src/levels.json',import.meta.url),JSON.stringify(buildCatalogue(intro),null,2)+'\n');console.log('250 puzzles authored, solutions verified, original boards preserved.');}
