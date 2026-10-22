import {motion} from 'framer-motion';import {useState} from 'react';
import {actions,bestOf,boardOf,useStore} from '../lib/store';import {GAMES} from '../games';import {Btn,Marquee} from './ui';import {Dialog} from './Dialog';import {sfx} from '../lib/sound';
import {IFull,IMedal,IMore,IMusic,IPad,ILock,ISound,IMute,IStar,ITrash,ITrophy} from './Icons';
type Tab='games'|'scores'|'more';
const TABS:[Tab,string,typeof IPad,string][]=[['games','GAMES',IPad,'#FF1493'],['scores','SCORES',ITrophy,'#FFD700'],['more','MORE',IMore,'#FF4500']];
const go=(id:string)=>{sfx('start');location.hash=`#/play/${id}`};
const fs=()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.().catch(()=>{})};
const Head=({children}:{children:React.ReactNode})=><h2 className="glow mb-3 px-1 font-pixel text-xs leading-6 text-gold">{children}</h2>;
const col=(c:string)=>({'--c':c} as React.CSSProperties);

function GamesTab(){const {sessions}=useStore();return <section aria-label="All games" className="h-full min-h-0">
<div className="grid h-full grid-cols-5 grid-rows-2 gap-1.5 sm:gap-3">{GAMES.map((g,i)=>{const best=bestOf(g.id,sessions);
return <motion.button key={g.id} onClick={()=>go(g.id)} aria-label={`Play ${g.title}`} initial={{opacity:0,y:40,scale:.8}} animate={{opacity:1,y:0,scale:1}} transition={{delay:i*.05,type:'spring',stiffness:260,damping:18}} whileHover={{y:-5}} whileTap={{scale:.94,y:4}}
className="group relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border-2 bg-panel p-1 text-left sm:rounded-[1.5rem] sm:border-4 sm:p-2" style={{borderColor:g.color,boxShadow:`0 0 14px ${g.color}66,0 4px 0 rgba(0,0,0,.55)`}}>
<span className="absolute right-1 top-1 z-10 rounded-full px-1.5 py-0.5 font-pixel text-[.4rem] text-ink sm:right-2 sm:top-2 sm:px-2 sm:py-1 sm:text-[.5rem]" style={{background:g.color}}>{best?`HI ${best}`:'NEW'}</span>
<div className="crt relative grid min-h-0 flex-1 place-items-center overflow-hidden rounded-lg bg-night sm:rounded-2xl" style={{boxShadow:`inset 0 0 30px ${g.color}55`}}>
<span className="absolute inset-0" style={{background:`radial-gradient(circle at 50% 55%,${g.color}40,transparent 65%)`}}/>
<motion.div animate={{y:[0,-6,0],rotate:[0,i%2?4:-4,0]}} transition={{repeat:Infinity,duration:3+(i%3)*.5,ease:'easeInOut'}} className="relative flex w-[72%] max-w-[6rem] justify-center"><g.Icon className="h-auto w-full drop-shadow-[0_0_10px_currentColor]"/></motion.div></div>
<div className="px-0.5 pt-1 sm:px-1 sm:pt-2"><p className="truncate text-center font-display text-[.6rem] leading-tight sm:text-left sm:text-base lg:text-lg" style={{color:g.color}}>{g.title}</p><p className="hidden truncate text-xs text-snow/75 md:block">{g.tag}</p>
<p className="blink mt-1 rounded-md py-1 text-center font-pixel text-[.4rem] text-ink sm:mt-2 sm:rounded-lg sm:py-1.5 sm:text-[.55rem]" style={{background:g.color}}><span className="sm:hidden">START</span><span className="hidden sm:inline">PRESS START</span></p></div></motion.button>})}</div></section>}

/** The lobby only shows who is on top. Full ranked boards live inside each game. */
function ScoresTab(){const {sessions}=useStore();
const players=new Set(sessions.map(s=>s.p.trim().toLowerCase())).size,wins=sessions.filter(s=>s.win).length,tot=sessions.reduce((a,s)=>a+s.score,0);
const ach:[string,boolean][]=[['First game',sessions.length>0],['First win',wins>0],['1,000 points',tot>=1000],['Played every game',GAMES.every(g=>sessions.some(s=>s.g===g.id))]];
return <section aria-label="Scores" className="space-y-3">
<div className="grid grid-cols-3 gap-2 text-center">{([['Plays',sessions.length,'text-hot'],['Players',players,'text-gold'],['Wins',wins,'text-fire']] as const).map(([k,v,c])=><div key={k} className="lcd !p-2"><p className={`text-[.5rem] ${c}`}>{k.toUpperCase()}</p><p className="mt-1.5 text-base">{v}</p></div>)}</div>
<div><Head>CURRENT CHAMPIONS</Head><ol className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">{GAMES.map(g=>{const c=boardOf(sessions,g.id)[0];return <li key={g.id} className="flex min-w-0 items-center gap-2 rounded-xl border-2 bg-panel p-1.5" style={{borderColor:`${g.color}99`}}>
<g.Icon className="h-8 w-8 shrink-0"/><div className="min-w-0 flex-1"><p className="truncate font-display text-xs leading-tight" style={{color:g.color}}>{g.title}</p><p className="truncate font-pixel text-[.45rem] leading-4 text-snow/80">{c?`${c.p} ${c.score}`:'---'}</p></div></li>})}</ol></div>
<div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">{ach.map(([k,ok])=><div key={k} className={`flex items-center gap-2 rounded-xl border-2 p-2 ${ok?'border-gold bg-gold/15 text-gold':'border-hot/30 text-snow/50'}`}>{ok?<IMedal className="h-5 w-5 shrink-0"/>:<ILock className="h-5 w-5 shrink-0"/>}<span className="text-xs font-bold">{k}</span></div>)}</div></section>}

