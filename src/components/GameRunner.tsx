import {AnimatePresence,motion} from 'framer-motion';import {useRef,useState} from 'react';
import type {Api,GameDef,Result} from '../types';import {actions,boardOf,getState,sameP,useStore} from '../lib/store';import {fmt,useClock} from '../lib/useClock';import {sfx} from '../lib/sound';
import {Btn,Confetti,Countdown,CountUp,Screen} from './ui';import {Dialog} from './Dialog';import {Board} from './Board';
import {IBack,IPause,IPlay,IRestart,IStar,ITrophy,IClock,ISound,IMute} from './Icons';
type Done=Result&{prev:number;top:number;secs:number};
const Hud=({label,children,icon}:{label:string;children:React.ReactNode;icon:React.ReactNode})=><div className="lcd flex items-center justify-between gap-2"><span className="flex items-center gap-2 text-[.55rem] text-hot">{icon}{label}</span><span className="text-base">{children}</span></div>;
export function GameRunner({def,player,onExit,onSwitch}:{def:GameDef;player:string;onExit:()=>void;onSwitch:()=>void}){
const {sessions,sound}=useStore();const [phase,setPhase]=useState<'setup'|'count'|'play'|'win'|'done'>('setup');const [cfg,setCfg]=useState<Record<string,string>>(()=>Object.fromEntries(def.options.map(o=>[o.key,o.def])));
const [run,setRun]=useState(0),[score,setScore]=useState(0),[paused,setPaused]=useState(false),[res,setRes]=useState<Done|null>(null),[dlg,setDlg]=useState<null|'leave'|'restart'>(null);
const clock=useClock(),started=useRef(false),saved=useRef(false);
const board=boardOf(sessions,def.id),rank=board.findIndex(x=>sameP(x.p,player))+1;
const go=()=>{clock.start();setRun(r=>r+1);setPhase('play')};const start=()=>{saved.current=false;started.current=false;setScore(0);setPaused(false);setPhase('count')};
const api:Api={cfg,paused,setScore,touch:()=>{started.current=true},elapsed:clock.secs,finish:r=>{if(saved.current)return;saved.current=true;const secs=clock.stop(),before=boardOf(getState().sessions,def.id),prev=before.find(x=>sameP(x.p,player))?.score??0,top=before[0]?.score??0;
actions.addSession({g:def.id,p:player,score:r.score,win:r.win,secs,at:Date.now(),cfg:Object.values(cfg).join('/')});sfx(r.win?'win':'bad');setScore(r.score);setRes({...r,prev,top,secs});if(r.win){setPhase('win');setTimeout(()=>setPhase('done'),1500)}else setPhase('done')}};
const leave=()=>{if(phase==='play'&&started.current){if(!paused){clock.pause();setPaused(true)}setDlg('leave')}else onExit()};
const togglePause=()=>{if(paused){clock.resume()}else clock.pause();setPaused(!paused)};
const restart=()=>{if(started.current){if(!paused){clock.pause();setPaused(true)}setDlg('restart')}else start()};
const closeDlg=()=>{setDlg(null);if(paused){clock.resume();setPaused(false)}};
const accent={borderColor:def.color,boxShadow:`0 0 0 3px #12000F,0 0 28px ${def.color}88,inset 0 0 40px ${def.color}22,0 10px 0 rgba(0,0,0,.5)`};
return <><AnimatePresence mode="wait">
{phase==='setup'&&<Screen key="s"><Btn className="bg-snow px-4" onClick={onExit} aria-label="Back to games"><span className="flex items-center gap-2"><IBack className="h-5 w-5"/>Games</span></Btn>
<div className="bezel crt mt-3 p-3" style={accent}><div className="relative z-10 flex items-center gap-3 text-left"><motion.div className="shrink-0" animate={{y:[0,-8,0]}} transition={{repeat:Infinity,duration:2.4,ease:'easeInOut'}}><def.Icon className="h-20 w-20 drop-shadow-[0_0_14px_currentColor]"/></motion.div>
<div className="min-w-0"><h1 className="glow font-display text-3xl leading-tight" style={{color:def.color}}>{def.title}</h1><p className="text-sm text-snow/90">{def.how}</p></div></div></div>
{def.options.map(o=><div key={o.key} className="mt-3"><p className="mb-2 font-pixel text-[.65rem] leading-5 text-hot">{o.label.toUpperCase()}</p><div className="flex flex-wrap gap-2">{o.values.map(v=><Btn key={v} aria-pressed={cfg[o.key]===v} onClick={()=>setCfg({...cfg,[o.key]:v})} className={cfg[o.key]===v?'bg-gold':'bg-panel2 !text-snow'}>{v}</Btn>)}</div></div>)}
<div className="mt-3"><Board g={def.id} color={def.color} me={player}/></div>
<Btn className="mt-3 w-full bg-deep py-3 text-2xl" onClick={()=>{sfx('start');start()}}><span className="flex items-center justify-center gap-3"><IPlay className="h-6 w-6"/>Press start</span></Btn></Screen>}
{phase==='count'&&<Screen key="c" className="grid min-h-dvh place-items-center"><Countdown onDone={go}/></Screen>}
{phase==='win'&&<Screen key="w" className="grid min-h-dvh place-items-center text-center"><Confetti count={120}/><motion.div initial={{scale:0,rotate:-30}} animate={{scale:[0,1.3,1],rotate:0}} transition={{duration:.6}}><ITrophy className="mx-auto h-40 w-40 text-gold drop-shadow-[0_0_20px_#FFD700]"/><h1 className="glow font-display text-5xl text-gold">YOU WIN!</h1></motion.div></Screen>}
{phase==='play'&&<Screen key="p"><header className="mb-3 grid gap-2">
<div className="flex items-center gap-2"><button className="arc-btn sm" style={{'--c':'#FF69B4'} as React.CSSProperties} onClick={leave} aria-label="Back to games"><IBack className="h-6 w-6"/></button>
<div className="min-w-0 flex-1"><h1 className="truncate font-display text-xl leading-tight" style={{color:def.color}}>{def.title}</h1><p className="truncate text-xs text-snow/70">{player} · {Object.values(cfg).join(' · ')}</p></div>
<button className="arc-btn sm" style={{'--c':'#FFD700'} as React.CSSProperties} onClick={actions.toggleSound} aria-label={sound?'Sound on':'Sound off'} aria-pressed={sound}>{sound?<ISound className="h-6 w-6"/>:<IMute className="h-6 w-6"/>}</button>
<button className="arc-btn sm" style={{'--c':'#FF4500'} as React.CSSProperties} onClick={togglePause} aria-label={paused?'Resume':'Pause'}>{paused?<IPlay className="h-6 w-6"/>:<IPause className="h-6 w-6"/>}</button><button className="arc-btn sm" style={{'--c':'#FF1493'} as React.CSSProperties} onClick={restart} aria-label="Restart"><IRestart className="h-6 w-6"/></button></div>
<div className="grid grid-cols-2 gap-2"><Hud label="SCORE" icon={<IStar className="h-4 w-4 text-gold"/>}><motion.b key={score} initial={{scale:1.5}} animate={{scale:1}} className="inline-block">{score}</motion.b></Hud><Hud label="TIME" icon={<IClock className="h-4 w-4 text-gold"/>}>{fmt(clock.secs())}</Hud></div></header>
<div className="bezel crt p-3 sm:p-5" style={accent}><div className="relative z-10 md:grid md:min-h-[58vh] md:content-center"><def.Game key={run} api={api}/></div>
{paused&&!dlg&&<div className="absolute inset-0 z-20 grid place-items-center rounded-[1.5rem] bg-night/90"><div className="text-center"><p className="glow font-display text-4xl text-gold">PAUSED</p><Btn className="mt-4 bg-deep" onClick={togglePause}><span className="flex items-center gap-2"><IPlay className="h-5 w-5"/>Resume</span></Btn></div></div>}</div></Screen>}
{phase==='done'&&res&&<Screen key="d" className="relative text-center">{res.win&&<Confetti count={90}/>}
<motion.div initial={{scale:.7,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'spring',stiffness:200,damping:15}} className="bezel crt mt-3 p-4" style={accent}><div className="relative z-10">
<p className="font-pixel text-[.65rem] leading-5 text-hot">{def.title.toUpperCase()}</p><h1 className={`glow mt-2 font-display text-5xl ${res.win?'text-gold':'text-deep'}`}>{res.win?'YOU WIN!':'GAME OVER'}</h1>
<div className="lcd mx-auto mt-4 max-w-xs py-5 text-3xl"><CountUp to={res.score}/></div><p className="mt-2 font-pixel text-[.6rem] text-snow/70">POINTS</p>
{res.score>0&&(res.score>res.top||res.score>res.prev)&&<motion.p initial={{scale:0,rotate:-12}} animate={{scale:1,rotate:-3}} transition={{type:'spring'}} className="blink mx-auto mt-3 w-fit rounded-full bg-gold px-4 py-2 font-pixel text-[.65rem] text-ink">{res.score>res.top?'NEW CHAMPION!':'NEW PERSONAL BEST!'}</motion.p>}
{rank>0&&<p className="mt-3 font-pixel text-[.65rem] leading-5 text-hot">{player} · RANK #{rank} OF {board.length}</p>}</div></motion.div>
<div className="mx-auto mt-3 max-w-sm"><Board g={def.id} color={def.color} me={player} title="LEADERBOARD"/></div>
<div className="mt-4 flex flex-wrap justify-center gap-3"><Btn className="bg-deep" onClick={start}>Play again</Btn><Btn className="bg-gold" onClick={onSwitch}>Next player</Btn><Btn className="bg-snow" onClick={onExit}>All games</Btn></div></Screen>}
</AnimatePresence>
<Dialog open={dlg==='leave'} title="Quit game?" text="Your progress in this round will be lost." yes="Quit" no="Keep playing" onYes={()=>{setDlg(null);onExit()}} onNo={closeDlg}/>
<Dialog open={dlg==='restart'} title="Restart?" text="Your progress in this round will be lost." yes="Restart" no="Keep playing" onYes={()=>{setDlg(null);start()}} onNo={closeDlg}/></>}
