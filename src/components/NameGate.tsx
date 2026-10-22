import {motion} from 'framer-motion';import {useState} from 'react';import {Btn,Screen} from './ui';import type {GameDef} from '../types';import {IBack} from './Icons';import {sfx} from '../lib/sound';

/** Shown every time someone walks up to a game, like a real arcade. The field always starts empty; only finished scores are kept for the leaderboard. */
export function NameGate({def,onCancel,onReady}:{def:GameDef;onCancel:()=>void;onReady:(name:string)=>void}){
const [v,setV]=useState(''),[err,setErr]=useState('');
const go=()=>{const n=v.trim().toUpperCase();if(!n){setErr('Type a name to continue');sfx('bad');return}sfx('coin');onReady(n.slice(0,12))};
return <Screen className="grid h-dvh min-h-0 place-items-center !pb-4 overflow-hidden">
<motion.div className="bezel crt w-full max-w-sm p-4" initial={{scale:.85,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'spring',stiffness:240,damping:20}}>
<div className="relative z-10">
<div className="mb-3 flex items-center gap-3"><button onClick={onCancel} aria-label="Back to games" className="arc-btn sm" style={{'--c':'#FF69B4'} as React.CSSProperties}><IBack className="h-6 w-6"/></button>
<div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border-2 p-1.5" style={{borderColor:def.color}}><def.Icon className="h-10 w-10 shrink-0"/><p className="truncate font-display text-lg" style={{color:def.color}}>{def.title}</p></div></div>
<h1 className="glow mb-2 font-display text-2xl text-snow">Who's playing?</h1>
<label htmlFor="player-name" className="font-pixel text-[.6rem] leading-5 text-hot">ENTER YOUR NAME</label>
<input id="player-name" autoFocus value={v} maxLength={12} placeholder="NOVA" autoComplete="nickname" autoCapitalize="characters" spellCheck={false} enterKeyHint="go"
onChange={e=>{setV(e.target.value);setErr('')}} onKeyDown={e=>e.key==='Enter'&&go()}
className="lcd mt-1 h-14 w-full text-center text-xl uppercase placeholder:text-gold/30"/>
<p role="alert" className="min-h-6 pt-1 text-sm font-bold text-fire">{err}</p>
<Btn className="w-full bg-gold py-2 text-2xl" onClick={go}>Start game</Btn></div></motion.div></Screen>}
