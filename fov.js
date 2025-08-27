import {bresenhamLine} from './util.js';
export function computeFOV(opaqueFn, px,py, radius=10){
const vis=new Set(); const push=(x,y)=>vis.add(x+","+y);
push(px,py);
const r=radius;
for(let dx=-r;dx<=r;dx++) for(let dy=-r;dy<=r;dy++){
const x=px+dx, y=py+dy; const dist=Math.abs(dx)+Math.abs(dy); if(dist>r) continue;
const line=bresenhamLine(px,py,x,y);
let blocked=false; for(const [lx,ly] of line){ push(lx,ly); if(!(lx===x && ly===y) && opaqueFn(lx,ly)){ blocked=true; break; }
if(blocked) break; }
}
return vis;
}
