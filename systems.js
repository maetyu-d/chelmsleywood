import world, {passable, opaque, setTile, setNoise, tickNoise, rollEvent, tickEvent, regionAt, nameForChunk, markExplored, isExplored} from './world.js';
import {computeFOV} from './fov.js';
import {clamp} from './util.js';
import {TILE, EFFECT, RECIPES} from './consts.js';
import {addItem, findItem, equip, listCraftable, craft} from './items.js';


export function startAt(player, rnd){ player.x=0; player.y=0; player.sees=player.baseSees; }


export function stepFOV(player){ const vis=computeFOV(opaque, player.x,player.y, player.sees); markExplored(vis); return vis; }


export function tryMove(player,dx,dy,log){ const nx=player.x+dx, ny=player.y+dy; if(passable(nx,ny)){ player.x=nx; player.y=ny; log(`You move to (${nx},${ny}).`); return true } log('Blocked.'); return false }


export function waitTurn(log){ log('You wait.'); }


export function interact(player,log,spawnEnemy){ const t=getTile(player.x,player.y); if(t===TILE.LOCKER){
const hasTool = !!( findItem(player,'screwdriver') || findItem(player,'lkey') );
if(hasTool){ log('You pop the locker.'); lootLocker(player,log); setTile(player.x,player.y,TILE.FLOOR); }
else{ log('Clang! Your fingers slip — something hears.'); setNoise(player.x,player.y,8); spawnEnemy('teen'); }
} else { log('Nothing to pick up here.'); }
}
function getTile(x,y){ return world.chunks.get(Math.floor(x/64)+","+Math.floor(y/64))?null: null; }
function lootLocker(player,log){ const rolls=[{key:'filter', charges:120, stack:true, amount:1},{key:'algae',stack:true,amount:1},{key:'battery',stack:true,amount:1},{key:'scrap',stack:true,amount:1},{key:'machete',type:'weapon',name:'Battery Machete',dmg:[3,6],crit:0.15,reach:1}]; const it=rolls[Math.floor(Math.random()*rolls.length)]; addItem(player,it); log(`You find ${it.name||it.key}.`); }


export function endTurn(player,log,rnd){
// Filters tick & environmental hazards
const maskOn = !!player.equip.mask;
if(maskOn){ if(player.maskFilter>0) player.maskFilter--; }
const hazard = isStorming() || inRadiation(player) ? 1:0;
if(hazard && (!maskOn || player.maskFilter<=0)){ player.hp-=1; addEffect(player,EFFECT.CONTAM,3); log('The air burns your lungs.'); }
// Hunger
player.hunger = clamp(player.hunger+1,0,400);
// Hunger states: 0-100 ok, 100-250 Hungry, 250+ Starving (HP drain)
if(player.hunger>250) { if(player.hunger%5===0){ player.hp=Math.max(0,player.hp-1); log('You are starving.'); } }
// Effects tick
tickEffects(player,log);
// Noise decay & world events
tickNoise(); tickEvent(); rollEvent(rnd);
}
function isStorming(){ return world.event.kind==='Microplastic squall'; }
function inRadiation(p){ return regionAt(p.x,p.y)==='deadzone'; }


export function eat(player, key, log){ const it=findItem(player,key); if(it && it.type==='food'){ player.hunger= Math.max(0, player.hunger - (it.satiate||120)); if(it.heal) player.hp=clamp(player.hp+it.heal,0,player.maxhp); removeItem(player,key); if(key==='algae') addEffect(player,EFFECT.WELLFED,30); log('You eat.'); return true } log('Not edible.'); return false }


export function addEffect(player,eff,dur){ const ex=player.effects.find(e=>e.kind===eff); if(ex){ ex.t=Math.max(ex.t,dur); } else player.effects.push({kind:eff,t:dur}); }
export function tickEffects(player,log){ for(const e of player.effects){ e.t--; if(e.kind===EFFECT.BLEED && e.t%2===0){ player.hp=Math.max(0,player.hp-1); log('You bleed.'); } } player.effects=player.effects.filter(e=>e.t>0); }


export function noiseAfter(action,player){ const radii={ move:2, run:6, attack:5, wait:0, ping:8, open:3 }; return radii[action]||0; }


export function donate(player, stat, amount, log){ if(player.creds<amount){ log('Not enough creds.'); return false } player.creds-=amount; if(stat==='sight'){ player.baseSees++; log('Your sight expands.'); } else if(stat==='hp'){ player.maxhp++; player.hp++; log('You feel tougher.'); } return true }


export function pricesFor(player){ const base={filter:20, algae:5, battery:12}; const mod=1 + Math.max(-0.3, Math.min(0.5, (-player.reputation.north+player.reputation.south)*0.05)); return Object.fromEntries(Object.entries(base).map(([k,v])=>[k,Math.round(v*mod)])); }


export function craftables(player){ return listCraftable(player, RECIPES); }
export function doCraft(player, recipe, log){ if(craft(player,recipe)){ log('Crafted: '+(recipe.out.name||recipe.out.key)); return true } log('Cannot craft.'); return false }
