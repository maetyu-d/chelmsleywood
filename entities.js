import {passable, regionAt} from './world.js';
import {aStar} from './util.js';


export class Entity{ constructor(x,y){ this.x=x; this.y=y; this.hp=10; this.maxhp=10; this.char='?'; this.fg='#ccc'; this.ai='idle'; this.sees=8; this.noise=0; this.hostile=true; this.name='Thing'; this.tags={}; }
}
export class Player extends Entity{ constructor(x,y){ super(x,y); this.char='@'; this.fg='#8be9fd'; this.name='You'; this.hp=12; this.maxhp=12; this.baseSees=8; this.sees=this.baseSees; this.effects=[]; this.hunger=0; this.maskFilter=0; this.inv=[]; this.equip={weapon:null, mask:null, offhand:null}; this.creds=0; this.reputation={north:0,south:0,mondeo:0,bio:0}; this.killCount=0; this.seed=''; }
}
export class Enemy extends Entity{ constructor(x,y,kind='teen'){ super(x,y); this.kind=kind; this.char= kind==='teen'?'t': (kind==='custodian'?'b': (kind==='cultist'?'m':'e'));
this.fg= kind==='teen'?'#ffb86c': kind==='custodian'?'#50fa7b': kind==='cultist'?'#bd93f9':'#f8f8f2';
this.name = {teen:'Gladiator Teen', custodian:'Bio‑drone Custodian', cultist:'Mondeo Acolyte'}[kind]||'Stray';
this.sees=7; this.noise=0; this.hp=6; this.maxhp=6; this.hostile=true; this.path=null; }
takeTurn(player, opaque){
// Chase last noise or player if seen; else wander
const dx=player.x-this.x, dy=player.y-this.y; const dist=Math.abs(dx)+Math.abs(dy);
if(dist<=1){ return {type:'melee', target:player}; }
const goal = (player.lastNoise && within(this.x,this.y, player.lastNoise)) ? [player.lastNoise.x, player.lastNoise.y]
: (dist< this.sees? [player.x,player.y] : null);
if(goal){ this.path = aStar([this.x,this.y], goal, (x,y)=>passable(x,y)); }
if(this.path && this.path.length>1){ const step=this.path[1]; this.x=step[0]; this.y=step[1]; this.path.splice(0,1); return {type:'move'}; }
// Wander
const dirs=[[1,0],[-1,0],[0,1],[0,-1]]; const pick=dirs[Math.floor(Math.random()*4)]; const nx=this.x+pick[0], ny=this.y+pick[1]; if(passable(nx,ny)){this.x=nx; this.y=ny; return {type:'move'}} return {type:'idle'};
}
}
function within(x,y,noise){ const dx=x-noise.x, dy=y-noise.y; return dx*dx+dy*dy <= noise.r*noise.r; }
