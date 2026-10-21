'use strict';
/* ================= engine ================= */
const NS='http://www.w3.org/2000/svg';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
/* no blur filters: on big tablet screens they are redrawn with every animation frame and make the picture flicker */
function el(tag,a,p){const e=document.createElementNS(NS,tag);if(a)for(const k in a){if(k==='filter'&&a[k]==='url(#glow)')continue;e.setAttribute(k,a[k])}if(p)p.appendChild(e);return e}
const gcd=(a,b)=>b?gcd(b,a%b):a, lcm=(a,b)=>a/gcd(a,b)*b;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t;
const U=27720; /* every piece size 1..12 divides this, so sizes add exactly */
const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease={in:t=>t*t*t,out:t=>1-Math.pow(1-t,3),inOut:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,back:t=>{const c=1.6;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)},lin:t=>t};
const SVG=$('#stage'),BACK=$('#back'),WORLD=$('#world'),FX=$('#fx'),CAM=$('#cam'),DOCK=$('#dock');

/* animation helpers; every one dies when the world changes */
let EPOCH=0;
function tween(dur,fn,done,e=ease.out){const ep=EPOCH;if(RM)dur=Math.min(dur,60);const t0=performance.now();const f=now=>{if(ep!==EPOCH)return;const p=clamp((now-t0)/dur,0,1);fn(e(p),p);if(p<1)requestAnimationFrame(f);else if(done)done()};requestAnimationFrame(f)}
function later(ms,fn){const ep=EPOCH;setTimeout(()=>{if(ep===EPOCH)fn()},RM?Math.min(ms,90):ms)}
/* background motion runs at about 30 frames a second and rests while the app is hidden: half the drawing work */
function loop(fn){const ep=EPOCH;let last=performance.now();const f=now=>{if(ep!==EPOCH)return;if(now-last<30||document.hidden){requestAnimationFrame(f);return}const dt=Math.min(.05,(now-last)/1000);last=now;fn(dt);requestAnimationFrame(f)};requestAnimationFrame(f)}

/* sound: smaller pieces sing higher */
let AC=null,SOUND=true,MASTER=null,ECHO=null,NOISE=null;
function unlockAudio(){if(!SOUND)return;try{
  if(!AC){AC=new(window.AudioContext||window.webkitAudioContext)();
    const comp=AC.createDynamicsCompressor();comp.threshold.value=-16;comp.knee.value=12;comp.ratio.value=5;comp.connect(AC.destination);
    MASTER=AC.createGain();MASTER.gain.value=.9;MASTER.connect(comp);
    const d=AC.createDelay(1),fb=AC.createGain(),lp=AC.createBiquadFilter();d.delayTime.value=.19;fb.gain.value=.34;lp.type='lowpass';lp.frequency.value=2800;
    ECHO=AC.createGain();ECHO.gain.value=.5;ECHO.connect(d);d.connect(lp);lp.connect(fb);fb.connect(d);lp.connect(comp);
    NOISE=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const ch=NOISE.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1}
  if(AC.state==='suspended')AC.resume();if(AMB.kind&&AMB.on!==AMB.kind)ambient(AMB.kind)}catch(e){}}
const live=()=>SOUND&&AC&&MASTER&&!document.hidden;
/* the app is put away (screen off, home button, another app): silence everything; carry on when it comes back */
document.addEventListener('visibilitychange',()=>{if(!AC)return;try{if(document.hidden){ambStop();AC.suspend()}else if(SOUND){AC.resume().then(()=>{if(AMB.kind)ambient(AMB.kind)}).catch(()=>{})}}catch(e){}});
addEventListener('pagehide',()=>{try{if(AC){ambStop();AC.suspend()}}catch(e){}});
function outTo(node,wet){node.connect(MASTER);if(wet&&ECHO){const g=AC.createGain();g.gain.value=wet;node.connect(g);g.connect(ECHO)}}
function env(g,t,a,peak,d){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,peak),t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d)}
/* while the background is playing its little sounds, anything low or long (rumbles, waves, hums) is dropped: no drones */
let AMB_GATE=false;
function osc(type,f,dur,vol,{to,wet=.25,a=.006,at=0,det=0,lfo=0,lfoDepth=0,lp=0}={}){
  if(!live()||(AMB_GATE&&(f<300||dur>1)))return;try{const t=AC.currentTime+at,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+dur);o.detune.value=det;
    let n=o;if(lp){const fl=AC.createBiquadFilter();fl.type='lowpass';fl.frequency.value=lp;o.connect(fl);n=fl}
    if(lfo){const l=AC.createOscillator(),lg=AC.createGain();l.frequency.value=lfo;lg.gain.value=lfoDepth;l.connect(lg);lg.connect(g.gain);l.start(t);l.stop(t+a+dur+.05)}
    env(g,t,a,vol,dur);n.connect(g);outTo(g,wet);o.start(t);o.stop(t+a+dur+.05)}catch(e){}}
function noise(dur,vol,{type='bandpass',f=1200,q=1,to,wet=.1,a=.003,at=0}={}){
  if(!live()||(AMB_GATE&&(type==='lowpass'||f<900||dur>1)))return;try{const t=AC.currentTime+at,s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NOISE;fl.type=type;fl.frequency.setValueAtTime(f,t);if(to)fl.frequency.exponentialRampToValueAtTime(to,t+dur);fl.Q.value=q;
    env(g,t,a,vol,dur);s.connect(fl);fl.connect(g);outTo(g,wet);s.start(t,Math.random()*.5);s.stop(t+a+dur+.05)}catch(e){}}
function bell(f,vol=.1,dur=.9,{at=0,wet=.4,ratio=3.5}={}){
  if(!live()||(AMB_GATE&&f<300))return;try{const t=AC.currentTime+at,c=AC.createOscillator(),m=AC.createOscillator(),mg=AC.createGain(),g=AC.createGain();
    c.frequency.value=f;m.frequency.value=f*ratio;mg.gain.setValueAtTime(f*1.8,t);mg.gain.exponentialRampToValueAtTime(f*.02,t+dur);m.connect(mg);mg.connect(c.frequency);
    env(g,t,.004,vol,dur);c.connect(g);outTo(g,wet);c.start(t);m.start(t);c.stop(t+dur+.1);m.stop(t+dur+.1)}catch(e){}}
/* a soft piano note: a few sine partials, a quick strike and a long fade, mellowing as it dies away */
function piano(f,vol=.02,{at=0,dur=2.6,wet=.55}={}){
  if(!live())return;try{const t=AC.currentTime+at,g=AC.createGain(),lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(Math.min(6000,f*7),t);lp.frequency.exponentialRampToValueAtTime(Math.max(400,f*1.6),t+dur);lp.connect(g);g.gain.value=vol;
    [[1,1,1],[2,.42,.6],[3,.16,.38],[4,.07,.25]].forEach(([h,a,dk])=>{const o=AC.createOscillator(),og=AC.createGain();o.type='sine';o.frequency.value=f*h*(1+.0004*h*h);
      og.gain.setValueAtTime(.0001,t);og.gain.exponentialRampToValueAtTime(a,t+.005);og.gain.exponentialRampToValueAtTime(.0001,t+dur*dk);o.connect(og);og.connect(lp);o.start(t);o.stop(t+dur+.1)});
    outTo(g,wet)}catch(e){}}
