/* ---------- 2. The Mason: a small one in front takes away ---------- */
W.mason={scene:'road',
notes:`<p>The take-away rule, discovered rather than told. Milestones are narrow, so four of the same letter in a row won't fit: to carve 4 she needs a shorter way. A smaller letter carved in front of a bigger one takes itself away (it gets a red notch under it as soon as it's in front), so IV is 5 take away 1. Tap a letter from the tray to carve it on the end; tap a carved letter to knock it off. Check reads the stone aloud, letter by letter (+10, −1, +10…), and the total must match.</p>
<p>Then 9 (IX), a teen with a take-away (14 or 19), L for 50 and XL for 40, and C for 100 with XC for 90. Only I goes in front of V and X, and only X in front of L and C: other pairs are caught with a reason.</p>`,
mount(root){
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const R=[{ns:[4],L:'IVX'},{ns:[9],L:'IVX'},{ns:[14,19,24],L:'IVX'},{ns:[40,45,44],L:'IVXL'},{ns:[90,94,99],L:'IVXLC'}];
  const S={r:0,busy:false,won:false,n:0};
  const scene=el('g',{},root),stoneL=el('g',{},root),readL=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=dexGuide(ui);let cv=null;
  const st=navStone({label:'Next stone',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this stone again',onTap:()=>load()});
  const parts=done=>[['w',S.n],['o','='],done?['w',toRoman(S.n)]:['o','?']];
  function drawScene(){scene.innerHTML='';
    /* the mason's bench, the hammer and chisel */
    el('rect',{x:70,y:350,width:460,height:22,rx:6,fill:'#8a5a34',stroke:'#4a2a14','stroke-width':2},scene);[110,490].forEach(x=>el('rect',{x:x-8,y:372,width:16,height:60,fill:'#6a4220'},scene));
    const h=el('g',{transform:'translate(524,240) rotate(-30)'},scene);el('rect',{x:-4,y:0,width:8,height:46,rx:3,fill:'#8a5a34'},h);el('rect',{x:-16,y:-10,width:32,height:16,rx:4,fill:'#8a92a8',stroke:'#4a5268','stroke-width':2},h);
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
    if(S.r>=1)unlock('rmason');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';readL.innerHTML='';ui.innerHTML='';ui.appendChild(guide.g);const q=R[S.r];
    Object.assign(S,{busy:false,won:false,n:pick(q.ns)});st.ready(false);navDots(R.length,S.r);decQ(qL,parts(false),false,guide);drawScene();stoneL.innerHTML='';
    cv=carver(stoneL,{x:300,y:296,letters:q.L,max:8,sz:44,ty:446,can:()=>!S.busy&&!S.won});
    decGo(ui,548,470,'Check the stone',check,'Check');
    say(S.r===0?'Carve 4 on this milestone. Careful: four sticks in a row won’t fit!':S.r===1?'Carve 9. Remember the trick with a small letter in front.':S.r===3?'A new letter: L is 50. Carve the number.':S.r===4?'C is 100. Carve the number.':'Carve the number on the milestone.')}
  W.mason.dbgQ=()=>({r:S.r,n:S.n,str:cv.get(),busy:S.busy});
  S.r=resumeAt(R.length);load();
}};
