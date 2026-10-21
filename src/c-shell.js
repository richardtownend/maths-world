
/* ================= shell: prompt, glow jar, goggles, worlds ================= */
const W={};
let CUR='hub';
function say(t){const p=$('#prompt');if(p.textContent===t)return;p.style.opacity=0;setTimeout(()=>{p.textContent=t;p.style.opacity=1},RM?0:160)}

const IDEAS=[
  {k:'maketen',w:'flies',t:'Make ten first: 8 + 5 is 8 + 2 (a full jar of ten) and 3 more, so 13. A full jar is a ten.'},
  {k:'missing',w:'flies',t:'5 + ? = 11: count on from 5 to 11. That’s 6, so turn the die to 6.'},
  {k:'breakten',w:'burrows',t:'Taking away on the hundred square: hop back to the ten first, then the rest. 32 − 7: back 2 to 30, then 5 more to 25. Taking 10 is one hop straight up a row.'},
  {k:'rows',w:'trays',t:'3 × 5 means 3 rows of 5: count in fives, 5, 10, 15. Turn the tray round and it is 5 rows of 3: the same 15.'},
  {k:'fair',w:'pigs',t:'12 ÷ 3 means share 12 apples fairly between 3 pigs. Each round of throwing uses 3, so 4 rounds use 12: 4 each. 3 × 4 = 12.'},
  {k:'flip',w:'mirror',t:'Times and share are one rectangle read two ways. 5 rows of 6 is 5 × 6 = 30; 30 shared into 5 rows is 30 ÷ 5 = 6. On the times table, find 30 in the 5s row: it is under the 6.'},
  {k:'tenths',w:'rock',t:'0.3 means 3 tenths: one whole cut into 10 equal pieces, and 3 of them. Dot, the decimal point, keeps the wholes on his left and the pieces on his right. Ten tenths make a whole: 0.8 + 0.4 = 1.2.'},
  {k:'hundredths',w:'dig',t:'Zoom into one tenth and it splits into 10 hundredths. 0.35 is 3 tenths and 5 hundredths, halfway between 0.3 and 0.4. 0.08 is only 8 hundredths: not even one tenth.'},
  {k:'compare',w:'snails',t:'To compare decimals, line Dot up and compare the tenths first. 0.3 is the same as 0.30, so it beats 0.25. A longer number isn’t a bigger number.'},
  {k:'shift',w:'potion',t:'× 10 moves every digit one place left, × 100 two places. ÷ moves them right. Dot never moves, and zeros fill the empty places: 1.2 × 100 = 120, 5 ÷ 100 = 0.05.'},
  {k:'percent',w:'tulips',t:'Per cent means out of 100. 45% of the field is 45 tulips out of 100: 4 rows of ten and 5 more. That is 0.45 of the field.'},
  {k:'percentof',w:'treasure',t:'To find 25% of 40, cut the whole (100%) into 4 equal parts: each part is 25%, so 40 ÷ 4 = 10. For 10%, cut into 10; for 30%, take 3 of the tenths.'},
  {k:'same',w:'lock',t:'One amount, three ways to write it: 1/2 = 0.5 = 50%, 1/4 = 0.25 = 25%, 3/4 = 0.75 = 75%, 1/5 = 0.2 = 20%. And 0.07 is 7%, not 70%.'},
  {k:'dotback',w:'magpie',t:'Wherever Dot is, wholes go on his left and pieces on his right: tenths, then hundredths. That’s the whole secret of decimals.'},
  {k:'turns',w:'turn',t:'An angle is an amount of turn. A quarter turn is 90° (a right angle), a half turn 180°, a whole turn 360°. Less than 90° is acute, between 90° and 180° obtuse, more than 180° reflex.'},
  {k:'angsum',w:'fans',t:'A right angle is 90°. Angles on a straight line add up to 180°; all the way round a point, 360°. A rectangle\u2019s four corners make 360°. Tear the three corners off any triangle and they make a straight line: 180°.'},
  {k:'coords',w:'chart',t:'Coordinates go along the corridor, then up the stairs: (3, 2) is 3 along, then 2 up. Negative numbers go left of 0 or below it: (−3, −2) is 3 left and 2 down.'},
  {k:'area',w:'tiles',t:'Area is how many squares cover a shape. A rectangle is rows × columns: 4 × 3 = 12. Split an L-shape into rectangles and add them. A right-angled triangle is half its rectangle.'},
  {k:'perim',w:'pens',t:'Perimeter is the distance all the way round; area is the space inside. The same 12 m of fence can hold 5, 8 or 9 squares of grass: the squarer the pen, the more grass.'},
  {k:'nets',w:'boxes',t:'A net is a box laid flat. A cube net has 6 squares, and every side must be covered exactly once. Two squares in a line with one square between them end up opposite each other.'},
  {k:'kraken',w:'kraken',t:'Shelly’s secret: shapes are just swimming straight and turning. Turns are angles, the walk round the edge is the perimeter, along-then-up finds any point on the map.'},
  {k:'forevery',w:'beads',t:'A ratio is a group that repeats. “For every 2 red there are 3 blue” is written 2 : 3. Twelve blue beads means 4 groups of 3, so 4 × 2 = 8 red. 4 : 8 is the same ratio as 1 : 2: the same groups, just more of them.'},
  {k:'shade',w:'paint',t:'Same ratio, same colour. 1 red : 3 white is the same pink as 2 : 6 or 3 : 9, because every part is multiplied by the same number. To compare 1 : 3 with 2 : 5, make the reds match: 2 : 6 has more white, so 2 : 5 is pinker.'},
  {k:'parts',w:'split',t:'Sharing in a ratio: draw the bars. 3 : 2 means 3 boxes and 2 boxes, 5 boxes in all. 20 pots ÷ 5 boxes = 4 in each box, so 12 and 8. If you know one share, or the difference, that tells you what one box holds.'},
  {k:'scale',w:'pancakes',t:'To scale a recipe, multiply every ingredient by the same number. For 6 people from a recipe for 4: halve it to get 2 people, then multiply by 3.'},
  {k:'factor',w:'giant',t:'In proportion means every length is multiplied by the same scale factor. A 2 × 3 picture made 3 times as big is 6 × 9. Adding the same amount (5 × 6) stretches it out of shape.'},
  {k:'mapscale',w:'river',t:'A map scale is a ratio: 1 square = 10 m means every square on the map is 10 m in real life. 3 squares is 30 m; 2½ squares is 25 m. To draw on the map, divide: 60 m is 3 squares of 20 m.'},
  {k:'wparts',w:'parts',t:'A balance: everything on one side equals everything on the other. If you know the whole and one part, take away to find the other part, even when the story says “more”.'},
  {k:'wcompare',w:'compare',t:'Comparing: who has more? Their tower is taller, and the gap is the difference. “Ali has 6 fewer than Sam, Ali has 8” means Sam has 8 + 6 = 14.'},
  {k:'wtimes',w:'times',t:'“3 times as heavy” means 3 copies of the small one. If together they weigh 24, that is 4 equal pieces, so one is 24 ÷ 4 = 6.'},
  {k:'wferry',w:'ferry',t:'Read what the question wants. 18 children, 4 in a car: 18 ÷ 4 = 4 remainder 2, so you need 5 cars, can fill 4, and 2 are left over.'},
  {k:'wsteps',w:'steps',t:'Two-step stories hide a question. Step 1: 4 pens at £3 is £12. Step 2 uses it: change from £20 is £20 − £12 = £8.'},
  {k:'wmachine',w:'machine',t:'To find the number someone thought of, run the machine backwards: undo the last step first. +3 is undone by −3, ×2 by ÷2.'},
  {k:'tsun',w:'sun',t:'The short hand tells the hour. When it is halfway between two numbers, it is half past.'},
  {k:'tpie',w:'pie',t:'The minute hand eats the clock like a pizza: a quarter eaten is quarter past, half eaten is half past, a quarter left is quarter to.'},
  {k:'tlap',w:'lap',t:'For the minute hand, each number on the clock is 5 minutes: a snail’s stone. Ten to five is two stones before the top.'},
  {k:'trail',w:'rail',t:'How long is a journey? Lay the time round the clock from start to finish. A whole lap of the minute hand is an hour.'},
  {k:'tsand',w:'sand',t:'To find when to start, wind the clock backwards from the finish by how long it takes.'},
  {k:'tfrog',w:'frog',t:'A week is one row of the calendar: straight down is the same day next week.'},
  {k:'mswap',w:'swap',t:'Swapping never changes how much you have: ten 10p coins are the same as one £1 coin, just fewer coins.'},
  {k:'mtuck',w:'tuck',t:'To pay exactly, start with the biggest coin that fits, then the next biggest, until you reach the price.'},
  {k:'mchange',w:'change',t:'Shopkeepers count up: from £3.60, 40p makes £4, then £1 makes £5. The change is what you counted: £1.40.'},
  {k:'mloot',w:'loot',t:'Long division is sharing: share the biggest money first, swap what won’t share for ten of the next, and carry on. The bus stop writes it down.'},
  {k:'mrug',w:'rug',t:'Long multiplication is a rectangle cut into tens and ones: 23 × 14 is 20 × 10, 3 × 10, 20 × 4 and 3 × 4, added up.'},
  {k:'msave',w:'save',t:'Saving up: add the same amount every week until you reach the price. A treat week takes some back out.'},
  {k:'gtally',w:'tally',t:'A tally keeps count while things go past: every fifth mark goes across, so you count in fives.'},
  {k:'gpicto',w:'picto',t:'In a pictogram the key matters: if one picture means 2, half a picture means 1.'},
  {k:'gbars',w:'bars',t:'A bar chart lets you see at a glance: the tallest bar is the most, and the gap between two bars is how many more.'},
  {k:'ggrow',w:'grow',t:'A line graph is a record of something changing: steep means changing fast, flat means not changing.'},
  {k:'fudge',w:'fudge',t:'Pip’s secret: always check where the scale starts, that its steps are even, and what the key says. Charts can fib!'},
  {k:'rsticks',w:'sticks',t:'Roman numerals began as tally sticks: I is one. Five sticks are tied into a hand, V, and two hands make an X, ten. Biggest first: XVII is 10 + 5 + 1 + 1 = 17.'},
  {k:'rmason',w:'mason',t:'Never four the same in a row. A small letter in front of a bigger one takes itself away: IV is 5 − 1 = 4, IX is 9, XL is 40, XC is 90. L is 50 and C is 100.'},
  {k:'ryear',w:'year',t:'To read a long Roman number, split it into thousands, hundreds, tens and ones: MCMXC is M | CM | XC = 1000 + 900 + 90 = 1990. D is 500 and M is 1000.'},
  {k:'rhills',w:'hills',t:'Rounding to the nearest 10: which milestone is nearer? 37 is 3 from 40 and 7 from 30, so it rounds to 40. Exactly halfway, like 35, always rounds up.'},
  {k:'rbig',w:'bighills',t:'Rounding to 100 or 1,000 is the same idea on bigger hills. Look at the next digit down: 3,720 to the nearest 1,000 looks at the 7 hundreds: 5 or more goes up, so 4,000.'},
  {k:'rgreat',w:'greatroad',t:'Every number from 245,000 up to 254,999 rounds to 250,000 (to the nearest 10,000). Rounding is a stretch of road, not a single spot.'},
  {k:'rinn',w:'inn',t:'Decimals round the same way: 2.37 to the nearest whole is 2, to one decimal place it is 2.4. Look at the digit just after the one you are keeping.'},
  {k:'rbridge',w:'bridge',t:'Round first to check a sum quickly: 487 + 312 + 196 is about 500 + 300 + 200 = 1,000. If the answer is miles from the estimate, something has gone wrong.'},
  {k:'gruff',w:'gruff',t:'Dex’s secret: a milestone tells you how far, and a round number tells you roughly how far. Read the letters biggest first; round to the nearer stone.'},
  {k:'eclipse',w:'eclipse',t:'The last secret: the worlds were never separate. A quarter is sharing, a pie chart is fractions, a turn is a time. Maths is all one sky.'},
  {k:'grabbit',w:'grabbit',t:'Polly’s secret: money is just tens and ones and hundreds in a purse. Swap, share and count up, and the sums take care of themselves.'},
  {k:'snooze',w:'snooze',t:'Tock’s secret: time is a distance round the clock. Start, how long, finish: know two and you can find the third.'},
  {k:'inkblot',w:'inkblot',t:'Pip’s secret: draw the story before you calculate. The bars tell you whether to add, take away, multiply or divide.'},
  {k:'smudge',w:'smudge',t:'Kai’s secret: a ratio is a recipe for a colour. Keep every part in step (multiply them all by the same number) and the colour never changes.'},
  {k:'share',w:'share',t:'The more who share a loaf, the smaller each piece.'},
  {k:'bigger',w:'scales',t:'More cuts make smaller pieces. So a bigger bottom number can mean a smaller amount.'},
  {k:'balance',w:'scales',t:'Different pieces can make exactly the same amount: one half weighs the same as three sixths.'},
  {k:'recut',w:'match',t:'Cut every slice into the same number of smaller slices and both numbers get multiplied. It is still the same amount of pizza.'},
  {k:'twins',w:'match',t:'One amount can have lots of names: 1/2, 2/4, 3/6, 4/8…'},
  {k:'common',w:'join',t:'To add two fractions, chop them both into the same size slices: find a number of slices both melons can reach.'},
  {k:'join',w:'join',t:'Once the slices are the same size, adding is just counting them onto one plate.'},
  {k:'wholes',w:'jugs',t:'When the pieces add up to more than one whole, they fill whole ones first and the rest is left over.'},
  {k:'open',w:'take',t:'A whole can be opened up into pieces: one whole bar is 4/4, or 3/3, or 6/6. That is what you do when you don’t have enough to take away.'},
  {k:'take',w:'take',t:'Taking away works like adding: make the pieces the same size, then count what is left.'},
  {k:'mixed',w:'hive',t:'17/12 means 17 twelfths. 12 twelfths make one whole, so 17/12 is 1 whole and 5 twelfths over: 1 5/12. Back again: 12 + 5 = 17.'},
  {k:'smash',w:'smash',t:'To take away a fraction with different pieces, use the small tiles both fractions share: 7/8 \u2212 1/3 = 21/24 \u2212 8/24.'},
  {k:'lots',w:'leap',t:'Lots of the same fraction is adding it again and again: 3 \u00d7 1/2 = 3/2. Three halves is one whole and a half, 1 1/2.'},
  {k:'of',w:'toll',t:'A fraction of an amount: to find 3/4 of 12, share the 12 into 4 equal baskets (3 each), then take 3 of them: 9.'},
  {k:'foldof',w:'fold',t:'A fraction of a fraction: 2/3 of 3/4. Fold into 4 and take 3, then fold that into 3 and take 2. Unfold: the creases make 3 \u00d7 4 = 12 pieces and 2 \u00d7 3 = 6 are coloured, so 6/12. Multiply the tops, multiply the bottoms.'},
  {k:'sharefrac',w:'picnic',t:'Sharing a fraction: 1/2 shared by 3 is 1/6. Cut the half into 3 fair pieces, then see how many of those make a whole pie (6). Sharing by 3 is the same as taking 1/3 of it.'},
  {k:'simplify',w:'glue',t:'Simplifying: the same amount with fewer, bigger pieces. 6/12 = 2/4 = 1/2. A bigger piece only fits if the coloured part ends exactly on its line, which happens when you divide the top and the bottom by the same number.'},
  {k:'decimals',w:'lanterns',t:'Out of 100: 3/4 = 75/100 = 0.75 = 75%. The first digit after the point is tenths (whole columns of 10), the second is hundredths (single ones). 0.08 is 8 hundredths, much smaller than 0.8.'},
  {k:'boss',w:'boss',t:'Every fraction spell in one battle: twins, scales, honey pots, melons, crystals, gems, hops and lanterns. The Gloom was only Glim, lost in the dark.'}
];
const WNAME={sticks:'Tally Stones',mason:'Mason',year:'Year Stone',hills:'Hills',bighills:'Big Hills',greatroad:'Great Road',inn:'Last Stretch',bridge:'Roughly',gruff:'Gruff',share:'Share',scales:'Scales',match:'Match',join:'Join',hive:'Hive',jugs:'Jugs',take:'Take',smash:'Smash',leap:'Leap',toll:'Toll',fold:'Fold',picnic:'Picnic',glue:'Glass',lanterns:'Lanterns',boss:'Boss',hub:'Home',map:'Map',flies:'Fireflies',burrows:'Burrows',trays:'Trays',pigs:'Pigs',mirror:'Mirror',rock:'Rock',dig:'Dig',snails:'Snails',potion:'Potion',tulips:'Tulips',treasure:'Treasure',lock:'Lock',magpie:'Magpie',turn:'Turn',fans:'Fans',chart:'Chart',tiles:'Tiles',pens:'Pens',boxes:'Boxes',kraken:'Kraken',beads:'Beads',paint:'Paint',split:'Split',pancakes:'Pancakes',giant:'Giant',river:'River',smudge:'Smudge',parts:'Parts',compare:'Compare',times:'Times',ferry:'Ferry',steps:'Steps',machine:'Machine',inkblot:'Inkblot',sun:'Sun hand',pie:'Pizza',lap:'Snail',rail:'Railway',sand:'Timers',frog:'Frog',snooze:'Snooze',swap:'Coin swap',tuck:'Tuck shop',change:'Change',loot:'Loot',rug:'Rugs',save:'Saving',grabbit:'Grabbit',tally:'Tally',picto:'Pictures',bars:'Bars',grow:'Sunflower',fudge:'Fudge',eclipse:'Eclipse'};
/* one world per maths subject; the islands inside run in story order */
const WORLDS=[{id:'fractions',name:'Fraction Isles',isles:['share','scales','match','glue','join','hive','jugs','take','smash','leap','toll','fold','picnic','lanterns','boss']},
  {id:'starter',name:'Starter Isles',isles:['flies','burrows','trays','pigs','mirror']},
  {id:'decimals',name:'Decimal Isles',isles:['rock','dig','snails','potion','tulips','treasure','lock','magpie']},
  {id:'shapes',name:'Shape Isles',isles:['turn','fans','chart','tiles','pens','boxes','kraken']},
  {id:'ratio',name:'Ratio Isles',isles:['beads','paint','pancakes','split','giant','river','smudge']},
  {id:'story',name:'Story Isles',isles:['parts','compare','times','ferry','steps','machine','inkblot']},
  {id:'time',name:'Clockwork Isles',isles:['sun','pie','lap','rail','sand','frog','snooze']},
  {id:'money',name:'Pirate Isles',isles:['swap','tuck','change','loot','rug','save','grabbit']},
  {id:'graphs',name:'Survey Isles',isles:['tally','picto','bars','grow','fudge']},
  {id:'road',name:'The Old Road',isles:['sticks','mason','year','hills','bighills','greatroad','inn','bridge','gruff']},
  {id:'eclipse',name:'The Eclipse',isles:['eclipse']}];
