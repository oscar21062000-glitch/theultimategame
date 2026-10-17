// Original generative ambient music. Recreated after recovery from the V1 backup.
export const SCORES=[
 {bpm:66,chords:[[50,57,60,64],[48,55,59,62],[53,60,64,67],[45,52,55,60]],melody:[0,2,1,3,2,0,3,1]},
 {bpm:78,chords:[[48,55,58,62],[51,58,62,65],[46,53,57,60],[53,60,63,67]],melody:[0,1,3,2,1,0,2,3]},
 {bpm:90,chords:[[45,52,57,60],[48,55,59,64],[41,48,53,57],[43,50,55,59]],melody:[0,2,3,1,2,3,0,1]}
];
function note(ctx,output,midi,time,duration,volume,type='sine',pan=0){
 const osc=ctx.createOscillator(),gain=ctx.createGain(),stereo=ctx.createStereoPanner();osc.type=type;osc.frequency.value=440*2**((midi-69)/12);stereo.pan.value=pan;
 gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(volume,time+Math.min(.25,duration/4));gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 osc.connect(gain);gain.connect(stereo);stereo.connect(output);osc.start(time);osc.stop(time+duration+.02);osc.onended=()=>{osc.disconnect();gain.disconnect();stereo.disconnect();};
}
export function scheduleBeat(ctx,output,world,step,time){
 const score=SCORES[world],beat=60/score.bpm/2,chord=score.chords[Math.floor(step/16)%score.chords.length];
 if(step%16===0)chord.forEach((m,i)=>note(ctx,output,m,time,beat*19,.025,'sine',(i-1.5)*.32));
 if(step%8===0)note(ctx,output,chord[0]-12,time,beat*7,.045);
 if(step%(world===0?4:2)===0){const m=chord[score.melody[Math.floor(step/2)%8]]+12;note(ctx,output,m,time,beat*3,.025,'sine',Math.sin(step)*.55);note(ctx,output,m,time+beat*.75,beat*3,.009,'sine',-.35);}
}
export function createSoundtrack(){
 let ctx,output,enabled=true,volume=.35,world=0,timer=null,next=0,step=0,playing=false,epoch=0;
 function ensure(){if(ctx)return;const Native=window.AudioContext||window.webkitAudioContext;if(!Native)return;ctx=new Native();output=ctx.createGain();output.gain.value=volume;output.connect(ctx.destination);}
 function unlock(){if(!enabled)return;try{ensure();ctx?.resume().catch(()=>{});}catch{}}
 function tick(){if(!ctx||!playing)return;while(next<ctx.currentTime+.4){scheduleBeat(ctx,output,world,step++,next);next+=60/SCORES[world].bpm/2;}}
 function play(value){world=value;if(!enabled)return;try{ensure();if(!ctx)return;epoch++;ctx.resume().catch(()=>{});output.gain.cancelScheduledValues(ctx.currentTime);output.gain.setTargetAtTime(volume,ctx.currentTime,.25);if(playing)return;playing=true;step=0;next=ctx.currentTime+.08;tick();timer=setInterval(tick,120);}catch{}}
 function pause(){playing=false;clearInterval(timer);if(!ctx)return;const token=++epoch;output.gain.setTargetAtTime(0,ctx.currentTime,.04);setTimeout(()=>{if(token===epoch&&!playing)ctx.suspend().catch(()=>{});},180);}
 function configure(value,loudness){enabled=value;volume=loudness;if(!enabled)pause();else if(ctx&&playing)output.gain.setTargetAtTime(volume,ctx.currentTime,.1);}
 return {unlock,play,pause,configure};
}
