import {AnimatePresence,motion,type HTMLMotionProps,animate} from 'framer-motion';import {sfx} from '../lib/sound';import {useEffect,useMemo,useState} from 'react';
import {P} from './Icons';import {Scenery} from './Scenery';

/** Chunky 3D arcade button. Pass the colour as a Tailwind bg-* class (palette only). */
export function Btn({className='',...p}:HTMLMotionProps<'button'>){return <motion.button whileTap={{scale:.94,y:4}} whileHover={{y:-2}} className={`cab-btn text-lg ${className}`} {...p}/>}
export const Pill=({children,className=''}:{children:React.ReactNode;className?:string})=><span className={`chip ${className}`}>{children}</span>;
export function CountUp({to}:{to:number}){const [v,setV]=useState(0);useEffect(()=>{const c=animate(0,to,{duration:.9,onUpdate:x=>setV(Math.round(x))});return()=>c.stop()},[to]);return <>{v}</>}

const COL=[P.hot,P.deep,P.mag,P.fire,P.gold];
export function Burst({show}:{show:boolean}){const ps=useMemo(()=>Array.from({length:18},(_,i)=>({a:i/18*Math.PI*2,d:90+Math.random()*90,c:COL[i%5]})),[]);
return show?<div className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden">{ps.map((p,i)=><motion.span key={i} className="absolute h-3 w-3 rounded-full" style={{background:p.c,boxShadow:`0 0 10px ${p.c}`}} initial={{x:0,y:0,opacity:1,scale:1.2}} animate={{x:Math.cos(p.a)*p.d,y:Math.sin(p.a)*p.d,opacity:0,scale:.3}} transition={{duration:.9,ease:'easeOut'}}/>)}</div>:null}

export const Screen=({children,className=''}:{children:React.ReactNode;className?:string})=><motion.main className={`relative z-10 mx-auto w-full max-w-4xl px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] ${className}`} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}} transition={{duration:.25}}>{children}</motion.main>;

export function Confetti({count=70}:{count?:number}){const ps=useMemo(()=>Array.from({length:count},(_,i)=>({x:Math.random()*100,r:Math.random()*720-360,d:2.2+Math.random()*1.8,dl:Math.random()*.6,c:COL[i%5],w:6+Math.random()*8,s:i%5===0})),[count]);
return <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>{ps.map((p,i)=><motion.span key={i} className="absolute top-0" style={{left:`${p.x}%`,width:p.w,height:p.s?p.w:p.w*1.6,background:p.c,borderRadius:p.s?'50%':2,boxShadow:`0 0 8px ${p.c}`}} initial={{y:-30,rotate:0,opacity:1}} animate={{y:'105vh',rotate:p.r,opacity:[1,1,.8]}} transition={{duration:p.d,delay:p.dl,ease:'easeIn'}}/>)}</div>}

let last={x:0,y:0};if(typeof window!=='undefined')window.addEventListener('pointerdown',e=>{last={x:e.clientX,y:e.clientY}},true);
type F={id:number;t:string;x:number;y:number;c:string};let fl:F[]=[];const fs=new Set<()=>void>();let fid=0;
export function pop(t:string,c:string=P.gold){const f={id:++fid,t,x:last.x||innerWidth/2,y:last.y||innerHeight/2,c};fl=[...fl,f];fs.forEach(g=>g());setTimeout(()=>{fl=fl.filter(q=>q.id!==f.id);fs.forEach(g=>g())},900)}
export function Floaters(){const [,n]=useState(0);useEffect(()=>{const f=()=>n(x=>x+1);fs.add(f);return()=>{fs.delete(f)}},[]);
return <div className="pointer-events-none fixed inset-0 z-50">{fl.map(f=><motion.span key={f.id} className="absolute font-pixel text-xl" style={{left:f.x-40,top:f.y-34,color:f.c,textShadow:`0 0 10px ${f.c},0 3px 0 ${P.ink}`}} initial={{y:0,opacity:1,scale:.6}} animate={{y:-80,opacity:0,scale:1.25}} transition={{duration:.85}}>{f.t}</motion.span>)}</div>}

