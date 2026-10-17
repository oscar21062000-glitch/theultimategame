export const WORLDS=[{name:'UMBRAL',rgb:'114,190,177',color:'#72beb1'},{name:'CORRIENTE',rgb:'107,155,218',color:'#6b9bda'},{name:'ÓRBITA',rgb:'179,149,221',color:'#b395dd'}];
export function createAtmosphere(){
 const canvas=document.querySelector('#atmosphere'),ctx=canvas.getContext('2d');let world=0,animated=false,reduced=false,frame=null;
 const stars=Array.from({length:90},(_,i)=>({x:((i*137.5)%997)/997,y:((i*239.1)%991)/991,r:i%7===0?1.1:.5}));
 function draw(time=0){const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,2);if(canvas.width!==w*dpr||canvas.height!==h*dpr){canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}ctx.clearRect(0,0,w,h);ctx.fillStyle=WORLDS[world].color;
  for(const s of stars){ctx.globalAlpha=.2+(s.r>.5?.2:0);ctx.beginPath();ctx.arc(s.x*w,(s.y*h+(animated&&!reduced?Math.sin(time/20000+s.x*5)*8:0)+h)%h,s.r,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=.09;ctx.strokeStyle=WORLDS[world].color;ctx.lineWidth=1;
  for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(w*.5,h*.63,w*(.48+i*.13),h*(.27+i*.08),(animated&&!reduced?time/180000:0)+i*.1,0,Math.PI*2);ctx.stroke();}
  if(animated&&!reduced)frame=requestAnimationFrame(draw);
 }
 function configure(next,move,reduce){world=next;animated=move;reduced=reduce;document.body.dataset.world=String(world);document.body.style.setProperty('--world-rgb',WORLDS[world].rgb);document.body.style.setProperty('--accent',WORLDS[world].color);cancelAnimationFrame(frame);draw();}
 window.addEventListener('resize',()=>{cancelAnimationFrame(frame);draw();});return {configure};
}
