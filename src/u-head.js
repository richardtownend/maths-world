
/* ================= The Starter Isles: adding, taking away, times, sharing, and the Mirror =================
   No number counters here: the question sits boxed at the top, and its "?" fills in from what she does. */
function starterQ(parent,parts,done=false){parent.innerHTML='';return qBox(parent,300,42,parts,{sz:22,done})}
function blob(parent,x,y,col,r=11){const g=el('g',{transform:`translate(${x},${y})`},parent);
  el('ellipse',{cx:-r*.4,cy:r*.9,rx:r*.32,ry:r*.18,fill:darker(col)},g);el('ellipse',{cx:r*.4,cy:r*.9,rx:r*.32,ry:r*.18,fill:darker(col)},g);
  el('circle',{r,fill:col},g);el('ellipse',{cx:-r*.35,cy:-r*.4,rx:r*.25,ry:r*.15,fill:'#fff',opacity:.35},g);
  [-1,1].forEach(s=>{el('circle',{cx:s*r*.32,cy:-r*.1,r:r*.24,fill:'#fffaf2'},g);el('circle',{cx:s*r*.32+r*.05,cy:-r*.08,r:r*.12,fill:'#241a3a'},g)});
  return{g,x,y,put(nx,ny){this.x=nx;this.y=ny;g.setAttribute('transform',`translate(${nx.toFixed(1)},${ny.toFixed(1)})`)}}}

function goStone(parent,x,y,label,fn,txt='Go'){const g=el('g',{transform:`translate(${x},${y})`,class:'gostone'},parent);el('circle',{r:31,fill:'#9a6cff',stroke:'#fff0a0','stroke-width':3},g);
  el('text',{y:6,'text-anchor':'middle','font-size':txt.length>3?14:18,'font-weight':700,fill:'#fff'},g).textContent=txt;interact(g,{label,tap:()=>{SFX.pop(1.1);fn()}});return g}