export function Countdown({onDone}:{onDone:()=>void}){const [n,setN]=useState(3);
useEffect(()=>{if(n===0){const t=setTimeout(onDone,450);return()=>clearTimeout(t)}const t=setTimeout(()=>{setN(n-1);sfx('tap',n*60)},800);return()=>clearTimeout(t)},[n]); // eslint-disable-line react-hooks/exhaustive-deps
return <div className="relative text-center"><p className="font-pixel text-xs text-hot blink">GET READY</p>
<div className="relative mt-6 grid h-64 w-64 place-items-center">
<motion.span key={'r'+n} className="absolute inset-0 rounded-full border-8" style={{borderColor:n%2?P.mag:P.gold,boxShadow:`0 0 40px ${n%2?P.mag:P.gold}`}} initial={{scale:.3,opacity:1}} animate={{scale:1.1,opacity:0}} transition={{duration:.8}}/>
<AnimatePresence mode="popLayout"><motion.div key={n} initial={{scale:2.5,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.3,opacity:0}} className="glow font-display text-9xl text-gold">{n||'GO!'}</motion.div></AnimatePresence></div></div>}

/* ---------- backdrop: night sky, neon floor, drifting vector shapes ---------- */
const SH=['plus','ring','tri','dia','star'] as const;
function Shape({k,c}:{k:typeof SH[number];c:string}){const p={fill:'none',stroke:c,strokeWidth:5,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
return <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden>{k==='plus'?<path {...p} d="M20 6v28M6 20h28"/>:k==='ring'?<circle {...p} cx="20" cy="20" r="13"/>:k==='tri'?<path {...p} d="M20 6l15 27H5z"/>:k==='dia'?<path {...p} d="M20 4l16 16-16 16L4 20z"/>:<path {...p} d="M20 4l4.5 10.5 11.5 1-8.7 7.6 2.6 11.300L20 28.7 10.1 34.400l2.6-11.300L4 15.500l11.5-1z"/>}</svg>}
export function Backdrop(){const items=useMemo(()=>Array.from({length:16},(_,i)=>({k:SH[i%5],c:COL[(i*2)%5],l:(i*37)%100,s:12+(i*7)%18,d:22+(i*5)%26,dl:-((i*3.7)%30)})),[]);
return <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-sky" aria-hidden>
<div className="sun"/><Scenery/><div className="rail" style={{left:0}}/><div className="rail" style={{right:0}}/><div className="floor"/>
{items.map((it,i)=><div key={i} className="drift" style={{left:`${it.l}%`,top:'105%',width:it.s,height:it.s,animationDuration:`${it.d}s`,animationDelay:`${it.dl}s`,opacity:.55}}><Shape k={it.k} c={it.c}/></div>)}
<div className="absolute inset-0" style={{background:'repeating-linear-gradient(0deg,rgba(0,0,0,.14) 0 1px,transparent 1px 3px)'}}/>
<div className="absolute inset-0" style={{background:'radial-gradient(ellipse at center,transparent 55%,rgba(18,0,15,.7) 100%)'}}/></div>}

/* ---------- marquee sign with chasing bulbs ---------- */
const TL=[['H',P.gold],['Y',P.hot],['P',P.fire],['E',P.mag]] as const;
const Bulbs=({n}:{n:number})=><div className="bulbs flex justify-between px-3" aria-hidden>{Array.from({length:n},(_,i)=><span key={i} className="bulb"/>)}</div>;
export function Marquee({compact=false}:{compact?:boolean}){
return <div className="marq relative rounded-[1.75rem] border-4 border-deep bg-gradient-to-b from-panel2 to-panel py-2 shadow-[0_0_30px_rgba(255,0,255,.5),0_8px_0_rgba(0,0,0,.5)]">
<Bulbs n={compact?14:16}/>
<div className={`flex items-end justify-center gap-1 ${compact?'py-1':'py-2'}`} aria-label="HYPE, Hindustan XR Division. Play, Innovate, Publish">{TL.map(([ch,col],i)=><motion.span key={i} animate={{y:[0,-6,0]}} transition={{repeat:Infinity,duration:1.8,delay:i*.1,ease:'easeInOut'}} className={`glow font-display leading-none ${compact?'text-3xl':'text-4xl sm:text-6xl'}`} style={{color:col}}>{ch}</motion.span>)}</div>
<p className={`text-center font-pixel leading-relaxed text-hot ${compact?'text-[.5rem]':'text-[.6rem] sm:text-xs'}`}>HINDUSTAN XR DIVISION</p>
<p className={`text-center font-pixel text-gold ${compact?'text-[.45rem]':'text-[.5rem] sm:text-[.65rem]'}`}>PLAY • INNOVATE • PUBLISH</p>
<div className="mt-2"><Bulbs n={compact?14:16}/></div></div>}