export const TILE = {
FLOOR: 0, ROAD: 1, WALL: 2, LOCKER: 3, WATER: 4, RAD: 5, ALTAR: 6, TRADER: 7,
STAIRS: 8, SILO: 9, MALL: 10, ROUNDABOUT: 11, SCRAP:12, DOOR:13
};
export const REGIONS = { CORE:"core", NORTH:"north", SOUTH:"south", DEAD:"deadzone", RINGS:"rings" };
export const BIOME = { ORIFICE:"Orifice", SILOS:"Silos", LAKES:"DrainedLakes", RINGS:"Rotaries", SOUTH:"South", NORTH:"North", DEAD:"Dead" };
export const EFFECT = { BLEED:"Bleeding", CONTAM:"Contaminated", STAG:"Staggered", WELLFED:"WellFed" };
export const EVENT = { NONE:"", BLEACH:"Bleach-drone sweep", MICRO:"Microplastic squall" };
export const DIRS = [ [1,0],[-1,0],[0,1],[0,-1] ];
export const COLORS = {
floor:'#1a1c20', wall:'#363c45', road:'#2b3340', water:'#102631', rad:'#2a1c2a',
locker:'#444b57', altar:'#40352a', trader:'#293a2f', round:'#24313b', mall:'#2a2431',
silo:'#2c2a28', scrap:'#2e343b', door:'#333940'
};
export const START_ITEMS = [
{ key:'gasmask', name:'Gas Mask', type:'equipment', slot:'mask', charges:0, meta:{}, stack:false },
{ key:'filter', name:'Filter Cartridge', type:'consumable', charges:200, stack:true, amount:2 },
{ key:'screwdriver', name:'Screwdriver', type:'weapon', dmg:[2,4], crit:0.25, reach:1, stack:false },
{ key:'algae', name:'Algae Paste', type:'food', heal:0, satiate:140, stack:true, amount:1 },
{ key:'cred', name:'Credstick', type:'currency', amount:20, stack:true },
];
export const RECIPES = [
{ out:{key:'ion', name:'Ion Scrubber', type:'consumable', charges:80, stack:true}, req:['filter','battery'] },
{ out:{key:'wbshield', name:'Wheelie-Bin Shield', type:'armor', slot:'offhand', armor:1}, req:['scrap','screwdriver'] },
];
export const KEYS = { LEFT:['ArrowLeft','a','h'], RIGHT:['ArrowRight','d','l'], UP:['ArrowUp','w','k'], DOWN:['ArrowDown','s','j'] };
