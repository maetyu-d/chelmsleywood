import world, {TILESIZE, tileAt, isExplored, regionAt} from './world.js';
import {COLORS, TILE} from './consts.js';


const canvas = document.getElementById('view');
const ctx = canvas.getContext('2d');


export function draw(state){ const {player, vis} = state; const w=canvas.width, h=canvas.height; ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h);
const tilesX=Math.floor(w/TILESIZE), tilesY=Math.floor(h/TILESIZE);
const offX = player.x - Math.floor(tilesX/2), offY = player.y - Math.floor(tilesY/2);
for(let y=0;y<tilesY;y++) for(let x=0;x<tilesX;x++){
const wx=offX+x, wy=offY+y; const key=wx+","+wy; const seen=vis.has(key); const mem=isExplored(wx,wy); if(!seen && !mem) continue;
const t = tileAt(wx,wy); const c = tileColor(t);
ctx.fillStyle=seen?c:shade(c,0.45); ctx.fillRect(x*TILESIZE,y*TILESIZE,TILESIZE,TILESIZE);
}
// entities would be drawn here; for brevity, we draw player only
ctx.fillStyle='#8be9fd'; ctx.fillRect(Math.floor(tilesX/2)*TILESIZE, Math.floor(tilesY/2)*TILESIZE, TILESIZE, TILESIZE);
}
function tileColor(t){ switch(t){
case TILE.ROAD: return COLORS.road; case TILE.WALL: return COLORS.wall; case TILE.WATER: return COLORS.water; case TILE.RAD: return COLORS.rad;
case TILE.LOCKER: return COLORS.locker; case TILE.ALTAR: return COLORS.altar; case TILE.TRADER: return COLORS.trader; case TILE.ROUNDABOUT: return COLORS.round;
case TILE.MALL: return COLORS.mall; case TILE.SILO: return COLORS.silo; case TILE.SCRAP: return COLORS.scrap; case TILE.DOOR: return COLORS.door; default:return COLORS.floor; }
}
function shade(hex, f){ // simple shade multiply
const c=parseInt(hex.slice(1),16); const r=c>>16, g=(c>>8)&255, b=c&255; const r2=Math.floor(r*f), g2=Math.floor(g*f), b2=Math.floor(b*f); return `#${(r2<<16|g2<<8|b2).toString(16).padStart(6,'0')}`;
}
export function updateHUD(player){
const hp=(player.hp/player.maxhp)*100; const mask=(player.maskFilter/400)*100; const hun=(player.hunger/400)*100;
setBar('hpBar',hp); setBar('filterBar',mask); setBar('hungerBar',hun);
setText('hpText',`${player.hp}/${player.maxhp}`);
setText('filterText',`${player.maskFilter}`);
setText('hungerText',`${player.hunger}`);
setText('sightText',player.sees);
}
export function setRegionText(player){ const reg=regionAt(player.x,player.y); document.getElementById('regionText').textContent=reg; }
export function setEventText(world){ document.getElementById('eventText').textContent=world.event.kind||'—'; }
function setBar(id,val){ const el=document.getElementById(id); el.style.width=Math.max(0,Math.min(100,val))+"%"; }
function setText(id,txt){ document.getElementById(id).textContent=txt; }
export function log(msg, dim=false){ const el=document.getElementById('log'); const p=document.createElement('div'); if(dim) p.className='dim'; p.textContent=msg; el.appendChild(p); el.scrollTop=el.scrollHeight; }
export function setSeed(str){ document.getElementById('seedStr').textContent=str; }