/* the world bosses: each one beaten puts a little of the moon back */
const BOSSES=['mirror','boss','magpie','kraken','smudge','inkblot','snooze','grabbit','fudge','gruff'];
/* suggested orders through the worlds (set per player in the grown-up corner) */
const PATHS={young:['starter','graphs','time','money','story','fractions','decimals','road','ratio','shapes'],old:['time','money','story','fractions','decimals','road','ratio','shapes','graphs','starter']};
const ISLES=WORLDS[0].isles;
const worldOf=w=>WORLDS.find(x=>x.isles.includes(w))||WORLDS[0];
const worldById=id=>WORLDS.find(x=>x.id===id)||WORLDS[0];
const ALLISLES=WORLDS.flatMap(x=>x.isles);
let CURW='fractions';
const PCOL=[0,1,2,3,4,5,6,8];/* creature colours a player can pick */

/* ---------- saved state: players, PIN, progress (this device only) ---------- */
let ST={v:2,pin:null,players:[],sound:true,gog:true,prog:{},last:{},seen:{}},PL=null,GOG=true;
try{localStorage.removeItem('fraction-worlds')}catch(e){}/* the old single-player save: a fresh start */
try{const s=JSON.parse(localStorage.getItem('maths-worlds')||'null');if(s&&s.v===2)ST=Object.assign(ST,s)}catch(e){}
GOG=ST.gog!==false;SOUND=ST.sound!==false;
function save(){ST.gog=GOG;ST.sound=SOUND;try{localStorage.setItem('maths-worlds',JSON.stringify(ST))}catch(e){}}
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
const grown=()=>PL==='g';
const player=()=>ST.players.find(p=>p.id===PL);
const pname=()=>grown()?'Grown-up':(player()||{}).name||'';
function progOf(id){const p=ST.prog[id]||(ST.prog[id]={ideas:[],won:{},n:{},cleared:[]});p.ideas=p.ideas.filter(k=>IDEAS.some(i=>i.k===k));return p}
const mine=()=>progOf(PL||'g');
const isCleared=w=>mine().cleared.includes(w);
function isOpen(w){if(grown())return true;if(w==='eclipse')return BOSSES.every(b=>isCleared(b));const L=worldOf(w).isles,i=L.indexOf(w);return i<=0||isCleared(L[i-1])}
const frontier=(wid=CURW)=>{const L=worldById(wid).isles;return L.find(w=>!isCleared(w))||L[L.length-1]};
const wonSet=(w=CUR)=>new Set(mine().won[w]||[]);
/* where an island should start: the first round not yet won */
function resumeAt(n,w=CUR){const s=wonSet(w);for(let k=0;k<n;k++)if(!s.has(k))return k;return 0}
function noteRounds(n){if(!PL||CUR==='hub'||CUR==='map')return;const p=mine();if(p.n[CUR]!==n){p.n[CUR]=n;save()}}
/* every island calls this when a round is won; winning them all clears the island and opens the next */
function roundWon(i,w=CUR){if(!PL)return;const p=mine(),s=new Set(p.won[w]||[]);if(s.has(i))return;s.add(i);p.won[w]=[...s].sort((a,b)=>a-b);save();redrawDots();const n=p.n[w];if(n&&s.size>=n)clearIsland(w)}
function clearIsland(w){const p=mine();if(p.cleared.includes(w))return;p.cleared.push(w);save();navState();setTimeout(()=>{if(CUR===w)clearCard(w)},w==='boss'?6500:w==='eclipse'?7000:2300)}