/* the older call shape, now through the magic chain */
function tone(f,d=.14,type='sine',vol=.1,to){osc(type==='square'||type==='sawtooth'?'triangle':type,f,d,vol*.9,{to,wet:.22})}
const sizeHz=s=>196/Math.sqrt(s);
const PENTA=[0,2,4,7,9];
const noteHz=i=>523.25*Math.pow(2,(PENTA[i%5]+12*Math.floor(i/5))/12);
const SFX={
  tick(i=0){osc('triangle',1500+i*90,.025,.05,{wet:.05});noise(.015,.05,{f:4000,q:3,wet:0})},
  pop(p=1){osc('sine',520*p,.11,.2,{to:160*p,wet:.12});noise(.025,.12,{f:2600,q:1.5,wet:0})},
  plink(i){bell(noteHz(i),.09,.6,{wet:.35,ratio:2})},
  sparkle(){[0,2,4,7,9,12,14].forEach((s,k)=>bell(1046*Math.pow(2,s/12),.045,.5,{at:k*.045,wet:.6,ratio:4.2}))},
  shimmer(){for(let k=0;k<7;k++)osc('sine',880*Math.pow(2,k/7),.5,.025,{at:k*.035,a:.08,det:(k%2?7:-7),wet:.7})},
  chime(){[784,988,1175,1568].forEach((f,k)=>bell(f,.07,1.1,{at:k*.09,wet:.45}));this.sparkle()},
  fanfare(){[523,659,784,1046,1318].forEach((f,k)=>bell(f,.08,1.2,{at:k*.11,wet:.45}));setTimeout(()=>this.sparkle(),520)},
  ding(){bell(880,.12,1.4,{wet:.5});bell(1320,.05,1.2,{at:.02,wet:.5,ratio:2.7})},
  whoosh(){noise(.38,.22,{f:300,to:3200,q:.9,wet:.25,a:.08})},
  swish(){noise(.16,.18,{type:'highpass',f:2500,to:7000,wet:.15,a:.02})},
  snap(big=1){noise(.05,.5,{f:1900,q:.7,wet:.05});osc('square',150*big,.12,.18,{to:55,wet:0,lp:900})},
  crunch(){for(let k=0;k<4;k++)noise(.05,.28,{f:900+Math.random()*1800,q:1.4,at:k*.045+Math.random()*.02,wet:0})},
  growl(len=.8){osc('sawtooth',62,len,.22,{to:48,lfo:22,lfoDepth:.12,lp:520,wet:.15,a:.06});noise(len,.12,{type:'lowpass',f:380,wet:0,a:.05})},
  gulp(){osc('sine',260,.34,.32,{to:70,wet:.1});[0,1,2].forEach(k=>osc('sine',420+k*160,.07,.08,{to:900+k*200,at:.18+k*.07,wet:.2}))},
  burp(){osc('sawtooth',120,.42,.18,{to:78,lfo:28,lfoDepth:.09,lp:700,wet:.1})},
  rumble(){osc('sawtooth',80,.35,.12,{to:65,lfo:14,lfoDepth:.08,lp:400,wet:.05})},
  clonk(){osc('sine',190,.18,.26,{to:110,wet:.05});noise(.06,.2,{type:'lowpass',f:900,wet:0})},
  thud(){osc('sine',95,.28,.4,{to:38,wet:0});noise(.08,.25,{type:'lowpass',f:250,wet:0})},
  glug(p=1){osc('sine',180*p,.14,.22,{to:420*p,wet:.25});osc('sine',300*p,.08,.1,{to:700*p,at:.08,wet:.25});noise(.1,.06,{type:'lowpass',f:600,wet:0})},
  crinkle(){for(let k=0;k<9;k++)noise(.025,.14,{type:'highpass',f:3500+Math.random()*3000,at:k*.035+Math.random()*.03,wet:.05})},
  wrong(){osc('triangle',440,.16,.1,{wet:.2});osc('triangle',349,.3,.1,{at:.14,wet:.25})},
  hop(){osc('sine',380,.12,.08,{to:720,wet:.1})},
  boing(i=0){const f=260*Math.pow(2,(PENTA[i%5]+12*Math.floor(i/5))/24);osc('sine',f,.28,.16,{to:f*2.4,lfo:18,lfoDepth:.05,wet:.25});osc('triangle',f*2,.12,.04,{to:f*4,wet:.2})},
  plop(){osc('sine',520,.16,.2,{to:160,wet:.3});noise(.08,.1,{type:'lowpass',f:900,wet:.1})},
  splash(){noise(.7,.4,{f:900,to:250,q:.6,wet:.3,a:.01});noise(.35,.18,{type:'highpass',f:3000,wet:.2});[0,1,2,3].forEach(k=>osc('sine',300+Math.random()*400,.12,.08,{to:900+Math.random()*600,at:.25+k*.09,wet:.4}))},
  clink(i=0){bell(noteHz(i+7),.05,.35,{wet:.45,ratio:6.2});noise(.02,.06,{type:'highpass',f:5000,wet:.1})},
  laugh(){[0,1,2,3].forEach(k=>osc('sawtooth',150-k*12,.16,.16,{to:120-k*12,at:k*.2,lp:700,lfo:20,lfoDepth:.08,wet:.25}))},
  buzz(len=1){osc('sawtooth',220,.5*len+.2,.04,{to:240,lfo:40,lfoDepth:.3,lp:900,wet:.2,a:.08});osc('sawtooth',330,.4*len+.2,.025,{to:300,lfo:37,lfoDepth:.3,lp:1100,at:.05,wet:.2,a:.08})},
  crease(){noise(.04,.16,{type:'highpass',f:3200,wet:.05});osc('square',900,.02,.03,{wet:0,lp:2000})},
  rustle(){for(let k=0;k<6;k++)noise(.06,.07,{type:'bandpass',f:1800+Math.random()*2400,q:1.2,at:k*.05+Math.random()*.03,wet:.1})},
  unfold(){noise(.5,.18,{f:600,to:3000,q:.8,wet:.3,a:.05});for(let k=0;k<5;k++)noise(.05,.08,{type:'highpass',f:2500+Math.random()*2500,at:.1+k*.07,wet:.1})},
  slice(){noise(.12,.22,{type:'highpass',f:2500,to:6000,wet:.2,a:.01});bell(2400,.04,.4,{wet:.5,ratio:3.1})},
  glue(){osc('sine',300,.5,.14,{to:120,lfo:9,lfoDepth:.15,wet:.3,a:.04});noise(.4,.06,{type:'lowpass',f:500,wet:.2,a:.1})},
  crackGlass(){for(let k=0;k<5;k++)noise(.04,.25,{type:'highpass',f:3500+Math.random()*3000,at:k*.04,wet:.1});[2600,3300,4100].forEach((f,k)=>bell(f,.05,.5,{at:.05+k*.05,wet:.5,ratio:5.3}))},
  wake(){[0,4,7,12,16].forEach((s,k)=>bell(523*Math.pow(2,s/12),.06,1.6,{at:k*.12,wet:.7,ratio:2}));this.shimmer()},
  croak(){osc('sawtooth',130,.32,.16,{to:105,lfo:34,lfoDepth:.25,lp:800,wet:.2});osc('sawtooth',150,.22,.12,{to:120,lfo:30,lfoDepth:.25,lp:800,at:.36,wet:.25})}
};
/* ambient soundscape: a soft pad plus little events that suit the place */
let AMB={kind:null,nodes:[],timer:null};
function ambStop(){clearTimeout(AMB.timer);AMB.timer=null;clearTimeout(AMB.swell);AMB.swell=null;AMB.on=null;AMB.nodes.forEach(n=>{try{n.g.gain.setTargetAtTime(.0001,AC.currentTime,.4);n.o.forEach(o=>o.stop(AC.currentTime+2))}catch(e){}});AMB.nodes=[]}
function ambient(kind){
  AMB.kind=kind;if(!live())return;ambStop();AMB.on=kind;
  const PAD={hills:[110,164.8],scales:[110,164.8],oven:[98,146.8],shop:[130.8,196],glass:[123.5,185],cave:[92.5,138.6],river:[103.8,155.6],gorge:[87.3,130.8],meadow:[116.5,174.6],patch:[103.8,155.6],desk:[98,146.8],picnic:[110,164.8],tower:[92.5,138.6],festival:[116.5,174.6],lair:[73.4,110],hub:[130.8,196],sea:[98,146.8],door:[98,146.8],lagoon:[110,164.8],chart:[98,146.8],whirl:[73.4,110],beach:[110,164.8],lamp:[87.3,130.8]}[kind]||[110,164.8];
  /* the music: short, gentle piano phrases on the same five notes as the game's chimes, with rests between.
     Darker places lean on A (minor feel), the rest on C. Each phrase picks a shape: a wander, a climb, a fall, a chord, an echo or a pair */
  const dark=['lair','cave','gorge','tower','whirl','grey','inky','night','lamp'].includes(kind),home=dark?-1:0;
  const pz=d=>523.25*Math.pow(2,(PENTA[((d%5)+5)%5]+12*Math.floor(d/5))/12);
  let pos=home+1+Math.floor(Math.random()*3),last='';
  const phrase=()=>{if(AMB.kind!==kind||!live())return;
    const v=.85+Math.random()*.3,step=[.34,.42,.5,.6][Math.floor(Math.random()*4)],notes=[];let t=0;
    const add=(d,dt=step,len=2.4,vol=1)=>{d=Math.max(-5,Math.min(7,d));notes.push([d,t,len,vol]);t+=dt;pos=d};
    let shapes=['wander','climb','fall','chord','echo','pair'].filter(x=>x!==last);const sh=shapes[Math.floor(Math.random()*shapes.length)];last=sh;
    if(Math.random()<.45)piano((dark?110:130.8)*(Math.random()<.5?1:1.5),.016*v,{dur:4.5,wet:.6});
    if(sh==='wander'){const n=3+Math.floor(Math.random()*4);for(let k=0;k<n;k++){const drift=pos>home+4?-1:pos<home-2?1:0;add(pos+([-2,-1,-1,1,1,2][Math.floor(Math.random()*6)]+drift)*(k?1:0),step*(Math.random()<.25?2:1))}}
    else if(sh==='climb'){const s0=pos>home+2?pos-3:pos;for(let k=0;k<4;k++)add(s0+k)}
    else if(sh==='fall'){const s0=pos<home+1?pos+3:pos;for(let k=0;k<4;k++)add(s0-k)}
    else if(sh==='chord'){const b=Math.min(pos,home+3);[0,2,4].forEach((o,k)=>add(b+o,.06,3.2,k?.8:1));t+=step}
    else if(sh==='echo'){const m=[pos,pos+1,pos-1],oc=pos>home+1?-5:5;m.forEach(d=>add(d));t+=step;m.forEach(d=>add(d+oc,step,2,.55))}
    else{add(pos,step*1.5);add(pos+(Math.random()<.5?2:-2),step,3)}
    notes.forEach(([d,at,len,vol],k)=>piano(pz(d),.02*v*vol,{at,dur:k===notes.length-1?len+1:len}));
    AMB.swell=setTimeout(phrase,(t+5+Math.random()*7)*1000)};
  AMB.swell=setTimeout(phrase,1500);
  const ev={
    hills:()=>{if(Math.random()<.6)for(let k=0;k<3;k++)osc('sine',4300+Math.random()*300,.03,.006,{at:k*.07,wet:.3});else bell(noteHz(5+Math.floor(Math.random()*8)),.012,1.6,{wet:.8})},
    oven:()=>{const n=2+Math.floor(Math.random()*5);for(let k=0;k<n;k++)noise(.02,.03+Math.random()*.04,{f:1500+Math.random()*2500,q:2,at:k*(.05+Math.random()*.15),wet:0});if(Math.random()<.15)noise(.6,.02,{type:'lowpass',f:300,a:.2,wet:0})},
    shop:()=>{const b=5+Math.floor(Math.random()*6);bell(noteHz(b),.016,1.2,{wet:.7,ratio:5});if(Math.random()<.5)bell(noteHz(b+2),.012,1.2,{at:.28,wet:.7,ratio:5})},
    glass:()=>{osc('sine',1400+Math.random()*700,.09,.03,{to:500,wet:.7});if(Math.random()<.3)noise(1.2,.012,{type:'bandpass',f:500,q:.4,a:.5,wet:.2})},
    river:()=>{const r=Math.random();if(r<.35)osc('sawtooth',90+Math.random()*50,.22,.05,{to:75,lfo:30,lfoDepth:.3,lp:600,wet:.4});else if(r<.7)for(let k=0;k<4;k++)osc('sine',3900+Math.random()*200,.04,.007,{at:k*.09,wet:.3});else{noise(.5,.03,{type:'lowpass',f:500,a:.2,wet:.3});osc('sine',300+Math.random()*200,.1,.02,{to:700,at:.2,wet:.5})}},
    festival:()=>{const r=Math.random();if(r<.5){const b=5+Math.floor(Math.random()*7);bell(noteHz(b),.014,1.6,{wet:.8,ratio:3.5});if(Math.random()<.5)bell(noteHz(b+2),.01,1.6,{at:.3,wet:.8,ratio:3.5})}else if(r<.8)noise(.6,.015,{type:'bandpass',f:400,q:.5,a:.2,wet:.3});else for(let k=0;k<3;k++)noise(.03,.03,{f:2500,q:2,at:k*.08,wet:.1})},
    tower:()=>{const r=Math.random();if(r<.45)noise(2,.03,{f:700,to:1400,q:2.5,a:.8,wet:.4});else if(r<.7)bell(196,.02,3,{wet:.9,ratio:2.76});else bell(noteHz(7+Math.floor(Math.random()*5)),.012,1.8,{wet:.8,ratio:5})},
    picnic:()=>{const r=Math.random();if(r<.5)for(let k=0;k<4;k++)osc('sine',4200+Math.random()*200,.04,.006,{at:k*.08,wet:.3});else if(r<.75){osc('sine',420,.45,.02,{to:380,wet:.7});osc('sine',380,.6,.02,{to:340,at:.55,wet:.7})}else noise(.4,.02,{type:'bandpass',f:1200,q:.6,a:.15,wet:.3})},
    desk:()=>{const r=Math.random();if(r<.4)SFX.rustle&&noise(.3,.02,{type:'bandpass',f:2200,q:.8,a:.1,wet:.3});else if(r<.7){for(let k=0;k<2;k++)osc('sine',360-k*40,.35,.012,{at:k*.4,wet:.7})}else bell(noteHz(4+Math.floor(Math.random()*6)),.01,1.6,{wet:.8,ratio:3})},
    patch:()=>{const r=Math.random();if(r<.6){const f=3900+Math.random()*500;for(let k=0;k<3;k++)osc('sine',f,.05,.007,{at:k*.09,wet:.3})}else if(r<.85)osc('sine',260,.35,.02,{to:200,wet:.6});else bell(noteHz(5+Math.floor(Math.random()*7)),.01,1.2,{wet:.8})},
    hub:()=>{const r=Math.random();if(r<.6){const b=7+Math.floor(Math.random()*6);bell(noteHz(b),.012,2,{wet:.85,ratio:3})}else osc('sine',600+Math.random()*400,.6,.008,{to:900,a:.2,wet:.8})},
    lair:()=>{const r=Math.random();if(r<.4)noise(2.2,.04,{f:300,to:700,q:.7,a:.8,wet:.4});else if(r<.7)osc('sawtooth',55,1.4,.03,{to:48,lfo:6,lfoDepth:.1,lp:300,a:.4,wet:.3});else bell(noteHz(2+Math.floor(Math.random()*4)),.012,2.2,{wet:.9,ratio:2.4})},
    meadow:()=>{const r=Math.random();if(r<.4)osc('sawtooth',200+Math.random()*60,.9,.008,{to:230,lfo:38,lfoDepth:.3,lp:700,a:.3,wet:.3});else if(r<.8){const f=2600+Math.random()*900;for(let k=0;k<3;k++)osc('sine',f,.07,.01,{to:f*1.2,at:k*.12,wet:.5})}else bell(noteHz(6+Math.floor(Math.random()*6)),.01,1.4,{wet:.8})},
    gorge:()=>{const r=Math.random();if(r<.45)noise(2.4,.035,{f:400,to:900,q:.6,a:.9,wet:.4});else if(r<.75){const f=1800+Math.random()*900;osc('sine',f,.12,.012,{to:f*1.3,wet:.6});osc('sine',f*1.1,.1,.01,{to:f*.9,at:.18,wet:.6})}else osc('triangle',140+Math.random()*40,.3,.02,{to:110,lp:500,wet:.3})},
    cave:()=>{if(Math.random()<.6)osc('sine',900+Math.random()*900,.12,.03,{to:350,wet:.85});else bell(noteHz(8+Math.floor(Math.random()*6)),.012,2,{wet:.9,ratio:6.1})}
  }[kind]||AMB_X[kind]||(()=>{});
  const tick=()=>{if(AMB.kind!==kind||!live())return;AMB_GATE=true;try{ev()}finally{AMB_GATE=false}AMB.timer=setTimeout(tick,(kind==='oven'?700:1600)+Math.random()*(kind==='oven'?1500:3200))};
  AMB.timer=setTimeout(tick,1200);
}
function chime(){SFX.chime()}
function clonk(){SFX.clonk()}

