import {motion} from 'framer-motion';import {boardOf,sameP,useStore} from '../lib/store';import {IMedal} from './Icons';
const MEDAL=['#FFD700','#FF69B4','#FF4500'];
/** Arcade-style ranked list for one game. `me` highlights the player who just played / is about to play. */
export function Board({g,color,me,limit=Infinity,title='HIGH SCORES'}:{g:string;color:string;me?:string;limit?:number;title?:string}){
const {sessions}=useStore();const rows=boardOf(sessions,g),top=rows.slice(0,limit);
const mine=me?rows.findIndex(r=>sameP(r.p,me)):-1;const extra=mine>=limit?mine:-1; // player ranked below the visible list still gets a row
return <section aria-label={`${title}`} className="rounded-2xl border-2 bg-night/80 p-3 text-left" style={{borderColor:`${color}aa`,boxShadow:`inset 0 0 18px ${color}33`}}>
<h2 className="glow mb-2 flex items-center justify-between font-pixel text-[.6rem] leading-5" style={{color}}><span>{title}</span><span className="text-snow/60">{rows.length} {rows.length===1?'PLAYER':'PLAYERS'}</span></h2>
{top.length===0?<p className="blink py-3 text-center font-pixel text-[.55rem] leading-5 text-gold">NO SCORES YET<br/>BE THE FIRST!</p>:
<ol className="space-y-1.5">{[...top.map((r,i)=>({r,i})),...(extra>=0?[{r:rows[extra],i:extra}]:[])].map(({r,i},k)=>{const you=mine===i;
return <motion.li key={r.p+i} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:k*.05}} className={`flex items-center gap-2 rounded-xl px-2 py-1.5 ${you?'bg-gold text-ink':'bg-panel'}`} style={extra===i&&k===top.length?{marginTop:10}:undefined}>
<span className="grid h-7 w-8 shrink-0 place-items-center font-pixel text-[.6rem]" style={{color:you?'#12000F':MEDAL[i]??'#FFF4FA'}}>{i<3?<IMedal className="h-6 w-6"/>:i+1}</span>
<span className={`min-w-0 flex-1 truncate font-display text-base ${you?'text-ink':'text-snow'}`}>{r.p}{you&&<span className="ml-2 font-pixel text-[.5rem]">YOU</span>}</span>
<span className={`font-pixel text-[.65rem] ${you?'text-ink':'text-gold'}`}>{r.score}</span></motion.li>})}</ol>}
</section>}