const IDEAS_W=w=>IDEAS.filter(i=>i.w===w);
function jarIcon(){const have=mine().ideas;const bd=$('#seedBadge');if(bd){bd.hidden=!have.length;bd.textContent=have.length}$$('#jarSeeds circle').forEach((c,i)=>{const on=i<have.length;c.setAttribute('fill',on?'#fff0a0':'none');c.setAttribute('stroke',on?'none':'currentColor');c.setAttribute('stroke-width','1');c.setAttribute('opacity',on?'1':'.45')})}
function navState(){const p=mine(),here=worldById(CURW).isles;$$('.isle').forEach(b=>{const w=b.dataset.w,open=isOpen(w);b.style.display=here.includes(w)?'':'none';b.classList.toggle('lock',!open);b.classList.toggle('done',p.cleared.includes(w));b.classList.toggle('fresh',open&&!grown()&&!(ST.seen[PL]||[]).includes(w));b.setAttribute('aria-current',w===CUR);b.setAttribute('aria-label',WNAME[w]+(open?'':' (locked)'))})}
let tt;
function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>{t.hidden=true},4200)}
function unlock(k){const m=mine();if(m.ideas.includes(k))return;m.ideas.push(k);save();jarIcon();SFX.chime();setTimeout(()=>SFX.shimmer(),500);toast('A glow seed fell into the jar. Tap the jar to read it.');if(!$('#sheet').hidden&&$('#sheet').dataset.kind==='jar')openJar()}