/* pointer to stage coordinates */
function svgPt(e){const m=WORLD.getScreenCTM();if(!m||!e)return{x:0,y:0};const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse());return{x:p.x,y:p.y}}

/* one helper for every touchable thing: drag, or tap, or keyboard */
function interact(node,{down,move,up,tap,label}){
  node.classList.add('hit');node.setAttribute('tabindex','0');node.setAttribute('role','button');if(label)node.setAttribute('aria-label',label);
  node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();unlockAudio();tap&&tap(null,null)}});
  node.addEventListener('pointerdown',e=>{
    if(e.button>0)return;e.preventDefault();e.stopPropagation();unlockAudio();
    const p0=svgPt(e);let moved=false;node.classList.add('pressed');const ctx=(down&&down(p0))||{};
    try{node.setPointerCapture(e.pointerId)}catch(_){}
    const mv=ev=>{const p=svgPt(ev);if(!moved&&Math.hypot(p.x-p0.x,p.y-p0.y)>6)moved=true;if(moved&&move)move(p,p0,ctx)};
    const end=ev=>{node.classList.remove('pressed');node.removeEventListener('pointermove',mv);node.removeEventListener('pointerup',end);node.removeEventListener('pointercancel',end);
      const p=svgPt(ev);if(!moved){if(tap)tap(p,ctx);else if(up)up(p,p0,ctx,false)}else if(up)up(p,p0,ctx,true)};
    node.addEventListener('pointermove',mv);node.addEventListener('pointerup',end);node.addEventListener('pointercancel',end);
  });
}

