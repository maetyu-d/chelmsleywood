import world, {initWorld} from './world.js';
import {rseed} from './rng.js';
import {Player} from './entities.js';
import {giveStartItems, equip} from './items.js';
import {initUI, draw, updateHUD, log, setSeed, setRegionText, setEventText} from './ui.js';
import {stepFOV, tryMove, waitTurn, endTurn} from './systems.js';


// Ensure UI is ready before first draw
initUI();


const rnd = rseed(String(Date.now()>>>0));
const player = new Player(0,0); giveStartItems(player); equip(player,'gasmask');


initWorld('chelmsley-'+Math.floor(rnd()*1e9));
setSeed(world.seed);


let vis = stepFOV(player);
updateHUD(player); setRegionText(player); setEventText(world);


function render(){ draw({player,vis}); updateHUD(player); setRegionText(player); setEventText(world); }
render();


function end(){ endTurn(player,log,rnd); vis = stepFOV(player); render(); }


window.addEventListener('keydown', (e)=>{
const k=e.key; let acted=false;
if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','a','d','w','s','h','j','k','l'].includes(k)){
const d = k==='ArrowLeft'||k==='a'||k==='h' ? [-1,0]
: k==='ArrowRight'||k==='d'||k==='l' ? [1,0]
: k==='ArrowUp'||k==='w'||k==='k' ? [0,-1] : [0,1];
acted = tryMove(player,d[0],d[1],log);
} else if(k==='.' ){ waitTurn(log); acted=true; }
if(acted){ e.preventDefault(); end(); }
});