function openSheet(kind,html){const s=$('#sheet');s.dataset.kind=kind;$('#sheetBody').innerHTML=html;s.hidden=false;$('#sheetX').focus()}
function openJar(){
  const have=mine().ideas;
  openSheet('jar',`<h2 id="sheetT">${grown()?'The':esc(pname())+'’s'} glow jar</h2>
  <p>Each big idea you discover drops a glow seed in here. ${have.length} of ${IDEAS.length} found so far.</p>
  ${IDEAS.map(i=>{const on=have.includes(i.k);return`<div class="idea${on?' on':''}"><span class="seed"></span><div>${on?i.t:'Still hidden. Keep exploring the '+WNAME[i.w]+' island.'}</div></div>`}).join('')}`);
}
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('#sheetX').addEventListener('click',()=>{$('#sheet').hidden=true});
const menu=$('#toolsPop'),menuBtn=$('#menuBtn');
const setMenu=o=>{menu.hidden=!o;menuBtn.setAttribute('aria-expanded',o)};
menuBtn.addEventListener('click',e=>{e.stopPropagation();unlockAudio();setMenu(menu.hidden);SFX.pop(menu.hidden?.8:1.1)});
document.addEventListener('pointerdown',e=>{if(!menu.hidden&&!e.target.closest('.menuwrap'))setMenu(false)});
['jar','help','players'].forEach(id=>$('#'+id).addEventListener('click',()=>setMenu(false)));
$('#jar').addEventListener('click',openJar);
$('#help').addEventListener('click',()=>openSheet('help',`<h2 id="sheetT">For the grown-up</h2>${W[CUR].notes}
  <h3>The number goggles</h3><p>Every world works with no numbers at all. When an idea has clicked, put the goggles on together. The same objects then show their fractions. That moment, seeing the familiar symbols sit on top of something she already understands, is the bridge back to schoolwork.</p>`));
