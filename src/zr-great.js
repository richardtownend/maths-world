/* ---------- 6. The Great Road: rounding to 10,000 and 100,000 ---------- */
W.greatroad={scene:'road',
notes:`<p>The long roads between cities, where the numbers get big. Dex's step-counter says 47,300 steps; the signposts round them for travellers. First she predicts on digit wheels which milestone the cart will roll to (only the end milestones are labelled, so she works out the ones between in 10,000s), then Go rolls it. Then hills of 100,000. The key round: paint the whole stretch of road whose carts all roll to 250,000, from 245,000 up to just before 255,000, and Go sends carts along it (and just outside it) to test the paint. Last, tap every cart that rolls to 300,000.</p>`,
mount(root){
  const E=roadRounds('greatroad',root,[
    {kind:'wheels',lo:30000,hi:70000,step:10000,tick:1000,digits:5,vs:[47300,52800,36100,63900,44500]},
    {kind:'wheels',lo:100000,hi:500000,step:100000,tick:10000,digits:6,vs:[248610,371200,429900,163500,350000]},
    {kind:'paint',step:10000,snap:1000,tick:1000,vars:[{lo:230000,hi:270000,target:250000},{lo:40000,hi:80000,target:60000},{lo:110000,hi:150000,target:130000}]},
    {kind:'many',lo:200000,hi:500000,step:100000,tick:10000,target:300000,sets:[[221000,256000,297500,333000,372000,450000],[205000,251000,284000,349000,388000,430000],[238000,262000,310000,350000,365000,412000]]}],{unlockK:'rgreat'});
  W.greatroad.dbgQ=E.dbg;E.S.r=resumeAt(4);E.load();
}};
