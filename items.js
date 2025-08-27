import {START_ITEMS} from './consts.js';


export function giveStartItems(player){
for(const it of START_ITEMS){ addItem(player,it); }
}
export function addItem(player,item){ const clone=JSON.parse(JSON.stringify(item)); if(clone.stack){ const ex=player.inv.find(i=>i.key===clone.key && i.stack); if(ex){ ex.amount=(ex.amount||0)+(clone.amount||1); ex.charges=(ex.charges||0)+(clone.charges||0); return; } }
player.inv.push(clone); if(clone.type==='currency') player.creds+=clone.amount||0; if(clone.key==='filter') player.maskFilter+=(clone.charges||0);
}
export function findItem(player,key){ return player.inv.find(i=>i.key===key); }
export function removeItem(player,key,amount=1){ const i=player.inv.findIndex(it=>it.key===key); if(i>=0){ const it=player.inv[i]; if(it.stack){ it.amount-=amount; if(it.amount<=0) player.inv.splice(i,1); } else player.inv.splice(i,1); }}
export function equip(player,key){ const it=findItem(player,key); if(!it) return false; if(it.type==='weapon'){ player.equip.weapon=it; return true; } if(it.slot==='mask'){ player.equip.mask=it; return true; } if(it.type==='armor' && it.slot==='offhand'){ player.equip.offhand=it; return true; } return false; }
export function listCraftable(player,recipes){ return recipes.filter(r=> r.req.every(k=> !!findItem(player,k)) ); }
export function craft(player,recipe){ if(!recipe) return false; for(const k of recipe.req) removeItem(player,k); addItem(player,recipe.out); return true; }