$('#players').addEventListener('click',()=>{if(grown())openGrown();else showWho()});
$('#goggles').addEventListener('click',()=>{GOG=!GOG;document.body.classList.toggle('goggles',GOG);$('#goggles').setAttribute('aria-pressed',GOG);save();unlockAudio();tone(GOG?660:440,.12,'triangle',.07)});
$('#snd').addEventListener('click',()=>{SOUND=!SOUND;if(!SOUND)ambStop();$('#snd').setAttribute('aria-pressed',SOUND);$('#sndWave').style.display=SOUND?'':'none';save();if(SOUND){unlockAudio();tone(520,.1,'triangle',.07)}});
$('#homeBtn').addEventListener('click',()=>{unlockAudio();SFX.whoosh();go(CUR==='map'||CURW==='eclipse'?'hub':'map')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#sheet').hidden=true});

/* islands whose layout runs off to the right are scaled and centred to sit inside the 600-wide stage (measured spans) */
const FIT={"lock":[70,571],"magpie":[13,607],"chart":[76,571],"tiles":[64,571],"pens":[13,592],"river":[38,602],"sun":[78,571],"pie":[70,571],"lap":[91,592],"frog":[41,597],"swap":[42,598],"loot":[10,634],"rug":[13,602],"save":[31,596],"grabbit":[19,591],"tally":[24,632],"picto":[24,632],"bars":[24,610],"grow":[147,610],"fudge":[20,591]};
function fitT(id){const f=FIT[id];if(!f)return '';const [a,b]=f,k=Math.min(1,572/(b-a)),tx=300-k*(a+b)/2,ty=(1-k)*300;return `translate(${tx.toFixed(1)},${ty.toFixed(1)}) scale(${k.toFixed(4)})`}
function go(id){
  if(id==='eclipse'&&!isOpen(id)){SFX.clonk();toast('Beat every world boss to face the Eclipse.');return}
  if(id!=='hub'&&id!=='map'&&!isOpen(id)){const b=$(`.isle[data-w="${id}"]`);if(b&&b.animate)b.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:320});SFX.clonk();const L=worldOf(id).isles,i=L.indexOf(id);toast(`Locked. Clear ${WNAME[L[i-1]]} to open ${WNAME[id]}.`);return}
  EPOCH++;CUR=id;if(id!=='hub'&&id!=='map')CURW=worldOf(id).id;document.body.classList.remove('dotless');
  if(id!=='hub'&&id!=='map'&&PL){ST.last[PL]=id;const sn=ST.seen[PL]||(ST.seen[PL]=[]);if(!sn.includes(id))sn.push(id);save()}
  WORLD.innerHTML='';FX.innerHTML='';DOCK.innerHTML='';CREATS.clear();DOTS=null;$('#clearCard').hidden=true;
  document.body.classList.toggle('inhub',id==='hub'||id==='map');document.body.classList.toggle('athub',id==='hub');$('#homeBtn').setAttribute('aria-label',id==='map'?'Back to the sky':'Back to the island map');navState();
  if(id!=='hub'&&id!=='map'){const b=$(`.isle[data-w="${id}"]`);if(b&&b.scrollIntoView)b.scrollIntoView({block:'nearest',inline:'center',behavior:RM?'auto':'smooth'})}
  backdrop(W[id].scene||'hills');ambient(W[id].scene||(id==='scales'?'scales':'hills'));
  {const t=fitT(id);[WORLD,FX].forEach(n=>t?n.setAttribute('transform',t):n.removeAttribute('transform'))}
  W[id].mount(WORLD);fitDock();
}
$$('.isle').forEach(b=>b.addEventListener('click',()=>{unlockAudio();if(b.dataset.w!==CUR)go(b.dataset.w)}));
function enterWorld(wid){CURW=wid;go('map')}

/* ---------- the cleared-island card ---------- */
function clearCard(w){const WW=worldOf(w),L=WW.isles,i=L.indexOf(w),nx=L[i+1],c=$('#clearCard');SFX.fanfare();
  $('#ccT').textContent=nx?`${WNAME[w]} cleared!`:`${WW.name} complete!`;
  $('#ccP').textContent=nx?(nx==='boss'?'Every island is cleared. Something stirs on the last island…':nx==='mirror'?'Every island is cleared. The Muddler is waiting in the Magic Mirror.':nx==='magpie'?'Every island is cleared. The Magpie is waiting at the top of the lighthouse.':nx==='kraken'?'Every island is cleared. The Kraken is waiting in the whirlpool.':nx==='smudge'?'Every island is cleared. The Smudge is waiting under the grey rainbow.':nx==='inkblot'?'Every island is cleared. The Inkblot is waiting in the storybook.':nx==='snooze'?'Every island is cleared. The Snooze is asleep on the clock tower.':nx==='grabbit'?'Every island is cleared. Captain Grabbit is sitting on the treasure.':nx==='fudge'?'Every island is cleared. Fudge the fox is waiting with his fibbing charts.':nx==='gruff'?'Every island is cleared. Gruff the goat is waiting up on the crag.':`A new island has appeared: ${WNAME[nx]}.`):WW.id==='fractions'?'You beat the Gloom. Every fraction island is yours.':WW.id==='decimals'?'Dot is home and the lighthouse shines again. Every decimal island is yours.':WW.id==='shapes'?'The Kraken is untangled and Shelly’s map is whole. Every shape island is yours.':WW.id==='ratio'?'The Smudge is a rainbow again and Kai has all his colours. Every ratio island is yours.':WW.id==='story'?'The Inkblot is wiped away and every story has its ending. Every story island is yours.':WW.id==='time'?'The Snooze is awake and every clock is ticking again. Every clockwork island is yours.':WW.id==='money'?'Captain Grabbit has handed back the treasure. Every pirate island is yours.':WW.id==='graphs'?'Every one of Fudge’s charts is honest again. Pip’s survey is done!':WW.id==='road'?'Every milestone is standing and Dex’s deliveries are done. The whole Old Road is yours!':WW.id==='eclipse'?'The moon is full again. Every world is safe. You did it all!':'You unmuddled the Muddler: adding, taking away, times and sharing, all beaten.';
  const ic=$('#ccIcon');ic.innerHTML='';const src=$(`.isle[data-w="${nx||w}"] svg`);if(src)ic.appendChild(src.cloneNode(true));
  $('#ccNext').textContent=nx?`On to ${WNAME[nx]}`:WW.id==='eclipse'?'Back to the sky':'See the island map';$('#ccNext').onclick=()=>{c.hidden=true;nx?go(nx):go(WW.id==='eclipse'?'hub':'map')};
  $('#ccStay').onclick=()=>{c.hidden=true};c.hidden=false;$('#ccNext').focus()}

