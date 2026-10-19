/* ---------- 2. Pictures: pictograms and their keys ---------- */
W.picto={scene:'survey',
notes:`<p>Turning a tally into a picture chart. Pip's tally is on the left; she taps each row of the pictogram to add a picture (tap a picture to take it off). First one picture is one animal. Then the key changes: one picture is 2 animals, so 8 sheep is 4 pictures, and 7 sheep needs half a picture (the ½ button). Then one picture is 5, so each gate of the tally is one picture. Then backwards: Pip lost his tally, so she makes it again from the pictures and the key. Last: two farms drew their hens with different keys; which farm really has more?</p>`,
mount(root){
  const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pickK=(n)=>['sheep','goat','duck','hen','cow'].sort(()=>Math.random()-.5).slice(0,n);
  const R=[
    {mode:'make',key:1,gen:()=>{const k=pickK(3);return Object.fromEntries(k.map(x=>[x,rnd(2,7)]))}},
    {mode:'make',key:2,gen:()=>{const k=pickK(3);return Object.fromEntries(k.map(x=>[x,2*rnd(2,6)]))}},
    {mode:'make',key:2,gen:()=>{const k=pickK(3),v=[2*rnd(1,5)+1,2*rnd(2,5),2*rnd(1,4)+1];return Object.fromEntries(k.map((x,i)=>[x,v[i]]))}},
    {mode:'make',key:5,gen:()=>{const k=pickK(3);return Object.fromEntries(k.map(x=>[x,5*rnd(1,5)]))}},
    {mode:'tally',key:2,gen:()=>{const k=pickK(3),v=[2*rnd(2,6),2*rnd(1,5)+1,2*rnd(2,5)];return Object.fromEntries(k.map((x,i)=>[x,v[i]]))}},
    {mode:'farms',gen:()=>{const t=Math.random()<.6,one=t?[rnd(5,6),1]:[[7,9][rnd(0,1)],1],two=t?[one[0]-1,2]:[one[0]===7?3:4,2];return Math.random()<.5?{A:one,B:two}:{A:two,B:one}}}];
  const S={r:0,busy:false,won:false,want:{},pic:{},marks:{},pick:null};
  const scene=el('g',{},root),left=el('g',{},root),chart=el('g',{},root),qL=el('g',{},root),ui=el('g',{},root);const guide=pipGuide(ui);
  const st=navStone({label:'Next chart',onTap:()=>{S.r=(S.r+1)%R.length;load()}});
  navStone({glyph:'redo',label:'Start this chart again',onTap:()=>load()});
  const Q=()=>R[S.r],kinds=()=>Object.keys(S.want),RY=i=>214+i*60;
  const parts=done=>[['t',Q().mode==='farms'?'more hens':'pictogram'],['o','='],done?['w','✓']:['o','?']];
  const valOf=k=>(S.pic[k].w+S.pic[k].h*.5)*Q().key;
  /* the picture for one animal, or half of it */
  function token(parent,x,y,k,half,s=.95){const g=el('g',{},parent);if(half){const id=`hc${Math.random().toString(36).slice(2,8)}`,cp=el('clipPath',{id},g);el('rect',{x:x-20,y:y-20,width:20,height:40},cp);const h=el('g',{'clip-path':`url(#${id})`},g);animalIcon(h,x,y,k,s);el('line',{x1:x,x2:x,y1:y-16,y2:y+16,stroke:'#7a5a3a','stroke-width':1.5,'stroke-dasharray':'2 2'},g)}else animalIcon(g,x,y,k,s);return g}
  function drawTally(editable){left.innerHTML='';const ks=kinds();
    el('rect',{x:24,y:146,width:204,height:46+ks.length*60,rx:10,fill:'#fffaf0',stroke:'#7a5a3a','stroke-width':3},left);el('text',{x:126,y:168,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#7a5a3a'},left).textContent='Pip’s tally';
    ks.forEach((k,i)=>{const y=RY(i),row=el('g',{},left);el('rect',{x:32,y:y-25,width:188,height:50,rx:8,fill:'rgba(201,167,122,.12)'},row);animalIcon(row,54,y+2,k,.9);
      tallyMarks(row,80,y,editable?S.marks[k]:S.want[k],{h:26,dx:6.2,gap:9});
      if(editable){interact(row,{label:`Tally: ${ANIMAL[k].name[0]}`,tap:()=>{if(S.busy||S.won)return;S.marks[k]++;SFX.tick(S.marks[k]%8);drawTally(true)}});
        const m=el('g',{transform:`translate(212,${y-14})`},left);el('circle',{r:9,fill:'#e8d8c0',stroke:'#a8743a','stroke-width':1.5},m);el('text',{y:4,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#7a4a1e'},m).textContent='−';
        interact(m,{label:`Rub out a ${ANIMAL[k].name[0]} mark`,tap:()=>{if(S.busy||S.won||!S.marks[k])return;S.marks[k]--;SFX.pop(.8);drawTally(true)}})}})}
  function drawChart(editable){chart.innerHTML='';const q=Q(),ks=kinds();
    el('rect',{x:240,y:146,width:392,height:46+ks.length*60,rx:10,fill:'#fffaf0',stroke:'#4a7ab8','stroke-width':3},chart);el('text',{x:256,y:168,'font-size':13,'font-weight':800,fill:'#2a4a7a'},chart).textContent='pictogram';
    const kb=el('g',{transform:'translate(570,162)'},chart);el('rect',{x:-72,y:-14,width:128,height:28,rx:8,fill:'#e8f0ff',stroke:'#4a7ab8','stroke-width':1.5},kb);el('text',{x:-8,y:5,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#2a4a7a'},kb).textContent=`key: 1 picture = ${q.key}`;
    ks.forEach((k,i)=>{const y=RY(i),row=el('g',{},chart),P=S.pic[k];el('rect',{x:248,y:y-25,width:376,height:50,rx:8,fill:'rgba(74,122,184,.08)'},row);animalIcon(row,270,y+2,k,.7);el('line',{x1:290,x2:290,y1:y-20,y2:y+20,stroke:'#4a7ab8','stroke-width':1.5},row);
      if(editable){const pb=el('g',{transform:`translate(${q.key>1?574:606},${y})`},chart);el('circle',{r:14,fill:'#4a7ab8',stroke:'#fff0a0','stroke-width':2},pb);el('text',{y:6,'text-anchor':'middle','font-size':17,'font-weight':800,fill:'#fff'},pb).textContent='+';
        interact(pb,{label:`Pictogram: add a ${ANIMAL[k].name[0]} picture`,tap:()=>{if(S.busy||S.won)return;if(P.w+P.h>=7){say('That row is full.');return}if(P.h){say('The half picture goes last.');return}P.w++;SFX.pop(1.1);drawChart(true)}})}
      for(let j=0;j<P.w+P.h;j++){const t=token(chart,312+j*34,y,k,j>=P.w);if(editable&&j===P.w+P.h-1)interact(t,{label:`Pictogram: take a ${ANIMAL[k].name[0]} picture off`,tap:()=>{if(S.busy||S.won)return;if(P.h)P.h=0;else P.w--;SFX.pop(.8);drawChart(true)}})}
      if(editable&&q.key===2){const hb=el('g',{transform:`translate(606,${y})`},chart);el('circle',{r:14,fill:'#9a6cff',stroke:'#fff0a0','stroke-width':2},hb);el('text',{y:5,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#fff'},hb).textContent='½';
        interact(hb,{label:`Pictogram: add half a ${ANIMAL[k].name[0]} picture`,tap:()=>{if(S.busy||S.won)return;if(P.h){say('Only one half picture, at the end.');return}P.h=1;SFX.pop(1.3);drawChart(true)}})}})}
  function drawFarms(){chart.innerHTML='';left.innerHTML='';const q=S.want;
    ['A','B'].forEach((f,i)=>{const [n,key]=q[f],x=50+i*300,g=el('g',{},chart),on=S.pick===f;
      el('rect',{x,y:150,width:270,height:190,rx:12,fill:on?'#fff4c0':'#fffaf0',stroke:on?'#e8813a':'#7a5a3a','stroke-width':on?5:3},g);el('text',{x:x+135,y:176,'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#3a2418'},g).textContent=`Farm ${f}`;
      for(let j=0;j<n;j++)token(g,x+30+(j%6)*42,226+Math.floor(j/6)*44,'hen',false,1.3);
      const kb=el('g',{transform:`translate(${x+135},310)`},g);el('rect',{x:-70,y:-15,width:140,height:30,rx:8,fill:'#e8f0ff',stroke:'#4a7ab8','stroke-width':1.5},kb);el('text',{x:-60,y:5,'font-size':13,'font-weight':800,fill:'#2a4a7a'},kb).textContent='key:';token(kb,-14,0,'hen',false,.7);
      el('text',{x:4,y:5,'font-size':13,'font-weight':800,fill:'#2a4a7a'},kb).textContent=`= ${key} hen${key>1?'s':''}`;
      interact(g,{label:`Farm ${f}`,tap:()=>{if(S.busy||S.won)return;S.pick=f;SFX.tick(i+3);drawFarms()}})})}
  function miss(msg){SFX.wrong();shake(2);S.busy=true;say(`${msg} A new chart…`);later(4200,load)}
  function check(){if(S.busy||S.won)return;const q=Q(),ks=kinds();
    if(q.mode==='make'){if(!ks.some(k=>S.pic[k].w||S.pic[k].h)){say('Tap a row of the pictogram to add pictures.');return}
      const bad=ks.find(k=>valOf(k)!==S.want[k]);if(bad){miss(q.key===1?`Count the ${ANIMAL[bad].name[1]} on the tally: one picture each.`:`Each picture is ${q.key} ${ANIMAL[bad].name[1]}. Count the tally in ${q.key===5?'gates of 5':'twos'}${q.key===2?', and use half a picture for an odd one out':''}.`);return}}
    else if(q.mode==='tally'){if(!ks.some(k=>S.marks[k])){say('Tap a row of the tally to add marks.');return}
      const bad=ks.find(k=>S.marks[k]!==S.want[k]);if(bad){miss(`Check the key: each ${ANIMAL[bad].name[0]} picture is 2 ${ANIMAL[bad].name[1]}, and half a picture is 1.`);return}}
    else{if(!S.pick){say('Tap the farm you think has more hens.');return}const [na,ka]=S.want.A,[nb,kb]=S.want.B,best=na*ka>nb*kb?'A':'B';
      if(S.pick!==best){miss(`Count each farm with its own key: on the farm where one picture is 2 hens, count in twos.`);return}}
    S.won=true;roundWon(S.r);SFX.fanfare();guide.cheer();decQ(qL,parts(true),true,guide);burst(436,240,{n:14});
    if(q.mode==='farms'){const [na,ka]=S.want.A,[nb,kb]=S.want.B;say(`Farm A has ${na*ka} hens and Farm B has ${nb*kb}. Always read the key!`)}
    else say(ks.map(k=>`${S.want[k]} ${ANIMAL[k].name[1]}`).join(', ')+(q.key>1?`: ${q.key} for each picture.`:'.'));
    if(S.r>=2)unlock('gpicto');later(1400,()=>st.ready(true))}
  function load(){EPOCH++;FX.innerHTML='';[...ui.children].forEach(n=>{if(n!==guide.g)n.remove()});const q=Q();
    Object.assign(S,{busy:false,won:false,want:q.gen(),pic:{},marks:{},pick:null});
    st.ready(false);navDots(R.length,S.r);decQ(qL,parts(false),false,guide);
    if(q.mode==='farms'){drawFarms();decGo(ui,560,500,'Check: this farm',check,'Check');say('Which farm has more hens? Look at the keys!');return}
    kinds().forEach(k=>{S.marks[k]=0;S.pic[k]={w:0,h:0}});
    if(q.mode==='tally'){kinds().forEach(k=>{const n=S.want[k]/2;S.pic[k]={w:Math.floor(n),h:n%1?1:0}});drawTally(true);drawChart(false);decGo(ui,560,500,'Check the tally',check,'Check');say('Pip lost his tally! Make it again from the pictures. Check the key.');return}
    drawTally(false);drawChart(true);decGo(ui,560,500,'Check the pictogram',check,'Check');
    say(S.r===0?'Make Pip’s tally into a picture chart. Tap + to add a picture for each animal.':q.key===2&&S.r===1?'Now one picture is 2 animals. How many pictures for each row?':q.key===2?'One picture is 2 animals. What about an odd number?':'Now one picture is 5 animals.')}
  W.picto.dbgQ=()=>({want:S.want,mode:Q().mode,key:Q().key,r:S.r});S.r=resumeAt(R.length);load();
}};