function MoreTab(){const [rs,setRs]=useState(false),[open,setOpen]=useState<string|null>(null);
return <section aria-label="More" className="space-y-3">
<div className="grid items-start gap-1.5 sm:grid-cols-2">{GAMES.map(g=><div key={g.id} className="overflow-hidden rounded-xl border-2 bg-panel" style={{borderColor:`${g.color}88`}}>
<button className="flex w-full items-center gap-2 p-1.5 text-left" aria-expanded={open===g.id} onClick={()=>setOpen(open===g.id?null:g.id)}><g.Icon className="h-8 w-8 shrink-0"/><span className="flex-1 font-display text-sm" style={{color:g.color}}>{g.title}</span><span className="pr-2 font-pixel text-xs text-snow/70">{open===g.id?'–':'+'}</span></button>
{open===g.id&&<motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} className="overflow-hidden px-3 text-sm text-snow/90"><span className="block pb-2">{g.how}</span></motion.p>}</div>)}</div>
<Btn className="w-full bg-fire" onClick={()=>setRs(true)}><span className="flex items-center justify-center gap-2"><ITrash className="h-5 w-5"/>Reset all scores</span></Btn>
<Dialog open={rs} title="Reset everything?" text="This deletes every player's scores on this device." yes="Delete" no="Cancel" onNo={()=>setRs(false)} onYes={()=>{actions.reset();setRs(false)}}/></section>}

/** Small round icon button for the top-right corner (settings). */
const Mini=({label,color,on,onClick,children}:{label:string;color:string;on?:boolean;onClick:()=>void;children:React.ReactNode}) =>
<button className="mini" style={col(color)} onClick={onClick} title={label} aria-label={label} {...(on!==undefined?{'aria-pressed':on,'data-off':!on}:{})}>{children}</button>;

function Corner({tab,setTab}:{tab:Tab;setTab:(t:Tab)=>void}){const {sound,music}=useStore();
const pick=(t:Tab)=>{if(t!==tab)sfx('tap');setTab(t)};
return <div className="ml-auto flex items-center gap-1.5">
{TABS.map(([id,label,Ic,c])=><button key={id} className="mini" style={col(c)} title={label} aria-label={label} aria-current={tab===id?'page':undefined} data-off={tab!==id} onClick={()=>pick(id)}><Ic className="h-3.5 w-3.5"/></button>)}
<span className="mx-0.5 h-4 w-px bg-hot/60" aria-hidden/>
<Mini label="Sound effects" color="#FFD700" on={sound} onClick={()=>{if(!sound)setTimeout(()=>sfx('coin'),30);actions.toggleSound()}}>{sound?<ISound className="h-3.5 w-3.5"/>:<IMute className="h-3.5 w-3.5"/>}</Mini>
<Mini label="Music" color="#FF69B4" on={music} onClick={actions.toggleMusic}><IMusic className="h-3.5 w-3.5"/></Mini>
<Mini label="Full screen" color="#FF00FF" onClick={fs}><IFull className="h-3.5 w-3.5"/></Mini></div>}

export function Lobby(){const {sessions}=useStore();const [tab,setTab]=useState<Tab>('games');
const champ=sessions.reduce<typeof sessions[number]|null>((m,s)=>!m||s.score>m.score?s:m,null);const fit=tab==='games';
return <motion.main initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.15}} className={`relative z-10 mx-auto flex max-w-5xl flex-col px-3 lobby-pb pt-[max(.5rem,env(safe-area-inset-top))] ${fit?'h-dvh overflow-hidden':'min-h-dvh'}`}>
<Marquee/>
<div className="bezel crt mt-2 flex min-h-0 flex-1 flex-col p-2 sm:p-4" style={{background:"rgba(31,5,38,.5)"}}><div className="relative z-10 flex min-h-0 flex-1 flex-col">
<div className="mb-2 flex flex-wrap items-center gap-2"><div className="lcd flex min-w-[6rem] flex-1 items-center gap-2 text-[.6rem]"><span className="text-hot">HI</span><span className="truncate">{champ?`${champ.p} ${champ.score}`:'---'}</span></div><div className="lcd flex items-center gap-2 text-[.6rem]"><IStar className="h-4 w-4 text-gold"/><span>{sessions.length}</span></div>
<Corner tab={tab} setTab={setTab}/></div>
<motion.div key={tab} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{duration:.18}} className={fit?'min-h-0 flex-1':''}>{tab==='games'?<GamesTab/>:tab==='scores'?<ScoresTab/>:<MoreTab/>}</motion.div></div></div>
</motion.main>}