/* ---------- who's playing ---------- */
/* a player's own creature: the classic blob, or a monster or alien of their choosing, in their colour */
const LOOKS=[['blob','Blob'],['alien','Alien'],['horns','Horned monster'],['cyclops','One-eyed monster'],['squid','Squid alien'],['fuzzy','Fuzzball']];
function buddy(parent,{x=0,y=0,r=24,i=0,look='blob',shadow=true}={}){
  if(!look||look==='blob'){const c=creature(parent,{x,y,r,i,label:'',shadow});CREATS.delete(c);return c}
  const col=CCOL[i%CCOL.length],dk=darker(col),ink='#241a3a',ivory='#fff4e6',f=n=>(n*r).toFixed(2);
  const g=el('g',{transform:`translate(${x},${y})`},parent);
  if(shadow)el('ellipse',{cx:0,cy:f(1.02),rx:f(.85),ry:f(.18),fill:'#0d0a24',opacity:.35},g);
  const b=el('g',look==='squid'?{transform:`translate(0,${f(-.08)}) scale(1.18)`}:{},g);
  const feet=()=>[-1,1].forEach(s=>el('ellipse',{cx:f(s*.36),cy:f(.92),rx:f(.24),ry:f(.13),fill:dk},b));
  const eye=(ex,ey,er,dx=0)=>{el('circle',{cx:f(ex),cy:f(ey),r:f(er),fill:'#fffaf2'},b);el('circle',{cx:f(ex+dx),cy:f(ey+er*.1),r:f(er*.52),fill:ink},b);el('circle',{cx:f(ex+dx-er*.18),cy:f(ey-er*.12),r:f(er*.17),fill:'#fff'},b)};
  const shine=()=>el('ellipse',{cx:f(-.34),cy:f(-.45),rx:f(.24),ry:f(.13),fill:'#fff',opacity:.28,transform:`rotate(-20 ${f(-.34)} ${f(-.45)})`},b);
  const cheeks=(cy=.2)=>[-1,1].forEach(s=>el('ellipse',{cx:f(s*.55),cy:f(cy),rx:f(.12),ry:f(.07),fill:'#ff6f91',opacity:.35},b));
  if(look==='alien'){
    [-1,1].forEach(s=>{el('path',{d:`M${f(s*.28)},${f(-.72)} Q${f(s*.4)},${f(-1.2)} ${f(s*.66)},${f(-1.3)}`,stroke:dk,'stroke-width':f(.09),fill:'none','stroke-linecap':'round'},b);el('circle',{cx:f(s*.66),cy:f(-1.3),r:f(.15),fill:'#e6ff8a'},b)});
    feet();el('path',{d:`M0,${f(-.95)} C${f(1.12)},${f(-.95)} ${f(1.0)},${f(.3)} ${f(.42)},${f(.86)} Q0,${f(1.02)} ${f(-.42)},${f(.86)} C${f(-1.0)},${f(.3)} ${f(-1.12)},${f(-.95)} 0,${f(-.95)}Z`,fill:col},b);shine();
    [-1,1].forEach(s=>{el('ellipse',{cx:f(s*.34),cy:f(-.18),rx:f(.27),ry:f(.17),fill:ink,transform:`rotate(${s*28} ${f(s*.34)} ${f(-.18)})`},b);el('circle',{cx:f(s*.34-.08),cy:f(-.24),r:f(.06),fill:'#fff'},b)});
    el('path',{d:`M${f(-.13)},${f(.36)} q${f(.13)},${f(.11)} ${f(.26)},0`,stroke:ink,'stroke-width':Math.max(1.2,r*.08),fill:'none','stroke-linecap':'round'},b)}
  else if(look==='horns'){
    [-1,1].forEach(s=>el('path',{d:`M${f(s*.32)},${f(-.78)} Q${f(s*.95)},${f(-.95)} ${f(s*.86)},${f(-1.42)} Q${f(s*.62)},${f(-1.02)} ${f(s*.12)},${f(-.9)}Z`,fill:ivory,stroke:'#d9c8b0','stroke-width':f(.04)},b));
    feet();el('path',{d:blobPath(r,1.06,.98,2.2),fill:col},b);shine();
    el('ellipse',{cx:0,cy:f(.42),rx:f(.48),ry:f(.34),fill:'#fff',opacity:.16},b);
    eye(-.3,-.2,.22,.03);eye(.3,-.2,.22,-.03);
    [-1,1].forEach(s=>el('path',{d:`M${f(s*.52)},${f(-.5)} L${f(s*.12)},${f(-.4)}`,stroke:dk,'stroke-width':f(.1),'stroke-linecap':'round'},b));
    el('path',{d:`M${f(-.46)},${f(.14)} Q0,${f(.66)} ${f(.46)},${f(.14)}Z`,fill:ink},b);
    [-1,1].forEach(s=>el('path',{d:`M${f(s*.36)},${f(.17)} l${f(-s*.08)},${f(.18)} l${f(-s*.09)},${f(-.16)}Z`,fill:'#fff'},b))}
  else if(look==='cyclops'){
    el('path',{d:`M${f(-.14)},${f(-1.0)} L0,${f(-1.42)} L${f(.14)},${f(-1.0)}Z`,fill:ivory,stroke:'#d9c8b0','stroke-width':f(.04)},b);
    feet();el('path',{d:blobPath(r,.96,1.1,4.1),fill:col},b);shine();cheeks(.25);
    el('circle',{cx:0,cy:f(-.22),r:f(.44),fill:'#fffaf2'},b);el('circle',{cx:0,cy:f(-.18),r:f(.26),fill:dk},b);el('circle',{cx:0,cy:f(-.18),r:f(.15),fill:ink},b);el('circle',{cx:f(-.08),cy:f(-.27),r:f(.07),fill:'#fff'},b);
    el('path',{d:`M${f(-.36)},${f(.36)} Q0,${f(.72)} ${f(.36)},${f(.36)}Z`,fill:ink},b);
    el('path',{d:`M${f(-.3)},${f(.38)} l${f(.1)},${f(.12)} l${f(.1)},${f(-.1)} l${f(.1)},${f(.12)} l${f(.1)},${f(-.1)} l${f(.1)},${f(.12)} l${f(.1)},${f(-.12)}Z`,fill:'#fff'},b)}
  else if(look==='squid'){
    [-.62,-.31,0,.31,.62].forEach((o,k)=>el('path',{d:`M${f(o)},${f(.2)} q${f(.14*(k%2?1:-1))},${f(.35)} ${f(0)},${f(.55)} t${f(o*.25)},${f(.25)}`,stroke:dk,'stroke-width':f(.2),fill:'none','stroke-linecap':'round'},b));
    el('path',{d:`M${f(-.92)},${f(.35)} C${f(-.98)},${f(-1.15)} ${f(.98)},${f(-1.15)} ${f(.92)},${f(.35)} Q0,${f(.55)} ${f(-.92)},${f(.35)}Z`,fill:col},b);shine();
    [[-.5,-.52,.1],[.42,-.62,.08],[.6,-.2,.07]].forEach(([cx,cy,rr])=>el('circle',{cx:f(cx),cy:f(cy),r:f(rr),fill:'#fff',opacity:.22},b));
    eye(-.28,-.12,.2);eye(.28,-.12,.2);eye(0,-.48,.15);
    el('ellipse',{cx:0,cy:f(.24),rx:f(.08),ry:f(.09),fill:ink},b)}
  else if(look==='fuzzy'){
    feet();let d='';const n=22;for(let k=0;k<=n;k++){const a=k/n*Math.PI*2-Math.PI/2,rr=k%2?.82:1.0,px=Math.cos(a)*rr,py=Math.sin(a)*rr*.95;d+=(k?' L':'M')+f(px)+','+f(py)}
    el('path',{d:d+'Z',fill:col,'stroke-linejoin':'round',stroke:col,'stroke-width':f(.08)},b);
    el('circle',{r:f(.72),fill:'#fff',opacity:.1},b);
    eye(-.28,-.16,.24,.04);eye(.28,-.16,.24,-.04);cheeks(.22);
    el('path',{d:`M${f(-.2)},${f(.3)} q${f(.2)},${f(.18)} ${f(.4)},0`,stroke:ink,'stroke-width':Math.max(1.2,r*.08),fill:'none','stroke-linecap':'round'},b);
    el('rect',{x:f(-.06),y:f(.36),width:f(.12),height:f(.12),rx:f(.02),fill:'#fff'},b)}
  return{g}}