/* ---------- creatures ---------- */
const CCOL=['#ff8f7a','#b8a2ff','#ffe07a','#8ff0c8','#86c9ff','#ff9ed2','#c6f07a','#ffb88a','#a9b8ff','#f4a6ff'];
const CREATS=new Set();
function blobPath(r,sx,sy,seed){
  const n=9,pts=[];
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2-Math.PI/2,w=1+.07*Math.sin(seed*3.1+i*2.3)+.05*Math.cos(seed*1.7+i*4.1);let x=Math.cos(a)*r*sx*w,y=Math.sin(a)*r*sy*w;if(y>0)y*=.93;pts.push([x,y])}
  const f=v=>v.toFixed(1);let d=`M${f(pts[0][0])},${f(pts[0][1])}`;
  for(let i=0;i<n;i++){const p0=pts[(i-1+n)%n],p1=pts[i],p2=pts[(i+1)%n],p3=pts[(i+2)%n];
    d+=`C${f(p1[0]+(p2[0]-p0[0])/6)},${f(p1[1]+(p2[1]-p0[1])/6)} ${f(p2[0]-(p3[0]-p1[0])/6)},${f(p2[1]-(p3[1]-p1[1])/6)} ${f(p2[0])},${f(p2[1])}`}
  return d+'Z';
}
function darker(hex,k=.72){const n=parseInt(hex.slice(1),16);const r=(n>>16)*k|0,g=((n>>8)&255)*k|0,b=(n&255)*k|0;return`rgb(${r},${g},${b})`}
function creature(parent,{x=0,y=0,r=22,i=0,label='creature',hat=null,shadow=true}={}){
  const col=CCOL[i%CCOL.length],kind=i%4,seed=i*1.37+.5;
  const sx=[1,.9,1.12,.96][kind],sy=[1,1.14,.9,1.04][kind];
  const g=el('g',{class:'cr'},parent);
  const sh=shadow?el('ellipse',{cx:0,cy:r*sy*1.02,rx:r*.85,ry:r*.18,fill:'#0d0a24',opacity:.35},g):null;
  const hopG=el('g',{},g),inner=el('g',{class:'bob'},hopG);
  inner.style.animationDelay=(-(i*.7)%3.4).toFixed(2)+'s';
  const foot=darker(col);
  el('ellipse',{cx:-r*.36,cy:r*sy*.92,rx:r*.24,ry:r*.13,fill:foot},inner);
  el('ellipse',{cx:r*.36,cy:r*sy*.92,rx:r*.24,ry:r*.13,fill:foot},inner);
  if(kind===1){el('path',{d:`M${r*.05},${-r*sy*.9} q${r*.15},${-r*.5} ${r*.5},${-r*.6}`,stroke:foot,'stroke-width':r*.1,fill:'none','stroke-linecap':'round'},inner);el('circle',{cx:r*.55,cy:-r*sy*.9-r*.6,r:r*.14,fill:'#fff4c2'},inner)}
  if(kind===3){[-1,1].forEach(s=>el('path',{d:`M${s*r*.45},${-r*sy*.7} l${s*r*.18},${-r*.42} l${-s*r*.34},${r*.2}Z`,fill:foot},inner))}
  el('path',{d:blobPath(r,sx,sy,seed),fill:col},inner);
  el('ellipse',{cx:-r*.32,cy:-r*.42*sy,rx:r*.26,ry:r*.15,fill:'#fff',opacity:.3,transform:`rotate(-20 ${-r*.32} ${-r*.42*sy})`},inner);
  el('ellipse',{cx:-r*.55,cy:r*.2,rx:r*.12,ry:r*.07,fill:'#ff6f91',opacity:.35},inner);
  el('ellipse',{cx:r*.55,cy:r*.2,rx:r*.12,ry:r*.07,fill:'#ff6f91',opacity:.35},inner);
  const E=kind===2?[[0,-r*.16,r*.36]]:kind===3?[[-r*.38,-r*.12,r*.2],[0,-r*.34,r*.17],[r*.38,-r*.12,r*.2]]:[[-r*.3,-r*.14,r*.25],[r*.3,-r*.14,r*.25]];
  const eyes=E.map(([ex,ey,er],k)=>{const eg=el('g',{transform:`translate(${ex},${ey})`},inner);el('circle',{r:er,fill:'#fffaf2'},eg);
    const pu=el('g',{},eg);el('circle',{r:er*.52,fill:'#241a3a'},pu);el('circle',{cx:-er*.18,cy:-er*.2,r:er*.17,fill:'#fff'},pu);
    const lid=el('ellipse',{rx:er*1.08,ry:er*1.08,fill:col,class:'lid'},eg);lid.style.animationDelay=(-(i*1.3+k*.02)%5.5).toFixed(2)+'s';return{ex,ey,er,pu}});
  if(hat==='chef'){const hy=-r*sy*.82;el('rect',{x:-r*.5,y:hy-r*.18,width:r,height:r*.3,rx:r*.08,fill:'#fffaf2'},inner);
    [-.32,0,.32].forEach((o,k)=>el('circle',{cx:r*o,cy:hy-r*.42-(k===1?r*.12:0),r:r*.3,fill:'#fffaf2'},inner));
    el('path',{d:`M${-r*.5},${hy+r*.05} h${r}`,stroke:'#e3d6c8','stroke-width':1.2},inner)}
  if(hat==='beanie'){const hy=-r*sy*.72;el('path',{d:`M${-r*.62},${hy+r*.12} Q0,${hy-r*.75} ${r*.62},${hy+r*.12}Z`,fill:'#ff6f91'},inner);el('rect',{x:-r*.66,y:hy+r*.02,width:r*1.32,height:r*.18,rx:r*.09,fill:'#ffd0dc'},inner);el('circle',{cx:0,cy:hy-r*.5,r:r*.14,fill:'#ffd0dc'},inner)}
  if(hat==='pirate'){const hy=-r*sy*.78;el('path',{d:`M${-r*.95},${hy+r*.1} Q${-r*.5},${hy-r*.25} 0,${hy-r*.62} Q${r*.5},${hy-r*.25} ${r*.95},${hy+r*.1} Q0,${hy-r*.12} ${-r*.95},${hy+r*.1}Z`,fill:'#2a1e3a',stroke:'#c9a24a','stroke-width':r*.06},inner);el('circle',{cx:0,cy:hy-r*.3,r:r*.11,fill:'#fff4e6'},inner)}
  const mouth=el('path',{stroke:'#241a3a','stroke-width':Math.max(1.4,r*.09),fill:'none','stroke-linecap':'round'},inner);
  const M={'':`M${-r*.16},${r*.3} q${r*.16},${r*.13} ${r*.32},0`,happy:`M${-r*.26},${r*.24} q${r*.26},${r*.34} ${r*.52},0`,
    eat:`M${-r*.15},${r*.3} a${r*.15},${r*.13} 0 1 0 ${r*.3},0 a${r*.15},${r*.13} 0 1 0 ${-r*.3},0`,
    oh:`M${-r*.07},${r*.33} a${r*.07},${r*.08} 0 1 0 ${r*.14},0 a${r*.07},${r*.08} 0 1 0 ${-r*.14},0`,
    dizzy:`M${-r*.24},${r*.32} q${r*.08},${-r*.1} ${r*.16},0 t${r*.16},0 t${r*.16},0`};
  const c={g,inner,hopG,x,y,s:1,r,sy,col,i,
    place(nx,ny,ns){if(nx!=null)c.x=nx;if(ny!=null)c.y=ny;if(ns!=null)c.s=ns;g.setAttribute('transform',`translate(${c.x.toFixed(1)},${c.y.toFixed(1)}) scale(${c.s.toFixed(3)})`)},
    look(px,py){eyes.forEach(e=>{const dx=px-(c.x+e.ex*c.s),dy=py-(c.y+e.ey*c.s),d=Math.hypot(dx,dy)||1,m=Math.min(1,d/90)*e.er*.4;e.pu.setAttribute('transform',`translate(${(dx/d*m).toFixed(2)},${(dy/d*m).toFixed(2)})`)})},
    mood(m){mouth.setAttribute('d',M[m]||M['']);mouth.setAttribute('fill',m==='eat'||m==='oh'?'#241a3a':'none');inner.classList.remove('dizzy');if(m==='dizzy'){inner.getBoundingClientRect();inner.classList.add('dizzy')}},
    hop(h=14,dur=420){const fy=r*sy*.95;tween(dur,(t,p)=>{let sx=1,sy2=1,y=0;
      if(p<.18){const q=p/.18;sx=1+.16*Math.sin(q*Math.PI/2);sy2=1-.16*Math.sin(q*Math.PI/2)}
      else if(p<.86){const q=(p-.18)/.68;y=-Math.sin(q*Math.PI)*h;sx=.92+.08*Math.abs(q*2-1);sy2=1.1-.1*Math.abs(q*2-1)}
      else{const q=(p-.86)/.14;sx=1+.12*Math.sin(q*Math.PI);sy2=1-.12*Math.sin(q*Math.PI)}
      hopG.setAttribute('transform',`translate(0,${y.toFixed(1)}) translate(0,${fy}) scale(${sx.toFixed(3)},${sy2.toFixed(3)}) translate(0,${-fy})`);
      if(sh)sh.setAttribute('rx',(r*.85*(1+y/(h*3||1))).toFixed(1))},()=>{hopG.removeAttribute('transform');if(sh)sh.setAttribute('rx',r*.85)},ease.lin)},
    moveTo(tx,ty,dur=450,done,arc=0){const fx=c.x,fy=c.y;tween(dur,(t,p)=>c.place(lerp(fx,tx,t),lerp(fy,ty,t)-Math.sin(p*Math.PI)*arc),done)}
  };
  if(label){g.setAttribute('aria-label',label)}
  c.mood('');c.place(x,y,1);CREATS.add(c);return c;
}
SVG.addEventListener('pointermove',e=>{const p=svgPt(e);CREATS.forEach(c=>{if(!c.g.isConnected){CREATS.delete(c);return}c.look(p.x,p.y)})});

/* ---------- loaf pieces ---------- */
function piece(parent,x,y,w,h,src){
  const g=el('g',{class:'pc'},parent),rx=Math.max(1.5,Math.min(10,w/3,h/3));
  el('rect',{x,y,width:Math.max(1,w),height:h,rx,fill:src?'url(#gB)':'url(#gA)'},g);
  if(w>8)el('rect',{x:x+3,y:y+3,width:Math.max(0,w-6),height:Math.min(5,h/6),rx:2.5,fill:'#fff',opacity:.38},g);
  if(w>16){const k=Math.max(1,Math.round(w/42));for(let i=0;i<k;i++)el('circle',{cx:x+w*((i+.5)/k)+((i*37)%7-3),cy:y+h*(.58+((i*53)%5)/22),r:1.7,fill:'#fff',opacity:.5},g)}
  g.dataset.x=x;g.dataset.y=y;return g;
}
function ghost(parent,x,y,w,h){return el('rect',{x:x+.75,y:y+.75,width:Math.max(1,w-1.5),height:h-1.5,rx:Math.max(1.5,Math.min(10,w/3,h/3)),fill:'rgba(255,244,230,.04)',stroke:'rgba(255,244,230,.32)','stroke-width':1.5,'stroke-dasharray':'4 4'},parent)}

