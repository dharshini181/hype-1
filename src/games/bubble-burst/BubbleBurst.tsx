import {AnimatePresence,motion} from 'framer-motion';import {useEffect,useRef,useState} from 'react';
import type {Api} from '../../types';import {pop} from '../../components/ui';import {sfx} from '../../lib/sound';import {IClock,ITarget} from '../../components/Icons';
import {Bubble,LEVELS,multiplier,popScore,spawn,step,sway} from './logic';
type Ring={id:number;x:number;y:number;r:number;color:string};
const Orb=({b}:{b:Bubble})=><svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
<circle cx="50" cy="50" r="46" fill={b.color} fillOpacity={b.gold?.45:.28} stroke={b.color} strokeWidth="6" style={{filter:`drop-shadow(0 0 6px ${b.color})`}}/>
<path d="M26 40a26 26 0 0 1 18-16" stroke="#FFF4FA" strokeWidth="7" strokeLinecap="round" fill="none" opacity=".85"/>
{b.gold&&<path d="M50 30l5.5 12.5 13.500 1.200-10.200 9 3.100 13.300L50 59l-11.900 7 3.100-13.300-10.200-9 13.500-1.200z" fill="#FFD700" stroke="#FF4500" strokeWidth="3" strokeLinejoin="round"/>}</svg>;
export function BubbleBurst({api}:{api:Api}){
const lv=LEVELS[api.cfg.level]??LEVELS.Medium;
const bs=useRef<Bubble[]>([]),rings=useRef<(Ring&{t:number})[]>([]),sc=useRef(0),streak=useRef(0),popped=useRef(0),bestMult=useRef(1),left=useRef(lv.secs),acc=useRef(0),nid=useRef(1),fin=useRef(false),paused=useRef(api.paused);
paused.current=api.paused;
const [,frame]=useState(0),[mult,setMult]=useState(1),[secs,setSecs]=useState(lv.secs),[score,setScore]=useState(0);
useEffect(()=>{api.touch();let raf=0,last=performance.now();
const loop=(now:number)=>{const dt=Math.min(.05,(now-last)/1000);last=now;
if(!paused.current&&!fin.current){
left.current=Math.max(0,left.current-dt);acc.current+=dt;
while(acc.current>=lv.every){acc.current-=lv.every;bs.current.push(spawn(nid.current++,lv))}
const r=step(bs.current,dt);bs.current=r.alive;
if(r.escaped.length&&streak.current>0){streak.current=0;setMult(1)}
rings.current=rings.current.filter(x=>now-x.t<380);
setSecs(Math.ceil(left.current));
if(left.current<=0){fin.current=true;const s=sc.current;sfx(s>=lv.goal?'win':'bad');
api.finish({score:s,win:s>=lv.goal,detail:`${popped.current} bubbles popped · best combo x${bestMult.current} · goal ${lv.goal}`});return}}
frame(n=>(n+1)%1e6);raf=requestAnimationFrame(loop)};
raf=requestAnimationFrame(loop);return()=>cancelAnimationFrame(raf)},[]); // eslint-disable-line react-hooks/exhaustive-deps
const hit=(b:Bubble)=>{if(fin.current||paused.current)return;
const gain=popScore(b,streak.current);streak.current++;popped.current++;sc.current+=gain;setScore(sc.current);api.setScore(sc.current);
const m=multiplier(streak.current);bestMult.current=Math.max(bestMult.current,m);setMult(m);
bs.current=bs.current.filter(x=>x.id!==b.id);rings.current.push({id:b.id,x:b.x+sway(b),y:b.y,r:b.r,color:b.color,t:performance.now()});
sfx(b.gold?'win':'good',Math.min(400,streak.current*20));pop('+'+gain,b.color)};
const now=performance.now();
return <div className="mx-auto max-w-md">
<div className="mb-2 flex flex-wrap justify-center gap-2 font-display"><span className="chip text-gold"><IClock className="h-4 w-4"/>{secs}s</span><span className="chip text-hot"><ITarget className="h-4 w-4"/>Goal {lv.goal}</span><span className={`chip ${mult>1?'text-fire':'text-snow/70'}`}>Combo x{mult}</span></div>
<div className="no-pan relative mx-auto aspect-[3/4] max-h-[62vh] w-full overflow-hidden rounded-2xl border-2 border-hot/60" style={{background:'radial-gradient(ellipse at 50% 100%,rgba(255,20,147,.28),rgba(18,0,15,.85) 70%)',touchAction:'none'}} aria-label={`Bubble Burst play area. Score ${score}`}>
{bs.current.map(b=><div key={b.id} role="button" aria-label="Pop bubble" tabIndex={-1} onPointerDown={e=>{e.preventDefault();hit(b)}} className="absolute cursor-pointer" style={{left:`${b.x+sway(b)}%`,bottom:`${b.y}%`,width:`${b.r*2}%`,aspectRatio:'1',transform:'translate(-50%,50%)'}}><Orb b={b}/></div>)}
{rings.current.map(g=>{const k=Math.min(1,(now-g.t)/380);return <span key={g.id} className="pointer-events-none absolute rounded-full border-4" style={{left:`${g.x}%`,bottom:`${g.y}%`,width:`${g.r*2*(1+k*1.1)}%`,aspectRatio:'1',transform:'translate(-50%,50%)',borderColor:g.color,opacity:1-k,boxShadow:`0 0 14px ${g.color}`}}/>})}
<AnimatePresence>{score===0&&<motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="pointer-events-none absolute inset-x-0 top-3 text-center font-pixel text-[.6rem] leading-5 text-gold blink">TAP THE BUBBLES!</motion.p>}</AnimatePresence></div>
<p className="mt-2 text-center text-xs text-snow/70">Small bubbles pay more · gold star = 50 · don't let them escape to keep your combo</p></div>}