function avatar(host,ci,r=24,look){const sv=document.createElementNS(NS,'svg');sv.setAttribute('viewBox','-36 -40 72 74');sv.setAttribute('aria-hidden','true');sv.classList.add('av');host.appendChild(sv);buddy(sv,{r,i:ci,look});return sv}
function showWho(){const scr=$('#whoScr'),box=$('#whoCards');box.innerHTML='';$('#sheet').hidden=true;
  ST.players.forEach(p=>{const w=document.createElement('div');w.className='pwrap';const b=document.createElement('button');b.className='pcard';b.dataset.pl=p.id;avatar(b,p.ci,24,p.look);const n=document.createElement('span');n.textContent=p.name;b.appendChild(n);
    b.addEventListener('click',()=>{unlockAudio();SFX.pop(1.2);PL=p.id;scr.hidden=true;start()});w.appendChild(b);
    const lk=document.createElement('button');lk.className='plook';lk.setAttribute('aria-label',`Change ${p.name}’s creature`);
    lk.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 4.5l5 5L9 20H4v-5z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M12.5 6.5l5 5" stroke="currentColor" stroke-width="2.2"/></svg>';
    lk.addEventListener('click',()=>{unlockAudio();SFX.pop(1.4);showLook(p.id)});w.appendChild(lk);box.appendChild(w)});
  const g=document.createElement('button');g.className='pcard grown';g.dataset.pl='g';g.innerHTML=`<svg class="av" viewBox="-36 -40 72 74" aria-hidden="true"><circle r="27" fill="#2c2356" stroke="rgba(255,240,160,.5)" stroke-width="2"/><rect x="-11" y="-3" width="22" height="18" rx="4" fill="#ffc04d"/><path d="M-6 -3v-6a6 6 0 0 1 12 0v6" fill="none" stroke="#ffc04d" stroke-width="3.5"/><circle cy="5" r="2.6" fill="#3a2418"/></svg><span>${ST.pin?'Grown-up':'Set up'}</span>`;
  g.addEventListener('click',()=>{unlockAudio();SFX.pop(.9);askPin(ST.pin?'enter':'new1')});box.appendChild(g);
  $('#whoHint').textContent=ST.players.length?'':'First time here? A grown-up sets a PIN, then adds the players.';
  scr.hidden=false;const f=box.querySelector('.pcard');if(f)f.focus()}
/* the creature picker: any player can choose their own look and colour */
function showLook(id){const p=ST.players.find(x=>x.id===id);if(!p)return;const scr=$('#lookScr');$('#lookT').textContent=`Pick your creature, ${p.name}`;
  const draw=()=>{const big=$('#lookBig');big.innerHTML='';avatar(big,p.ci,24,p.look);
    const L=$('#lookList');L.innerHTML='';LOOKS.forEach(([k,nm])=>{const b=document.createElement('button');b.setAttribute('aria-label',nm);b.setAttribute('aria-pressed',(p.look||'blob')===k);avatar(b,p.ci,24,k);
      b.addEventListener('click',()=>{p.look=k;save();SFX.pop(1+LOOKS.findIndex(x=>x[0]===k)*.08);draw()});L.appendChild(b)});
    const C=$('#lookCols');C.innerHTML='';PCOL.forEach((ci,k)=>{const b=document.createElement('button');b.className='cdot';b.style.background=CCOL[ci];b.setAttribute('aria-label',`Colour ${k+1}`);b.setAttribute('aria-pressed',p.ci===ci);
      b.addEventListener('click',()=>{p.ci=ci;save();SFX.tick(k);draw()});C.appendChild(b)})};
  draw();scr.hidden=false;$('#lookOk').focus()}