/* drag a loaf piece: the original dims, a copy follows the finger */
function dragPiece(g,{label,canStart,onDrop,onTap}){
  const ox=+g.dataset.x,oy=+g.dataset.y;
  interact(g,{label,
    down:()=>{if(canStart&&!canStart())return{no:1};const cl=g.cloneNode(true);cl.removeAttribute('tabindex');cl.removeAttribute('role');cl.classList.remove('hit');FX.appendChild(cl);g.style.opacity=.25;return{cl}},
    move:(p,p0,k)=>{if(!k.no)k.cl.setAttribute('transform',`translate(${p.x-p0.x},${p.y-p0.y-10})`)},
    up:(p,p0,k)=>{if(k.no)return;const dx=p.x-p0.x,dy=p.y-p0.y-10;const dest=onDrop(p);
      if(dest){tween(260,t=>k.cl.setAttribute('transform',`translate(${lerp(dx,dest.x-ox,t)},${lerp(dy,dest.y-oy,t)})`),()=>{k.cl.remove();dest.done()})}
      else{tween(320,t=>k.cl.setAttribute('transform',`translate(${dx*(1-t)},${dy*(1-t)})`),()=>{k.cl.remove();g.style.opacity=''},ease.back)}},
    tap:(p,k)=>{if(k&&k.cl)k.cl.remove();g.style.opacity='';if(k&&k.no)return;onTap&&onTap()}
  });
}

/* ---------- controls drawn in the world ---------- */
function knob(parent,{x,y,r=26,vals,val,hue=0,label,onChange,fmt}){
  const g=el('g',{transform:`translate(${x},${y})`},parent);
  el('circle',{r:r+9,fill:'rgba(255,244,230,.07)',stroke:hue===2?'rgba(255,244,230,.25)':hue?'rgba(111,227,205,.55)':'rgba(255,192,77,.55)','stroke-width':2},g);
  const rot=el('g',{},g);
  el('circle',{r,fill:'url(#gKnob)',stroke:'rgba(255,244,230,.35)','stroke-width':1.5},rot);
  for(let k=0;k<12;k++){const a=k/12*Math.PI*2;el('line',{x1:Math.cos(a)*(r-3),y1:Math.sin(a)*(r-3),x2:Math.cos(a)*(r-7),y2:Math.sin(a)*(r-7),stroke:'rgba(255,244,230,.28)','stroke-width':2,'stroke-linecap':'round'},rot)}
  el('circle',{cx:0,cy:-r+10,r:5,fill:hue===2?'#fff0a0':hue?'#6fe3cd':'#ffc04d'},rot);
  const nt=el('text',{'text-anchor':'middle',y:r+30,'font-size':14},el('g',{class:'num'},g));
  let i=Math.max(0,vals.indexOf(val)),locked=false;
  const show=()=>{rot.setAttribute('transform',`rotate(${i*30})`);nt.textContent=fmt?fmt(vals[i]):`cut into ${vals[i]}`};
  const set=j=>{j=clamp(j,0,vals.length-1);if(j===i)return;i=j;show();SFX.tick(i);onChange(vals[i])};
  interact(g,{label,down:()=>({i0:i}),move:(p,p0,k)=>{if(!locked)set(k.i0+Math.round(((p0.y-p.y)+(p.x-p0.x))/15))},tap:()=>{if(!locked)set(i+1>=vals.length?0:i+1)}});
  g.addEventListener('keydown',e=>{if(locked)return;if(e.key==='ArrowUp'||e.key==='ArrowRight'){e.preventDefault();set(i+1)}if(e.key==='ArrowDown'||e.key==='ArrowLeft'){e.preventDefault();set(i-1)}});
  show();
  return{g,get:()=>vals[i],set:v=>{i=Math.max(0,vals.indexOf(v));show()},lock:b=>{locked=b;g.classList.toggle('locked',b)}};
}
/* speedometer dial: a half circle with a needle you swing. dir: up, right or left */
function gauge(parent,{x,y,r=60,vals,val,label,caption,onChange,onPreview,dir='up'}){
  const g=el('g',{transform:`translate(${x},${y})`},parent),n=vals.length;
  const a0=dir==='up'?Math.PI:Math.PI/2,sg=dir==='left'?1:-1,a1=a0+sg*Math.PI;
  const ang=i=>n>1?a0+sg*i*Math.PI/(n-1):a0+sg*Math.PI/2;
  const pt=(a,rr)=>[Math.cos(a)*rr,-Math.sin(a)*rr];
  const sweep=sg<0?1:0,arc=(rr,fa,fb,sw)=>{const [p,q]=pt(fa,rr),[u,v]=pt(fb,rr);return`M${p.toFixed(1)},${q.toFixed(1)} A${rr},${rr} 0 0 ${sw} ${u.toFixed(1)},${v.toFixed(1)}`};
  {const [ox,oy]=pt(a1,r+16),[ix,iy]=pt(a1,r-22),[sx,sy]=pt(a0,r-22);
    el('path',{d:`${arc(r+16,a0,a1,sweep)} L${ix.toFixed(1)},${iy.toFixed(1)} A${r-22},${r-22} 0 0 ${1-sweep} ${sx.toFixed(1)},${sy.toFixed(1)}Z`,fill:'rgba(255,244,230,.08)',stroke:'rgba(255,244,230,.2)'},g)}
  const fillP=el('path',{fill:'none',stroke:'#fff0a0','stroke-width':10,'stroke-linecap':'round',opacity:.85},g);
  const ticks=el('g',{},g);
  vals.forEach((v,i)=>{const a=ang(i),[x1,y1]=pt(a,r-14),[x2,y2]=pt(a,r+2),[lx,ly]=pt(a,r+28);
    el('line',{x1,y1,x2,y2,stroke:'#fff4e6','stroke-width':3,'stroke-linecap':'round',opacity:.7},ticks);
    const t=el('text',{x:lx,y:ly+5,'text-anchor':'middle','font-size':15,'font-weight':600,fill:'#d8c6e4'},ticks);t.textContent=v});
  const needle=el('g',{},g);
  el('path',{d:`M-6,0 L0,${-(r-6)} L6,0Z`,fill:'#ff9a6a'},needle);
  el('circle',{r:12,fill:'url(#gKnob)',stroke:'#fff0a0','stroke-width':2},g);
  if(caption){const [cx,cy]=dir==='up'?[0,30]:[sg<0?18:-18,r+52];el('text',{x:cx,y:cy,'text-anchor':dir==='up'?'middle':sg<0?'start':'end','font-size':14,fill:'#d8c6e4'},g).textContent=caption}
  {const [hx,hy]=pt(a1,r+34);el('path',{d:`${arc(r+34,a0,a1,sweep)} L0,0Z`,fill:'transparent'},g)}
  const relOf=a=>{let d=(a-a0)*sg;d=((d%(2*Math.PI))+2*Math.PI)%(2*Math.PI);if(d>1.5*Math.PI)d=0;return clamp(d,0,Math.PI)};
  const idxOf=a=>Math.round(relOf(a)/Math.PI*(n-1));
  let i=Math.max(0,vals.indexOf(val)),cur=ang(i),lastPrev=i;
  const show=a=>{cur=a;needle.setAttribute('transform',`rotate(${(90-a*180/Math.PI).toFixed(1)})`);
    fillP.setAttribute('d',relOf(a)<1e-3?'':arc(r-6,a0,a,sweep));
    const near=idxOf(a);[...ticks.querySelectorAll('text')].forEach((t,k)=>t.setAttribute('fill',k===near?'#fff0a0':'#d8c6e4'));
    if(near!==lastPrev){lastPrev=near;SFX.tick(near);onPreview&&onPreview(vals[near])}};
  const snapTo=(j,fire=true)=>{j=clamp(j,0,n-1);const from=cur,to=ang(j),changed=j!==i;i=j;lastPrev=j;tween(200,t=>show(lerp(from,to,t)),null,ease.back);if(changed){SFX.pop(.7+j*.08);if(fire)onChange(vals[i])}else if(onPreview)onPreview(vals[i])};
  const angAt=p=>Math.atan2(y-p.y,p.x-x);
  interact(g,{label,move:p=>show(a0+sg*relOf(angAt(p))),up:p=>snapTo(idxOf(angAt(p))),
    tap:p=>{if(!p){snapTo(i+1>=n?0:i+1);return}snapTo(idxOf(angAt(p)))}});
  g.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();snapTo(i+1)}if(e.key==='ArrowLeft'||e.key==='ArrowDown'){e.preventDefault();snapTo(i-1)}});
  show(cur);
  return{g,get:()=>vals[i],set:v=>{i=Math.max(0,vals.indexOf(v));lastPrev=i;show(ang(i))}};
}
function stone(parent,{x,y,label,glyph='next',onTap}){
  const g=el('g',{transform:`translate(${x},${y})`},parent);
  const ring=el('circle',{r:30,fill:'none',stroke:'#fff0a0','stroke-width':2.5,class:'ring'},g);ring.style.display='none';
  el('path',{d:'M-27,5C-29,-14 -12,-25 4,-24C21,-23 29,-10 27,6C25,21 10,25 -2,24C-17,23 -26,18 -27,5Z',fill:'url(#gStone)',stroke:'rgba(255,244,230,.3)','stroke-width':1.5},g);
  const G={redo:'M-9,3 A9.5,9.5 0 1 0 -3,-8 M-4,-14 L-2,-7.5 L-9,-6',next:'M-7,-9 L6,0 L-7,9',shuffle:'M-11,-6h6c6,0 6,12 12,12h4M-11,6h6c2,0 3,-1.5 4,-3M5,-6h6M8,-9l3,3l-3,3M8,3l3,3l-3,3'};
  el('path',{d:G[glyph],fill:'none',stroke:'#fff0a0','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round'},g);
  interact(g,{label,tap:()=>{SFX.pop(.9);onTap()}});
  return{g,ready:b=>{ring.style.display=b?'':'none'}};
}
/* round controls live in the dock, down in the corner away from the play */
function navStone({glyph='next',label,onTap}){const old=DOCK.querySelector(`[data-slot="${glyph}"]`);if(old)old.remove();
  const s=stone(DOCK,{x:glyph==='redo'?125:195,y:36,glyph,label,onTap});s.g.dataset.slot=glyph;return s}
