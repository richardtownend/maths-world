/* ---------- 7. The Last Stretch: rounding decimals ---------- */
W.inn={scene:'road',
notes:`<p>The last stretch to the inn, measured in miles and tenths of a mile. Hills between whole miles with a mark every tenth: drag the 2.7 cart into place and pick the whole mile it rolls to; 4.5 balances on the peak and the wind blows it on. Then zoom in: hills of a tenth, with a mark every hundredth, to round 2.37 to one decimal place (2.4). Last, tap every cart that ends up at the 3-mile stone.</p>`,
mount(root){
  const E=roadRounds('inn',root,[
    {kind:'place',lo:1,hi:4,step:1,tick:.1,snap:.1,dp:1,vs:[2.7,1.3,3.6,2.2,1.8],near:'nearest whole mile',say:'Nearly at the inn! Hills of one mile, a mark every tenth. Drag the cart to its place, then pick the milestone.'},
    {kind:'place',lo:3,hi:6,step:1,tick:.1,snap:.1,dp:1,vs:[4.5,3.5,5.5],near:'nearest whole mile'},
    {kind:'place',lo:2.2,hi:2.6,step:.1,tick:.01,snap:.01,dp:2,vs:[2.37,2.43,2.31,2.48,2.26],near:'to 1 decimal place',say:'Zoomed in: hills of a tenth, a mark every hundredth. Drag the cart, then pick the milestone.'},
    {kind:'place',lo:6.2,hi:6.6,step:.1,tick:.01,snap:.01,dp:2,vs:[6.45,6.35,6.25],near:'to 1 decimal place'},
    {kind:'many',lo:2,hi:4,step:1,tick:.1,dp:1,target:3,sets:[[2.4,2.6,2.9,3.3,3.5,3.8],[2.2,2.5,2.8,3.1,3.4,3.7],[2.3,2.7,3,3.2,3.6,3.9]]}],{unlockK:'rinn'});
  W.inn.dbgQ=E.dbg;E.S.r=resumeAt(5);E.load();
}};
