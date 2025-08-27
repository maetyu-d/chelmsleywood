// Deterministic PRNG + helpers
export function mulberry32(a){return function(){let t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}};
export function hashStr(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
export function rseed(seed){return mulberry32(typeof seed==='string'?hashStr(seed):seed>>>0)}
export function rint(r,min,max){return Math.floor(r()*(max-min+1))+min}
export function rpick(r,arr){return arr[Math.floor(r()*arr.length)]}
export function rchance(r,p){return r()<p}
// 2D hash noise in [0,1)
export function h2(seed,x,y){let h=hashStr(seed+"|"+x+","+y);const r=mulberry32(h);return r()}