/* round dots: gold = won (remembered per player), ringed = this round. plain = just "how far along" (the boss battle) */
let DOTS=null;
function navDots(n,cur,plain){DOTS={n,cur,plain};let g=DOCK.querySelector('#dockDots');if(g)g.remove();g=el('g',{id:'dockDots'},DOCK);
  if(!plain)noteRounds(n);const won=plain?null:wonSet();
  for(let k=0;k<n;k++){const w=plain?k<cur:won.has(k),on=k===cur;el('circle',{cx:84-(n-1-k)*13,cy:36,r:on?5.5:4.5,fill:w?'#fff0a0':on?'rgba(255,240,160,.3)':'rgba(255,244,230,.18)',stroke:on?'#fff0a0':'none','stroke-width':1.5},g)}}
function redrawDots(){if(DOTS)navDots(DOTS.n,DOTS.cur,DOTS.plain)}
function fitDock(){const w=SVG.parentElement;w.classList.remove('dockpad');w.style.paddingBottom='';
  const sz=()=>{const s=SVG.getBoundingClientRect(),k=Math.min(s.width,s.height)/600;DOCK.style.height=(70*k).toFixed(1)+'px';return{s,k}};
  let{s,k}=sz();const cx=s.left+s.width/2,cy=s.top+s.height/2,d=DOCK.getBoundingClientRect();
  if(d.left<cx+300*k-4&&d.top<cy+300*k-4){w.classList.add('dockpad');w.style.paddingBottom=(70*k).toFixed(1)+'px';sz()}}
addEventListener('resize',fitDock);
function pulseRing(parent,x,y,r){const c=el('circle',{cx:x,cy:y,r,fill:'none',stroke:'#fff0a0','stroke-width':2.5,class:'ring'},parent);c.style.display='none';return{show:b=>{c.style.display=b?'':'none'},el:c}}

/* a fraction that only shows through the goggles */
function svgFrac(p,x,y,n,d,sz=16){
  const g=el('g',{class:'num',transform:`translate(${x},${y})`},p);
  const w=Math.max(String(n).length,String(d).length)*sz*.34+sz*.2;
  el('text',{'text-anchor':'middle',y:-sz*.22,'font-size':sz},g).textContent=n;
  el('line',{x1:-w,x2:w,y1:0,y2:0,stroke:'#fff4e6','stroke-width':Math.max(1.4,sz*.09),'stroke-linecap':'round'},g);
  el('text',{'text-anchor':'middle',y:sz*.92,'font-size':sz},g).textContent=d;
  return g;
}
let _mc=null;const tWidth=(t,sz)=>{try{_mc=_mc||document.createElement('canvas').getContext('2d');_mc.font=`700 ${sz*.85}px ${getComputedStyle(document.documentElement).getPropertyValue('--font-body')||'sans-serif'}`;const w=_mc.measureText(t).width;if(w>0)return w+10}catch(e){}return t.length*sz*.44+8};
const ROMW={I:.3,V:.68,X:.66,L:.54,C:.7,D:.74,M:.88};
const partW=(pt,sz)=>pt[0]==='w'&&/^[IVXLCDM]+$/.test(String(pt[1]))?[...String(pt[1])].reduce((a,c)=>a+ROMW[c],0)*sz*1.25+10:pt[0]==='f'?Math.max(String(pt[1]).length,String(pt[2]).length)*sz*.6+12:pt[0]==='w'?(String(pt[1]).length+(String(pt[1]).match(/%/g)||[]).length*.75-(String(pt[1]).match(/\./g)||[]).length*.35)*sz*.62+6:pt[0]==='t'?tWidth(String(pt[1]),sz):22;
function exprWidth(parts,sz=17){return parts.reduce((a,pt)=>a+partW(pt,sz),0)}
function svgExpr(p,x,y,parts,sz=17,anchor='start'){
  const g=el('g',{class:'num'},p);let cx=anchor==='middle'?x-exprWidth(parts,sz)/2:x;
  parts.forEach(pt=>{const w=partW(pt,sz);
    if(pt[0]==='f'){svgFrac(g,cx+w/2,y,pt[1],pt[2],sz).setAttribute('class','')}
    else{const t=el('text',{x:cx+w/2,y:y+sz*.34,'text-anchor':'middle','font-size':pt[0]==='w'?sz*1.25:pt[0]==='t'?sz*.85:sz},g);
      if(pt[0]==='w'&&/\d\.\d/.test(String(pt[1])))String(pt[1]).split(/(\.)/).forEach(s=>{const sp=el('tspan',s==='.'?{class:'dotch'}:{},t);sp.textContent=s});else t.textContent=pt[1]}
    cx+=w});
  return g;
}

/* the question sign: when the question is a formula it sits in a cream box and is always shown
   (the goggles never hide it). '?' marks what she has to find; done=true fills it in and lights the edge */
function qBox(parent,x,y,parts,{sz=20,done=false}={}){
  const g=el('g',{class:'qbox'},parent),w=exprWidth(parts,sz)+34,h=sz*3.1;
  if(done)el('rect',{x:x-w/2-7,y:y-h/2-7,width:w+14,height:h+14,rx:18,fill:'none',stroke:'#fff0a0','stroke-width':6,opacity:.3},g);
  el('rect',{x:x-w/2,y:y-h/2,width:w,height:h,rx:12,fill:'#fff4e6',stroke:done?'#fff0a0':'#c9a77a','stroke-width':done?4:2.5},g);
  const e=svgExpr(g,x,y,parts,sz,'middle');e.setAttribute('class','');
  e.querySelectorAll('text').forEach(t=>t.setAttribute('style',`fill:${/\?/.test(t.textContent)?'#8a5cf0':'#3a2418'};font-weight:700`));e.querySelectorAll('line').forEach(l=>l.setAttribute('stroke','#3a2418'));
  if(done)popIn(g,.85);
  return g}
/* sparkle burst */
function burst(x,y,{n=14,cols=['#fff0a0','#ffc04d','#ff9ed2','#8ff0c8'],spread=70}={}){
  const fl=el('circle',{cx:x,cy:y,r:6,fill:'#fff8d8'},FX);tween(260,(t,p)=>{fl.setAttribute('r',(6+30*t).toFixed(1));fl.setAttribute('opacity',(1-p).toFixed(2))},()=>fl.remove());
  for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=spread*(.5+Math.random()*.7),col=cols[i%cols.length];
    const s=el('path',{d:'M0,-5 L1.4,-1.4 L5,0 L1.4,1.4 L0,5 L-1.4,1.4 L-5,0 L-1.4,-1.4Z',fill:col},FX);
    tween(700+Math.random()*400,(t,p)=>{const px=x+Math.cos(a)*v*t,py=y+Math.sin(a)*v*t+60*p*p;s.setAttribute('transform',`translate(${px.toFixed(1)},${py.toFixed(1)}) rotate(${(p*180).toFixed(0)}) scale(${(1-p*.7).toFixed(2)})`);s.setAttribute('opacity',(1-p).toFixed(2))},()=>s.remove())}
}
/* ---------- juice ---------- */
let shakeAmt=0,shakeOn=false;
function shake(m=6){if(RM)return;shakeAmt=Math.max(shakeAmt,m);if(shakeOn)return;shakeOn=true;
  const f=()=>{shakeAmt*=.86;if(shakeAmt<.3){shakeAmt=0;shakeOn=false;CAM.removeAttribute('transform');return}
    CAM.setAttribute('transform',`translate(${((Math.random()*2-1)*shakeAmt).toFixed(1)},${((Math.random()*2-1)*shakeAmt).toFixed(1)}) rotate(${((Math.random()*2-1)*shakeAmt*.12).toFixed(2)} 300 300)`);requestAnimationFrame(f)};requestAnimationFrame(f)}
function floatText(x,y,txt,{col='#fff0a0',size=26}={}){
  const g=el('g',{transform:`translate(${x},${y})`},FX),t=el('text',{'text-anchor':'middle','font-size':size,fill:col,stroke:'#1d1840','stroke-width':5,'paint-order':'stroke','font-weight':600,style:'font-family:var(--font-display);font-style:italic'},g);t.textContent=txt;
  tween(1100,(e,p)=>{const s=p<.15?lerp(.4,1.2,p/.15):p<.3?lerp(1.2,1,(p-.15)/.15):1;g.setAttribute('transform',`translate(${x},${(y-50*e).toFixed(1)}) scale(${s.toFixed(2)})`);g.setAttribute('opacity',p>.7?(1-(p-.7)/.3).toFixed(2):1)},()=>g.remove(),ease.lin)}
function ring(x,y,{col='#fff0a0',r0=10,r1=90,w=5,dur=600}={}){const c=el('circle',{cx:x,cy:y,r:r0,fill:'none',stroke:col,'stroke-width':w},FX);
  tween(dur,(t,p)=>{c.setAttribute('r',lerp(r0,r1,t).toFixed(1));c.setAttribute('stroke-width',(w*(1-p)+.5).toFixed(1));c.setAttribute('opacity',(1-p).toFixed(2))},()=>c.remove())}
function crumbs(x,y,{n=10,cols=['#7a4a2e','#5a321d','#a8714c'],up=1}={}){
  for(let i=0;i<n;i++){const a=-Math.PI/2*up+(Math.random()-.5)*2.4,v=50+Math.random()*90,r=1.8+Math.random()*2.8,c=el('rect',{x:-r,y:-r,width:r*2,height:r*2,rx:r*.4,fill:cols[i%cols.length]},FX);
    tween(600+Math.random()*300,(t,p)=>{c.setAttribute('transform',`translate(${(x+Math.cos(a)*v*t).toFixed(1)},${(y+Math.sin(a)*v*t+140*p*p).toFixed(1)}) rotate(${(p*400).toFixed(0)})`);c.setAttribute('opacity',(1-p*p).toFixed(2))},()=>c.remove(),ease.out)}}
