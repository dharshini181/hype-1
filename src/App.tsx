import {AnimatePresence,MotionConfig} from 'framer-motion';import {useEffect,useState} from 'react';
import {useStore} from './lib/store';import {GAMES} from './games';import {Lobby} from './components/Lobby';import {NameGate} from './components/NameGate';import {GameRunner} from './components/GameRunner';import {Backdrop,Floaters} from './components/ui';import {setMusic} from './lib/sound';import {InstallPrompt} from './components/InstallPrompt';
function useHash(){const [h,setH]=useState(location.hash);useEffect(()=>{const f=()=>setH(location.hash);window.addEventListener('hashchange',f);return()=>window.removeEventListener('hashchange',f)},[]);return h}
export default function App(){const {music}=useStore(),h=useHash(),def=GAMES.find(g=>h===`#/play/${g.id}`);const exit=()=>{location.hash='#/'};
// Who is at the machine right now. Cleared whenever anyone goes back to the lobby, so every game entry asks for a name.
const [who,setWho]=useState<{id:string;name:string}|null>(null);
useEffect(()=>{if(!def)setWho(null)},[def]);
useEffect(()=>{setMusic(music)},[music]);
const player=def&&who&&who.id===def.id?who.name:'';
return <MotionConfig reducedMotion="user"><div className="min-h-dvh"><Backdrop/><Floaters/>
<AnimatePresence mode="wait">{def?(player?<GameRunner key={def.id} def={def} player={player} onExit={exit} onSwitch={()=>setWho(null)}/>:<NameGate key={'n'+def.id} def={def} onCancel={exit} onReady={name=>setWho({id:def.id,name})}/>):<Lobby key="l"/>}</AnimatePresence>{!def&&<InstallPrompt/>}</div></MotionConfig>}
