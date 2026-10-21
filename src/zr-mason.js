/* ---------- 2. The Mason: a small one in front takes away ---------- */
W.mason={scene:'road',
notes:`<p>The first round shows the rule by doing it: put an I behind a V and the stone reads 5 + 1 = 6 (VI); move it in front and it reads 5 − 1 = 4 (IV). Then the same with X and C: CX is 110, XC is 100 − 10 = 90. Each placement is read aloud and written as a sum.</p>
<p>Then the take-away rule is used. Milestones are narrow, so four of the same letter in a row won't fit: to carve 4 she needs a shorter way. A smaller letter carved in front of a bigger one takes itself away (it gets a red notch under it as soon as it's in front), so IV is 5 take away 1. Tap a letter from the tray to carve it on the end; tap a carved letter to knock it off. Check reads the stone aloud, letter by letter (+10, −1, +10…), and the total must match.</p>
<p>Then 9 (IX), a teen with a take-away (14 or 19), L for 50 and XL for 40, and C for 100 with XC for 90. Only I goes in front of V and X, and only X in front of L and C: other pairs are caught with a reason.</p>`,
mount(root){
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const R=[{explain:1},{ns:[4],L:'IVX'},{ns:[9],L:'IVX'},{ns:[14,19,24],L:'IVX'},{ns:[40,45,44],L:'IVXL'},{ns:[90,94,99],L:'IVXLC'}];
  const S={r:0,busy:false,won:false,n:0};
  const scene=el('g',{},root),stoneL=el('g',{},root),readL=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=dexGuide(ui);let cv=null;
  const st=navStone({label:'Next stone',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this stone again',onTap:()=>load()});
  const parts=done=>R[S.r].explain?[['t',done?'a small letter in front takes away':'in front, or behind?']]:[['w',S.n],['o','='],done?['w',toRoman(S.n)]:['o','?']];
  function drawScene(tools=true){scene.innerHTML='';
    /* the mason's bench, the hammer and chisel */
    el('rect',{x:70,y:350,width:460,height:22,rx:6,fill:'#8a5a34',stroke:'#4a2a14','stroke-width':2},scene);[110,490].forEach(x=>el('rect',{x:x-8,y:372,width:16,height:60,fill:'#6a4220'},scene));
    if(!tools)return;const h=el('g',{transform:'translate(524,240) rotate(-30)'},scene);el('rect',{x:-4,y:0,width:8,height:46,rx:3,fill:'#8a5a34'},h);el('rect',{x:-16,y:-10,width:32,height:16,rx:4,fill:'#8a92a8',stroke:'#4a5268','stroke-width':2},h);
    const c=el('g',{transform:'translate(96,248) rotate(28)'},scene);el('rect',{x:-3,y:-30,width:6,height:44,rx:2,fill:'#a8b0c4',stroke:'#4a5268','stroke-width':1.5},c);el('rect',{x:-5,y:-46,width:10,height:18,rx:3,fill:'#8a5a34'},c)}
  /* only I before V/X, X before L/C, C before D/M; and only one in front */
  function why(str){if(/(IL|IC|ID|IM|XD|XM|VX|VL|VC|VD|VM|LC|LD|LM|DM)/.test(str))return'Only I can go in front of V and X, and only X in front of L and C.';
    if(/(II[VX]|XX[LC]|CC[DM])/.test(str))return'Only one small letter can stand in front to take away.';return null}
  function check(){if(S.busy||S.won)return;const s=cv.get();if(!s){say('Carve the number on the stone: tap the letters in the tray.');return}
    S.busy=true;readL.innerHTML='';readOut(readL,300,296,s,{sz:44,done:v=>{
      const bad=why(s);
      if(v===S.n&&s===toRoman(S.n)){win();return}
      SFX.wrong();shake(2);
      say(bad?`${bad} ${v===S.n?'It does add up to '+S.n+', but there’s a proper way.':''}`:v===S.n?(s.length===toRoman(S.n).length?`That adds up to ${S.n}, but Romans carve the biggest letters first.`:`That adds up to ${S.n}, but the Romans would carve it shorter: use a take-away instead of a long row.`):v>S.n?`The stone reads ${v}, more than ${S.n}.${/[VXLC]I/.test(s)&&!/I[VX]/.test(s)?' A small letter after a big one adds. In front, it takes away.':''}`:`The stone reads ${v}, less than ${S.n}.`);
      later(2800,()=>{readL.innerHTML='';S.busy=false})}})}
  function win(){S.won=true;roundWon(S.r);SFX.fanfare();heehaw();guide.cheer();decQ(qL,parts(true),true,guide);burst(300,296,{n:16});const s=toRoman(S.n);
    const take=s.match(/IV|IX|XL|XC|CD|CM/g)||[];say(`${s} = ${S.n}.${take.length?' '+take.map(t=>`${t} is ${RV[t[1]]} take away ${RV[t[0]]}`).join(', and ')+'.':''}`);
    if(S.r>=2)unlock('rmason');later(1400,()=>st.ready(true))}
  /* round 1: in front, or behind? The same two letters, read both ways */
  const STEPS=[['V','I',1],['V','I',0],['C','X',1],['C','X',0]];
  function explain(){let k=0,side=null;const eq=el('g',{},readL),learnt=el('g',{},ui);
    const draw=()=>{stoneL.innerHTML='';const [big,sm]=STEPS[k],g=el('g',{transform:'translate(300,296)'},stoneL),W=300,H=110;
      el('rect',{x:-W/2,y:-H/2,width:W,height:H,rx:14,fill:STONE.face,stroke:STONE.edge,'stroke-width':3},g);
      const cw=48*CW;if(side==null)carve(g,0,16,big,{sz:48});else{const str=side?big+sm:sm+big;[...str].forEach((c,i)=>carve(g,(i-.5)*cw,16,c,{sz:48}));if(!side)el('path',{d:`M${-cw/2-8},${44} h16`,stroke:'#c9413a','stroke-width':4,'stroke-linecap':'round'},g)}
      [[-1,'in front'],[1,'behind']].forEach(([d,t])=>{const sg=el('g',{transform:`translate(${d*96},0)`},g);
        if(side==null)el('rect',{x:-26,y:-34,width:52,height:62,rx:8,fill:'rgba(255,255,255,.35)',stroke:STONE.side,'stroke-width':2,'stroke-dasharray':'5 4'},sg);
        el('text',{y:-H/2-10,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#fff4e6',stroke:'#3a2a1a','stroke-width':3,'paint-order':'stroke'},sg).textContent=t;
        el('rect',{x:-36,y:-50,width:72,height:100,fill:'transparent'},sg);interact(sg,{label:`Put the ${sm} ${d<0?'in front of':'behind'} the ${big}`,tap:()=>{if(S.busy)return;side=d>0?1:0;eq.innerHTML='';SFX.tick(d>0?5:2);draw()}})})};
    const ask=()=>{const [big,sm,b]=STEPS[k];say(`Put the ${sm} ${b?'behind':'in front of'} the ${big}, then check what the stone says.`)};
    S.check=()=>{if(S.busy)return;const [big,sm,b]=STEPS[k];if(side==null){say(`Tap a space: in front of the ${big}, or behind it.`);return}
      const str=side?big+sm:sm+big;S.busy=true;readL.querySelectorAll('.ro').forEach(n=>n.remove());const ro=readOut(readL,300,312,str,{sz:48,done:v=>{
        eq.innerHTML='';const t=el('text',{x:300,y:410,'text-anchor':'middle','font-size':26,'font-weight':800,fill:'#fff4e6',stroke:'#3a2a1a','stroke-width':4,'paint-order':'stroke'},eq);
        [[str+' = ',null],[fmtR(RV[big]),null],[side?' + ':' − ',side?'#8ff0c8':'#ff9a9a'],[fmtR(RV[sm]),null],[' = '+fmtR(v),null]].forEach(([x,c])=>{const sp=el('tspan',c?{fill:c}:{},t);sp.textContent=x});
        if(side!==b){SFX.clonk();say(side?`Behind the ${big}, the ${sm} adds: ${str} is ${v}. Now put it in front.`:`In front of the ${big}, the ${sm} takes away: ${str} is ${v}! Now try it behind.`);later(600,()=>{S.busy=false})}
        else{SFX.chime();const c=el('g',{transform:`translate(${520},${170+k*40})`},learnt);el('rect',{x:-48,y:-16,width:96,height:30,rx:8,fill:'#fff4e6',stroke:side?'#3aa86a':'#c9413a','stroke-width':2},c);el('text',{y:6,'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#3a2418'},c).textContent=`${str} = ${v}`;popIn(c,.5);
          say(side?`Behind, it adds: ${fmtR(RV[big])} + ${fmtR(RV[sm])} = ${fmtR(v)}.`:`In front, it takes away: ${fmtR(RV[big])} − ${fmtR(RV[sm])} = ${fmtR(v)}. That’s how the Romans write ${fmtR(v)}.`);
          later(2600,()=>{k++;side=null;eq.innerHTML='';readL.querySelectorAll('.ro').forEach(n=>n.remove());S.busy=false;if(k>=STEPS.length){S.won=true;roundWon(S.r);SFX.fanfare();heehaw();guide.cheer();decQ(qL,parts(true),true,guide);say('A small letter in front takes itself away: IV is 5 − 1, XC is 100 − 10. Behind, it adds.');later(1400,()=>st.ready(true));stoneL.innerHTML='';return}draw();ask()})}}});ro.classList.add('ro')};
    draw();ask()}
  function load(){EPOCH++;FX.innerHTML='';readL.innerHTML='';ui.innerHTML='';ui.appendChild(guide.g);const q=R[S.r];S.check=null;
    if(q.explain){Object.assign(S,{busy:false,won:false,n:0});st.ready(false);navDots(R.length,S.r);decQ(qL,parts(false),false,guide);drawScene(false);cv={get:()=>''};decGo(ui,548,470,'Check the stone',()=>S.check&&S.check(),'Check');explain();return}
    Object.assign(S,{busy:false,won:false,n:pick(q.ns)});st.ready(false);navDots(R.length,S.r);decQ(qL,parts(false),false,guide);drawScene();stoneL.innerHTML='';
    cv=carver(stoneL,{x:300,y:296,letters:q.L,max:8,sz:44,ty:446,can:()=>!S.busy&&!S.won});
    decGo(ui,548,470,'Check the stone',check,'Check');
    say(S.r===1?'Carve 4 on this milestone. Careful: four sticks in a row won’t fit!':S.r===2?'Carve 9. Remember the trick with a small letter in front.':S.r===4?'A new letter: L is 50. Carve the number.':S.r===5?'C is 100. Carve the number.':'Carve the number on the milestone.')}
  W.mason.dbgQ=()=>({r:S.r,n:S.n,str:cv.get(),busy:S.busy});
  S.r=resumeAt(R.length);load();
}};