function drops(x,y,n=7){crumbs(x,y,{n,cols:['#b9ecff','#6fcdf5','#e6f8ff'],up:1})}
function popIn(g,from=.55){if(RM||!g||g.getAttribute('transform'))return;g.style.transformBox='fill-box';g.style.transformOrigin='center';
  tween(380,(t,p)=>{const s=p<.6?lerp(from,1.14,p/.6):lerp(1.14,1,(p-.6)/.4);g.style.transform=`scale(${s.toFixed(3)})`},()=>{g.style.transform=''},ease.lin)}
/* ---------- the dusk backdrop ---------- */
const SCENE_X={},AMB_X={};
function backdrop(kind='hills'){
  BACK.innerHTML='';
  el('circle',{cx:562,cy:40,r:140,fill:'url(#gMoon)'},BACK);
  el('circle',{cx:562,cy:40,r:24,fill:'#fff1d6',opacity:.85},BACK);
  el('circle',{cx:555,cy:35,r:6,fill:'#f3dcc0',opacity:.6},BACK);
  try{moonShadow(BACK,562,40,24)}catch(e){}
  for(let i=0;i<34;i++){const x=-320+((i*197)%1240),y=((i*83)%300)+8;const s=el('circle',{cx:x,cy:y,r:(i%3)*.5+.7,fill:'#fff4e6',opacity:.7,class:'twinkle'},BACK);s.style.animationDelay=(-(i*.37)%4).toFixed(2)+'s'}
  el('path',{d:'M-900,470 C-600,400 -380,440 -150,420 C40,402 160,452 330,428 C520,400 700,440 900,410 C1100,385 1300,430 1500,420 L1500,700 L-900,700Z',fill:'#5b3b78',opacity:.55},BACK);
  el('path',{d:'M-900,500 C-650,465 -420,500 -200,478 C20,456 180,500 380,482 C580,464 760,505 960,476 C1160,450 1320,490 1500,476 L1500,700 L-900,700Z',fill:'#2e2a62'},BACK);
  el('path',{d:'M-900,540 C-640,515 -400,545 -160,526 C80,508 220,548 420,530 C640,512 820,550 1020,528 C1220,506 1360,540 1500,532 L1500,1400 L-900,1400Z',fill:'#1a2346'},BACK);
  if(kind==='oven'){
    const o=el('g',{},BACK);
    el('path',{d:'M-700,470 L-700,140 Q300,-60 1300,140 L1300,470Z',fill:'#2a1b3a',opacity:.75},o);
    for(let r=0;r<7;r++)for(let c=-6;c<14;c++){const x=c*80+(r%2)*40,y=150+r*46;el('rect',{x,y,width:74,height:40,rx:6,fill:'none',stroke:'#4a2b44','stroke-width':2,opacity:.5},o)}
    el('path',{d:'M140,470 L140,330 Q300,180 460,330 L460,470Z',fill:'#1a0f1f'},o);
    el('ellipse',{cx:300,cy:440,rx:170,ry:120,fill:'url(#gOven)',class:'flicker'},o);
    [[250,450,14],[300,446,18],[350,452,12],[275,456,9],[328,458,10]].forEach(([x,y,r])=>el('circle',{cx:x,cy:y,r,fill:'#ff9a4a',opacity:.55,class:'flicker'},o));
  }
  if(kind==='cave'){
    const o=el('g',{},BACK);
    el('rect',{x:-700,y:-10,width:2000,height:800,fill:'url(#gDimA)'},o);
    [[-60,470,1],[40,520,.7],[560,480,1.1],[640,430,.8],[500,540,.6],[120,560,.5]].forEach(([x,y,s],k)=>{const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},o);
      [[0,-120,22],[-30,-80,16],[30,-90,18]].forEach(([dx,h,w],j)=>{el('path',{d:`M${dx-w},0 L${dx-w*.6},${h*.85} L${dx},${h} L${dx+w*.6},${h*.85} L${dx+w},0Z`,fill:['#8a6cf0','#5fb8e8','#c084fc'][(k+j)%3],opacity:.55},g)});
      el('circle',{cx:0,cy:-60,r:70,fill:'#8fd6ff',opacity:.06},g)});
  }
  if(kind==='river'){
    const o=el('g',{},BACK);
    for(let i=-6;i<14;i++){const x=i*70+((i*37)%30),h=70+((i*53)%60);el('path',{d:`M${x-34},302 Q${x-30},${300-h*.6} ${x},${300-h} Q${x+30},${300-h*.6} ${x+34},302Z`,fill:'#16233f',opacity:.9},o)}
    el('rect',{x:-700,y:296,width:2000,height:10,fill:'#16233f'},o);
    for(let i=-14;i<30;i++){const x=i*34+Math.abs((i*29)%17),h=26+Math.abs((i*41)%30);el('path',{d:`M${x},560 q${((i%3)-1)*4},-${h/2} ${(i%2?6:-6)},-${h}`,stroke:'#203a3a','stroke-width':4,'stroke-linecap':'round',fill:'none'},o);if(i%4===0)el('ellipse',{cx:x+(i%2?6:-6),cy:560-h-6,rx:3.5,ry:9,fill:'#5a3b2a'},o)}
    for(let i=0;i<9;i++){const f=el('circle',{cx:-80+i*95,cy:140+((i*59)%140),r:2.4,fill:'#e6ff8a',opacity:.8,class:'mote'},o);f.style.animationDelay=(-i*1.3)+'s';el('circle',{cx:-80+i*95,cy:140+((i*59)%140),r:9,fill:'#e6ff8a',opacity:.08},o)}
  }
  if(kind==='festival'){
    const o=el('g',{},BACK);
    el('path',{d:'M-700,470 C-400,455 -100,480 300,466 C700,452 1000,478 1300,466 L1300,800 L-700,800Z',fill:'#1b2d55',opacity:.9},o);
    for(let i=0;i<26;i++){const x=-300+((i*137)%1200),y=40+((i*71)%330),s=.5+((i*13)%10)/14,g=el('g',{transform:`translate(${x},${y}) scale(${s.toFixed(2)})`,class:'mote'},o);g.style.animationDelay=(-i*.9)+'s';
      el('circle',{r:16,fill:'#ffb86a',opacity:.12},g);el('ellipse',{rx:6,ry:8,fill:'#ff8a5a',opacity:.75},g);el('ellipse',{rx:3,ry:5,fill:'#ffe08a',opacity:.9},g)}
    for(let i=0;i<14;i++){const x=-200+i*90,y=500+(i%3)*14;el('ellipse',{cx:x,cy:y,rx:14,ry:4,fill:'#ffb86a',opacity:.25},o);el('rect',{x:x-5,y:y-12,width:10,height:10,rx:2,fill:'#ff9a6a',opacity:.6},o)}
  }
  if(kind==='tower'){
    const o=el('g',{},BACK);
    el('rect',{x:-700,y:-10,width:2000,height:800,fill:'url(#gDimB)'},o);
    for(let r=0;r<12;r++)for(let c=-10;c<22;c++){const x=c*64+(r%2)*32,y=60+r*44;if(x>120&&x<480&&y<470)continue;el('rect',{x,y,width:60,height:40,rx:5,fill:'#3a3150',opacity:.55},o)}
    [[36,300],[564,300]].forEach(([x,y])=>{el('rect',{x:x-5,y,width:10,height:40,rx:3,fill:'#e8dcc8'},o);el('path',{d:`M${x},${y-4} q-6,-12 0,-22 q6,10 0,22Z`,fill:'#ffd36a',class:'flicker'},o);el('circle',{cx:x,cy:y-10,r:34,fill:'#ffd36a',opacity:.1,class:'flicker'},o)});
  }
  if(kind==='picnic'){
    const o=el('g',{},BACK);
    for(let i=-8;i<18;i++){const x=i*62+((i*41)%23),h=180+Math.abs((i*53)%90),w=26+Math.abs((i*17)%14);el('path',{d:`M${x},430 L${x-w},430 L${x},${430-h} L${x+w},430Z`,fill:i%2?'#1b2a2a':'#16232a',opacity:.95},o);el('rect',{x:x-4,y:430,width:8,height:20,fill:'#1a1418'},o)}
    for(let i=0;i<10;i++){const f=el('circle',{cx:-60+i*80,cy:130+((i*47)%170),r:2.4,fill:'#e6ff8a',opacity:.8,class:'mote'},o);f.style.animationDelay=(-i*1.1)+'s'}
  }
  if(kind==='desk'){
    const o=el('g',{},BACK);
    el('rect',{x:-700,y:-10,width:2000,height:800,fill:'url(#gDimB)'},o);
    el('ellipse',{cx:40,cy:150,rx:240,ry:150,fill:'#ffcf8a',opacity:.07},o);el('ellipse',{cx:40,cy:150,rx:120,ry:80,fill:'#ffcf8a',opacity:.07},o);
    [[470,0,110],[540,0,70],[610,0,140],[-60,0,90]].forEach(([x,y,len],k)=>{el('line',{x1:x,y1:0,x2:x,y2:len,stroke:'#cdbfa8',opacity:.4},o);const g=el('g',{transform:`translate(${x},${len+14}) scale(${.8+k*.1})`,class:'mote'},o);
      el('path',{d:'M-22,0 L0,-6 L22,0 L0,8Z',fill:['#ff9ed2','#8fd6ff','#fff0a0','#b8a2ff'][k],opacity:.7},g);el('path',{d:'M0,-6 L-6,-22 L4,-4Z',fill:'#fff',opacity:.5},g)});
    el('rect',{x:-700,y:430,width:2000,height:400,fill:'#3a2618'},o);el('rect',{x:-700,y:430,width:2000,height:6,fill:'#5a3f2c'},o);
    for(let i=0;i<14;i++)el('path',{d:`M${-700+i*150},${450+(i%3)*30} q60,-6 140,4`,stroke:'#4a3222','stroke-width':2,fill:'none'},o);
  }
  if(kind==='meadow'){
    const o=el('g',{},BACK);
    
    for(let i=-14;i<30;i++){const x=i*40+((i*23)%15),y=470+((i*17)%40),c=['#ff9ed2','#fff0a0','#b8a2ff','#ffb88a'][Math.abs(i)%4];
      el('path',{d:`M${x},${y+40} q${(i%2?4:-4)},-20 0,-40`,stroke:'#3f5a3a','stroke-width':2.5,fill:'none'},o);
      for(let k=0;k<5;k++)el('ellipse',{cx:x+Math.cos(k*1.26)*5,cy:y+Math.sin(k*1.26)*5,rx:3.5,ry:2.2,fill:c,opacity:.55,transform:`rotate(${k*72} ${x+Math.cos(k*1.26)*5} ${y+Math.sin(k*1.26)*5})`},o);el('circle',{cx:x,cy:y,r:2,fill:'#ffd34d',opacity:.7},o)}
  }
  if(kind==='patch'){/* a melon patch at night: vines, leaves, sleeping melons, fireflies */
    const o=el('g',{},BACK);
    el('path',{d:'M-900,455 C-500,430 -200,462 120,448 C380,436 640,466 900,446 C1150,430 1350,452 1500,446 L1500,700 L-900,700Z',fill:'#20321f',opacity:.9},o);
    for(let i=-12;i<26;i++){const x=i*58+((i*31)%19),y=468+((i*13)%46);
      el('path',{d:`M${x-30},${y+6} q15,-14 30,0 t30,0`,stroke:'#3f6a35','stroke-width':2.5,fill:'none',opacity:.8},o);
      el('path',{d:`M${x},${y} q-12,-16 -2,-24 q12,4 2,24Z`,fill:'#2f5a2e',opacity:.9},o);
      el('path',{d:`M${x+6},${y+2} q14,-10 22,-2 q-8,12 -22,2Z`,fill:'#3a6b34',opacity:.85},o);
      el('path',{d:`M${x+18},${y-2} q6,-10 0,-14`,stroke:'#5c8f48','stroke-width':1.5,fill:'none'},o);
      if(i%4===1){const mx=x+22,my=y+14;el('ellipse',{cx:mx,cy:my,rx:22,ry:13,fill:'#2c6b34'},o);
        for(let k=-2;k<=2;k++)el('path',{d:`M${mx+k*7},${my-12} q${-k*2},12 0,24`,stroke:'#1d4d26','stroke-width':3,fill:'none'},o);
        el('ellipse',{cx:mx-7,cy:my-5,rx:7,ry:3,fill:'#fff',opacity:.12},o)}}
    for(let i=0;i<10;i++){const f=el('circle',{cx:-40+i*76,cy:150+((i*53)%180),r:2.4,fill:'#e6ff8a',opacity:.8,class:'mote'},o);f.style.animationDelay=(-i*1.3)+'s'}
  }
  if(kind==='hub'){/* the open sky between worlds */
    const o=el('g',{},BACK);
    [[120,200,260,90,'#7a4ad0',.12],[480,330,240,80,'#3fb6c8',.08],[300,90,320,60,'#ff8fb0',.06]].forEach(([cx,cy,rx,ry,f,op])=>el('ellipse',{cx,cy,rx,ry,fill:f,opacity:op,transform:`rotate(-12 ${cx} ${cy})`},o));
    for(let i=0;i<60;i++){const x=-300+((i*137)%1200),y=((i*71)%430)+6,s=el('circle',{cx:x,cy:y,r:(i%4)*.35+.5,fill:'#fff4e6',opacity:.6,class:'twinkle'},o);s.style.animationDelay=(-(i*.53)%4).toFixed(2)+'s'}
    el('circle',{cx:40,cy:70,r:16,fill:'#6fe3cd',opacity:.35},o);el('ellipse',{cx:40,cy:70,rx:28,ry:6,fill:'none',stroke:'#6fe3cd',opacity:.35,'stroke-width':2,transform:'rotate(-18 40 70)'},o);
  }
  if(kind==='lair'){/* storm peaks under a swirling sky */
    const o=el('g',{},BACK);
    el('rect',{x:-700,y:-10,width:2000,height:800,fill:'url(#gDimA)'},o);
    for(let i=0;i<9;i++){const x=-300+i*150+((i*37)%40),y=40+((i*53)%110);const c=el('g',{class:'mote'},o);c.style.animationDelay=(-i*1.7)+'s';
      [[0,0,60,18],[30,-10,40,16],[-34,-6,36,14]].forEach(([dx,dy,rx,ry])=>el('ellipse',{cx:x+dx,cy:y+dy,rx,ry,fill:'#2a1a48',opacity:.55},c))}
    el('path',{d:'M-900,480 L-760,360 L-640,430 L-520,330 L-400,420 L-280,350 L-170,440 L-60,370 L40,450 L120,400 L200,470 L300,430 L400,470 L480,400 L560,450 L660,350 L780,430 L900,340 L1040,440 L1200,370 L1500,450 L1500,700 L-900,700Z',fill:'#140c26'},o);
    el('rect',{x:-900,y:500,width:2400,height:300,fill:'#0f0920'},o);
    for(let i=0;i<16;i++){const x=-500+i*110+((i*29)%50),y=505+((i*41)%60);el('path',{d:`M${x},${y} l12,10 l-5,9 l14,8`,stroke:'#9a6cff','stroke-width':2,fill:'none',opacity:.35,class:'flicker'},o)}
  }
  if(kind==='gorge'){
    const o=el('g',{},BACK);
    el('path',{d:'M-700,340 L-560,170 L-470,250 L-360,120 L-240,240 L-120,150 L-20,260 L80,160 L190,250 L300,110 L410,240 L520,140 L640,250 L760,130 L880,240 L1000,160 L1120,260 L1300,180 L1300,500 L-700,500Z',fill:'#2a2552',opacity:.9},o);
    [[-360,120],[80,160],[300,110],[520,140],[760,130]].forEach(([x,y])=>el('path',{d:`M${x-26},${y+30} L${x},${y} L${x+24},${y+28} L${x+10},${y+22} L${x},${y+30} L${x-10},${y+22}Z`,fill:'#e8e4ff',opacity:.5},o));
    for(let i=-10;i<24;i++){const x=i*48+((i*31)%20),h=40+Math.abs((i*37)%30);el('path',{d:`M${x},300 l-12,0 l12,-${h} l12,${h}Z`,fill:'#1b1838'},o)}
    for(let i=0;i<4;i++)el('ellipse',{cx:-200+i*360,cy:250+i%2*30,rx:260,ry:26,fill:'#cfc6ff',opacity:.07,class:'mote'},o);
  }
  if(kind==='shop'){
    const o=el('g',{},BACK);
    [150,250,350].forEach(y=>{el('rect',{x:-700,y,width:2000,height:8,fill:'#4a3550',opacity:.8},o);
      for(let i=-8;i<16;i++){const x=i*62+((y/50)%2)*20,h=34+(i*13+y)%22,c=['#ff9ed2','#8ff0c8','#ffe07a','#b8a2ff','#ffb88a'][Math.abs(i+y/50)%5|0];
        el('rect',{x,y:y-h,width:36,height:h,rx:8,fill:'#fff4e6',opacity:.08},o);el('rect',{x:x+4,y:y-h*.6,width:28,height:h*.6-2,rx:6,fill:c,opacity:.22},o);el('rect',{x:x+6,y:y-h-6,width:24,height:7,rx:3,fill:'#6b4a5a',opacity:.6},o)}});
  }
  if(kind==='glass'){
    const o=el('g',{},BACK);
    for(let c=-8;c<16;c++)el('line',{x1:c*70,y1:-40,x2:c*70+40,y2:470,stroke:'#fff4e6',opacity:.06,'stroke-width':2},o);
    el('path',{d:'M-700,40 Q300,-30 1300,40',stroke:'#fff4e6',opacity:.1,'stroke-width':3,fill:'none'},o);
    el('path',{d:'M-700,150 Q300,90 1300,150',stroke:'#fff4e6',opacity:.08,'stroke-width':2,fill:'none'},o);
    [[60,0],[540,0]].forEach(([x])=>{el('line',{x1:x,y1:-60,x2:x,y2:30,stroke:'#6b5a8a','stroke-width':2},o);el('circle',{cx:x,cy:40,r:12,fill:'#fff0a0',opacity:.9,class:'flicker'},o);el('circle',{cx:x,cy:40,r:38,fill:'#fff0a0',opacity:.12},o)});
  }
  if(SCENE_X[kind])SCENE_X[kind](el('g',{},BACK));
  for(let i=0;i<7;i++){const m=el('circle',{cx:40+i*85,cy:180+((i*71)%220),r:2+(i%3),fill:'#fff0a0',opacity:.35,class:'mote'},BACK);m.style.animationDelay=(-i*1.9)+'s'}
}