$('#lookOk').addEventListener('click',()=>{SFX.chime();$('#lookScr').hidden=true;showWho()});
function start(){save();document.body.classList.toggle('goggles',GOG);jarIcon();go('hub')}

/* ---------- the grown-up PIN (a latch for little fingers, not real security) ---------- */
let PIN={mode:'enter',v:'',first:''};
function askPin(mode){PIN={mode,v:'',first:''};$('#pinScr').hidden=false;pinDraw()}
function pinDraw(){$('#pinT').textContent={enter:'Grown-up PIN',new1:'Choose a 4-digit PIN',new2:'Once more to check'}[PIN.mode];$$('#pinDots i').forEach((d,k)=>d.classList.toggle('on',k<PIN.v.length))}
function pinKey(k){if(k==='del'){PIN.v=PIN.v.slice(0,-1);pinDraw();return}if(PIN.v.length>=4)return;PIN.v+=k;SFX.tick(+k);pinDraw();
  if(PIN.v.length<4)return;setTimeout(()=>{
    if(PIN.mode==='new1'){PIN.first=PIN.v;PIN.v='';PIN.mode='new2';pinDraw()}
    else if(PIN.mode==='new2'){if(PIN.v===PIN.first){ST.pin=PIN.v;save();pinOk(true)}else{pinBad();PIN.mode='new1';PIN.first=''}}
    else if(PIN.v===ST.pin)pinOk(false);else pinBad()},160)}
function pinOk(first){$('#pinScr').hidden=true;$('#whoScr').hidden=true;PL='g';SFX.chime();start();if(first||!ST.players.length)setTimeout(openGrown,400)}
function pinBad(){SFX.wrong();const d=$('#pinDots');if(d.animate)d.animate([{transform:'translateX(0)'},{transform:'translateX(-10px)'},{transform:'translateX(10px)'},{transform:'translateX(0)'}],{duration:300});PIN.v='';setTimeout(pinDraw,300)}
(()=>{const pad=$('#pinPad');['1','2','3','4','5','6','7','8','9','del','0','x'].forEach(k=>{const b=document.createElement('button');b.className='key';b.dataset.k=k;b.textContent=k==='del'?'⌫':k==='x'?'✕':k;b.setAttribute('aria-label',k==='del'?'Delete':k==='x'?'Cancel':k);
  b.addEventListener('click',()=>{unlockAudio();if(k==='x'){$('#pinScr').hidden=true;return}pinKey(k)});pad.appendChild(b)})})();
document.addEventListener('keydown',e=>{if($('#pinScr').hidden)return;if(/^[0-9]$/.test(e.key))pinKey(e.key);else if(e.key==='Backspace')pinKey('del');else if(e.key==='Escape')$('#pinScr').hidden=true});

/* ---------- the grown-up corner: players, progress, PIN ---------- */
function openGrown(){
  const rows=ST.players.map(p=>{const g=progOf(p.id),c=CCOL[p.ci%CCOL.length];return`<div class="prow"><span class="pdot" style="background:${c}"></span><b>${esc(p.name)}</b><span class="pmeta">${g.cleared.length} of ${ALLISLES.length} islands · ${g.ideas.length} seeds</span><button class="chip" data-act="path" data-id="${p.id}" title="Which suggested order the home screen shows">${p.path==='young'?'Younger path':'Older path'}</button><button class="chip" data-act="reset" data-id="${p.id}">Reset</button><button class="chip" data-act="del" data-id="${p.id}">Remove</button></div>`}).join('')||'<p>No players yet. Add one below.</p>';
  openSheet('grown',`<h2 id="sheetT">Grown-up corner</h2>
  <p>In grown-up mode every island is open and the arrow stones skip between rounds. Players unlock islands one by one: an island is cleared when every round in it has been won once.</p>
  <h3>Players</h3><div class="plist">${rows}</div>
  <h3>Add a player</h3><div class="addp"><input id="newName" maxlength="14" placeholder="Name" autocomplete="off" aria-label="New player name"><div class="cols" role="group" aria-label="Creature colour">${PCOL.map((ci,k)=>`<button class="cdot" data-ci="${ci}" aria-pressed="${k===0}" aria-label="Colour ${k+1}" style="background:${CCOL[ci]}"></button>`).join('')}</div><button class="chip gold" id="addP">Add player</button></div>
  <h3>This device</h3><div class="who"><button class="chip" data-act="pin">Change PIN</button><button class="chip" data-act="switch">Switch player</button></div>
  <p>Progress is saved on this device only.</p>`)}
$('#sheetBody').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||$('#sheet').dataset.kind!=='grown')return;
  if(b.classList.contains('cdot')){$$('.cdot').forEach(x=>x.setAttribute('aria-pressed',x===b));return}
  if(b.id==='addP'){const n=$('#newName').value.trim();if(!n){$('#newName').focus();return}const ci=+($('.cdot[aria-pressed="true"]')||{dataset:{ci:0}}).dataset.ci;ST.players.push({id:'p'+Date.now().toString(36),name:n,ci});save();SFX.chime();openGrown();return}
  const act=b.dataset.act,id=b.dataset.id;
  if(act==='pin'){$('#sheet').hidden=true;askPin('new1');return}
  if(act==='switch'){showWho();return}
  if(act==='path'){const p=ST.players.find(x=>x.id===id);if(p){p.path=p.path==='young'?'old':'young';save();SFX.tick(3);openGrown()}return}
  if(act==='reset'||act==='del'){if(b.dataset.sure!=='1'){b.dataset.sure='1';b.textContent='Sure?';b.classList.add('gold');return}
    if(act==='reset')delete ST.prog[id];else{ST.players=ST.players.filter(p=>p.id!==id);delete ST.prog[id];delete ST.last[id];delete ST.seen[id]}
    if(act==='reset'){delete ST.seen[id];delete ST.last[id]}save();openGrown()}});
