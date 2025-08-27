import {DIRS} from './consts.js';
export const clamp=(v,a,b)=>v<a?a:v>b?b:v;
export const keyOf=(x,y)=>x+","+y;
export function bresenhamLine(x0,y0,x1,y1){
const points=[]; let dx=Math.abs(x1-x0), dy=Math.abs(y1-y0); let sx=x0<x1?1:-1, sy=y0<y1?1:-1; let err=dx-dy;
while(true){points.push([x0,y0]); if(x0===x1 && y0===y1) break; const e2=2*err; if(e2>-dy){err-=dy;x0+=sx} if(e2<dx){err+=dx;y0+=sy}}
return points;
}
export function neighbors4(x,y){return DIRS.map(([dx,dy])=>[x+dx,y+dy])}
export function aStar(start,goal,passable){
// Lightweight grid A* with Manhattan heuristic
const key=([x,y])=>x+","+y; const open=new Map(); const came=new Map(); const g=new Map();
const h=([x,y])=>Math.abs(x-goal[0])+Math.abs(y-goal[1]);
const startK=key(start); open.set(startK,{pos:start,f:h(start)}); g.set(startK,0);
while(open.size){ // pick lowest f
let curK,cur; for(const [k,v] of open) if(!cur||v.f<cur.f){cur=v;curK=k}
if(cur.pos[0]===goal[0]&&cur.pos[1]===goal[1]){ // reconstruct
const path=[cur.pos]; let k=curK; while(came.has(k)){const p=came.get(k); path.push(p); k=key(p)} return path.reverse();
}
open.delete(curK);
for(const nb of neighbors4(cur.pos[0],cur.pos[1])){
if(!passable(nb[0],nb[1])) continue; const nk=key(nb); const tentative=g.get(curK)+1;
if(!g.has(nk)||tentative<g.get(nk)) {came.set(nk,cur.pos); g.set(nk,tentative); open.set(nk,{pos:nb,f:tentative+h(nb)})}
}
}
return null;
}
