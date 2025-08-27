import {h2, rseed, rint, rpick, rchance} from './rng.js';


const CHUNK=64; // 64x64 tiles per chunk
export const TILESIZE=16;
const world = { seed:"", chunks:new Map(), explored:new Set(), lastNoise:null, event:{kind:"", t:0}, reps:{north:0,south:0,mondeo:0,bio:0} };
export default world;


export function initWorld(seed){ world.seed=seed; world.chunks.clear(); world.explored.clear(); world.lastNoise=null; world.event={kind:"",t:0}; world.reps={north:0,south:0,mondeo:0,bio:0}; }


function chunkKey(cx,cy){return cx+","+cy}
function ensureChunk(cx,cy){ const key=chunkKey(cx,cy); if(world.chunks.has(key)) return world.chunks.get(key);
const c = genChunk(cx,cy); world.chunks.set(key,c); return c; }
function genChunk(cx,cy){
const tiles=new Uint8Array(CHUNK*CHUNK); const r=rseed(world.seed+"/"+cx+"/"+cy);
// region bias
const baseReg = regionAt(cx*CHUNK, cy*CHUNK);
for(let y=0;y<CHUNK;y++) for(let x=0;x<CHUNK;x++){
const wx=cx*CHUNK+x, wy=cy*CHUNK+y;
const n=h2(world.seed, wx,wy);
let t=TILE.FLOOR;
// broad features by region
if(baseReg===REGIONS.CORE){ if(n<0.05) t=TILE.MALL; else if(n<0.15) t=TILE.ROAD; else if(n<0.18) t=TILE.WATER; }
else if(baseReg===REGIONS.RINGS){ if(n<0.12) t=TILE.ROUNDABOUT; else if(n<0.35) t=TILE.ROAD; }
else if(baseReg===REGIONS.NORTH){ if(n<0.08) t=TILE.TRADER; else if(n<0.28) t=TILE.SILO; else if(n<0.38) t=TILE.ROAD; }
else if(baseReg===REGIONS.SOUTH){ if(n<0.06) t=TILE.SCRAP; else if(n<0.12) t=TILE.LOCKER; else if(n<0.35) t=TILE.ROAD; }
else if(baseReg===REGIONS.DEAD){ if(n<0.15) t=TILE.RAD; else if(n<0.22) t=TILE.WATER; else if(n<0.30) t=TILE.SCRAP; }
// walls clusters
if(h2(world.seed+"w",wx,wy)<0.05) t=TILE.WALL;
// doors occasionally
if(t===TILE.WALL && h2(world.seed+"d",wx,wy)<0.05) t=TILE.DOOR;
tiles[y*CHUNK+x]=t;
}
// sprinkle lockers/altars/POIs
for(let i=0;i<rint(r,3,7);i++){
const x=rint(r,2,CHUNK-3), y=rint(r,2,CHUNK-3); const wx=cx*CHUNK+x, wy=cy*CHUNK+y; const p=h2(world.seed+"p",wx,wy);
if(p<0.12) tiles[y*CHUNK+x]=TILE.LOCKER; else if(p<0.18) tiles[y*CHUNK+x]=TILE.ALTAR;
}
return {cx,cy,tiles, seenName:false, name:nameForChunk(cx,cy), biome:biomeAt(cx,cy)};
}


export function tileAt(wx,wy){ const cx=Math.floor(wx/CHUNK), cy=Math.floor(wy/CHUNK); const c=ensureChunk(cx,cy); const x=wx-cx*CHUNK, y=wy-cy*CHUNK; return c.tiles[y*CHUNK+x]; }
export function setTile(wx,wy,t){ const cx=Math.floor(wx/CHUNK), cy=Math.floor(wy/CHUNK); const c=ensureChunk(cx,cy); const x=wx-cx*CHUNK, y=wy-cy*CHUNK; c.tiles[y*CHUNK+x]=t; }
export function passable(wx,wy){ const t=tileAt(wx,wy); return t!==TILE.WALL && t!==TILE.WATER && t!==TILE.RAD; }
export function opaque(wx,wy){ const t=tileAt(wx,wy); return t===TILE.WALL && t!==TILE.DOOR; }
export function regionAt(wx,wy){
const d=Math.hypot(wx,wy);
if(d<80) return REGIONS.CORE;
if(d<300) return REGIONS.RINGS;
if(wy<0) return REGIONS.NORTH;
if(d>800) return REGIONS.DEAD;
return REGIONS.SOUTH;
}
export function biomeAt(cx,cy){ const reg=regionAt(cx*CHUNK,cy*CHUNK); switch(reg){
case REGIONS.CORE: return BIOME.ORIFICE; case REGIONS.RINGS: return BIOME.RINGS; case REGIONS.NORTH: return BIOME.SILOS;
case REGIONS.SOUTH: return BIOME.SOUTH; default: return BIOME.DEAD; }
}
export function nameForChunk(cx,cy){ const reg=regionAt(cx*CHUNK,cy*CHUNK);
const base = {
[REGIONS.CORE]: ['Orifice Annex','Poundland Relic','Liz Taylor Cryo'],
[REGIONS.RINGS]: ['Rotary','HS2 Overpass','Aldi Mausoleum'],
[REGIONS.NORTH]: ['Habitat Silo','Murray Drive Gate','VR Clinic'],
[REGIONS.SOUTH]: ['Wheelie Bin Court','Drained Lake','Teen Arena'],
[REGIONS.DEAD]: ['Dead Zone Fuselage','Mondeo Shrine','ASDA Subduct']
}[reg];
const r=rseed("n:"+cx+","+cy+":"+reg); const id=rint(r,1,999); return rpick(r,base)+" "+id;
}
export function forEachNeighbor(wx,wy,fn){ fn(wx+1,wy); fn(wx-1,wy); fn(wx,wy+1); fn(wx,wy-1); }
export function markExplored(set){ for(const k of set) world.explored.add(k); }
export function isExplored(wx,wy){ return world.explored.has(wx+","+wy); }
export function setNoise(x,y,r){ world.lastNoise={x,y,r,t:10}; }
export function tickNoise(){ if(world.lastNoise) if(--world.lastNoise.t<=0) world.lastNoise=null; }
export function rollEvent(rnd){ if(world.event.kind) return; const roll=rnd(); if(roll<0.03) world.event={kind:'Bleach-drone sweep', t: rint(rnd,20,40)}; else if(roll<0.06) world.event={kind:'Microplastic squall', t:rint(rnd,18,30)}; }
export function tickEvent(){ if(world.event.kind){ if(--world.event.t<=0) world.event={kind:'',t:0}; } }
